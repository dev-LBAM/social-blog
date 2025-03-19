export default function Button({ 
  text, 
  color = 'to-orange-100', 
  hcolor = 'to-orange-200', 
  disabled = false, 
  onClick 
}: { 
  text: string; 
  color?: string; 
  hcolor?: string; 
  disabled?: boolean; 
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; 
}) {
  return (
    <button 
      type="submit" 
      className={`outline-none  w-full py-2 bg-gradient-to-r drop-shadow-md font-serif from-background ${color} text-white rounded-md
      ${disabled ? "cursor-not-allowed opacity-50" : `transition-transform duration-200 ease-in-out transform hover:scale-105 cursor-pointer hover:from-background hover:${hcolor}`
    }`}
    disabled={disabled}
    onClick={onClick}
      >
      
      
      {text}
    </button>
  )
}