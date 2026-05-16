const admin = require("firebase-admin");
admin.initializeApp();

const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const nodemailer = require("nodemailer");

/* =========================
   🔐 OPENAI SECRET
========================= */
const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");

/* =========================
   📧 NODEMAILER
========================= */
function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "YOUR_GMAIL@gmail.com",
      pass: "YOUR_APP_PASSWORD",
    },
  });
}

/* =====================================================
   🧠 AI SYMPTOM ANALYSIS
===================================================== */
exports.analyzeSymptoms = onCall(
  { secrets: [OPENAI_API_KEY] },
  async (request) => {
    try {
      const { symptoms, severityData } = request.data;

      if (!symptoms) {
        throw new HttpsError("invalid-argument", "Symptoms are required");
      }

      const OpenAI = require("openai");
      const openai = new OpenAI({
        apiKey: OPENAI_API_KEY.value(),
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are a medical triage AI assistant.
You are NOT a doctor.
You must NOT diagnose diseases.
You only assess risk level.

Always end with:
Triage Level: LOW | MODERATE | HIGH | CRITICAL
            `,
          },
          {
            role: "user",
            content: `
Symptoms: ${symptoms}
Pain: ${severityData?.pain ?? 0}
Fatigue: ${severityData?.fatigue ?? 0}
Fever: ${severityData?.fever ?? 0}
Breathing: ${severityData?.breathing ?? 0}

Give clinical reasoning and triage.
            `,
          },
        ],
        temperature: 0.5,
      });

      const result = completion?.choices?.[0]?.message?.content;

      return { result };
    } catch (error) {
      console.error(error);
      throw new HttpsError("internal", error?.message || "Unknown error");
    }
  },
);

/* =========================
   EMAIL NOTIFICATION
========================= */
exports.sendWelcomeEmail = onDocumentCreated(
  "newsletterSubscribers/{docId}",
  async (event) => {
    const data = event.data.data();

    await getTransporter().sendMail({
      from: "MediShareNG <YOUR_GMAIL@gmail.com>",
      to: data.email,
      subject: "Welcome to MediShareNG Newsletter 🎉",
      html: `<h2>Welcome!</h2><p>Thanks for subscribing.</p>`,
    });
  },
);

/* =========================
   PARTNER REQUEST NOTIFICATION
========================= */
exports.notifyAdminPartnerRequest = onDocumentCreated(
  "partnerRequests/{docId}",
  async (event) => {
    const data = event.data.data();

    await admin
      .firestore()
      .collection("notifications")
      .add({
        title: "New Partner Request",
        message: `${data.organization} sent a partnership request`,
        type: "partner",
        read: false,
        userId: data.userId || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        time: new Date().toLocaleString(),
      });
  },
);

/* =========================
   NEW USER NOTIFICATION
========================= */
exports.notifyAdminNewUser = onDocumentCreated(
  "users/{userId}",
  async (event) => {
    const data = event.data.data();

    await admin
      .firestore()
      .collection("notifications")
      .add({
        title: "New User Registered",
        message: `${data.name || data.email} joined.`,
        type: "user",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        time: new Date().toLocaleString(),
      });
  },
);

/* =========================
   APPOINTMENT NOTIFICATION (FIXED)
========================= */
exports.notifyAppointmentBooked = onDocumentCreated(
  "appointments/{appointmentId}",
  async (event) => {
    const data = event.data.data();

    await admin
      .firestore()
      .collection("notifications")
      .add({
        title: "New Appointment Request",
        message: `${data.patientName || "A patient"} requested consultation.`,
        type: "appointment",
        status: data.status || "pending",
        doctorId: data.doctorId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        time: new Date().toLocaleString(),
      });
  },
);

/* =========================
   VIDEO ROOM CREATION (SAFE VERSION)
   ✅ ONLY CREATES ROOM ON APPOINTMENT
   ❌ DOES NOT OVERWRITE FRONTEND FLOW
========================= */
exports.createVideoRoomOnAppointment = onDocumentCreated(
  "appointments/{appointmentId}",
  async (event) => {
    const data = event.data.data();
    const appointmentId = event.params.appointmentId;

    if (!data.doctorId || !data.patientId) return;

    // Prevent duplicate room creation
    if (data.roomId) return;

    const roomRef = admin.firestore().collection("videoRooms").doc();

    await roomRef.set({
      roomId: roomRef.id,
      appointmentId,
      doctorId: data.doctorId,
      patientId: data.patientId,
      active: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await admin
      .firestore()
      .collection("appointments")
      .doc(appointmentId)
      .update({
        roomId: roomRef.id,
      });
  },
);

/* =========================
   VIDEO ROOM NOTIFICATION
========================= */
exports.notifyVideoRoomCreated = onDocumentCreated(
  "videoRooms/{roomId}",
  async (event) => {
    const roomId = event.params.roomId;

    await admin
      .firestore()
      .collection("notifications")
      .add({
        title: "Video Consultation Ready",
        message: `Room ${roomId} created`,
        type: "video",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        time: new Date().toLocaleString(),
      });
  },
);

/* =========================
   ADMIN ROLE
========================= */
exports.setAdminRole = onCall(async (request) => {
  const caller = request.auth;

  if (!caller) {
    throw new HttpsError("unauthenticated", "User must be logged in");
  }

  const { uid } = request.data;

  await admin.auth().setCustomUserClaims(uid, {
    admin: true,
  });

  return { message: `User ${uid} is now an admin` };
});

/* =========================
   EXPORT PARTNERS (EXCEL)
========================= */
exports.exportPartnersExcel = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const XLSX = require("xlsx");

  const snapshot = await admin.firestore().collection("partnerRequests").get();

  const data = snapshot.docs.map((doc) => {
    const d = doc.data();
    return {
      Name: d.name,
      Email: d.email,
      Phone: d.phone,
      Organization: d.organization,
      State: d.state,
      "Office Address": d.officeAddress,
      "ID Type": d.idType,
      "ID Number": d.idNumber,
      Status: d.status || "pending",
      Verified: d.verified || false,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Partners");

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  return buffer.toString("base64");
});

/* =========================
   EXPORT PARTNERS (PDF)
========================= */
exports.exportPartnersPDF = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const PDFDocument = require("pdfkit");
  const fs = require("fs");

  const snapshot = await admin.firestore().collection("partnerRequests").get();

  const doc = new PDFDocument();
  const filePath = "/tmp/partners.pdf";
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  doc.fontSize(18).text("Partner Requests Report", { align: "center" });
  doc.moveDown();

  snapshot.forEach((docSnap) => {
    const d = docSnap.data();

    doc.fontSize(12).text(`
Name: ${d.name}
Email: ${d.email}
Phone: ${d.phone}
Org: ${d.organization}
State: ${d.state}
ID Type: ${d.idType}
ID Number: ${d.idNumber}
Status: ${d.status || "pending"}
Verified: ${d.verified || false}
------------------------------------
    `);
  });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => {
      try {
        const file = fs.readFileSync(filePath);
        resolve(file.toString("base64"));
      } catch (e) {
        reject(e);
      }
    });
  });
});
