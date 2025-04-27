function getMayDayDate(year) {
    // May Day is the first Monday of May, so find the first Saturday.
    const mayFirst = new Date(year, 4, 1);
    const dayOfWeek = mayFirst.getDay();
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
    mayFirst.setDate(mayFirst.getDate() + daysUntilSaturday);
    return mayFirst;
}

function startCountdown() {
    const now = new Date();
    let targetDate = getMayDayDate(now.getFullYear());

    if (now > targetDate) {
        // If today's date is past the May Day date, set target to next year
        targetDate = getMayDayDate(now.getFullYear() + 1);
    }

    const interval = setInterval(function() {
        const currentTime = new Date();
        const timeRemaining = targetDate - currentTime;

        if (timeRemaining <= 0) {
            clearInterval(interval);
            startCountdown(); // Reset countdown for next year
        } else {
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
            
            document.getElementById("timer").innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    }, 1000);
}

// Start the countdown
startCountdown();
