// MessageInput.tsx
"use client";
import React, { useState } from "react";
import { FiPaperclip, FiSend } from "react-icons/fi";
import Tooltip from "../../ui/Tooltip";
import { Socket } from "socket.io-client";

type MessageInputProps = {
  handleSendMessage: (message: string) => void;
  socket: Socket | null;
  selectedFollower: {
  _id: string;

}}

const MessageInput: React.FC<MessageInputProps> = ({ handleSendMessage, socket, selectedFollower }) => {
  const [newMessage, setNewMessage] = useState("");
const handleTyping = () => {
  if (!socket || !selectedFollower?._id) return

  socket.emit("typing", {
    senderId: sessionStorage.getItem("user-id"),
    receiverId: selectedFollower._id,
  });
};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if(!newMessage.trim())  return

      handleSendMessage(newMessage);
      setNewMessage("");
    }
  };

return (
  <div className="px-4 py-3 bg-box border-t rounded-b-lg border-neutral-300 dark:border-neutral-800 flex items-center justify-between">
<input
  type="text"
  placeholder="Send some message..."
  value={newMessage}
  onChange={(e) => {
    setNewMessage(e.target.value);
    handleTyping()
  }}
  onKeyDown={handleKeyDown}
  className="input-style-standard flex-grow mr-2"
/>
    <div className="flex items-center space-x-3">
      {/* Attach File */}
      <div className="relative group">
        <FiPaperclip
          size={24}
          className="text-gray-500 hover:text-gray-700 transition-all duration-200 cursor-pointer"
        />
        <Tooltip text="Attach File" bgColor="bg-gray-700" />
      </div>
      {/* Send Message */}
      <div className="relative group">
        <FiSend
          size={28}
          className={`transition-all duration-200 ${
            !newMessage?.trim()
              ? "text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
              : "text-blue-500 hover:text-blue-600 cursor-pointer"
          }`}
          onClick={() => {
            if (newMessage.trim()) {
              handleSendMessage(newMessage);
              setNewMessage("");
            }
          }}
        />
        <Tooltip text="Send Message" bgColor="bg-blue-600" />
      </div>
    </div>
  </div>
);
};

export default MessageInput;

