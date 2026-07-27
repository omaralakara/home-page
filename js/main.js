document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");
const submenuToggles = [...document.querySelectorAll(".submenu-toggle")];
const mobileNavigation = window.matchMedia("(max-width: 74rem)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function closeSubmenus(except = null) {
  submenuToggles.forEach((toggle) => {
    if (toggle === except) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.closest(".has-submenu")?.classList.remove("is-open");
  });
}

function syncNavigationInteractivity() {
  if (!navigation || !menuToggle) return;
  navigation.inert =
    mobileNavigation.matches &&
    menuToggle.getAttribute("aria-expanded") !== "true";
}

function closeMenu() {
  if (!menuToggle || !navigation || !header) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.querySelector(".sr-only").textContent = "Open navigation";
  navigation.classList.remove("is-open");
  header.classList.remove("is-menu-open");
  document.body.classList.remove("menu-open");
  closeSubmenus();
  syncNavigationInteractivity();
}

if (menuToggle && navigation && header) {
  menuToggle.addEventListener("click", () => {
    const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.querySelector(".sr-only").textContent = willOpen
      ? "Close navigation"
      : "Open navigation";
    navigation.classList.toggle("is-open", willOpen);
    header.classList.toggle("is-menu-open", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
    syncNavigationInteractivity();

    if (willOpen) {
      const focusDelay = window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
        ? 0
        : 320;
      window.setTimeout(() => navigation.querySelector("a")?.focus(), focusDelay);
    }
  });

  navigation.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (link && !link.classList.contains("header-cta")) closeMenu();
  });
}

submenuToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    closeSubmenus(toggle);
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.closest(".has-submenu")?.classList.toggle("is-open", !isOpen);
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".has-submenu")) closeSubmenus();
});

document.addEventListener("keydown", (event) => {
  const menuIsOpen = menuToggle?.getAttribute("aria-expanded") === "true";

  if (event.key === "Escape") {
    closeMenu();
    if (menuIsOpen) menuToggle?.focus();
    return;
  }

  if (event.key !== "Tab" || !menuIsOpen || !mobileNavigation.matches) return;

  const focusable = [menuToggle, ...navigation.querySelectorAll("a, button")]
    .filter((element) => element.getClientRects().length > 0 && !element.disabled);
  const first = focusable[0];
  const last = focusable.at(-1);

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();
syncNavigationInteractivity();

const needTabs = [...document.querySelectorAll(".need-tab")];
const needPanels = [...document.querySelectorAll(".need-panel")];
const needQuestion = document.querySelector(".needs-prompt [data-need-question]");

function selectNeed(selectedTab, moveFocus = false) {
  const targetId = selectedTab.getAttribute("aria-controls");

  needTabs.forEach((tab) => {
    const active = tab === selectedTab;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });

  needPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === targetId);
  });

  if (needQuestion && selectedTab.dataset.needQuestion) {
    needQuestion.textContent = selectedTab.dataset.needQuestion;
  }

  if (moveFocus) selectedTab.focus();
}

needTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectNeed(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    let nextIndex = index;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (index + 1) % needTabs.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (index - 1 + needTabs.length) % needTabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = needTabs.length - 1;
    }

    selectNeed(needTabs[nextIndex], true);
  });
});

const serviceCarousel = document.querySelector("[data-service-carousel]");

if (serviceCarousel) {
  const serviceCards = [...serviceCarousel.querySelectorAll("[data-service-card]")];
  const serviceTabs = [...serviceCarousel.querySelectorAll("[data-service-go]")];
  const previousService = serviceCarousel.querySelector("[data-service-prev]");
  const nextService = serviceCarousel.querySelector("[data-service-next]");
  const currentService = serviceCarousel.querySelector("[data-service-current]");
  const serviceStatus = serviceCarousel.querySelector("[data-service-status]");
  const serviceViewport = serviceCarousel.querySelector(".service-viewport");
  let activeServiceIndex = 0;
  let pointerStartX = null;

  function showServiceCard(index, announce = true) {
    activeServiceIndex = (index + serviceCards.length) % serviceCards.length;

    serviceCards.forEach((card, cardIndex) => {
      const active = cardIndex === activeServiceIndex;
      const deckPosition =
        (cardIndex - activeServiceIndex + serviceCards.length) %
        serviceCards.length;

      card.dataset.deckPosition = String(deckPosition);
      card.classList.toggle("is-active", active);
      card.setAttribute("aria-hidden", String(!active));
      card.inert = !active;
    });

    serviceTabs.forEach((tab, tabIndex) => {
      const active = tabIndex === activeServiceIndex;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-pressed", String(active));
    });

    currentService.textContent = String(activeServiceIndex + 1).padStart(2, "0");

    if (announce) {
      const serviceName = serviceCards[activeServiceIndex]
        .querySelector("h3")
        .textContent.trim();
      serviceStatus.textContent = `Showing ${serviceName}, service ${activeServiceIndex + 1} of ${serviceCards.length}.`;
    }
  }

  previousService.addEventListener("click", () => {
    showServiceCard(activeServiceIndex - 1);
  });

  nextService.addEventListener("click", () => {
    showServiceCard(activeServiceIndex + 1);
  });

  serviceTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      showServiceCard(Number(tab.dataset.serviceGo));
    });
  });

  serviceViewport.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();

    if (event.key === "ArrowLeft") showServiceCard(activeServiceIndex - 1);
    if (event.key === "ArrowRight") showServiceCard(activeServiceIndex + 1);
    if (event.key === "Home") showServiceCard(0);
    if (event.key === "End") showServiceCard(serviceCards.length - 1);
  });

  serviceViewport.addEventListener(
    "pointerdown",
    (event) => {
      if (event.pointerType === "mouse") return;
      pointerStartX = event.clientX;
    },
    { passive: true },
  );

  serviceViewport.addEventListener(
    "pointerup",
    (event) => {
      if (pointerStartX === null) return;
      const distance = event.clientX - pointerStartX;
      pointerStartX = null;
      if (Math.abs(distance) < 45) return;
      showServiceCard(activeServiceIndex + (distance < 0 ? 1 : -1));
    },
    { passive: true },
  );

  showServiceCard(0, false);
}

const heroTypeword = document.querySelector("[data-hero-typewords]");

if (heroTypeword) {
  const words = heroTypeword.dataset.heroTypewords
    .split(",")
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length > 1 && !reducedMotion.matches) {
    let wordIndex = 0;
    let charIndex = words[0].length;
    let deleting = true;

    function tickHeroType() {
      const currentWord = words[wordIndex];
      heroTypeword.textContent = currentWord.slice(0, charIndex);

      if (deleting) {
        if (charIndex > 0) {
          charIndex -= 1;
          window.setTimeout(tickHeroType, 46);
          return;
        }

        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        window.setTimeout(tickHeroType, 220);
        return;
      }

      if (charIndex < words[wordIndex].length) {
        charIndex += 1;
        window.setTimeout(tickHeroType, 68);
        return;
      }

      deleting = true;
      window.setTimeout(tickHeroType, 1350);
    }

    window.setTimeout(tickHeroType, 1050);
  }
}

const scaleSection = document.querySelector("[data-scale-section]");

if (scaleSection) {
  const scaleCanvas = scaleSection.querySelector("[data-scale-canvas]");
  const scaleContext = scaleCanvas?.getContext("2d", { alpha: true });
  const compactScale = window.matchMedia("(max-width: 47.99rem)");

  if (scaleCanvas && scaleContext) {
    const FRAME_INTERVAL = 1000 / 30;
    const LINK_DISTANCE = 130;
    const LINK_DISTANCE_SQ = LINK_DISTANCE * LINK_DISTANCE;

    let canvasWidth = 1;
    let canvasHeight = 1;
    let particles = [];
    let frameId = 0;
    let lastStep = 0;
    let sectionVisible = !("IntersectionObserver" in window);

    function seededValue(index, salt = 0) {
      const value =
        Math.sin((index + 1) * (12.9898 + salt * 17.17)) * 43758.5453;
      return value - Math.floor(value);
    }

    function createParticles() {
      const count = compactScale.matches ? 28 : 52;

      particles = Array.from({ length: count }, (_, index) => ({
        x: seededValue(index, 1) * canvasWidth,
        y: seededValue(index, 2) * canvasHeight,
        driftX: (seededValue(index, 3) - 0.5) * 14,
        driftY: (seededValue(index, 4) - 0.5) * 10,
        radius: 1.05 + seededValue(index, 5) * 1.35,
        alpha: 0.28 + seededValue(index, 6) * 0.42,
        pulse: seededValue(index, 7) * Math.PI * 2,
      }));
    }

    function stepParticles(deltaSeconds) {
      const margin = 14;

      particles.forEach((particle) => {
        particle.x += particle.driftX * deltaSeconds;
        particle.y += particle.driftY * deltaSeconds;

        if (particle.x < -margin) particle.x = canvasWidth + margin;
        else if (particle.x > canvasWidth + margin) particle.x = -margin;
        if (particle.y < -margin) particle.y = canvasHeight + margin;
        else if (particle.y > canvasHeight + margin) particle.y = -margin;
      });
    }

    function drawParticles(now = performance.now()) {
      scaleContext.clearRect(0, 0, canvasWidth, canvasHeight);
      scaleContext.lineWidth = 1;

      for (let first = 0; first < particles.length; first += 1) {
        for (
          let second = first + 1;
          second < particles.length;
          second += 1
        ) {
          const deltaX = particles[first].x - particles[second].x;
          const deltaY = particles[first].y - particles[second].y;
          const distanceSquared = deltaX * deltaX + deltaY * deltaY;

          if (distanceSquared < LINK_DISTANCE_SQ) {
            const strength =
              1 - Math.sqrt(distanceSquared) / LINK_DISTANCE;
            scaleContext.strokeStyle =
              `rgba(96, 182, 232, ${(strength * 0.14).toFixed(3)})`;
            scaleContext.beginPath();
            scaleContext.moveTo(
              particles[first].x,
              particles[first].y,
            );
            scaleContext.lineTo(
              particles[second].x,
              particles[second].y,
            );
            scaleContext.stroke();
          }
        }
      }

      particles.forEach((particle) => {
        const twinkle =
          0.82 + Math.sin(now * 0.0011 + particle.pulse) * 0.18;
        scaleContext.beginPath();
        scaleContext.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2,
        );
        scaleContext.fillStyle =
          `rgba(158, 213, 244, ${(particle.alpha * twinkle).toFixed(3)})`;
        scaleContext.fill();
      });
    }

    function shouldAnimateScale() {
      return sectionVisible && !reducedMotion.matches && !document.hidden;
    }

    function scheduleScaleFrame() {
      if (frameId || !shouldAnimateScale()) return;
      lastStep = lastStep || performance.now();
      frameId = window.requestAnimationFrame(runScaleFrame);
    }

    function runScaleFrame(now) {
      frameId = 0;
      if (!shouldAnimateScale()) return;

      const elapsed = now - lastStep;
      if (elapsed >= FRAME_INTERVAL) {
        lastStep = now - (elapsed % FRAME_INTERVAL);
        stepParticles(Math.min(elapsed, 120) / 1000);
        drawParticles(now);
      }

      scheduleScaleFrame();
    }

    function stopScaleFrame() {
      if (!frameId) return;
      window.cancelAnimationFrame(frameId);
      frameId = 0;
    }

    function resizeScaleCanvas() {
      const bounds = scaleSection.getBoundingClientRect();
      const density = Math.min(window.devicePixelRatio || 1, 1.5);
      const nextWidth = Math.max(1, Math.round(bounds.width));
      const nextHeight = Math.max(1, Math.round(bounds.height));
      const sizeChanged =
        Math.abs(nextWidth - canvasWidth) > 24 ||
        Math.abs(nextHeight - canvasHeight) > 24;

      canvasWidth = nextWidth;
      canvasHeight = nextHeight;
      scaleCanvas.width = Math.round(nextWidth * density);
      scaleCanvas.height = Math.round(nextHeight * density);
      scaleContext.setTransform(density, 0, 0, density, 0, 0);

      if (sizeChanged || !particles.length) createParticles();
      drawParticles();
    }

    if ("ResizeObserver" in window) {
      new ResizeObserver(resizeScaleCanvas).observe(scaleSection);
    } else {
      window.addEventListener("resize", resizeScaleCanvas, {
        passive: true,
      });
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        ([entry]) => {
          sectionVisible = entry.isIntersecting;
          if (sectionVisible) scheduleScaleFrame();
          else stopScaleFrame();
        },
        { rootMargin: "80px 0px", threshold: 0.01 },
      ).observe(scaleSection);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopScaleFrame();
      else scheduleScaleFrame();
    });

    reducedMotion.addEventListener("change", () => {
      if (reducedMotion.matches) {
        stopScaleFrame();
        drawParticles();
      } else {
        scheduleScaleFrame();
      }
    });

    compactScale.addEventListener("change", () => {
      createParticles();
      drawParticles();
    });

    resizeScaleCanvas();
    scheduleScaleFrame();
  }

  const statNumbers = [
    ...scaleSection.querySelectorAll("[data-stat-number]"),
  ];

  if (
    statNumbers.length &&
    "IntersectionObserver" in window &&
    !reducedMotion.matches
  ) {
    const renderStat = (element, value) => {
      element.textContent =
        `${element.dataset.prefix || ""}${value}` +
        `${element.dataset.suffix || ""}`;
    };

    const animateStat = (element) => {
      const target = Number(element.dataset.target || 0);
      const started = performance.now();
      const duration = 950;

      const tick = (now) => {
        const progress = Math.min((now - started) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        renderStat(element, Math.round(target * eased));
        if (progress < 1) window.requestAnimationFrame(tick);
      };

      window.requestAnimationFrame(tick);
    };

    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          statObserver.unobserve(entry.target);
          animateStat(entry.target);
        });
      },
      { threshold: 0.4 },
    );

    statNumbers.forEach((element) => statObserver.observe(element));
  }
}

const revealItems = [...document.querySelectorAll(".reveal")];

if (reducedMotion.matches || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

mobileNavigation.addEventListener("change", (event) => {
  if (!event.matches) closeMenu();
  syncNavigationInteractivity();
});
