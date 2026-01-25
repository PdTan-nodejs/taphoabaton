document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".hero-bg-effect");
    if (!container) return;

    const STAR_COUNT = window.innerWidth < 768 ? 12 : 24;

    function createStar() {
        const star = document.createElement("span");
        star.className = "hero-bg-item";

        const size = Math.random() * 10 + 12;
        const duration = Math.random() * 3 + 4;
        const left = Math.random() * 100;

        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${left}%`;
        star.style.animationDuration = `${duration}s`;

        container.appendChild(star);

        setTimeout(() => star.remove(), duration * 1000);
    }

    setInterval(() => {
        if (container.children.length < STAR_COUNT) {
            createStar();
        }
    }, 300);
});