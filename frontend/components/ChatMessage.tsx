import { IChatMessage } from "../types";

interface ChatMessageProps {
  msg: IChatMessage;
}

export const ChatMessage = ({ msg }: ChatMessageProps) => {
  if (!msg.text) return null;

  return (
    <div
      className={`max-w-[75%] p-2 rounded-2xl ${
        msg.sender === "user"
          ? "bg-gray-500 text-white self-end"
          : "bg-gray-200 text-gray-800 self-start"
      }`}
    >
      {msg.text}
    </div>
  );
};
