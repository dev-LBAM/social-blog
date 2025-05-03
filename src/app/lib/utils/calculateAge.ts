export default function calculateAge(birthDate: Date | string): number {
    if (typeof birthDate === "string") {
      birthDate = new Date(birthDate); // Converte a string para um objeto Date
   
    }

    const today = new Date();
  
    // Get the difference in years
    let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
  
    // Check if the birthday already passed this year
    const currentMonth = today.getUTCMonth();  // Months are 0-indexed
    const birthMonth = birthDate.getUTCMonth();
  
    const currentDay = today.getUTCDate();
    const birthDay = birthDate.getUTCDate();
  
    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
      age--;
    }

    return age;
  }

  