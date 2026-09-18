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
// Cursor-reactive background glow. Only runs for devices with a
// precise, hover-capable pointer (i.e. a real mouse) and only when
// the user hasn't asked for reduced motion — touch devices and
// reduced-motion users simply see the glow's static default position.
// ---------------------------------------------------------
const cursorGlow = document.querySelector(".cursor-glow");
const hasFinePointer = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
).matches;

if (cursorGlow && hasFinePointer && !prefersReducedMotion) {
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight * 0.22;
  let rafPending = false;

  const applyGlowPosition = () => {
    cursorGlow.style.setProperty("--cursor-x", `${targetX}px`);
    cursorGlow.style.setProperty("--cursor-y", `${targetY}px`);
    rafPending = false;
  };

  window.addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(applyGlowPosition);
    }
  });
}

// ---------------------------------------------------------
// AI Review Analyzer card: "See how it works" flow toggle.
// CSS handles the hover reveal for mouse users; this click
// handler makes it work on touch and keyboard too.
// ---------------------------------------------------------
const flowToggle = document.getElementById("reviewFlowToggle");
const flowPanel = document.getElementById("reviewFlow");

if (flowToggle && flowPanel) {
  flowToggle.addEventListener("click", () => {
    const isOpen = flowPanel.classList.toggle("is-open");
    flowToggle.setAttribute("aria-expanded", String(isOpen));
    flowPanel.setAttribute("aria-hidden", String(!isOpen));
  });
}

// ---------------------------------------------------------
// Mini terminal easter egg
// ---------------------------------------------------------
const terminalEl = document.querySelector(".terminal");
const terminalBody = document.getElementById("terminalBody");
const terminalInput = document.getElementById("terminalInput");

const TERMINAL_RESPONSES = {
  help: "Commands: about, projects, skills, whoami, tea, help, clear",
  about:
    "Moesha Eleuthere — started a pastry business before moving into tech. " +
    "Now learning by building practical, AI-powered web applications and " +
    "exploring AI/LLM integration and structured data.",
  projects:
    "AI Review Analyzer — Live · Phase 1 MVP (Next.js, TypeScript, Tailwind CSS, Gemini API). " +
    "Barbados Menu & Market Intelligence — In Development.",
  skills:
    "Languages: Python, JavaScript, TypeScript, HTML, CSS. " +
    "Frameworks & Tools: Next.js, Tailwind CSS, Git, GitHub, VS Code. " +
    "AI & Data: Gemini API, AI/LLM Integration, JSON/Structured Data.",
  whoami: [
    "You found me 👀",
    "I'm Moesha — pastry chef turned AI builder.",
    "I bake cakes, build apps, and convince computers to cooperate.",
    "Status: still figuring it out, but we're getting there. 💙",
  ],
  tea: ["Brewing... 🫖", "Tea first. Then we build. 💙"],
};

function appendTerminalLine(text, variant) {
  const lines = Array.isArray(text) ? text : [text];
  lines.forEach((lineText) => {
    const line = document.createElement("p");
    line.className = "terminal__line" + (variant ? ` terminal__line--${variant}` : "");
    line.textContent = lineText;
    terminalBody.appendChild(line);
  });
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

if (terminalEl && terminalBody && terminalInput) {
  terminalEl.addEventListener("click", (event) => {
    if (event.target !== terminalInput) {
      terminalInput.focus();
    }
  });

  terminalInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;

    const raw = terminalInput.value.trim();
    terminalInput.value = "";
    if (!raw) return;

    const command = raw.toLowerCase();
    appendTerminalLine(`moesha@portfolio:~$ ${raw}`, "cmd");

    if (command === "clear") {
      terminalBody.innerHTML = "";
    } else if (TERMINAL_RESPONSES[command]) {
      appendTerminalLine(TERMINAL_RESPONSES[command]);
    } else {
      appendTerminalLine(
        `Command not found: ${raw}. Type "help" for a list of commands.`,
        "error"
      );
    }
  });
}

// ---------------------------------------------------------
// Footer year
// ---------------------------------------------------------
document.getElementById("year").textContent = new Date().getFullYear();
