/* NUSA PMC — interactions */
(function () {
  "use strict";

  /* ---- Footer year ---- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---- Mobile nav toggle ---- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  function closeNav() {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) closeNav();
    });
  }

  /* ---- Sticky navbar state on scroll ---- */
  var navbar = document.getElementById("navbar");
  function onScroll() {
    if (window.scrollY > 24) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Reveal on scroll (staggered) ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // stagger items that share the same parent
            var siblings = Array.prototype.slice.call(entry.target.parentElement.children);
            var index = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = Math.min(index, 6) * 70 + "ms";
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Gallery pagination arrows ---- */
  var cur = 1;
  var total = document.querySelectorAll("[id^='gallery-p']").length;
  var prevBtn = document.querySelector(".page-prev");
  var nextBtn = document.querySelector(".page-next");
  var curEl = document.querySelector(".page-current");
  function updateArrows() {
    if (prevBtn) prevBtn.disabled = cur <= 1;
    if (nextBtn) nextBtn.disabled = cur >= total;
    if (curEl) curEl.textContent = cur;
  }
  function goPage(n) {
    if (n < 1 || n > total) return;
    cur = n;
    var targets = Array.prototype.slice.call(document.querySelectorAll("[id^='gallery-p']"));
    targets.forEach(function(g, i) { g.style.display = i + 1 === n ? "" : "none"; });
    updateArrows();
    var target = document.getElementById("gallery-p" + n);
    if (target) {
      target.querySelectorAll(".reveal").forEach(function(el) {
        el.classList.remove("in");
        if ("IntersectionObserver" in window) io.observe(el);
        else el.classList.add("in");
      });
    }
  }
  if (prevBtn) prevBtn.addEventListener("click", function(){ goPage(cur - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function(){ goPage(cur + 1); });
  updateArrows();

  /* ---- Gallery lightbox ---- */
  var lb = document.getElementById("lightbox");
  var lbImage = document.getElementById("lbImage");
  var lbCaption = document.getElementById("lbCaption");
  var lbClose = document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  var current = 0;

  function show(index) {
    current = (index + items.length) % items.length;
    var item = items[current];
    var img = item.querySelector("img");
    lbImage.src = item.getAttribute("data-full") || img.src;
    lbImage.alt = img.alt;
    var cap = item.querySelector("figcaption");
    lbCaption.textContent = cap ? cap.textContent.replace(/\s+/g, " ").trim() : "";
  }

  function openLb(index) {
    show(index);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    lb.hidden = true;
    document.body.style.overflow = "";
  }

  items.forEach(function (item, i) {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.addEventListener("click", function () { openLb(i); });
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLb(i);
      }
    });
  });

  if (lb) {
    lbClose.addEventListener("click", closeLb);
    lbPrev.addEventListener("click", function () { show(current - 1); });
    lbNext.addEventListener("click", function () { show(current + 1); });
    lb.addEventListener("click", function (e) {
      if (e.target === lb) closeLb();
    });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

})();
