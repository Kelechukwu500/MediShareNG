import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const createCall = async ({ callerId, receiverId, roomId }) => {
  const callRef = doc(db, "videoCalls", roomId);

  await setDoc(callRef, {
    callerId,
    receiverId,
    roomId,
    status: "ringing",
    createdAt: serverTimestamp(),
    startedAt: null,
    endedAt: null,
  });

  return roomId;
};
