
export default function getDate(date: Date | string) : string 
{
    if (typeof date === "string") {
        date = new Date(date); 
    }
  
    const convertDate = new Date(date);
    const formattedDate = convertDate.toISOString().split('T')[0]; // Pega a parte "yyyy-mm-dd"
    
    return formattedDate
}

