import React, { useState } from "react";
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Download,
  ArrowLeft,
  Shield,
  AlertTriangle,
} from "lucide-react";

import jsPDF from "jspdf";

/* =========================
   FIREBASE IMPORTS
========================= */
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

const AISymptomsChecker = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "Hello! I'm MedAI. Describe your symptoms and I'll provide instant AI analysis and triage support.",
      triage: null,
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [triageLevel, setTriageLevel] = useState(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const [severityData] = useState({
    pain: 5,
    fatigue: 5,
    fever: 0,
    breathing: 0,
  });

  const analyzeSymptoms = httpsCallable(functions, "analyzeSymptoms");

  /* =========================
     VOICE INPUT
  ========================= */
  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition is not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript);
    };

    recognition.start();
  };

  /* =========================
     AI CALL
  ========================= */
  const callAIBackend = async (userMessage) => {
    setIsLoading(true);

    try {
      const response = await analyzeSymptoms({
        symptoms: userMessage,
        severityData,
      });

      const reply = response?.data?.result;

      if (!reply) {
        throw new Error("Empty AI response received");
      }

      let triage = "Moderate";
      const lower = reply.toLowerCase();

      if (lower.includes("critical")) triage = "Critical";
      else if (lower.includes("high")) triage = "High";
      else if (lower.includes("low")) triage = "Low";
      else if (lower.includes("moderate")) triage = "Moderate";

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: reply,
          triage,
        },
      ]);

      setTriageLevel(triage);
    } catch (error) {
      console.error("🔥 FULL FIREBASE FUNCTION ERROR:", {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        stack: error?.stack,
      });

      let friendlyMessage = "AI service error occurred.";
      let debugInfo = error?.message || "Unknown error";

      /* =========================
         ✅ 429 QUOTA HANDLING (MAIN FIX)
      ========================= */
      const isQuotaError =
        error?.code === "functions/resource-exhausted" ||
        error?.message?.includes("429") ||
        error?.message?.toLowerCase()?.includes("quota");

      if (isQuotaError) {
        friendlyMessage =
          "AI is currently unavailable due to quota limits. Please try again later or upgrade your OpenAI plan.";

        // optional frontend-safe fallback structure (your requested snippet adapted properly)
        const fallback = {
          result: friendlyMessage,
        };

        debugInfo = JSON.stringify(fallback);
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: `${friendlyMessage}\n\nDebug: ${debugInfo}`,
          triage: null,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     SEND MESSAGE
  ========================= */
  const handleSend = (voiceText = null) => {
    const text = voiceText || input;
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        content: text,
      },
    ]);

    setInput("");
    callAIBackend(text);
  };

  /* =========================
     PDF EXPORT
  ========================= */
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("MedConnectNG AI Symptom Report", 20, 20);

    let y = 40;

    messages.forEach((msg) => {
      const role = msg.type === "user" ? "User" : "MedAI";
      const lines = doc.splitTextToSize(`${role}: ${msg.content}`, 170);

      doc.text(lines, 20, y);
      y += lines.length * 8;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("medai-report.pdf");
  };

  /* =========================
     TRIAGE COLORS
  ========================= */
  const getTriageColor = () => {
    switch (triageLevel) {
      case "Critical":
        return "bg-red-600";
      case "High":
        return "bg-orange-500";
      case "Low":
        return "bg-green-600";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-3 md:p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="bg-emerald-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Bot size={28} />
            <div>
              <h1 className="font-bold text-lg">MedAI Symptoms Checker</h1>
              <p className="text-xs opacity-80">
                MedConnectNG Clinical AI Assistant
              </p>
            </div>
          </div>

          {onClose && <ArrowLeft onClick={onClose} />}
        </div>

        {/* TRIAGE */}
        {triageLevel && (
          <div
            className={`${getTriageColor()} text-white px-4 py-2 flex gap-2`}
          >
            <AlertTriangle size={16} />
            TRIAGE LEVEL: {triageLevel.toUpperCase()}
          </div>
        )}

        {/* CHAT */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[500px]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-xl max-w-[80%] ${
                  msg.type === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="text-emerald-600 flex items-center gap-2">
              <Bot size={16} />
              Analyzing symptoms...
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="p-3 border-t flex gap-2">
          <button onClick={startVoiceInput} className="p-2 bg-gray-100 rounded">
            {isListening ? <MicOff /> : <Mic />}
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 border rounded px-3 py-2"
            placeholder="Describe symptoms..."
          />

          <button
            onClick={() => handleSend()}
            className="bg-emerald-600 text-white px-4 rounded"
          >
            <Send />
          </button>

          <button
            onClick={generatePDF}
            className="bg-gray-800 text-white px-4 rounded hidden md:flex"
          >
            <Download />
          </button>
        </div>

        {/* DISCLAIMER */}
        {showDisclaimer && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl text-center max-w-sm">
              <Shield className="mx-auto text-emerald-600 mb-3" />
              <p className="text-sm">
                This AI is not a medical diagnosis tool.
              </p>

              <button
                onClick={() => setShowDisclaimer(false)}
                className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded"
              >
                I Understand
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISymptomsChecker;
