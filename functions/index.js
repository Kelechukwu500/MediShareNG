const admin = require("firebase-admin");
admin.initializeApp();

const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

/* =========================
   🔐 OPENAI SECRET
========================= */
const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");

/* =========================
   🔐 SAFE USER FETCH HELPER
========================= */
async function getUser(uid) {
  const snap = await admin.firestore().collection("users").doc(uid).get();
  return snap.exists ? snap.data() : null;
}

/* =====================================================
   🧠 AI SYMPTOM ANALYSIS (FIXED - LAZY LOAD OPENAI)
===================================================== */
exports.analyzeSymptoms = onCall(
  { secrets: [OPENAI_API_KEY] },
  async (request) => {
    try {
      const { symptoms, severityData } = request.data;

      if (!symptoms) {
        throw new HttpsError("invalid-argument", "Symptoms are required");
      }

      // 🔥 IMPORT INSIDE FUNCTION (CRITICAL FIX)
      const OpenAI = require("openai");

      const openai = new OpenAI({
        apiKey: OPENAI_API_KEY.value(),
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a medical triage assistant. Do not diagnose.",
          },
          {
            role: "user",
            content: `
Symptoms: ${symptoms}
Pain: ${severityData?.pain ?? 0}
Fatigue: ${severityData?.fatigue ?? 0}
Fever: ${severityData?.fever ?? 0}
Breathing: ${severityData?.breathing ?? 0}
            `,
          },
        ],
        temperature: 0.5,
      });

      return {
        result: completion.choices[0].message.content,
      };
    } catch (error) {
      throw new HttpsError("internal", error?.message || "AI error");
    }
  },
);

/* =========================
   EMAIL NOTIFICATION (FIXED)
========================= */
exports.sendWelcomeEmail = onDocumentCreated(
  "newsletterSubscribers/{docId}",
  async (event) => {
    const data = event.data.data();

    // 🔥 LAZY LOAD NODEMAILER
    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "YOUR_GMAIL@gmail.com",
        pass: "YOUR_APP_PASSWORD",
      },
    });

    await transporter.sendMail({
      from: "MediShareNG <YOUR_GMAIL@gmail.com>",
      to: data.email,
      subject: "Welcome to MediShareNG 🎉",
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
        message: `${data.organization} sent a request`,
        type: "partner",
        read: false,
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
        message: `${data.fullName || data.email} joined`,
        type: "user",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        time: new Date().toLocaleString(),
      });
  },
);

/* =========================
   APPOINTMENT NOTIFICATION
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
        message: `Patient booked consultation`,
        type: "appointment",
        doctorId: data.doctorId,
        patientId: data.patientId,
        status: data.status || "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        time: new Date().toLocaleString(),
      });
  },
);

/* =========================
   VIDEO ROOM CREATION (SAFE)
========================= */
exports.createVideoRoomOnAppointment = onDocumentCreated(
  "appointments/{appointmentId}",
  async (event) => {
    const data = event.data.data();
    const appointmentId = event.params.appointmentId;

    if (!data.doctorId || !data.patientId) return;
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
        title: "Video Room Ready",
        message: `Room ${roomId} created`,
        type: "video",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        time: new Date().toLocaleString(),
      });
  },
);

/* =========================
   ADMIN ROLE (SAFE)
========================= */
exports.setAdminRole = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const caller = await getUser(request.auth.uid);

  if (caller?.role !== "admin") {
    throw new HttpsError("permission-denied", "Admin only");
  }

  const { uid } = request.data;

  await admin.auth().setCustomUserClaims(uid, {
    admin: true,
  });

  return { message: `User ${uid} is now admin` };
});

/* =========================
   EXPORT PARTNERS (EXCEL)
========================= */
exports.exportPartnersExcel = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const caller = await getUser(request.auth.uid);

  if (caller?.role !== "admin") {
    throw new HttpsError("permission-denied", "Admin only");
  }

  const XLSX = require("xlsx");

  const snapshot = await admin.firestore().collection("partnerRequests").get();

  const data = snapshot.docs.map((doc) => doc.data());

  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(data);

  XLSX.utils.book_append_sheet(workbook, sheet, "Partners");

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

  const caller = await getUser(request.auth.uid);

  if (caller?.role !== "admin") {
    throw new HttpsError("permission-denied", "Admin only");
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
Org: ${d.organization}
Status: ${d.status || "pending"}
------------------------
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
