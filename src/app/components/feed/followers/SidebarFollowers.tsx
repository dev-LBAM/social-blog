"use client";
import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Sidebar from "./Sidebar";
import ThemeToggleButton from "../../ui/ThemeToggleButton";

type Follower = {
  _id: string;
  username: string;
  name: string;
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

export default function ChatApp() {
  // Estados de controle para sidebar, chat, mensagens e socket
  const [isOpen, setIsOpen] = useState(true);
  const [onlineFollowers, setOnlineFollowers] = useState<Follower[]>([]);
  const [offlineFollowers, setOfflineFollowers] = useState<Follower[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedFollower, setSelectedFollower] = useState<Follower | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [userExists, setUserExists] = useState <boolean>(false)
  const [loadingFollowers, setLoadingFollowers] = useState<boolean>(true)


  // Toggle do sidebar
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  // Abre o chat com o seguidor, garantindo que, se a tela for menor que 1635px, o sidebar inicie fechado
const toggleChat = (follower: Follower) => {
  setSelectedFollower(follower);
  setMessages([]);
  setCursor(null);
  setChatOpen(true);
  setIsOpen(true)
};

  useEffect(() => {
    if (selectedFollower) {
      fetchMessages();
    }
  }, [selectedFollower]);

  const fetchMessages = async () => {
    if (!selectedFollower?._id) return;
    try {
      const res = await fetch(
        `/api/messages/${selectedFollower._id}${cursor ? `?cursor=${cursor}` : ""}`
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data.messages.length > 0) {
        const fetchedMessages = data.messages.reverse();
        setMessages((prev) =>
          cursor ? [...fetchedMessages, ...prev] : fetchedMessages
        );
        setCursor(data.nextCursor || null);
      }
    } catch (err) {
      console.error("Error to load messages: ", err);
    }
  };

  const closeChat = () => {
    setChatOpen(false);
    setSelectedFollower(null);
  };

  // Responsividade: se a tela for menor que 1635px, o sidebar inicia fechado; se maior, ele abre.
useEffect(() => {
  const handleResize = () => {
    if(selectedFollower)
    {
      setIsOpen(true);
    }
    else{
      setIsOpen(window.innerWidth >= 1635);
    }

  };

  window.addEventListener("resize", handleResize);
  handleResize(); // Executa no primeiro render para definir corretamente
  return () => window.removeEventListener("resize", handleResize);
}, []);


  // Configuração do socket e eventos
  useEffect(() => {
    const userId = sessionStorage.getItem("user-id");
    if (!userId) return;

    setUserExists(true)
    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
        withCredentials: true,
        auth: { userId },
      });
    }
    const socket = socketRef.current;
    socket.on("mutual_followers_online", (followers: Follower[]) =>
      {
        setOnlineFollowers(followers)
        setLoadingFollowers(false)
      }
    );
    socket.on("mutual_followers_offline", (followers: Follower[]) =>
    {
      setOfflineFollowers(followers)
      setLoadingFollowers(false)
    }

    
    );
    socket.on("chat_message", (msg: Message) => {
      if (
        selectedFollower &&
        (msg.senderId === selectedFollower._id || msg.receiverId === selectedFollower._id)
      ) {
        setIsTyping(false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        setMessages((prev) => [...prev, msg]);
      }
    });
    socket.on("user_typing", ({ senderId }) => {
      if (selectedFollower?._id === senderId) {
        setIsTyping(true);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 5000);
      }
    });
    socket.on("mutual_follower_login", (user) => {
      setOfflineFollowers((prev) => prev.filter((u) => u._id !== user._id));
      setOnlineFollowers((prev) => {
        if (prev.some((u) => u._id === user._id)) return prev;
        return [{ ...user, lastSeen: null }, ...prev];
      });
      if (selectedFollower && selectedFollower._id === user._id) {
        setSelectedFollower((prev) =>
          prev ? { ...prev, loggedAt: user.loggedAt } : prev
        );
      }
    });
    socket.on("mutual_follower_logout", (user) => {
      setOnlineFollowers((prev) => prev.filter((u) => u._id !== user._id));
      setOfflineFollowers((prev) => {
        if (prev.some((u) => u._id === user._id)) return prev;
        return [...prev, { ...user }];
      });
      if (selectedFollower && selectedFollower._id === user._id) {
        setSelectedFollower((prev) =>
          prev ? { ...prev, loggedAt: null } : prev
        );
      }
    });
    return () => {
      socket.off("mutual_followers_online");
      socket.off("mutual_followers_offline");
      socket.off("chat_message");
      socket.off("mutual_follower_login");
      socket.off("mutual_follower_logout");
      socket.off("user_typing");
    };
  }, [selectedFollower]);

  // Envia a mensagem e emite para o socket
  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !selectedFollower) return;
    const userId = sessionStorage.getItem("user-id");
    if (!userId) return;
    try {
      const res = await fetch(`/api/messages/${selectedFollower._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message.trim() }),
      });
      if (!res.ok) throw new Error("Erro ao enviar mensagem");
      const data = await res.json();
      const msg: Message = data.createdMessage;
      setMessages((prev) => [...prev, msg]);
      socketRef.current?.emit("private_message", msg);
      setShouldScrollToBottom(true);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };
console.log(userExists)
return (
  <>
  <ThemeToggleButton isSidebarOpen={isOpen} />

    <Sidebar
      loadingFollowers={loadingFollowers}
      userExists={userExists}
      isOpen={isOpen}
      showButton={false}
      onlineFollowers={onlineFollowers}
      offlineFollowers={offlineFollowers}
      toggleSidebar={toggleSidebar}
      toggleChat={toggleChat}
      closeChat={closeChat}
      selectedFollower={selectedFollower}
      chatOpen={chatOpen}
      messages={messages}
      handleSendMessage={handleSendMessage}
      fetchMessages={fetchMessages}
      shouldScrollToBottom={shouldScrollToBottom}
      resetShouldScrollToBottom={() => setShouldScrollToBottom(false)}
      socket={socketRef.current}
      isTyping={isTyping}
    />
  </>
);
}