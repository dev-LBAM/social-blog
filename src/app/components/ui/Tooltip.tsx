type TooltipProps = {
    text: string;
    bgColor: string;
  }
  
  export default function Tooltip({ text, bgColor }: TooltipProps) {
    return(
        <>
    <span className={`${bgColor} text-neutral-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-xs py-1 px-3 rounded-md opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 whitespace-nowrap`}>
        {text}
    </span>
     </>
    )
}