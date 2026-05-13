import React, { useState } from "react";
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Download,
  ArrowLeft,
  AlertTriangle,
  Shield,
} from "lucide-react";
import jsPDF from "jspdf";

const AISymptomsChecker = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "Hello! I'm MedAI. Describe your symptoms and I'll provide instant analysis & triage.",
      triage: null,
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [triageLevel, setTriageLevel] = useState(null);
  const [severityData, setSeverityData] = useState({
    pain: 5,
    fatigue: 5,
    fever: 0,
    breathing: 0,
  });
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const handleSeverityChange = (key, value) => {
    setSeverityData((prev) => ({ ...prev, [key]: value }));
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setInput(text);
      handleSend(text);
    };

    recognition.start();
  };

  const callOpenAI = async (userMessage) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer YOUR_OPENAI_API_KEY`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are MedAI, a medical assistant. Always include triage level: Critical, High, Medium, Low.",
              },
              { role: "user", content: userMessage },
            ],
          }),
        },
      );

      const data = await response.json();
      const reply = data.choices[0].message.content;

      let triage = "Medium";
      if (reply.toLowerCase().includes("emergency")) triage = "Critical";
      else if (reply.toLowerCase().includes("urgent")) triage = "High";
      else if (reply.toLowerCase().includes("monitor")) triage = "Medium";

      setMessages((prev) => [...prev, { type: "bot", content: reply, triage }]);

      setTriageLevel(triage);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", content: "AI error. Try again.", triage: null },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (voiceText = null) => {
    const text = voiceText || input;
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { type: "user", content: text }]);
    setInput("");
    callOpenAI(text);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("MedConnectNG AI Report", 20, 20);
    doc.save("medai-report.pdf");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-3 md:p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl md:rounded-3xl shadow-xl flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 md:p-6 flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-4">
            <Bot />
            <div>
              <h1 className="text-lg md:text-2xl font-bold">
                MedAI Symptoms Checker
              </h1>
              <p className="text-xs md:text-sm text-white/80">
                MedConnectNG Clinical AI Assistant
              </p>
            </div>
          </div>

          {onClose && (
            <button onClick={onClose}>
              <ArrowLeft />
            </button>
          )}
        </div>

        {/* TRIAGE */}
        {triageLevel && (
          <div
            className={`text-white px-4 py-2 text-sm font-medium ${
              triageLevel === "Critical"
                ? "bg-red-600"
                : triageLevel === "High"
                  ? "bg-orange-500"
                  : "bg-yellow-500"
            }`}
          >
            ⚠ TRIAGE LEVEL: {triageLevel.toUpperCase()}
          </div>
        )}

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 bg-gray-50 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-xl text-sm md:text-base ${
                  msg.type === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-white border"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <p className="text-emerald-600 text-sm">MedAI analyzing...</p>
          )}
        </div>

        {/* SEVERITY */}
        <div className="p-4 md:p-6 border-t bg-white">
          <h3 className="font-semibold mb-3 text-sm md:text-base">
            Symptom Severity
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.keys(severityData).map((key) => (
              <div key={key}>
                <label className="text-xs capitalize">{key}</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={severityData[key]}
                  onChange={(e) =>
                    handleSeverityChange(key, Number(e.target.value))
                  }
                  className="w-full accent-emerald-600"
                />
              </div>
            ))}
          </div>
        </div>

        {/* INPUT */}
        <div className="p-3 md:p-4 border-t flex gap-2 bg-white">
          <button
            onClick={startVoiceInput}
            className="p-3 bg-gray-100 rounded-xl"
          >
            {isListening ? <MicOff /> : <Mic />}
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Describe symptoms..."
            className="flex-1 border rounded-xl px-3 md:px-4 py-2 text-sm md:text-base"
          />

          <button
            onClick={() => handleSend()}
            className="bg-emerald-600 text-white px-4 md:px-6 rounded-xl"
          >
            <Send />
          </button>

          <button
            onClick={generatePDF}
            className="bg-gray-800 text-white px-4 rounded-xl hidden md:block"
          >
            <Download />
          </button>
        </div>

        {/* DISCLAIMER */}
        {showDisclaimer && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md text-center">
              <Shield className="mx-auto text-emerald-600 mb-3" size={40} />
              <h2 className="font-bold text-lg mb-2">Medical Disclaimer</h2>
              <p className="text-sm text-gray-500">
                This tool does not replace professional medical advice.
              </p>

              <button
                onClick={() => setShowDisclaimer(false)}
                className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-xl"
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
