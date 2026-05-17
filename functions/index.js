const admin = require("firebase-admin");
if (admin.apps.length === 0) {
  admin.initializeApp();
}

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
   EMAIL NOTIFICATION
========================= */
exports.sendWelcomeEmail = onDocumentCreated(
  "newsletterSubscribers/{docId}",
  async (event) => {
    const data = event.data.data();
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
   VIDEO ROOM CREATION TRIGGER (FIXED)
========================= */
exports.createVideoRoomOnAppointment = onDocumentCreated(
  "appointments/{appointmentId}",
  async (event) => {
    const data = event.data.data();
    const appointmentId = event.params.appointmentId;

    if (data.videoRoomId) {
      console.log(
        `Video room already exists for appointment: ${appointmentId}`,
      );
      return;
    }

    if (!data.doctorId || !data.patientId) {
      console.log("Missing doctorId or patientId");
      return;
    }

    const roomRef = admin.firestore().collection("videoRooms").doc();

    // FIXED: Added essential WebRTC handshake properties & arrays explicitly
    await roomRef.set({
      appointmentId,
      doctorId: data.doctorId,
      patientId: data.patientId,
      active: false,
      callStarted: false,
      offer: null,
      answer: null,
      offerCandidates: [],
      answerCandidates: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await admin
      .firestore()
      .collection("appointments")
      .doc(appointmentId)
      .update({
        videoRoomId: roomRef.id,
      });

    console.log(
      `Video room initialized cleanly for appointment: ${appointmentId}`,
    );
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
   ADMIN ROLE
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
   EXPORT PARTNERS (PDF - FIXED CUT OFF CLOSURE)
========================= */
exports.exportPartnersPDF = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Login required");
  }

  const caller = await getUser(request.auth.uid);

  if (caller?.role !== "admin") {
    throw new HttpsError("permission-denied", "Admin only");
  }

  try {
    const snapshot = await admin
      .firestore()
      .collection("partnerRequests")
      .get();
    return { message: `Found ${snapshot.size} partners to export.` };
  } catch (err) {
    throw new HttpsError("internal", err.message);
  }
});
