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

  /* ---- WhatsApp: satu nomor acak per halaman untuk CTA + tombol mengambang ---- */
  var WA_NUMBERS = ["6281399541494", "6285814777485", "6285872121214"];
  var waNumber = WA_NUMBERS[Math.floor(Math.random() * WA_NUMBERS.length)];
  var WA_TEXT = "Halo NUSA PMC, saya ingin konsultasi tentang tenda / kanopi membrane.";
  var WA_LINK = "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(WA_TEXT);

  Array.prototype.forEach.call(document.querySelectorAll("a[href*='wa.me']"), function (a) {
    if (/konsultasi gratis/i.test(a.textContent)) {
      a.href = a.getAttribute("href").replace(/wa\.me\/\d+/, "wa.me/" + waNumber);
    }
  });

  var waFloat = document.createElement("a");
  waFloat.className = "wa-float";
  waFloat.href = WA_LINK;
  waFloat.target = "_blank";
  waFloat.rel = "noopener";
  waFloat.setAttribute("aria-label", "Chat WhatsApp: +" + waNumber);
  waFloat.title = "Chat WhatsApp — +" + waNumber;
  waFloat.innerHTML =
    '<svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true"><path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.5 0 9.95-4.46 9.95-9.96 0-2.66-1.04-5.16-2.92-7.04A9.9 9.9 0 0 0 12.04 2Zm5.84 14.16c-.25.7-1.44 1.34-1.99 1.42-.51.08-1.16.11-1.87-.12-.43-.14-.99-.32-1.7-.63-2.99-1.29-4.94-4.3-5.09-4.5-.15-.2-1.22-1.62-1.22-3.09 0-1.47.77-2.19 1.04-2.49.27-.3.59-.37.79-.37l.57.01c.18.01.43-.07.67.51.25.6.84 2.07.91 2.22.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.36 1.45.3.15.47.13.64-.08.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.13.07.75-.18 1.45Z"/></svg>';
  document.body.appendChild(waFloat);

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
