/* ============================================================
   Umair Lone — Studio site · interactions
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme ---------- */
  var themeToggle = document.getElementById("themeToggle");
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  applyTheme(stored || "dark");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    mainNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Sticky header + scroll progress ---------- */
  var header = document.getElementById("siteHeader");
  var progress = document.getElementById("scrollProgress");
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-stuck", y > 8);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    highlightNav(y);
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Active nav highlight ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".main-nav a"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  function highlightNav(y) {
    var current = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop - 120 <= y) current = sec.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + current);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.style.transitionDelay = Math.min(i * 60, 240) + "ms";
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Animated counters ---------- */
  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var suffix = el.getAttribute("data-suffix");
    if (suffix === null) suffix = "+";
    if (prefersReduced) { el.textContent = target + suffix; return; }
    var start = null, dur = 1500;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute("data-count") + "+"; });
  }

  /* ---------- Tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      document.querySelectorAll(".tab-panel").forEach(function (p) {
        p.classList.remove("is-active");
        p.hidden = true;
      });
      var panel = document.getElementById(tab.getAttribute("aria-controls"));
      if (panel) { panel.classList.add("is-active"); panel.hidden = false; }
    });
  });

  /* ---------- Testimonial carousel ---------- */
  var quotes = Array.prototype.slice.call(document.querySelectorAll(".quote"));
  var dotsWrap = document.getElementById("carouselDots");
  var current = 0, timer = null;
  function showQuote(i) {
    current = (i + quotes.length) % quotes.length;
    quotes.forEach(function (q, idx) {
      var active = idx === current;
      q.classList.toggle("is-active", active);
      q.hidden = !active;
    });
    if (dotsWrap) {
      Array.prototype.forEach.call(dotsWrap.children, function (d, idx) {
        d.classList.toggle("is-active", idx === current);
        d.setAttribute("aria-selected", idx === current ? "true" : "false");
      });
    }
  }
  if (dotsWrap && quotes.length) {
    quotes.forEach(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Testimonial " + (i + 1));
      if (i === 0) b.classList.add("is-active");
      b.addEventListener("click", function () { showQuote(i); restart(); });
      dotsWrap.appendChild(b);
    });
    function restart() {
      if (timer) clearInterval(timer);
      if (!prefersReduced) timer = setInterval(function () { showQuote(current + 1); }, 6500);
    }
    restart();
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      form.name.classList.toggle("invalid", !name);
      form.email.classList.toggle("invalid", !emailOk);
      form.message.classList.toggle("invalid", !message);
      if (!name || !emailOk || !message) {
        status.textContent = "Please complete the highlighted fields.";
        status.classList.add("err");
        return;
      }
      status.classList.remove("err");
      status.textContent = "Thanks, " + name + " — your enquiry is noted. I'll reply within one working day.";
      form.reset();
    });
  }

  /* ---------- Year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  onScroll();
})();
