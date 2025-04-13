export default function Button({ 
  text, 
  bgcolor = 'bg-neutral-600', 
  bghcolor = 'hover:bg-neutral-700',
  width = 'w-full',
  disabled = false,
  onClick 
}: { 
  text: string 
  bgcolor?: string 
  bghcolor?: string 
  disabled?: boolean
  width?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void 
}) {
  return (
    <button 
      type="submit" 
      className={`outline-none ${width} py-2 bg-gradient-to-r font-serif drop-shadow-md from-background ${bgcolor} text-white rounded-md
        ${disabled ? "cursor-not-allowed opacity-50" : ` transition-all duration-200 ease-in-out cursor-pointer hover:from-background ${bghcolor}`
      }`}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  )
}