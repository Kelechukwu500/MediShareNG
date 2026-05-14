import React from "react";

const IncomingCallPopup = ({ call, onAccept, onReject }) => {
  if (!call || !onAccept || !onReject) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-80 text-center shadow-xl">
        <h2 className="text-lg font-bold text-green-700">Incoming Call</h2>

        <p className="text-gray-600 mt-2">
          {call?.fromName || "Someone"} is calling you...
        </p>

        {/* RINGING ANIMATION */}
        <div className="animate-pulse text-green-600 text-sm mt-3">
          ● Ringing...
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onReject}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Reject
          </button>

          <button
            onClick={onAccept}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallPopup;
