export const getLast7Weekdays = () => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    let result = [];
    let count = 0;
    
    while (count < 7) {
      today.setDate(today.getDate() - 1); // Move to the previous day
      let dayName = daysOfWeek[today.getDay()];
      
      // Exclude Saturdays (Sat) and Sundays (Sun)
      if (dayName !== "Sat" && dayName !== "Sun") {
        let day = today.getDate();
        let month = today.getMonth() + 1; // Months are zero-based in JS
        let year = today.getFullYear();
        
        // Ensure two-digit month and day format (e.g., 03 instead of 3)
        let formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        let label = `${dayName} ${day}`;
  
        result.push({ label, date: formattedDate });
        count++;
      }
    }
  
    return result.reverse(); 
  };
  
 
  

  export const getFormattedDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
  
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  };

  export function formatDateForAPI(date) {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  }