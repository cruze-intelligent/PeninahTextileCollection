document.documentElement.classList.add("js-enabled");

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const revealItems = document.querySelectorAll(".reveal");
const localLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const viewer = document.querySelector("[data-selection-viewer]");
const viewerImage = document.querySelector("[data-viewer-image]");
const viewerTitle = document.querySelector("[data-viewer-title]");
const viewerPrice = document.querySelector("[data-viewer-price]");
const viewerClose = document.querySelector("[data-viewer-close]");

function setMenu(open) {
  if (!menuToggle || !navLinks) return;
  menuToggle.setAttribute("aria-expanded", String(open));
  navLinks.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenu(!isOpen);
  });
}

localLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

window.addEventListener(
  "scroll",
  () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  },
  { passive: true }
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

function closeViewer() {
  if (!viewer) return;
  clearSelectedItem();
  viewer.hidden = true;
  document.body.classList.remove("viewer-open");
}

function clearSelectedItem() {
  document.querySelectorAll(".gallery-item.is-selected").forEach((selected) => {
    selected.classList.remove("is-selected");
  });
}

function openViewer(item) {
  if (!viewer || !viewerImage || !viewerTitle || !viewerPrice) return;

  clearSelectedItem();
  item.classList.add("is-selected");

  const img = item.querySelector("img");
  viewerImage.src = item.dataset.src || img?.currentSrc || "";
  viewerImage.alt = img?.alt || "Selected item";
  viewerTitle.textContent = item.dataset.title || "";
  viewerPrice.textContent = item.dataset.price || "";
  viewer.hidden = false;
  document.body.classList.add("viewer-open");
}

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => openViewer(item));
});

if (viewerClose) {
  viewerClose.addEventListener("click", closeViewer);
}

if (viewer) {
  viewer.addEventListener("click", (event) => {
    const clickedInsideSelectedItem = event.target.closest(".viewer-image-wrap img, .viewer-panel, .viewer-close");
    if (!clickedInsideSelectedItem) closeViewer();
  });
}

document.addEventListener("click", (event) => {
  if (!viewer?.hidden) return;

  const clickedGalleryItem = event.target.closest(".gallery-item");
  const clickedViewer = event.target.closest(".selection-viewer");
  if (!clickedGalleryItem && !clickedViewer) {
    clearSelectedItem();
  }
});

if (viewer) {
  viewer.addEventListener("transitionend", () => {
    if (viewer.hidden) {
      clearSelectedItem();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
    closeViewer();
  }
});
