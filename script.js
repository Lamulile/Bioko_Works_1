/* =========================================================
   Base elements
========================================================= */
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

/* =========================================================
   Mobile nav toggle
========================================================= */
function closeNav() {
  if (!nav || !navToggle) return;
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function openNav() {
  if (!nav || !navToggle) return;
  nav.classList.add("is-open");
  navToggle.setAttribute("aria-expanded", "true");
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.contains("is-open");
    open ? closeNav() : openNav();
  });

  // Close on link click (mobile)
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => closeNav());
  });

  // Close if you tap outside nav (mobile)
  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("is-open")) return;
    const clickedInside = nav.contains(e.target) || navToggle.contains(e.target);
    if (!clickedInside) closeNav();
  });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
}

/* =========================================================
   Active nav highlight (multi-page)
========================================================= */
function setActiveNav() {
  const page = document.body?.dataset?.page;
  if (!page) return;

  // Clear all
  document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("is-active"));
  document.querySelectorAll(".nav-dd-item").forEach(item => item.classList.remove("is-active"));
  document.querySelectorAll(".nav-dd").forEach(dd => dd.classList.remove("is-active"));

  // Standard links
  document.querySelectorAll(".nav-link[data-page]").forEach(link => {
    const linkPage = link.getAttribute("data-page");
    if (linkPage === page) link.classList.add("is-active");
  });

  // Divisions dropdown: if on reach/edge/divisions, highlight parent
  if (page === "reach" || page === "edge" || page === "divisions") {
    const dd = document.querySelector(".nav-dd");
    if (dd) dd.classList.add("is-active");
  }

  // Also highlight the dropdown item if on reach/edge
  const activeItem = document.querySelector(`.nav-dd-item[data-page="${page}"]`);
  if (activeItem) activeItem.classList.add("is-active");
}

document.addEventListener("DOMContentLoaded", setActiveNav);

/* =========================================================
   Divisions dropdown (Reach / Edge)
========================================================= */
(function initDivisionSelect() {
  const select = document.getElementById("divisionSelect");
  if (!select) return;

  const panels = Array.from(document.querySelectorAll(".service-panel"));

  function showPanel(id) {
    panels.forEach(p => p.classList.toggle("is-active", p.id === id));
  }

  // initial
  showPanel(select.value);

  select.addEventListener("change", () => {
    showPanel(select.value);
  });
})();

/* =========================================================
   Footer year
========================================================= */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================================================
   Contact form demo
========================================================= */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Form captured (demo). Next step: connect to email/API endpoint.");
    contactForm.reset();
  });
}

/* =========================================================
   Header dropdown (Divisions)
========================================================= */
(function initNavDropdown(){
  const dd = document.querySelector(".nav-dd");
  if (!dd) return;

  const toggle = dd.querySelector(".nav-dd-toggle");
  const menu = dd.querySelector(".nav-dd-menu");
  if (!toggle || !menu) return;

  function closeDD(){
    dd.classList.remove("open");
    toggle.setAttribute("aria-expanded","false");
  }
  function openDD(){
    dd.classList.add("open");
    toggle.setAttribute("aria-expanded","true");
  }

  toggle.addEventListener("click", (e)=>{
    e.preventDefault();
    const isOpen = dd.classList.contains("open");
    isOpen ? closeDD() : openDD();
  });

  document.addEventListener("click", (e)=>{
    if (!dd.classList.contains("open")) return;
    const inside = dd.contains(e.target);
    if (!inside) closeDD();
  });

  document.addEventListener("keydown", (e)=>{
    if (e.key === "Escape") closeDD();
  });

  // Close on selecting an item (esp. mobile)
  menu.querySelectorAll("a").forEach(a=>{
    a.addEventListener("click", ()=> closeDD());
  });
})();



/* =========================================================
   Divisions landing: jump select
========================================================= */
(function initDivisionJump(){
  const sel = document.getElementById("divisionJump");
  const go = document.getElementById("divisionGo");
  if (!sel || !go) return;

  function sync(){
    go.setAttribute("href", sel.value);
  }
  sync();
  sel.addEventListener("change", sync);
})();



/* Activation carousel controls */
const activationCarousel = document.getElementById('activationCarousel');
const activationPrev = document.querySelector('.activation-nav--prev');
const activationNext = document.querySelector('.activation-nav--next');

if (activationCarousel && activationPrev && activationNext) {
  const scrollAmount = () => {
    const slide = activationCarousel.querySelector('.activation-slide');
    if (!slide) return 320;
    const gap = 18;
    return slide.offsetWidth + gap;
  };

  activationPrev.addEventListener('click', () => {
    activationCarousel.scrollBy({
      left: -scrollAmount(),
      behavior: 'smooth'
    });
  });

  activationNext.addEventListener('click', () => {
    activationCarousel.scrollBy({
      left: scrollAmount(),
      behavior: 'smooth'
    });
  });
}
