'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { FiLoader } from "react-icons/fi";

type Follower = {
  _id: string;
  name: string;
  username: string;
  profileImg: string;
  lastSeen: Date | null;
  loggedAt: Date | null;
};

type Conversation = {
  _id: string;
  participant: Follower;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
};

type MessagesTabProps = {
  userExists: boolean;
  toggleChat: (follower: Follower) => void;
};

const MessagesTab: React.FC<MessagesTabProps> = ({
  userExists,
  toggleChat
}) => {
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = async () => {
    try {
      setLoadingConversations(true);
      const res = await fetch(`/api/conversations`);
      const data = await res.json();
      const convs: Conversation[] = data.conversations || [];

      // Sort by most recent
      const sorted = convs.sort(
        (a, b) =>
          new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
      );

      setConversations(sorted);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    if (userExists) fetchConversations();
  }, [userExists]);

  return (
    <div className="p-2">
      <span className="text-xs ml-1 text-neutral-500">
        Messages ({conversations.length})
      </span>

      {loadingConversations ? (
        <div className="flex items-center justify-center p-4 text-neutral-500">
          <FiLoader className="animate-spin mr-2" />
          Loading conversations...
        </div>
      ) : conversations.length > 0 ? (
        conversations.map((conv) => (
          <div
            key={conv._id}
            onClick={() => toggleChat(conv.participant)}
            className="flex items-center space-x-3 m-1 p-2 rounded-sm bg-white/50 dark:bg-black/50 cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
          >
            <Image
              alt={conv.participant.name}
              src={
                conv.participant.profileImg ||
                "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              }
              width={40}
              height={40}
              className="w-10 h-10 rounded-lg"
            />
            <div className="flex flex-col overflow-hidden">
              <span className="font-sans text-sm hover:underline cursor-pointer text-color truncate">
                {conv.participant.username}
              </span>
              <span className="text-xs text-neutral-600 truncate">
                {conv.lastMessage}
              </span>
              <span className="text-xs text-neutral-500 italic">
                {formatDistanceToNow(new Date(conv.lastMessageAt))} ago
              </span>
              {conv.unreadCount > 0 && (
                <span className="text-xs text-blue-500 font-semibold">
                  {conv.unreadCount} new message
                  {conv.unreadCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-sm text-center text-neutral-500 py-2">
          No conversations found.
        </div>
      )}
    </div>
  );
};

export default MessagesTab;
