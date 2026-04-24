function getSaturdayMayDay(year = new Date().getFullYear()) {
    const may1 = new Date(year, 4, 1);
    const offset = (1 - may1.getDay() + 7) % 7;
    const mon = new Date(year, 4, 1 + offset);
    const sat = new Date(mon);
    sat.setDate(mon.getDate() - 2);
    return sat;
}

function getDisplayedEventDate() {
    const now = new Date();
    const thisYearSat = getSaturdayMayDay();

    const satEnd = new Date(thisYearSat);
    satEnd.setHours(22, 0, 0, 0);

    // After 10pm Saturday → show next year's date
    if (now >= satEnd) {
        return getSaturdayMayDay(now.getFullYear() + 1);
    }

    return thisYearSat;
}

function getEventDateString() {
    const sat = getDisplayedEventDate();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return sat.toLocaleDateString(undefined, options);
}


function toRoman(num) {
    const map = [
        [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
        [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
        [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
    ];
    let result = "";
    for (const [value, numeral] of map) {
        while (num >= value) {
            result += numeral;
            num -= value;
        }
    }
    return result;
}

function getLestivalNumber() {
    const now = new Date();
    const baseYear = 2026; // Lestival XVII
    const baseNum = 17;

    const thisYearSat = getSaturdayMayDay();
    const satEnd = new Date(thisYearSat);
    satEnd.setHours(22, 0, 0, 0);

    const yearOffset = now >= satEnd ? 1 : 0;

    const num = baseNum + (now.getFullYear() - baseYear) + yearOffset;
    return toRoman(num);
}


function getTarget() {
    const now = new Date();
    const thisYearSat = getSaturdayMayDay();

    const satStart = new Date(thisYearSat);
    satStart.setHours(10, 0, 0, 0);

    if (now > satStart) {
        const nextYearSat = getSaturdayMayDay(now.getFullYear() + 1);
        nextYearSat.setHours(10, 0, 0, 0);
        return nextYearSat;
    }

    return satStart;
}

function getCountdownTarget() {
    const now = new Date();
    const sat = getSaturdayMayDay();

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

    const isFirstVisit = !localStorage.getItem('lestival-visited');

    if (isFirstVisit && now >= satStart && now < satStart15) {
        localStorage.setItem('lestival-visited', 'true');
        confettiTriggered = true;

        const burst = () => confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0.6 },
            duration: 3000
        });

        burst();
        setTimeout(burst, 500);
        setTimeout(burst, 1000);
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

    const numeral = getLestivalNumber();

    // During festival
    if (now >= satStart && now < satEnd) {
        label.textContent = `How long is left of Lestival! ${numeral}:`;
        timerGrid.style.display = 'flex';

        const diff = satEnd - now;
        document.getElementById('l-days').textContent = Math.floor(diff / 86400000);
        document.getElementById('l-hrs').textContent = pad(Math.floor((diff / 3600000) % 24));
        document.getElementById('l-min').textContent = pad(Math.floor((diff / 60000) % 60));
        document.getElementById('l-sec').textContent = pad(Math.floor((diff / 1000) % 60));
    }

    // After festival (10pm–midnight)
    else if (now >= satEnd && now < midnight) {
        label.textContent = `See you next year for Lestival! ${numeral}`;
        timerGrid.style.display = 'none';
    }

    // Before festival OR after midnight
    else {
        label.textContent = `Lestival! ${numeral} is in:`;
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


document.addEventListener("DOMContentLoaded", () => {
    const dateString = getEventDateString();

    const heroSub = document.querySelector(".lest-hero-sub");
    if (heroSub) {
        heroSub.textContent =
            `Leicester's favourite one-day juggling and circus convention — ${dateString}`;
    }

    const dateBox = document.querySelector(".lest-event-date");
    if (dateBox) {
        dateBox.textContent = dateString;
    }
});
