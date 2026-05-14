const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

/* =========================================
   GMAIL TRANSPORT (MOVE TO ENV IN PROD)
========================================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "YOUR_GMAIL@gmail.com",
    pass: "YOUR_APP_PASSWORD",
  },
});

/* =========================================
   NEWSLETTER EMAIL
========================================= */
exports.sendWelcomeEmail = onDocumentCreated(
  "newsletterSubscribers/{docId}",
  async (event) => {
    try {
      const data = event.data.data();

      await transporter.sendMail({
        from: "MediShareNG <YOUR_GMAIL@gmail.com>",
        to: data.email,
        subject: "Welcome to MediShareNG Newsletter 🎉",
        html: `
          <div style="font-family: Arial; padding: 20px;">
            <h2>Thank you for subscribing!</h2>
            <p>You have successfully subscribed to MediShareNG newsletter.</p>
            <p>You will now receive healthcare updates and announcements.</p>
            <p><strong>— MediShareNG Team</strong></p>
          </div>
        `,
      });

      console.log("Welcome email sent");
    } catch (error) {
      console.error(error);
    }
  },
);

/* =========================================
   PARTNER REQUEST NOTIFICATION
========================================= */
exports.notifyAdminPartnerRequest = onDocumentCreated(
  "partnerRequests/{docId}",
  async (event) => {
    try {
      const data = event.data.data();

      await admin
        .firestore()
        .collection("notifications")
        .add({
          title: "New Partnership Request",
          message: `${data.organization} submitted a partnership request.`,
          type: "partner",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          time: new Date().toLocaleString(),
        });

      console.log("Partner notification created");
    } catch (error) {
      console.error(error);
    }
  },
);

/* =========================================
   NEW USER NOTIFICATION
========================================= */
exports.notifyAdminNewUser = onDocumentCreated(
  "users/{userId}",
  async (event) => {
    try {
      const data = event.data.data();

      await admin
        .firestore()
        .collection("notifications")
        .add({
          title: "New User Registered",
          message: `${data.name || data.email} joined MediShareNG.`,
          type: "user",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          time: new Date().toLocaleString(),
        });

      console.log("User notification created");
    } catch (error) {
      console.error(error);
    }
  },
);

/* =========================================
   APPOINTMENT NOTIFICATION
========================================= */
exports.notifyAppointmentBooked = onDocumentCreated(
  "appointments/{appointmentId}",
  async (event) => {
    try {
      const data = event.data.data();

      await admin
        .firestore()
        .collection("notifications")
        .add({
          title: "New Appointment",
          message: `${data.patientName || "A patient"} booked an appointment.`,
          type: "appointment",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          time: new Date().toLocaleString(),
        });

      console.log("Appointment notification created");
    } catch (error) {
      console.error(error);
    }
  },
);

/* =========================================
   CREATE VIDEO ROOM + LINK TO APPOINTMENT (FIXED CORE LOGIC)
========================================= */
exports.createVideoRoomOnAppointment = onDocumentCreated(
  "appointments/{appointmentId}",
  async (event) => {
    try {
      const data = event.data.data();
      const appointmentId = event.params.appointmentId;

      if (!data.doctorId || !data.patientId) {
        console.log("Missing doctorId or patientId");
        return;
      }

      // ✅ CREATE ROOM
      const roomRef = admin.firestore().collection("videoRooms").doc();
      const roomId = roomRef.id;

      await roomRef.set({
        roomId,
        appointmentId,
        doctorId: data.doctorId,
        patientId: data.patientId,
        offer: null,
        answer: null,
        offerCandidates: [],
        answerCandidates: [],
        active: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 🔥 LINK ROOM BACK TO APPOINTMENT (CRITICAL FIX)
      await admin
        .firestore()
        .collection("appointments")
        .doc(appointmentId)
        .update({
          roomId,
        });

      console.log("Video room created + linked successfully");
    } catch (error) {
      console.error(error);
    }
  },
);

/* =========================================
   VIDEO ROOM NOTIFICATION
========================================= */
exports.notifyVideoRoomCreated = onDocumentCreated(
  "videoRooms/{roomId}",
  async (event) => {
    try {
      const data = event.data.data();
      const roomId = event.params.roomId;

      await admin
        .firestore()
        .collection("notifications")
        .add({
          title: "Video Consultation Ready",
          message: `Room ${roomId} is ready for consultation`,
          type: "video",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          time: new Date().toLocaleString(),
        });

      console.log("Video room notification created");
    } catch (error) {
      console.error(error);
    }
  },
);

/* =========================================
   ADMIN ROLE ASSIGNMENT
========================================= */
exports.setAdminRole = onCall(async (request) => {
  try {
    const caller = request.auth;

    if (!caller) {
      throw new HttpsError("unauthenticated", "User must be logged in");
    }

    const callerUser = await admin.auth().getUser(caller.uid);

    if (callerUser.customClaims?.admin !== true) {
      throw new HttpsError("permission-denied", "Only admin can assign roles");
    }

    const { uid } = request.data;

    if (!uid) {
      throw new HttpsError("invalid-argument", "UID is required");
    }

    await admin.auth().setCustomUserClaims(uid, {
      admin: true,
    });

    return {
      message: `User ${uid} is now an admin`,
    };
  } catch (error) {
    throw new HttpsError("internal", error.message);
  }
});
