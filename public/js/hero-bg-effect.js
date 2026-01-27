function createStar() {
    const star = document.createElement("span");
    star.className = "hero-bg-item";

    const depth = Math.random(); // 0 (gần) → 1 (xa)

    // kích thước & cảm giác không gian
    const size = 18 + (1 - depth) * 14;
    const scale = 0.7 + (1 - depth) * 0.6;
    const opacity = 0.4 + (1 - depth) * 0.6;

    // rơi: gần nhanh, xa chậm (nhưng không quá gắt)
    const duration = 6 + depth * 4;

    const left = Math.random() * 100;

    // lệch nhẹ để tránh rơi thẳng đứng
    const driftX = (Math.random() - 0.5) * 80;

    // quay đa trục – chậm – tự nhiên
    const rotateX = Math.random() * 240 + 60;
    const rotateY = Math.random() * 240 + 60;
    const rotateZ =
        (Math.random() * 180 + 120) *
        (Math.random() > 0.5 ? 1 : -1);

    // Z-depth thật
    const zStart = 160 - depth * 220; // gần → nổi, xa → chìm

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${left}%`;

    star.style.setProperty("--scale", scale);
    star.style.setProperty("--opacity", opacity);
    star.style.setProperty("--duration", `${duration}s`);

    star.style.setProperty("--rotateX", `${rotateX}deg`);
    star.style.setProperty("--rotateY", `${rotateY}deg`);
    star.style.setProperty("--rotate", `${rotateZ}deg`);
    star.style.setProperty("--driftX", `${driftX}px`);
    star.style.setProperty("--z", `${zStart}px`);

    container.appendChild(star);

    setTimeout(() => star.remove(), duration * 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".hero-bg-effect");
    if (!container) return;

    // expose để test devtools
    window.container = container;
    window.createStar = createStar;

    const isMobile = window.innerWidth < 768;

    // số sao tối đa tồn tại cùng lúc
    const MAX_STARS = isMobile ? 10 : 18;

    // khoảng spawn (ms)
    const SPAWN_INTERVAL = isMobile ? 900 : 600;

    let spawnTimer = null;

    function spawnLoop() {
        if (container.children.length < MAX_STARS) {
            createStar();
        }
    }

    spawnTimer = setInterval(spawnLoop, SPAWN_INTERVAL);

    // optional: dừng khi tab inactive (tiết kiệm CPU)
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            clearInterval(spawnTimer);
            spawnTimer = null;
        } else if (!spawnTimer) {
            spawnTimer = setInterval(spawnLoop, SPAWN_INTERVAL);
        }
    });
});
