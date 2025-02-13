'use client'

import React from "react";

export default function Home() {
  const click: React.MouseEventHandler<HTMLButtonElement> = () => {
    return console.log("\u{1F4BB} vc clicou")
  }
    return (
      <main>
        <div>Hello HomePage</div>
        <button onClick={click}>click here</button>
      </main>
    );
  }