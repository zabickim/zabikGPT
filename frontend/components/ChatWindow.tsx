"use client";

import { useState } from "react";

export const ChatWindow = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    setChat((prev) => prev + "\n" + message);
    setMessage("");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-2">
      <h1 className="text-2xl font-bold text-center">ZabikGPT</h1>
      <div className="border p-4 h-64 overflow-auto whitespace-pre-wrap bg-gray-50">
        {chat}
      </div>

      <input
        type="text"
        className="border p-2 w-full"
        placeholder="Napisz wiadomość..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      <button
        className="bg-gray-500 text-white p-2 w-full"
        onClick={handleSend}
      >
        Wyślij
      </button>
    </div>
  );
};
