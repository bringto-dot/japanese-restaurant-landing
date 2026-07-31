(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasIO = "IntersectionObserver" in window;

  /* =========================================================
     Line masks
     Each .mask gets an inner wrapper that slides up from
     behind the mask's own edge. Wrapping in JS keeps the
     markup readable and keeps the effect out of the HTML.
     ========================================================= */
  const wrapMask = (mask) => {
    if (mask.firstElementChild && mask.firstElementChild.classList.contains("m-inner")) return;
    const inner = document.createElement("span");
    inner.className = "m-inner";
    while (mask.firstChild) inner.appendChild(mask.firstChild);
    mask.appendChild(inner);
  };
  document.querySelectorAll(".mask").forEach(wrapMask);

  /* =========================================================
     Reveal on scroll
     Motivated by: the page reads as a sequence, each block
     introduces itself as the guest arrives at it instead of
     everything landing at once on load.
     ========================================================= */
  /* Anything already on screen at load, including a page opened
     straight at an anchor, plays right away rather than waiting
     for a scroll event that may never come. */
  const inViewport = (el, margin = 0) => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || root.clientHeight;
    const vw = window.innerWidth || root.clientWidth;
    return r.top < vh + margin && r.bottom > -margin && r.left < vw + margin && r.right > -margin;
  };

  const revealEls = document.querySelectorAll(".mask, .rise, .unveil");
  revealEls.forEach((el) => {
    const d = el.getAttribute("data-delay");
    if (d) el.style.setProperty("--i", d);
  });

  if (reduceMotion || !hasIO) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );

    revealEls.forEach((el) => {
      if (inViewport(el)) {
        el.classList.add("in");
      } else {
        io.observe(el);
      }
    });
  }

  /* =========================================================
     Nav background once the hero is behind us.
     Sentinel + IntersectionObserver, no scroll listener.
     ========================================================= */
  const nav = document.getElementById("nav");
  const hero = document.getElementById("top");
  if (nav && hero && hasIO) {
    const navIO = new IntersectionObserver(
      ([e]) => nav.classList.toggle("solid", !e.isIntersecting || e.intersectionRatio < 0.55),
      { threshold: [0, 0.55] }
    );
    navIO.observe(hero);
  }

  /* =========================================================
     Mobile menu
     ========================================================= */
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobile-menu");
  if (burger && mobileMenu) {
    const close = () => {
      burger.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("open");
    };
    burger.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* =========================================================
     Language toggle
     Copy for both languages ships in data-i18n-en / data-i18n-ru.
     Masked elements write into their inner wrapper so the
     reveal structure survives a language switch.
     ========================================================= */
  const LANG_KEY = "tth-lang";
  const i18nEls = document.querySelectorAll("[data-i18n-en]");
  const langBtns = document.querySelectorAll("[data-lang-btn]");

  const applyLang = (lang) => {
    const attr = lang === "ru" ? "data-i18n-ru" : "data-i18n-en";
    i18nEls.forEach((el) => {
      const copy = el.getAttribute(attr);
      if (copy == null) return;
      const target = el.classList.contains("mask")
        ? el.querySelector(".m-inner") || el
        : el;
      target.innerHTML = copy;
    });
    root.setAttribute("lang", lang === "ru" ? "ru" : "en");
    langBtns.forEach((b) => b.classList.toggle("is-active", b.dataset.langBtn === lang));
  };

  let saved = null;
  try {
    saved = localStorage.getItem(LANG_KEY);
  } catch (err) {
    /* storage unavailable, fall through to default */
  }
  applyLang(saved === "ru" ? "ru" : "en");

  langBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.langBtn;
      applyLang(lang);
      try {
        localStorage.setItem(LANG_KEY, lang);
      } catch (err) {
        /* non-essential */
      }
    });
  });

  /* =========================================================
     Lazy video
     Motivated by: three background clips sit below the fold.
     Their sources are attached only as each section comes
     within range, so nothing competes with the hero photo
     for bandwidth on first paint.
     ========================================================= */
  const lazyVideos = document.querySelectorAll("video.lazy");
  const startVideo = (video) => {
    video.querySelectorAll("source[data-src]").forEach((s) => {
      s.src = s.dataset.src;
      delete s.dataset.src;
    });
    video.load();
    video.play().catch(() => {});
  };

  if (lazyVideos.length) {
    if (!hasIO) {
      lazyVideos.forEach(startVideo);
    } else {
      const vIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            startVideo(entry.target);
            vIO.unobserve(entry.target);
          });
        },
        { rootMargin: "500px 0px" }
      );
      lazyVideos.forEach((v) => {
        if (inViewport(v, 500)) startVideo(v);
        else vIO.observe(v);
      });
    }
  }

  /* =========================================================
     Reservation form
     Front end only. Submitting swaps in a confirmation panel
     so the whole flow can be reviewed without a backend.
     ========================================================= */
  const form = document.getElementById("res-form");
  const done = document.getElementById("res-done");
  const again = document.getElementById("res-again");

  if (form && done) {
    const dateInput = document.getElementById("res-date");
    if (dateInput) dateInput.min = new Date().toISOString().slice(0, 10);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      form.hidden = true;
      done.hidden = false;
      done.setAttribute("tabindex", "-1");
      done.focus({ preventScroll: true });
    });
  }

  if (again && form && done) {
    again.addEventListener("click", () => {
      form.reset();
      done.hidden = true;
      form.hidden = false;
    });
  }

  /* =========================================================
     Footer year
     ========================================================= */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
