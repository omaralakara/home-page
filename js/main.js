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

const partnerMarquee = document.querySelector("[data-partner-marquee]");

if (partnerMarquee) {
  const partnerTrack = partnerMarquee.querySelector(".partner-marquee-track");
  const reducedPartnerMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let partnerLogos = [];
  let partnerLoopWidth = 0;
  let partnerPointerId = null;
  let partnerPointerStartX = 0;
  let partnerStartScrollLeft = 0;
  let partnerHasDragged = false;
  let partnerIsDragging = false;
  let partnerIsHovered = false;
  let partnerPreviousFrame = null;

  if (partnerTrack) {
    [...partnerTrack.querySelectorAll("[data-partner-logo]")].forEach(
      (logo, index) => {
        logo.dataset.partnerLogoId = String(index);
      },
    );

    ["beforebegin", "afterend"].forEach((position) => {
      const duplicateTrack = partnerTrack.cloneNode(true);
      duplicateTrack.setAttribute("aria-hidden", "true");
      duplicateTrack.querySelectorAll("a").forEach((logo) => {
        logo.tabIndex = -1;
      });
      partnerTrack.insertAdjacentElement(position, duplicateTrack);
    });

    partnerLogos = [...partnerMarquee.querySelectorAll("[data-partner-logo]")];
  }

  function highlightPartnerLogo(logo) {
    partnerIsHovered = Boolean(logo);
    partnerMarquee.classList.toggle("is-logo-paused", partnerIsHovered);
  }

  partnerLogos.forEach((logo) => {
    logo.addEventListener("pointerenter", () => highlightPartnerLogo(logo));
    logo.addEventListener("pointerleave", () => {
      if (!partnerMarquee.matches(":focus-within")) highlightPartnerLogo(null);
    });
    logo.addEventListener("focus", () => highlightPartnerLogo(logo));
    logo.addEventListener("blur", () => {
      window.setTimeout(() => {
        if (!partnerMarquee.matches(":focus-within")) highlightPartnerLogo(null);
      }, 0);
    });
  });

  partnerMarquee.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    partnerPointerId = event.pointerId;
    partnerPointerStartX = event.clientX;
    partnerStartScrollLeft = partnerMarquee.scrollLeft;
    partnerHasDragged = false;
    partnerIsDragging = true;
    partnerMarquee.classList.add("is-dragging");
    partnerMarquee.setPointerCapture?.(event.pointerId);
  });

  partnerMarquee.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerId !== partnerPointerId) return;
      const distance = event.clientX - partnerPointerStartX;

      if (Math.abs(distance) > 4) {
        partnerHasDragged = true;
        partnerMarquee.scrollLeft = partnerStartScrollLeft - distance;
        keepPartnerMarqueeInLoop();
        event.preventDefault();
      }
    },
    { passive: false },
  );

  function finishPartnerDrag(event) {
    if (event.pointerId !== partnerPointerId) return;
    partnerMarquee.releasePointerCapture?.(event.pointerId);
    partnerMarquee.classList.remove("is-dragging");
    partnerPointerId = null;
    partnerIsDragging = false;
  }

  partnerMarquee.addEventListener("pointerup", finishPartnerDrag);
  partnerMarquee.addEventListener("pointercancel", finishPartnerDrag);
  partnerMarquee.addEventListener("dragstart", (event) => event.preventDefault());
  partnerMarquee.addEventListener(
    "click",
    (event) => {
      if (!partnerHasDragged) return;
      event.preventDefault();
      event.stopPropagation();
      partnerHasDragged = false;
    },
    true,
  );

  function measurePartnerMarquee(resetPosition = false) {
    if (!partnerTrack) return;
    const nextLoopWidth = partnerTrack.getBoundingClientRect().width;
    if (!nextLoopWidth) return;

    const previousOffset = partnerLoopWidth
      ? partnerMarquee.scrollLeft - partnerLoopWidth
      : 0;
    partnerLoopWidth = nextLoopWidth;
    partnerMarquee.scrollLeft = resetPosition
      ? partnerLoopWidth
      : partnerLoopWidth + previousOffset;
    keepPartnerMarqueeInLoop();
  }

  function keepPartnerMarqueeInLoop() {
    if (!partnerLoopWidth) return;
    if (partnerMarquee.scrollLeft >= partnerLoopWidth * 2) {
      partnerMarquee.scrollLeft -= partnerLoopWidth;
    } else if (partnerMarquee.scrollLeft <= 0) {
      partnerMarquee.scrollLeft += partnerLoopWidth;
    }
  }

  function movePartnerMarquee(timestamp) {
    if (partnerPreviousFrame === null) partnerPreviousFrame = timestamp;
    const elapsed = Math.min(timestamp - partnerPreviousFrame, 48);
    partnerPreviousFrame = timestamp;

    if (
      !reducedPartnerMotion.matches &&
      !partnerIsDragging &&
      !partnerIsHovered &&
      partnerLoopWidth
    ) {
      partnerMarquee.scrollLeft += elapsed * 0.052;
      keepPartnerMarqueeInLoop();
    }

    window.requestAnimationFrame(movePartnerMarquee);
  }

  measurePartnerMarquee(true);
  window.addEventListener("resize", () => measurePartnerMarquee());
  window.requestAnimationFrame(movePartnerMarquee);
}

const serviceCarousel = document.querySelector("[data-service-carousel]");

if (serviceCarousel) {
  const serviceCards = [...serviceCarousel.querySelectorAll("[data-service-card]")];
  const previousService = serviceCarousel.querySelector("[data-service-prev]");
  const nextService = serviceCarousel.querySelector("[data-service-next]");
  const serviceStatus = serviceCarousel.querySelector("[data-service-status]");
  const serviceViewport = serviceCarousel.querySelector(".service-viewport");
  let activeServiceIndex = 0;
  let pointerStartX = null;
  let pointerId = null;
  let dragDistance = 0;
  let suppressClick = false;

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

    if (announce) {
      const serviceName = serviceCards[activeServiceIndex]
        .querySelector("h3")
        .textContent.trim();
      serviceStatus.textContent = `Showing ${serviceName}.`;
    }
  }

  previousService.addEventListener("click", () => {
    showServiceCard(activeServiceIndex - 1);
  });

  nextService.addEventListener("click", () => {
    showServiceCard(activeServiceIndex + 1);
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
      if (event.button !== undefined && event.button !== 0) return;
      pointerStartX = event.clientX;
      pointerId = event.pointerId;
      dragDistance = 0;
      suppressClick = false;
      serviceViewport.classList.add("is-dragging");
      serviceViewport.setPointerCapture?.(event.pointerId);
    },
  );

  serviceViewport.addEventListener(
    "pointermove",
    (event) => {
      if (pointerStartX === null || event.pointerId !== pointerId) return;
      dragDistance = event.clientX - pointerStartX;
      if (Math.abs(dragDistance) > 8) {
        suppressClick = true;
        event.preventDefault();
      }
    },
    { passive: false },
  );

  function finishServicePointer(event) {
    if (pointerStartX === null || event.pointerId !== pointerId) return;
    const distance = dragDistance || event.clientX - pointerStartX;
    const shouldAdvance =
      event.type === "pointerup" && Math.abs(distance) >= 45;

    serviceViewport.releasePointerCapture?.(event.pointerId);
    serviceViewport.classList.remove("is-dragging");
    pointerStartX = null;
    pointerId = null;
    dragDistance = 0;
    if (event.type !== "pointerup") suppressClick = false;

    if (shouldAdvance) {
      showServiceCard(activeServiceIndex + (distance < 0 ? 1 : -1));
    }
  }

  serviceViewport.addEventListener("pointerup", finishServicePointer);
  serviceViewport.addEventListener("pointercancel", finishServicePointer);
  serviceViewport.addEventListener(
    "click",
    (event) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    },
    true,
  );

  showServiceCard(0, false);
}

const industryShowcase = document.querySelector("[data-industry-showcase]");

if (industryShowcase) {
  const industryRail = industryShowcase.querySelector("[data-industry-rail]");
  const industryCards = [
    ...industryShowcase.querySelectorAll("[data-industry-card]"),
  ];
  const industryButtons = industryCards.map((card) =>
    card.querySelector("[data-industry-go]"),
  );
  const previousIndustry = industryShowcase.querySelector(
    "[data-industry-prev]",
  );
  const nextIndustry = industryShowcase.querySelector("[data-industry-next]");
  const currentIndustry = industryShowcase.querySelector(
    "[data-industry-current]",
  );
  const industryStatus = industryShowcase.querySelector(
    "[data-industry-status]",
  );
  const compactIndustryRail = window.matchMedia("(max-width: 61.25rem)");
  let activeIndustryIndex = 0;

  function showIndustry(index, announce = true, moveFocus = false) {
    const nextIndustryIndex =
      (index + industryCards.length) % industryCards.length;

    activeIndustryIndex = nextIndustryIndex;

    industryCards.forEach((card, cardIndex) => {
      const active = cardIndex === activeIndustryIndex;
      const title = card.querySelector("h3").textContent.trim();

      card.classList.toggle("is-active", active);
      card.setAttribute(
        "aria-label",
        `${cardIndex + 1} of ${industryCards.length}: ${title}`,
      );
      industryButtons[cardIndex].setAttribute(
        "aria-pressed",
        String(active),
      );
    });

    if (currentIndustry) {
      currentIndustry.textContent = String(activeIndustryIndex + 1).padStart(
        2,
        "0",
      );
    }

    if (compactIndustryRail.matches) {
      window.requestAnimationFrame(() => {
        const activeCard = industryCards[activeIndustryIndex];
        const targetLeft = Math.max(
          0,
          activeCard.offsetLeft - Math.max(16, industryRail.clientWidth * 0.08),
        );

        industryRail.scrollTo({
          left: targetLeft,
          behavior: reducedMotion.matches ? "auto" : "smooth",
        });
      });
    }

    if (announce) {
      const title = industryCards[activeIndustryIndex]
        .querySelector("h3")
        .textContent.trim();
      industryStatus.textContent =
        `Showing ${title}, industry ${activeIndustryIndex + 1} of ${industryCards.length}.`;
    }

    if (moveFocus) {
      industryButtons[activeIndustryIndex].focus({ preventScroll: true });
    }
  }

  previousIndustry.addEventListener("click", () => {
    showIndustry(activeIndustryIndex - 1);
  });

  nextIndustry.addEventListener("click", () => {
    showIndustry(activeIndustryIndex + 1);
  });

  industryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showIndustry(Number(button.dataset.industryGo));
    });
  });

  industryRail.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();

    if (event.key === "ArrowLeft") {
      showIndustry(activeIndustryIndex - 1, true, true);
    }
    if (event.key === "ArrowRight") {
      showIndustry(activeIndustryIndex + 1, true, true);
    }
    if (event.key === "Home") showIndustry(0, true, true);
    if (event.key === "End") {
      showIndustry(industryCards.length - 1, true, true);
    }
  });

  showIndustry(0, false);
}

const industryQueue = document.querySelector("[data-industry-queue]");

if (industryQueue) {
  const industryQueueRail = industryQueue.querySelector(
    "[data-industry-queue-rail]",
  );
  const industryQueueCards = [
    ...industryQueue.querySelectorAll("[data-industry-queue-card]"),
  ];
  const industryQueueButtons = industryQueueCards.map((card) =>
    card.querySelector("[data-industry-queue-go]"),
  );
  const previousQueueIndustry = industryQueue.querySelector(
    "[data-industry-queue-prev]",
  );
  const nextQueueIndustry = industryQueue.querySelector(
    "[data-industry-queue-next]",
  );
  const industryQueueStatus = industryQueue.querySelector(
    "[data-industry-queue-status]",
  );
  const compactIndustryQueue = window.matchMedia("(max-width: 47.99rem)");
  let industryQueueOrder = [...industryQueueCards];
  let industryQueueMoving = false;
  let pendingIndustryQueueCard = null;
  let industryQueuePointerStartX = null;
  let industryQueuePointerId = null;
  let suppressIndustryQueueClick = false;

  function syncIndustryQueue() {
    industryQueueOrder.forEach((card, position) => {
      const active = position === 0;

      card.dataset.industryQueuePosition = String(position);
      card.classList.toggle("is-active", active);
      industryQueueButtons[industryQueueCards.indexOf(card)].setAttribute(
        "aria-pressed",
        String(active),
      );
    });
  }

  function moveIndustryQueueTo(card, announce = true, moveFocus = false) {
    if (!card || !industryQueueOrder.includes(card)) return;

    if (industryQueueMoving) {
      pendingIndustryQueueCard = card;
      return;
    }

    const selectedPosition = industryQueueOrder.indexOf(card);

    if (selectedPosition === 0) {
      if (moveFocus) {
        industryQueueButtons[industryQueueCards.indexOf(card)].focus({
          preventScroll: true,
        });
      }
      return;
    }

    industryQueueMoving = true;
    const transitionDuration = reducedMotion.matches ? 0 : 900;
    const previousOrder = [...industryQueueOrder];
    const outgoingCards = previousOrder.slice(0, selectedPosition);
    const remainingCards = previousOrder.slice(selectedPosition);
    const nextOrder = [...remainingCards, ...outgoingCards];

    function finishIndustryQueueMove() {
      industryQueueMoving = false;
      const activeCard = industryQueueOrder[0];
      const activeTitle = activeCard.querySelector("h3").textContent.trim();

      if (announce && industryQueueStatus) {
        industryQueueStatus.textContent = `Showing ${activeTitle}.`;
      }

      if (moveFocus) {
        industryQueueButtons[industryQueueCards.indexOf(activeCard)].focus({
          preventScroll: true,
        });
      }

      if (pendingIndustryQueueCard) {
        const pendingCard = pendingIndustryQueueCard;
        pendingIndustryQueueCard = null;
        moveIndustryQueueTo(pendingCard, true, moveFocus);
      }
    }

    if (compactIndustryQueue.matches) {
      const mobileFadeDuration = reducedMotion.matches ? 0 : 140;

      industryQueueRail.classList.add("is-mobile-changing");

      window.setTimeout(() => {
        industryQueueOrder = nextOrder;
        industryQueueOrder.forEach((queueCard) =>
          industryQueueRail.append(queueCard),
        );
        syncIndustryQueue();

        window.requestAnimationFrame(() => {
          industryQueueRail.classList.remove("is-mobile-changing");
        });

        window.setTimeout(
          finishIndustryQueueMove,
          reducedMotion.matches ? 0 : 260,
        );
      }, mobileFadeDuration);
      return;
    }

    industryQueueCards.forEach((queueCard) => {
      queueCard.style.transition = "none";
    });

    industryQueueOrder = nextOrder;
    industryQueueOrder.forEach((queueCard) => industryQueueRail.append(queueCard));
    syncIndustryQueue();
    void industryQueueRail.offsetWidth;

    const firstTailRect = outgoingCards[0].getBoundingClientRect();
    const lastTailRect = outgoingCards[
      outgoingCards.length - 1
    ].getBoundingClientRect();
    const reservedTailWidth = lastTailRect.right - firstTailRect.left;

    industryQueueOrder = previousOrder;
    industryQueueOrder.forEach((queueCard) => industryQueueRail.append(queueCard));
    syncIndustryQueue();
    void industryQueueRail.offsetWidth;

    industryQueueCards.forEach((queueCard) => {
      queueCard.style.transition = "";
    });

    const tailPlaceholder = document.createElement("span");
    tailPlaceholder.className = "industry-queue-placeholder";
    tailPlaceholder.setAttribute("aria-hidden", "true");
    industryQueueRail.append(tailPlaceholder);

    industryQueueRail.style.setProperty(
      "--industry-queue-step-duration",
      `${transitionDuration}ms`,
    );
    void industryQueueRail.offsetWidth;

    window.requestAnimationFrame(() => {
      outgoingCards.forEach((queueCard) => {
        queueCard.classList.add("is-exiting");
      });
      industryQueueOrder = nextOrder;
      syncIndustryQueue();
      tailPlaceholder.style.flexBasis = `${reservedTailWidth}px`;
    });

    window.setTimeout(() => {
      industryQueueCards.forEach((queueCard) => {
        queueCard.style.transition = "none";
      });
      tailPlaceholder.style.transition = "none";

      industryQueueOrder.forEach((queueCard) => industryQueueRail.append(queueCard));
      outgoingCards.forEach((queueCard) => {
        queueCard.classList.remove("is-exiting");
      });
      tailPlaceholder.remove();
      syncIndustryQueue();
      void industryQueueRail.offsetWidth;

      window.requestAnimationFrame(() => {
        industryQueueCards.forEach((queueCard) => {
          queueCard.style.transition = "";
        });
        finishIndustryQueueMove();
      });
    }, transitionDuration);
  }

  previousQueueIndustry.addEventListener("click", () => {
    moveIndustryQueueTo(
      industryQueueOrder[industryQueueOrder.length - 1],
      true,
      true,
    );
  });

  nextQueueIndustry.addEventListener("click", () => {
    moveIndustryQueueTo(industryQueueOrder[1], true, true);
  });

  industryQueueCards.forEach((card, cardIndex) => {
    industryQueueButtons[cardIndex].addEventListener("click", (event) => {
      if (suppressIndustryQueueClick) {
        event.preventDefault();
        return;
      }
      moveIndustryQueueTo(card);
    });
  });

  industryQueueRail.addEventListener("pointerdown", (event) => {
    if (!compactIndustryQueue.matches || !event.isPrimary) return;

    industryQueuePointerStartX = event.clientX;
    industryQueuePointerId = event.pointerId;
    industryQueueRail.setPointerCapture(event.pointerId);
  });

  industryQueueRail.addEventListener("pointerup", (event) => {
    if (
      industryQueuePointerStartX === null ||
      event.pointerId !== industryQueuePointerId
    ) {
      return;
    }

    const swipeDistance = event.clientX - industryQueuePointerStartX;
    industryQueuePointerStartX = null;
    industryQueuePointerId = null;

    if (Math.abs(swipeDistance) < 44) return;

    suppressIndustryQueueClick = true;
    window.setTimeout(() => {
      suppressIndustryQueueClick = false;
    }, 0);

    if (swipeDistance < 0) {
      moveIndustryQueueTo(industryQueueOrder[1]);
    } else {
      moveIndustryQueueTo(
        industryQueueOrder[industryQueueOrder.length - 1],
      );
    }
  });

  industryQueueRail.addEventListener("pointercancel", () => {
    industryQueuePointerStartX = null;
    industryQueuePointerId = null;
  });

  industryQueueRail.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();

    if (event.key === "ArrowLeft") {
      moveIndustryQueueTo(
        industryQueueOrder[industryQueueOrder.length - 1],
        true,
        true,
      );
    }
    if (event.key === "ArrowRight") {
      moveIndustryQueueTo(industryQueueOrder[1], true, true);
    }
    if (event.key === "Home") {
      moveIndustryQueueTo(industryQueueCards[0], true, true);
    }
    if (event.key === "End") {
      moveIndustryQueueTo(
        industryQueueCards[industryQueueCards.length - 1],
        true,
        true,
      );
    }
  });

  syncIndustryQueue();
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
