export default function Buttom({ text })
{
  return(
    <button 
      type="submit" 
      className="w-full py-2 bg-gradient-to-r font-serif from-background to-indigo-400 text-zinc-200 rounded-md transition-transform duration-200 ease-in-out transform hover:scale-102 cursor-pointer hover:from-background hover:to-indigo-500">
      {text}
    </button>
  )
}