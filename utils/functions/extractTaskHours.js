function extractTaskHours(data) {
    // Check if data is empty or invalid
    if (!data || !data.task_data || !data.dates) {
        return [];
    }

    // Extract and flatten all dates
    let allDates = [];
    if (Array.isArray(data.dates)) {
        allDates = data.dates.flatMap(dateObj => 
            dateObj.Dates.split(',')
        );
    } else if (typeof data.dates === 'object' && data.dates.Dates) {
        allDates = data.dates.Dates.split(',');
    }

    // Process each employee's task data
    return data.task_data.map(user => {
        const hoursByDate = {};
        
        // Populate hours for each date
        allDates.forEach(date => {
            // Trim any whitespace from date
            const trimmedDate = date.trim();
            // Check if the date exists in the user's data
            if (user[trimmedDate] !== undefined) {
                hoursByDate[trimmedDate] = user[trimmedDate];
            } else {
                hoursByDate[trimmedDate] = 0; // Default to 0 if date not found
            }
        });

        return {
            EmpId: user.EmpId,
            OWNER: user.OWNER,
            hours: hoursByDate
        };
    });
}

export default extractTaskHours;