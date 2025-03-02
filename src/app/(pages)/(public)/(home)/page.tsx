'use client'

export default function Home() 
{
  const toggleTheme = () => 
    {
        document.documentElement.classList.toggle("light");
    }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-text">
      <h1 className="text-4xl font-bold">Tailwind está funcionando</h1>
      <button onClick={toggleTheme}>Test light mode</button>
    </main>
  );
}
