import React from "react";

interface ChatInputProps {
  message: string;
  setMessage: (msg: string) => void;
  onSend: () => void;
}

export const ChatInput = ({ message, setMessage, onSend }: ChatInputProps) => {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        className="border border-gray-300 p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
        placeholder="Napisz wiadomość..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
      />
      <button
        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 rounded-md transition"
        onClick={onSend}
      >
        Wyślij
      </button>
    </div>
  );
};
