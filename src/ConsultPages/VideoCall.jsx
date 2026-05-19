import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth, functions } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";

const generateLiveKitToken = httpsCallable(functions, "generateLiveKitToken");

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [livekitUrl, setLivekitUrl] = useState(null);
  const [userId, setUserId] = useState(null);

  const tokenFetched = useRef(false);

  // Auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/login");
      else setUserId(user.uid);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Token Generation
  useEffect(() => {
    if (!roomId || !userId || tokenFetched.current) return;

    const fetchToken = async () => {
      tokenFetched.current = true;
      try {
        console.log("🔄 Requesting token for room:", roomId);

        const result = await generateLiveKitToken({
          roomName: roomId,
          participantName: userId,
        });

        console.log("✅ Token Response:", result.data);

        if (result?.data?.token && result?.data?.url) {
          setToken(result.data.token);
          setLivekitUrl(result.data.url);
        } else {
          throw new Error("Missing token or URL in response");
        }
      } catch (err) {
        console.error("❌ LiveKit token error:", err);
        setError(err.message || "Failed to generate token");
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [roomId, userId]);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white p-4">
        <div className="text-center max-w-md">
          <h2 className="text-red-500 text-2xl mb-4">Error</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 px-6 py-3 rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading || !token || !livekitUrl) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Connecting to video room...</p>
          <p className="text-xs text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  console.log("🎥 Connecting to LiveKit with URL:", livekitUrl);

  return (
    <LiveKitRoom
      token={token}
      serverUrl={livekitUrl}
      connect={true}
      video={true}
      audio={true}
      className="min-h-screen"
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
};

export default VideoCall;
