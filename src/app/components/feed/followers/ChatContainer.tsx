"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";

type Follower = {
  _id: string;
  username: string;
  name: string;
  profileImg: string;
  lastSeen: Date | null;
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

type ChatContainerProps = {
  messages: Message[];
  selectedFollower: Follower | null;
  fetchMessages: () => Promise<void>;
  shouldScrollToBottom: boolean;
  resetShouldScrollToBottom: () => void;
  isTyping: boolean;
};

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  selectedFollower,
  fetchMessages,
  shouldScrollToBottom,
  resetShouldScrollToBottom,
  isTyping,
}) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // 1. Scroll para o final ao abrir uma nova conversa
  useLayoutEffect(() => {
    if (selectedFollower && messagesContainerRef.current) {
      setTimeout(() => {
        messagesContainerRef.current!.scrollTo({
          top: messagesContainerRef.current!.scrollHeight,
          behavior: "smooth",
        });
      }, 500);
    }
  }, [selectedFollower]);

  // 2. Ao rolar para o topo, carrega mensagens antigas e preserva a posição do scroll.
  useLayoutEffect(() => {
    const handleScroll = async () => {
      const container = messagesContainerRef.current;
      if (container && container.scrollTop === 0 && !loadingOlder) {
        const previousScrollHeight = container.scrollHeight;
        setLoadingOlder(true);
        await fetchMessages();
        requestAnimationFrame(() => {
          if (container) {
            container.scrollTop = container.scrollHeight - previousScrollHeight;
          }
          setLoadingOlder(false);
        });
      }
    };

    const container = messagesContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [fetchMessages, loadingOlder]);

  // 3. Ao enviar mensagem, scroll automático para o final.
  useEffect(() => {
    if (shouldScrollToBottom && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
      resetShouldScrollToBottom();
    }
  }, [shouldScrollToBottom, messages, resetShouldScrollToBottom]);

  // 4. [Nova funcionalidade] Usando MutationObserver para, em caso de nova mensagem recebida
  // ou mudança (como o indicador "digitando"), scrollar até o final, se o usuário estiver no final.
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container && isAtBottom) {
      const observer = new MutationObserver(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
      });
      observer.observe(container, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
      };
    }
  }, [isAtBottom, messages]);

  // 5. Atualiza o estado de "isAtBottom" conforme o usuário rola a lista.
  useEffect(() => {
    const handleScroll = () => {
      const container = messagesContainerRef.current;
      if (container) {
        const nearBottom =
          container.scrollHeight - container.scrollTop <= container.clientHeight + 20;
        setIsAtBottom(nearBottom);
      }
    };

    const container = messagesContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 6. Agrupa mensagens por data usando a chave local "yyyy-mm-dd"
  const groupedMessages = messages.reduce((groups: { [key: string]: Message[] }, message) => {
    const dateObj = new Date(message.createdAt);
    // Formata a data local (yyyy-mm-dd)
    const localDateKey = `${dateObj.getFullYear()}-${("0" + (dateObj.getMonth() + 1)).slice(-2)}-${(
      "0" + dateObj.getDate()
    ).slice(-2)}`;
    if (!groups[localDateKey]) {
      groups[localDateKey] = [];
    }
    groups[localDateKey].push(message);
    return groups;
  }, {});

  // Ordena as datas cronologicamente.
  const sortedDates = Object.keys(groupedMessages).sort(
    (a, b) => new Date(a + "T00:00").getTime() - new Date(b + "T00:00").getTime()
  );

  return (
    <div className="flex flex-col flex-grow h-full bg-box">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-4"
        style={{ maxHeight: "calc(100vh - 150px)" }}
      >
        {sortedDates.length > 0 ? (
          sortedDates.map((dateKey) => (
            <div key={dateKey} className="space-y-2">
              <div className="flex justify-center">
                <div className="px-4 py-1 rounded-sm text-xs text-color ">
                  {new Date(dateKey + "T00:00").toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div className="space-y-2">
                {groupedMessages[dateKey].map((msg) => (
                  <MessageItem key={msg._id} message={msg} selectedFollower={selectedFollower} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-neutral-500 italic">No messages</div>
        )}

        {/* ✨ Indicador de "digitando" ✨ */}
        {isTyping && selectedFollower && (
          <div className="text-sm italic text-neutral-500 px-4 py-2">
            {selectedFollower.username} is typing...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;