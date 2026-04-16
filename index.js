function getTarget() {
    const y = new Date().getFullYear();
    const may1 = new Date(y, 4, 1);
    const offset = (1 - may1.getDay() + 7) % 7;
    const mon = new Date(y, 4, 1 + offset);
    const sat = new Date(mon);
    sat.setDate(mon.getDate() - 2);
    sat.setHours(10, 0, 0, 0);
    if (new Date() > sat) {
        const ny = y + 1;
        const nm = new Date(ny, 4, 1);
        const no = (1 - nm.getDay() + 7) % 7;
        const nm2 = new Date(ny, 4, 1 + no);
        const ns = new Date(nm2);
        ns.setDate(nm2.getDate() - 2);
        ns.setHours(10, 0, 0, 0);
        return ns;
    }
    return sat;
}
const target = getTarget();
function pad(n) { return String(n).padStart(2, '0'); }
setInterval(() => {
    const diff = target - new Date();
    if (diff <= 0) return;
    document.getElementById('l-days').textContent = Math.floor(diff / 86400000);
    document.getElementById('l-hrs').textContent = pad(Math.floor((diff / 3600000) % 24));
    document.getElementById('l-min').textContent = pad(Math.floor((diff / 60000) % 60));
    document.getElementById('l-sec').textContent = pad(Math.floor((diff / 1000) % 60));
}, 1000);