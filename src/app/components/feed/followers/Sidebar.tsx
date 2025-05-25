// Sidebar.tsx
"use client";
import React from "react";
import Image from "next/image";
import ChatContainer from "./ChatContainer";
import MessageInput from "./MessageInput";
import { formatDistanceToNow } from "date-fns";
import { Socket } from "socket.io-client";

type Follower = {
  _id: string;
  name: string;
  username: string;

  profileImg: string;
  lastSeen: Date | null;
  loggedAt: Date | null;
};

type Message = {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text?: string;
  file?: {
    name?: string;
    url?: string;
    type?: string;
    isSensitive?: boolean;
    sensitiveLabel?: string[];
  };
  status: "sent" | "delivered" | "viewed";
  viewedAt?: string;
  createdAt: string;
  updatedAt: Date;
};

type SidebarProps = {
  isOpen: boolean;
  showButton: boolean;
  onlineFollowers: Follower[];
  offlineFollowers: Follower[];
  toggleSidebar: () => void;
  toggleChat: (follower: Follower) => void;
  closeChat: () => void;
  selectedFollower: Follower | null;
  chatOpen: boolean;
  messages: Message[];
  handleSendMessage: (message: string) => void;
  fetchMessages: () => Promise<void>;
  shouldScrollToBottom: boolean;
  resetShouldScrollToBottom: () => void;
  socket: Socket | null;
  isTyping: boolean
};

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  showButton,
  onlineFollowers,
  offlineFollowers,
  toggleSidebar,
  toggleChat,
  closeChat,
  selectedFollower,
  chatOpen,
  messages,
  handleSendMessage,
  fetchMessages,
  shouldScrollToBottom,
  resetShouldScrollToBottom,
  socket,
  isTyping
}) => {
  return (
    <>
      {!showButton && !isOpen && (
        <button
          onClick={toggleSidebar}
          className="group fixed bottom-4 right-4 p-2 z-30 flex items-center justify-center cursor-pointer transition-colors duration-300"
          title={"Open Chat"}
        >
          <div className="relative w-10 h-10">
            <Image
              src="/chat0.png"
              alt="Chat toggle"
              width={40}
              height={40}
              className="object-contain transition-opacity duration-300 group-hover:opacity-0"
              aria-hidden
            />
            <Image
              src="/chat1.png"
              alt="Chat toggle hover"
              width={40}
              height={40}
              className="object-contain absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden
            />
          </div>
        </button>
      )}



        <aside
  className={`fixed bg-box rounded-lg shadow-lg flex flex-col transition-transform duration-300 
  ${isOpen ? "translate-x-0" : "translate-x-105"} 
  ${window.innerWidth < 1280 ? "w-screen h-screen top-0 bottom-0 right-0 left-0" : "w-full sm:w-100 top-2 bottom-2 right-2"}`}
>

        {chatOpen && selectedFollower ? (
          <>
            <div className="border-b border-neutral-300 dark:border-neutral-800 flex flex-col justify-between items-start">
              <div className="flex items-center space-x-2 p-3">
                <Image
                                      src={
                      selectedFollower.profileImg ||
                      "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                    }
                  alt={selectedFollower.username}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-lg"
                />
                <div>
                  <h2 className="text-lg font-semibold text-color">{selectedFollower.username}</h2>
                  <div className="flex items-center space-x-2">
                    {selectedFollower.loggedAt ? (
                      <>
                        <span className="text-xs text-green-500">online</span>
                        <span className="text-xs text-neutral-500 italic">
                          active {formatDistanceToNow(new Date(selectedFollower.loggedAt))} ago
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-red-500">offline</span>
                        <span className="text-xs text-neutral-500 italic">
                          last seen on{" "}
                          {selectedFollower.lastSeen
                            ? new Date(selectedFollower.lastSeen).toLocaleDateString("en-US", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                              timeZone: "America/Sao_Paulo",
                            })
                            : "unknown"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={closeChat}
                className="group fixed top-3 right-3 p-2 rounded-lg z-30 flex items-center justify-center cursor-pointer transition-colors duration-300"
                title="Back chat"
                aria-label="Back Chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-neutral-500 dark:text-neutral-800 group-hover:text-neutral-800 dark:group-hover:text-neutral-500 transition-colors duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
            <ChatContainer
              messages={messages}
              selectedFollower={selectedFollower}
              fetchMessages={fetchMessages}
              shouldScrollToBottom={shouldScrollToBottom}
              resetShouldScrollToBottom={resetShouldScrollToBottom}
              isTyping={isTyping}
            />
            <MessageInput handleSendMessage={handleSendMessage} socket={socket} selectedFollower={selectedFollower} />
          </>
        ) : (
          <div className=" overflow-y-auto flex-grow">
            <div className="border-b border-neutral-300 dark:border-neutral-800 flex flex-col justify-between items-start">

              <h2 className="text-lg p-3 font-semibold text-color">Mutual Followers</h2>
                            <button
                onClick={toggleSidebar}
                className="group fixed top-3 right-3 rounded-lg z-30 flex items-center justify-center cursor-pointer transition-colors duration-300"
                title="Back chat"
                aria-label="Back Chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-neutral-800 dark:text-neutral-500 group-hover:text-neutral-500 dark:group-hover:text-neutral-800 transition-colors duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Section Online */}
            <span className="text-xs ml-1 text-neutral-500">
              Online ({onlineFollowers.length})
            </span>
            {onlineFollowers.length > 0 ? (
              onlineFollowers.map((f) => (
                <div
                  key={f._id}
                  onClick={() => {toggleChat(f)}}
                  className="flex items-center space-x-3 m-1 p-2 rounded-sm bg-white/50 dark:bg-black/50 cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
                >
                  <Image
                  alt={f.name}
                    src={
                      f.profileImg ||
                      "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                    }
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-lg"
                  />
                  <div className="flex flex-col">
                    <span className="font-sans text-sm hover:underline cursor-pointer text-color">
                      {f.username}
                    </span>
                    <span className="text-xs text-green-500">online</span>
                    <span className="text-xs text-neutral-500 italic">
                      {`active ${formatDistanceToNow(new Date(f.loggedAt!))} ago`}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-center text-neutral-500 py-2">
                No online mutual followers found.
              </div>
            )}

            <hr className="my-3 border-neutral-300 dark:border-neutral-800" />

            {/* Section Offline */}
            <div>
              <span className="text-xs ml-1 text-neutral-500">
                Offline ({offlineFollowers.length})
              </span>
              {offlineFollowers.length > 0 ? (
                offlineFollowers.map((f) => (
                  <div
                    key={f._id}
                    className="flex items-center space-x-3 m-1 p-2 rounded-sm bg-white/50 dark:bg-black/50 cursor-pointer transition-transform duration-200 hover:scale-[1.01]"
                    onClick={() => toggleChat(f)}
                  >
                    <Image
                      src={
                        f.profileImg ||
                        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                      }
                      alt={f.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-lg"
                    />
                    <div className="flex flex-col">
                      <span className="font-sans text-sm hover:underline cursor-pointer text-color">
                        {f.username}
                      </span>
                      <span className="text-xs text-red-500">offline</span>
                      <span className="text-xs text-neutral-500 italic">
                        last seen on{" "}
                        {f.lastSeen
                          ? new Date(f.lastSeen).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            year: "2-digit",
                            hour12: false,
                            timeZone: "America/Sao_Paulo",
                          })
                          : "unknown"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-center text-neutral-500 py-2">
                  No offline mutual followers found.
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;