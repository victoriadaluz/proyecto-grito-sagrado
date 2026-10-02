/**
 * Progressive enhancement for the primary navigation and image carousel.
 * Controls keep visible, Spanish labels so people can operate them by voice.
 */
const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu");
const carousel = document.querySelector(".carousel");
const slides = document.querySelector(".slides");
const dots = [...document.querySelectorAll(".dot")];

if (menuButton && menu) {
  menuButton.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  menu.addEventListener("click", () => {
    menu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "Abrir menú";
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      menu.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "Abrir menú";
      menuButton.focus();
    }
  });
}

if (carousel && slides && dots.length) {
  let activeSlide = 0;

  const showSlide = (index) => {
    activeSlide = (index + dots.length) % dots.length;
    slides.style.transform = `translateX(-${activeSlide * 100}%)`;

    dots.forEach((dot, dotIndex) => {
      dot.setAttribute("aria-current", String(dotIndex === activeSlide));
    });
  };

  carousel.querySelectorAll("[data-direction]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.direction === "next" ? 1 : -1;
      showSlide(activeSlide + direction);
    });
  });

  dots.forEach((dot, index) =>
    dot.addEventListener("click", () => showSlide(index)),
  );

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") showSlide(activeSlide + 1);
    if (event.key === "ArrowLeft") showSlide(activeSlide - 1);
  });
}

const heroImages = [...document.querySelectorAll(".hero-image")];
const heroToggle = document.querySelector(".hero-toggle");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (heroImages.length && heroToggle) {
  let activeHeroImage = 0;
  let heroTimer;
  let isPaused = reducedMotion.matches;

  const showHeroImage = (index) => {
    activeHeroImage = (index + heroImages.length) % heroImages.length;
    heroImages.forEach((image, imageIndex) => {
      image.classList.toggle("is-active", imageIndex === activeHeroImage);
    });
  };

  const stopRotation = () => window.clearInterval(heroTimer);
  const startRotation = () => {
    stopRotation();
    if (!isPaused) heroTimer = window.setInterval(() => showHeroImage(activeHeroImage + 1), 3000);
  };

  const updateToggle = () => {
    heroToggle.setAttribute("aria-pressed", String(isPaused));
    heroToggle.textContent = isPaused ? "Reanudar imágenes" : "Pausar imágenes";
  };

  heroToggle.addEventListener("click", () => {
    isPaused = !isPaused;
    updateToggle();
    startRotation();
  });

  reducedMotion.addEventListener("change", ({ matches }) => {
    isPaused = matches;
    updateToggle();
    startRotation();
  });

  updateToggle();
  startRotation();
}

document.querySelector("#year").textContent = new Date().getFullYear();
