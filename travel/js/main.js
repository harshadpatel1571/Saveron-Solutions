/** Shared behaviour for all SAVERON pages. */
const SITE_CONFIG = window.SAVERON_CONFIG || {
  companyName: "SAVERON SOLUTIONS PRIVATE LIMITED",
  phone: "+91XXXXXXXXXX",
  whatsapp: "91XXXXXXXXXX",
  email: "info@saveronsolutions.com"
};

const qs = (selector, context = document) => context.querySelector(selector);
const qsa = (selector, context = document) => [...context.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", () => {
  enhanceBranding();
  injectBrandStyles();
  hideLoader();
  setupHeader();
  markCurrentPage();
  setupRevealAnimations();
  setupAccordions();
  setupWhatsAppLinks();
  setupBackToTop();
  setupCookieBanner();
  setupTestimonialSlider();
  setupModals();

  qsa("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  qsa("[data-counter]").forEach((element) => {
    element.textContent = element.dataset.counter;
  });
});

function injectBrandStyles() {
  if (qs('link[href="css/brand.css"]')) return;

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = "css/brand.css";
  document.head.append(stylesheet);
}

function enhanceBranding() {
  qsa(".brand-logo").forEach((brand) => {
    brand.setAttribute(
      "aria-label",
      `${SITE_CONFIG.companyName || "SAVERON SOLUTIONS PRIVATE LIMITED"} home`
    );
    brand.innerHTML =
      '<img class="brand-logo-image" src="assets/images/saveron-logo.png" width="1733" height="1396" alt="SAVERON Solutions Private Limited"><span class="sr-only">SAVERON SOLUTIONS PRIVATE LIMITED</span>';
  });

  qsa('a[target="_blank"]').forEach((link) => {
    link.rel = "noopener noreferrer";
  });
}

function hideLoader() {
  setTimeout(() => qs(".loader")?.classList.add("hidden"), 250);
}

function setupHeader() {
  const header = qs(".site-header");
  const menu = qs(".nav-list");
  const toggle = qs(".menu-toggle");

  const setScrollState = () => {
    header?.classList.toggle("scrolled", window.scrollY > 25);
    qs(".back-top")?.classList.toggle("show", window.scrollY > 500);
  };

  setScrollState();
  window.addEventListener("scroll", setScrollState, { passive: true });

  toggle?.addEventListener("click", () => {
    const isOpen = menu?.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  qsa(".nav-list a").forEach((link) => {
    link.addEventListener("click", () => {
      menu?.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });
}

function markCurrentPage() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  qsa(".nav-list a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
}

function setupRevealAnimations() {
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  qsa(".reveal").forEach((element) => observer.observe(element));
}

function setupAccordions() {
  qsa(".accordion-button").forEach((button) => {
    button.addEventListener("click", () => {
      const open = button.closest(".accordion-item")?.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
    });
  });
}

function setupWhatsAppLinks() {
  qsa(".whatsapp-link").forEach((link) => {
    const message =
      link.dataset.message || "Hello SAVERON, I would like assistance planning a journey.";
    link.href = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
  });
}

function setupBackToTop() {
  qs(".back-top")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setupCookieBanner() {
  const banner = qs(".cookie-banner");
  if (!banner) return;

  if (localStorage.getItem("saveron-cookie-choice")) banner.hidden = true;

  qsa("[data-cookie]").forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.setItem("saveron-cookie-choice", button.dataset.cookie);
      banner.hidden = true;
    });
  });
}

function setupTestimonialSlider() {
  const slides = qsa(".testimonial");
  if (!slides.length) return;

  let index = 0;
  const show = (nextIndex) => {
    slides.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== nextIndex;
    });
  };

  show(index);
  qs("[data-slide-next]")?.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    show(index);
  });
  qs("[data-slide-prev]")?.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    show(index);
  });
}

function setupModals() {
  qsa("[data-modal-open]").forEach((button) => {
    button.addEventListener("click", () => openModal(qs(button.dataset.modalOpen), button));
  });

  qsa(".modal").forEach((modal) => {
    qsa("[data-modal-close]", modal).forEach((button) => {
      button.addEventListener("click", () => closeModal(modal));
    });
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") qsa(".modal.open").forEach(closeModal);
  });
}

function openModal(modal, trigger) {
  if (!modal) return;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  modal._trigger = trigger;
  qs("input,button,select,textarea", modal)?.focus();
}

function closeModal(modal) {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  modal._trigger?.focus();
}
