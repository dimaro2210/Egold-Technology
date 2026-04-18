(function () {
  "use strict";

  /* ==============================================
     DARK MODE — via floating action button
     ============================================== */
  const html = document.documentElement;

  function setTheme(theme) {
    html.setAttribute("data-theme", theme);
    localStorage.setItem("egold-theme", theme);
    const icon = document.getElementById("fabThemeIcon");
    if (icon) icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
  }

  // Load saved theme
  setTheme(localStorage.getItem("egold-theme") || "light");

  // FAB toggle
  const fabToggle = document.getElementById("fabToggle");
  const fabOptions = document.getElementById("fabOptions");

  if (fabToggle && fabOptions) {
    fabToggle.addEventListener("click", () => {
      fabToggle.classList.toggle("open");
      fabOptions.classList.toggle("show");
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".fab-container")) {
        fabToggle.classList.remove("open");
        fabOptions.classList.remove("show");
      }
    });
  }

  // Theme button
  const fabThemeBtn = document.getElementById("fabThemeBtn");
  if (fabThemeBtn) {
    fabThemeBtn.addEventListener("click", () => {
      const current = html.getAttribute("data-theme") || "light";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  // Scroll to top button
  const fabScrollTop = document.getElementById("fabScrollTop");
  if (fabScrollTop) {
    fabScrollTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ==============================================
     HEADER SCROLL EFFECT
     ============================================== */
  const header = document.getElementById("siteHeader");
  if (header) {
    window.addEventListener(
      "scroll",
      () => {
        header.classList.toggle("scrolled", window.scrollY > 60);
      },
      { passive: true }
    );
  }

  /* ==============================================
     MOBILE MENU
     ============================================== */
  const menuToggle = document.getElementById("menuToggle");
  const dropdown = document.getElementById("mobileDropdown");

  if (menuToggle && dropdown) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdown.style.display === "flex";
      dropdown.style.display = isOpen ? "none" : "flex";
      menuToggle.innerHTML = isOpen
        ? '<i class="fas fa-bars"></i>'
        : '<i class="fas fa-times"></i>';
    });

    document.addEventListener("click", (e) => {
      if (
        !dropdown.contains(e.target) &&
        e.target !== menuToggle &&
        !menuToggle.contains(e.target)
      ) {
        dropdown.style.display = "none";
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });

    dropdown.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        dropdown.style.display = "none";
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  /* ==============================================
     ACTIVE NAV HIGHLIGHT
     ============================================== */
  const navLinks = document.querySelectorAll(".nav-links a");
  const sectionsList = document.querySelectorAll("section[id]");

  window.addEventListener(
    "scroll",
    () => {
      let current = "";
      sectionsList.forEach((sec) => {
        if (window.scrollY >= sec.offsetTop - 200)
          current = sec.getAttribute("id");
      });
      navLinks.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === "#" + current)
      );
    },
    { passive: true }
  );

  /* ==============================================
     SCROLL REVEAL
     ============================================== */
  const sections = document.querySelectorAll("section");
  const revealEls = document.querySelectorAll(".reveal-up");

  const sectionObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );
  sections.forEach((sec) => sectionObs.observe(sec));

  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("revealed");
      });
    },
    { threshold: 0.1 }
  );
  revealEls.forEach((el) => revealObs.observe(el));

  /* ==============================================
     HERO VIDEO SLIDESHOW
     ============================================== */
  const heroVideos = document.querySelectorAll(".hero-video-wrap video");
  const videoDots = document.querySelectorAll(".video-dot");
  let currentVideoIndex = 0;
  let videoProgressInterval = null;

  function playVideo(index) {
    heroVideos.forEach((v, i) => {
      v.classList.remove("active-video");
      v.pause();
      if (videoDots[i]) {
        videoDots[i].classList.remove("active");
        const prog = videoDots[i].querySelector(".dot-progress");
        if (prog) prog.style.width = "0%";
      }
    });

    currentVideoIndex = index;
    const video = heroVideos[index];
    if (!video) return;

    video.currentTime = 0;
    video.classList.add("active-video");
    video.play().catch(() => {});

    if (videoDots[index]) {
      videoDots[index].classList.add("active");
    }

    // Progress bar
    clearInterval(videoProgressInterval);
    videoProgressInterval = setInterval(() => {
      if (video.duration > 0 && videoDots[index]) {
        const pct = (video.currentTime / video.duration) * 100;
        const prog = videoDots[index].querySelector(".dot-progress");
        if (prog) prog.style.width = pct + "%";
      }
    }, 100);
  }

  if (heroVideos.length > 0) {
    heroVideos.forEach((v, i) => {
      v.addEventListener("ended", () => {
        const next = (i + 1) % heroVideos.length;
        playVideo(next);
      });
    });

    videoDots.forEach((dot, i) => {
      dot.addEventListener("click", () => playVideo(i));
    });

    // Start first video
    playVideo(0);
  }

  /* ==============================================
     SERVICES CAROUSEL — 3D stacked cards
     ============================================== */
  const serviceCards = document.querySelectorAll(".service-card");
  let serviceIndex = 0;

  function updateServiceCards() {
    const total = serviceCards.length;
    serviceCards.forEach((card, i) => {
      card.classList.remove(
        "card-left",
        "card-center",
        "card-right",
        "card-hidden"
      );
      const diff = i - serviceIndex;
      if (diff === 0) card.classList.add("card-center");
      else if (diff === -1 || (serviceIndex === 0 && i === total - 1))
        card.classList.add("card-left");
      else if (diff === 1 || (serviceIndex === total - 1 && i === 0))
        card.classList.add("card-right");
      else card.classList.add("card-hidden");
    });
  }

  const svcPrev = document.getElementById("svcPrev");
  const svcNext = document.getElementById("svcNext");

  if (svcPrev) {
    svcPrev.addEventListener("click", () => {
      serviceIndex =
        (serviceIndex - 1 + serviceCards.length) % serviceCards.length;
      updateServiceCards();
    });
  }

  if (svcNext) {
    svcNext.addEventListener("click", () => {
      serviceIndex = (serviceIndex + 1) % serviceCards.length;
      updateServiceCards();
    });
  }

  // Auto-rotate services
  let svcAutoInterval = setInterval(() => {
    serviceIndex = (serviceIndex + 1) % serviceCards.length;
    updateServiceCards();
  }, 5000);

  const svcCarousel = document.querySelector(".services-carousel");
  if (svcCarousel) {
    svcCarousel.addEventListener("mouseenter", () =>
      clearInterval(svcAutoInterval)
    );
    svcCarousel.addEventListener("mouseleave", () => {
      clearInterval(svcAutoInterval);
      svcAutoInterval = setInterval(() => {
        serviceIndex = (serviceIndex + 1) % serviceCards.length;
        updateServiceCards();
      }, 5000);
    });
  }

  if (serviceCards.length > 0) updateServiceCards();

  /* ==============================================
     TESTIMONIAL CAROUSEL — 3D stacked
     ============================================== */
  const testCards = document.querySelectorAll(".testimonial-card");
  let testIndex = 0;

  function updateTestCards() {
    const total = testCards.length;
    testCards.forEach((card, i) => {
      card.classList.remove(
        "card-left",
        "card-center",
        "card-right",
        "card-hidden"
      );
      const diff = i - testIndex;
      if (diff === 0) card.classList.add("card-center");
      else if (diff === -1 || (testIndex === 0 && i === total - 1))
        card.classList.add("card-left");
      else if (diff === 1 || (testIndex === total - 1 && i === 0))
        card.classList.add("card-right");
      else card.classList.add("card-hidden");
    });
  }

  const testPrev = document.getElementById("testPrev");
  const testNext = document.getElementById("testNext");

  if (testPrev) {
    testPrev.addEventListener("click", () => {
      testIndex = (testIndex - 1 + testCards.length) % testCards.length;
      updateTestCards();
    });
  }
  if (testNext) {
    testNext.addEventListener("click", () => {
      testIndex = (testIndex + 1) % testCards.length;
      updateTestCards();
    });
  }

  let testAutoInterval = setInterval(() => {
    testIndex = (testIndex + 1) % testCards.length;
    updateTestCards();
  }, 6000);

  const testCarousel = document.querySelector(".testimonial-carousel");
  if (testCarousel) {
    testCarousel.addEventListener("mouseenter", () =>
      clearInterval(testAutoInterval)
    );
    testCarousel.addEventListener("mouseleave", () => {
      clearInterval(testAutoInterval);
      testAutoInterval = setInterval(() => {
        testIndex = (testIndex + 1) % testCards.length;
        updateTestCards();
      }, 6000);
    });
  }

  if (testCards.length > 0) updateTestCards();

  /* ==============================================
     ANIMATED COUNTERS
     ============================================== */
  function animateCounter(el, target, suffix, duration) {
    suffix = suffix || "+";
    duration = duration || 1500;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statsData = [
    { el: document.getElementById("statsProjects"), target: 128 },
    { el: document.getElementById("statsSolar"), target: 65 },
    { el: document.getElementById("statsClients"), target: 85 },
    { el: document.getElementById("statsYears"), target: 20 },
  ];

  let statsDone = false;
  const statsObs = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !statsDone) {
        statsDone = true;
        statsData.forEach((s, i) => {
          if (s.el) setTimeout(() => animateCounter(s.el, s.target), i * 150);
        });
      }
    },
    { threshold: 0.2 }
  );

  if (statsData[0].el) {
    const statsParent = statsData[0].el.closest(".stats-row");
    if (statsParent) statsObs.observe(statsParent);
  }

  /* ==============================================
     SMOOTH ANCHOR
     ============================================== */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href === "") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ==============================================
     CONTACT & FEEDBACK FORMS
     ============================================== */
  function handleFormSubmit(formId, btnId) {
    const form = document.getElementById(formId);
    const btn = document.getElementById(btnId);
    if (!form || !btn) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      btn.style.background = "linear-gradient(135deg, #16a34a, #15803d)";
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = "";
        form.reset();
      }, 3000);
    });
  }

  handleFormSubmit("contactForm", "formSubmit");
  handleFormSubmit("feedbackForm", "feedbackSubmit");
})();
