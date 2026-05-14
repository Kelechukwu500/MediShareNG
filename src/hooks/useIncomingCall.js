import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

export const useIncomingCall = (userId) => {
  const [call, setCall] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "videoCalls", userId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();

        if (data.status === "ringing") {
          setCall(data);
        } else {
          setCall(null);
        }
      }
    });

    return () => unsub();
  }, [userId]);

  const acceptCall = async () => {
    await updateDoc(doc(db, "videoCalls", call.roomId), {
      status: "accepted",
      startedAt: new Date(),
    });
  };

  const rejectCall = async () => {
    await updateDoc(doc(db, "videoCalls", call.roomId), {
      status: "ended",
      endedAt: new Date(),
    });
  };

  return { call, acceptCall, rejectCall };
};
