// components/MessageItem.tsx
import React from "react";

type Follower = {
  _id: string;
  username: string;
  name: string;
  profileImg: string;
  lastSeen: Date | null;
};

export type Message = {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text?: string;
  status: "sent" | "delivered" | "viewed";
  createdAt: string;
  updatedAt: Date;
};

type MessageItemProps = {
  message: Message;
  selectedFollower: Follower | null;
};

const MessageItem: React.FC<MessageItemProps> = ({ message, selectedFollower }) => {
  const isFromOther = message.senderId === selectedFollower?._id;

  const dateObj = new Date(message.createdAt);
  const formattedTime = dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex items-end ${isFromOther ? "justify-start" : "justify-end"} space-x-2`}>

      <div className="relative max-w-[75%]">
        <div
          className={`p-4 pt-1 pb-1.9 rounded-lg shadow-sm backdrop-blur-sm transition-all duration-200 ${
            isFromOther ? "bg-white/50 dark:bg-black/10 text-color" : "bg-page text-color"
          }`}
        >
          <p className="break-words pb-2 font-sans">{message.text}</p>
          <div className="absolute bottom-1 right-2 text-[0.65rem] text-neutral-500">
            {formattedTime}
          </div>
        </div>
      </div>

    </div>
  );
};

export default MessageItem;