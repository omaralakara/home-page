document.documentElement.classList.add("js");

const serviceData = {
  accounting: {
    title: "Accounting",
    description: "Clearer finance operations, reporting, tax, and transaction workflows.",
    label: "Explore Accounting",
    url: "https://synergi.ae/our-services/accounting/",
  },
  "human-resources": {
    title: "Human Resources",
    description: "Connected people operations across payroll, development, systems, and the employee lifecycle.",
    label: "Explore Human Resources",
    url: "https://synergi.ae/our-services/human-resources/",
  },
  procurement: {
    title: "Procurement",
    description: "Structured sourcing, governance, contract administration, and spend visibility.",
    label: "Explore Procurement",
    url: "https://synergi.ae/our-services/procurement/",
  },
  "technology-ai": {
    title: "Technology & AI",
    description: "Practical support for users, infrastructure, compliance, collaboration, and managed services.",
    label: "Explore Technology & AI",
    url: "https://synergi.ae/our-services/technology-ai/",
  },
  marketing: {
    title: "Marketing",
    description: "Coordinated brand, communications, experience, events, and fractional leadership support.",
    label: "Explore Marketing",
    url: "https://synergi.ae/our-services/marketing/",
  },
};

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");
const submenuToggles = [...document.querySelectorAll(".submenu-toggle")];
const mobileNavigation = window.matchMedia("(max-width: 74rem)");

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

const systemNodes = [...document.querySelectorAll(".system-node")];
const systemTitle = document.querySelector("[data-system-title]");
const systemDescription = document.querySelector("[data-system-description]");
const systemLink = document.querySelector("[data-system-link]");
const systemLines = [...document.querySelectorAll("[data-line]")];

function selectService(key) {
  const data = serviceData[key];
  if (!data || !systemTitle || !systemDescription || !systemLink) return;

  systemNodes.forEach((node) => {
    const active = node.dataset.service === key;
    node.classList.toggle("is-active", active);
    node.setAttribute("aria-pressed", String(active));
  });

  systemLines.forEach((line) => {
    line.classList.toggle("is-active", line.dataset.line === key);
  });

  systemTitle.textContent = data.title;
  systemDescription.textContent = data.description;
  systemLink.href = data.url;
  systemLink.innerHTML = `${data.label} <span aria-hidden="true">→</span>`;
}

systemNodes.forEach((node) => {
  const activate = () => selectService(node.dataset.service);
  node.addEventListener("click", activate);
  node.addEventListener("focus", activate);
  node.addEventListener("pointerenter", activate);
});

selectService("accounting");

const needTabs = [...document.querySelectorAll(".need-tab")];
const needPanels = [...document.querySelectorAll(".need-panel")];

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

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
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
