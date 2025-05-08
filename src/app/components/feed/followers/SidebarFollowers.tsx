'use client'

import React, { useState, useEffect } from "react";
import { Avatar } from "../../ui/Avatar";
import Image from "next/image";

const followers = [
  { id: "1", name: "Ana Clara", profileImg: "https://i.pravatar.cc/40?img=1", status: "online" },
  { id: "2", name: "Bruno Silva", profileImg: "https://i.pravatar.cc/40?img=2", status: "offline" },
  { id: "3", name: "Carla Souza", profileImg: "https://i.pravatar.cc/40?img=3", status: "online" },
  { id: "4", name: "Diego Costa", profileImg: "https://i.pravatar.cc/40?img=4", status: "offline" },
];

export default function SidebarFollowers() {
    const [isOpen, setIsOpen] = useState(false); // Estado para controlar se o sidebar está aberto ou fechado
    const [showButton, setShowButton] = useState(false)
  // Função para alternar a visibilidade do sidebar
  const toggleSidebar = () => setIsOpen(!isOpen);

  // Monitorando a largura da tela
  useEffect(() => {

    const handleResize = () => {
      if (window.innerWidth < 1450) {
        setIsOpen(false); // Fecha o sidebar em telas menores que 1300px
        setShowButton(false)
      } else {
        setIsOpen(true);  // Abre o sidebar em telas maiores que 1300px
        setShowButton(true)
    }
    };

    handleResize(); // Chama para ajustar o estado inicialmente
    window.addEventListener("resize", handleResize);

    // Limpando o evento de resize quando o componente for desmontado
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onlineFollowers = followers.filter(f => f.status === "online");
  const offlineFollowers = followers.filter(f => f.status === "offline");

  return (
    <>
      {/* Botão para abrir/fechar sidebar (visível apenas em telas menores que 1300px) */}
      
      {!showButton && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-4 right-4 p-2  rounded-lg z-30 flex items-center justify-center cursor-pointer"
          title={isOpen ? "Close" : "Open"} // Tooltip com o texto ao passar o mouse
        >
          {isOpen ? (
                  <Image
                  src="/chat1.png"
                  alt="logo"
                  width={40}
                  height={40}
                  className="object-contain hover:scale-110 transition-transform duration-300"
                  aria-hidden
                />
          ) : (
            <Image
            src="/chat0.png"
            alt="logo"
            width={40}
            height={40}
            className="object-contain hover:scale-110 transition-transform duration-300 text-color"
            aria-hidden
          />
          )}
        </button>
      )}


      <aside
        className={`fixed right-0 top-0 h-full w-80 bg-page border-l border-neutral-200 dark:border-neutral-700 shadow-lg flex flex-col transition-transform duration-300 xl2:block ${
          isOpen ? "transform-none" : "transform translate-x-full"
        } ${isOpen || "xl2:hidden"}`} // O sidebar fica oculto em telas menores que 1300px (xl2)
      >
        {/* Cabeçalho */}
        <div className="border-b border-neutral-200 dark:border-neutral-700 p-4">
          <h2 className="text-lg font-semibold text-color">Mutual Followers</h2>
        </div>

        {/* Abas (Online e Offline) */}
        <div className="p-4">
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded-lg bg-page text-color hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Online ({onlineFollowers.length})
            </button>
            <button className="px-3 py-1 rounded-lg bg-page text-color hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Offline ({offlineFollowers.length})
            </button>
          </div>

          {/* Seguidores Online */}
          <div className="overflow-y-auto space-y-4 p-4">
            {onlineFollowers.map(f => (
              <div key={f.id} className="flex items-center space-x-3">
                <Avatar src={f.profileImg} alt={f.name} size={10} />
                <div className="flex flex-col">
                  <span className="font-medium text-color">{f.name}</span>
                  <span className="text-xs text-green-500">Online</span>
                </div>
              </div>
            ))}
          </div>

          {/* Seguidores Offline */}
          <div className="overflow-y-auto space-y-4 p-4">
            {offlineFollowers.map(f => (
              <div key={f.id} className="flex items-center space-x-3">
                <Avatar src={f.profileImg} alt={f.name} size={10} />
                <div className="flex flex-col">
                  <span className="font-medium text-color">{f.name}</span>
                  <span className="text-xs text-neutral-500">Offline</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
