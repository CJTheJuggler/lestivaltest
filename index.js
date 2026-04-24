function getSaturdayMayDay() {
    const y = new Date().getFullYear();
    const may1 = new Date(y, 4, 1);
    const offset = (1 - may1.getDay() + 7) % 7;
    const mon = new Date(y, 4, 1 + offset);
    const sat = new Date(mon);
    sat.setDate(mon.getDate() - 2);
    return sat;
}

function getTarget() {
    const y = new Date().getFullYear();
    const sat = getSaturdayMayDay();
    const satStart = new Date(sat);
    satStart.setHours(10, 0, 0, 0);
    
    if (new Date() > satStart) {
        const ny = y + 1;
        const may1 = new Date(ny, 4, 1);
        const offset = (1 - may1.getDay() + 7) % 7;
        const mon = new Date(ny, 4, 1 + offset);
        const ns = new Date(mon);
        ns.setDate(mon.getDate() - 2);
        ns.setHours(10, 0, 0, 0);
        return ns;
    }
    return satStart;
}

function getCountdownTarget() {
    const sat = getSaturdayMayDay();
    const now = new Date();
    const satStart = new Date(sat);
    satStart.setHours(10, 0, 0, 0);
    const satEnd = new Date(sat);
    satEnd.setHours(22, 0, 0, 0);
    
    if (now >= satStart && now < satEnd) {
        return satEnd;
    }
    return getTarget();
}

const pad = n => String(n).padStart(2, '0');

let confettiTriggered = false;

function triggerConfetti() {
    if (confettiTriggered) return;
    
    const now = new Date();
    const sat = getSaturdayMayDay();
    const satStart = new Date(sat);
    satStart.setHours(10, 0, 0, 0);
    const satStart15 = new Date(sat);
    satStart15.setHours(10, 15, 0, 0);
    
    // Check if it's first visit and within 10am-10:15am
    const isFirstVisit = !localStorage.getItem('lestival-visited');
    
    if (isFirstVisit && now >= satStart && now < satStart15) {
        localStorage.setItem('lestival-visited', 'true');
        confettiTriggered = true;
        
        // Multiple confetti bursts for more intensity
        confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0.6 },
            duration: 3000
        });
        
        setTimeout(() => {
            confetti({
                particleCount: 200,
                spread: 90,
                origin: { y: 0.6 },
                duration: 3000
            });
        }, 500);
        
        setTimeout(() => {
            confetti({
                particleCount: 200,
                spread: 90,
                origin: { y: 0.6 },
                duration: 3000
            });
        }, 1000);
    }
}

function updateTimer() {
    triggerConfetti();
    
    const now = new Date();
    const sat = getSaturdayMayDay();
    const satStart = new Date(sat);
    satStart.setHours(10, 0, 0, 0);
    const satEnd = new Date(sat);
    satEnd.setHours(22, 0, 0, 0);
    const midnight = new Date(sat);
    midnight.setHours(24, 0, 0, 0);
    
    const label = document.querySelector('.lest-countdown-label');
    const timerGrid = document.querySelector('.lest-timer-grid');
    
    // Check if festival is happening (10am to 10pm on Saturday)
    if (now >= satStart && now < satEnd) {
        label.textContent = 'How long is left of lestival:';
        timerGrid.style.display = 'flex';
        const diff = satEnd - now;
        document.getElementById('l-days').textContent = Math.floor(diff / 86400000);
        document.getElementById('l-hrs').textContent = pad(Math.floor((diff / 3600000) % 24));
        document.getElementById('l-min').textContent = pad(Math.floor((diff / 60000) % 60));
        document.getElementById('l-sec').textContent = pad(Math.floor((diff / 1000) % 60));
    }
    // Check if festival has ended (10pm to midnight on Saturday)
    else if (now >= satEnd && now < midnight) {
        label.textContent = 'See you next year!';
        timerGrid.style.display = 'none';
    }
    // Before festival or after midnight
    else {
        label.textContent = 'Lestival XVII is in:';
        timerGrid.style.display = 'flex';
        const target = getTarget();
        const diff = target - now;
        if (diff <= 0) return;
        document.getElementById('l-days').textContent = Math.floor(diff / 86400000);
        document.getElementById('l-hrs').textContent = pad(Math.floor((diff / 3600000) % 24));
        document.getElementById('l-min').textContent = pad(Math.floor((diff / 60000) % 60));
        document.getElementById('l-sec').textContent = pad(Math.floor((diff / 1000) % 60));
    }
}

setInterval(updateTimer, 1000);
updateTimer();

// Back to top button functionality
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});