// ---------------------------------------------------------
// Mobile nav toggle
// ---------------------------------------------------------
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close the mobile menu after a link is clicked
navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// ---------------------------------------------------------
// Scroll-spy: highlight the nav link for the section in view
// ---------------------------------------------------------
const navLinks = document.querySelectorAll("[data-nav-link]");
const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      const link = document.querySelector(`[data-nav-link][href="#${id}"]`);
      if (!link) return;

      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove("is-active"));
        link.classList.add("is-active");
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px" }
);

sections.forEach((section) => spyObserver.observe(section));

// ---------------------------------------------------------
// Scroll-reveal animation (skipped instantly if the user
// prefers reduced motion, matching the CSS fallback)
// ---------------------------------------------------------
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const revealEls = document.querySelectorAll(".reveal");

if (prefersReducedMotion) {
  revealEls.forEach((el) => el.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
}

// ---------------------------------------------------------
// Back to top button
// ---------------------------------------------------------
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("is-visible", window.scrollY > 500);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
});

// ---------------------------------------------------------
// Footer arrow: subtly shifts toward whichever link is hovered
// or focused (GitHub = left, LinkedIn = right)
// ---------------------------------------------------------
const footerArrow = document.getElementById("footerArrow");
const footerLinks = document.querySelectorAll(".footer__link");

if (footerArrow && footerLinks.length === 2) {
  const [githubLink, linkedinLink] = footerLinks;

  const shiftLeft = () =>
    footerArrow.classList.add("footer__arrow-wrap--left");
  const shiftRight = () =>
    footerArrow.classList.add("footer__arrow-wrap--right");
  const resetShift = () =>
    footerArrow.classList.remove(
      "footer__arrow-wrap--left",
      "footer__arrow-wrap--right"
    );

  githubLink.addEventListener("mouseenter", shiftLeft);
  githubLink.addEventListener("focus", shiftLeft);
  githubLink.addEventListener("mouseleave", resetShift);
  githubLink.addEventListener("blur", resetShift);

  linkedinLink.addEventListener("mouseenter", shiftRight);
  linkedinLink.addEventListener("focus", shiftRight);
  linkedinLink.addEventListener("mouseleave", resetShift);
  linkedinLink.addEventListener("blur", resetShift);
}

// ---------------------------------------------------------
// Footer year
// ---------------------------------------------------------
document.getElementById("year").textContent = new Date().getFullYear();
