(() => {
  "use strict";

  /*
   * ================================================================
   * SYNERGI IMPACT CONFIGURATION
   * Edit this object to update content, colors, particle budgets,
   * motion speed, responsive canvas heights, or morph timing.
   * ================================================================
   */
  window.SYNERGI_IMPACT_CONFIG = {
    statistics: [
      {
        state: "clients",
        value: "50+",
        description: "Clients we have served",
        visualLabel: "Connected client network",
      },
      {
        state: "locations",
        value: "5",
        description: "Global delivery locations",
        visualLabel: "Five delivery hubs",
      },
      {
        state: "experience",
        value: "100+",
        description: "Years of combined experience",
        visualLabel: "Layered experience",
      },
      {
        state: "savings",
        value: "10–15%",
        description: "Direct savings",
        visualLabel: "Efficient operations",
      },
    ],
    colors: {
      primary: "#1d4e89",
      accent: "#28abe5",
      ink: "#071a31",
      particle: "#4f9ed0",
      line: "#77bce4",
      highlight: "#0a79b8",
    },
    particleCounts: {
      desktop: 340,
      tablet: 220,
      mobile: 120,
    },
    animationSpeed: {
      desktop: 1,
      tablet: 0.82,
      mobile: 0.64,
      rotation: 0.000035,
      float: 0.00055,
    },
    sectionHeight: {
      desktop: 430,
      tablet: 380,
      mobile: 290,
    },
    transitionDuration: 850,
  };

  const CONFIG = window.SYNERGI_IMPACT_CONFIG;
  const DEFAULT_STATE = "default";
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

  const clamp = (value, minimum, maximum) =>
    Math.min(Math.max(value, minimum), maximum);

  const mix = (start, end, amount) => start + (end - start) * amount;

  const easeInOutCubic = (value) =>
    value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;

  const seededValue = (index, salt = 0) => {
    const value =
      Math.sin((index + 1) * (12.9898 + salt * 17.173)) * 43758.5453123;
    return value - Math.floor(value);
  };

  const hexToRgb = (hex) => {
    const normalized = hex.replace("#", "");
    const value =
      normalized.length === 3
        ? normalized
            .split("")
            .map((character) => character + character)
            .join("")
        : normalized;
    const parsed = Number.parseInt(value, 16);

    return {
      r: (parsed >> 16) & 255,
      g: (parsed >> 8) & 255,
      b: parsed & 255,
    };
  };

  const rgba = (color, alpha) =>
    `rgba(${color.r}, ${color.g}, ${color.b}, ${clamp(alpha, 0, 1).toFixed(3)})`;

  class SynergiImpactParticleField {
    constructor(section, config) {
      this.section = section;
      this.config = config;
      this.stats = section.querySelector("[data-synergi-impact-stats]");
      this.buttons = [
        ...section.querySelectorAll("[data-synergi-impact-state]"),
      ];
      this.visual = section.querySelector("[data-synergi-impact-visual]");
      this.canvas = section.querySelector("[data-synergi-impact-canvas]");
      this.status = section.querySelector("[data-synergi-impact-status]");
      this.visualState = section.querySelector(
        "[data-synergi-impact-visual-state]",
      );
      this.context = this.canvas?.getContext("2d", {
        alpha: true,
        desynchronized: true,
      });

      if (!this.stats || !this.visual || !this.canvas || !this.context) return;

      this.motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
      this.mobileQuery = window.matchMedia("(max-width: 47.99rem)");
      this.tabletQuery = window.matchMedia("(max-width: 64rem)");

      this.width = 1;
      this.height = 1;
      this.pixelRatio = 1;
      this.breakpoint = "desktop";
      this.particles = [];
      this.targets = {};
      this.connections = {};
      this.state = DEFAULT_STATE;
      this.previousState = DEFAULT_STATE;
      this.fromPositions = [];
      this.toPositions = [];
      this.transitionStarted = 0;
      this.transitioning = false;
      this.lastRenderedPositions = [];
      this.lastFrame = 0;
      this.frameId = 0;
      this.resizeTimer = 0;
      this.sectionVisible = !("IntersectionObserver" in window);
      this.tapStartedActive = false;
      this.colors = {
        particle: hexToRgb(config.colors.particle),
        line: hexToRgb(config.colors.line),
        primary: hexToRgb(config.colors.primary),
        accent: hexToRgb(config.colors.accent),
        highlight: hexToRgb(config.colors.highlight),
      };

      this.handleFrame = this.handleFrame.bind(this);
      this.requestResize = this.requestResize.bind(this);
      this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
      this.handleMotionChange = this.handleMotionChange.bind(this);

      this.applyConfiguration();
      this.bindControls();
      this.bindLifecycle();
      this.resizeCanvas();
      this.setState(DEFAULT_STATE, { announce: false, immediate: true });
    }

    applyConfiguration() {
      const { colors, sectionHeight, statistics } = this.config;

      this.section.style.setProperty("--synergi-impact-primary", colors.primary);
      this.section.style.setProperty("--synergi-impact-accent", colors.accent);
      this.section.style.setProperty("--synergi-impact-ink", colors.ink);
      this.section.style.setProperty(
        "--synergi-impact-height-desktop",
        `${sectionHeight.desktop}px`,
      );
      this.section.style.setProperty(
        "--synergi-impact-height-tablet",
        `${sectionHeight.tablet}px`,
      );
      this.section.style.setProperty(
        "--synergi-impact-height-mobile",
        `${sectionHeight.mobile}px`,
      );

      this.buttons.forEach((button) => {
        const statistic = statistics.find(
          (item) => item.state === button.dataset.synergiImpactState,
        );
        if (!statistic) return;
        button.setAttribute(
          "aria-label",
          `${statistic.value}: ${statistic.description}. Activate to explore this statistic.`,
        );
      });
    }

    bindControls() {
      this.buttons.forEach((button) => {
        const state = button.dataset.synergiImpactState;

        button.addEventListener("pointerenter", () => {
          if (!this.hoverQuery.matches) return;
          this.setState(state, { announce: false });
        });

        button.addEventListener("pointerdown", () => {
          if (this.hoverQuery.matches) return;
          this.tapStartedActive = this.state === state;
        });

        button.addEventListener("focus", () => {
          this.setState(state, { announce: false });
        });

        button.addEventListener("click", (event) => {
          if (this.hoverQuery.matches) {
            this.setState(state, { announce: event.detail === 0 });
            return;
          }

          const shouldReset =
            event.detail === 0
              ? this.state === state
              : this.tapStartedActive;
          this.setState(shouldReset ? DEFAULT_STATE : state, {
            announce: true,
          });
          this.tapStartedActive = false;
        });
      });

      this.stats.addEventListener("pointerleave", () => {
        if (!this.hoverQuery.matches) return;
        this.setState(DEFAULT_STATE, { announce: false });
      });

      this.stats.addEventListener("focusout", () => {
        window.requestAnimationFrame(() => {
          if (this.stats.contains(document.activeElement)) return;
          this.setState(DEFAULT_STATE, { announce: false });
        });
      });

      document.addEventListener(
        "pointerdown",
        (event) => {
          if (
            this.hoverQuery.matches ||
            this.state === DEFAULT_STATE ||
            event.target.closest?.("[data-synergi-impact-state]")
          ) {
            return;
          }
          this.setState(DEFAULT_STATE, { announce: false });
        },
        { passive: true },
      );
    }

    bindLifecycle() {
      if ("ResizeObserver" in window) {
        this.resizeObserver = new ResizeObserver(this.requestResize);
        this.resizeObserver.observe(this.visual);
      } else {
        window.addEventListener("resize", this.requestResize, {
          passive: true,
        });
      }

      if ("IntersectionObserver" in window) {
        this.intersectionObserver = new IntersectionObserver(
          ([entry]) => {
            this.sectionVisible = entry.isIntersecting;
            if (this.sectionVisible) this.scheduleFrame();
            else this.stopFrame();
          },
          { rootMargin: "100px 0px", threshold: 0.01 },
        );
        this.intersectionObserver.observe(this.section);
      }

      document.addEventListener(
        "visibilitychange",
        this.handleVisibilityChange,
      );
      this.motionQuery.addEventListener("change", this.handleMotionChange);
      this.mobileQuery.addEventListener("change", this.requestResize);
      this.tabletQuery.addEventListener("change", this.requestResize);
    }

    handleVisibilityChange() {
      if (document.hidden) this.stopFrame();
      else this.scheduleFrame();
    }

    handleMotionChange() {
      if (this.motionQuery.matches) {
        this.stopFrame();
        this.transitioning = false;
        this.fromPositions = this.clonePositions(this.targets[this.state] || []);
        this.toPositions = this.clonePositions(this.targets[this.state] || []);
        this.draw(performance.now());
      } else {
        this.scheduleFrame();
      }
    }

    requestResize() {
      window.clearTimeout(this.resizeTimer);
      this.resizeTimer = window.setTimeout(() => this.resizeCanvas(), 120);
    }

    getBreakpoint() {
      if (this.mobileQuery.matches) return "mobile";
      if (this.tabletQuery.matches) return "tablet";
      return "desktop";
    }

    resizeCanvas() {
      const bounds = this.visual.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round(bounds.width));
      const nextHeight = Math.max(1, Math.round(bounds.height));
      const nextBreakpoint = this.getBreakpoint();
      const nextCount = this.config.particleCounts[nextBreakpoint];
      const nextPixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const meaningfulChange =
        Math.abs(nextWidth - this.width) > 16 ||
        Math.abs(nextHeight - this.height) > 16 ||
        nextBreakpoint !== this.breakpoint ||
        nextCount !== this.particles.length;

      this.width = nextWidth;
      this.height = nextHeight;
      this.breakpoint = nextBreakpoint;
      this.pixelRatio = nextPixelRatio;
      this.canvas.width = Math.round(this.width * this.pixelRatio);
      this.canvas.height = Math.round(this.height * this.pixelRatio);
      this.context.setTransform(
        this.pixelRatio,
        0,
        0,
        this.pixelRatio,
        0,
        0,
      );

      if (meaningfulChange || !this.particles.length) {
        this.createParticles(nextCount);
        this.createTargets();
        this.createConnections();
        this.fromPositions = this.clonePositions(this.targets[this.state]);
        this.toPositions = this.clonePositions(this.targets[this.state]);
        this.transitioning = false;
      }

      this.draw(performance.now());
      this.scheduleFrame();
    }

    createParticles(count) {
      this.particles = Array.from({ length: count }, (_, index) => ({
        phase: seededValue(index, 1) * Math.PI * 2,
        phaseTwo: seededValue(index, 2) * Math.PI * 2,
        radius: 0.75 + seededValue(index, 3) * 1.35,
        alpha: 0.34 + seededValue(index, 4) * 0.58,
      }));
    }

    createTargets() {
      this.targets = {
        default: this.createGlobeTargets(),
        clients: this.createClientTargets(),
        locations: this.createLocationTargets(),
        experience: this.createExperienceTargets(),
        savings: this.createSavingsTargets(),
      };
    }

    createGlobeTargets() {
      const count = this.particles.length;
      const centerX = this.width * 0.5;
      const centerY = this.height * 0.965;
      const radiusX = Math.min(this.width * 0.48, this.height * 0.86);
      const radiusY = this.height * 0.83;

      return this.particles.map((_, index) => {
        const progress = (index + 0.5) / count;
        const sphereY = -1 + progress * 1.31;
        const ring = Math.sqrt(Math.max(0, 1 - sphereY * sphereY));
        const angle = index * GOLDEN_ANGLE;
        const sphereX = Math.cos(angle) * ring;
        const sphereZ = Math.sin(angle) * ring;

        return {
          x: centerX + sphereX * radiusX,
          y: centerY + sphereY * radiusY,
          z: sphereZ,
          emphasis: index % 37 === 0 ? 0.48 : 0,
          group: 0,
        };
      });
    }

    createClientTargets() {
      const centerX = this.width * 0.5;
      const centerY = this.height * 0.53;
      const spreadX = Math.min(this.width * 0.43, this.height * 0.72);
      const spreadY = this.height * 0.46;
      const clusters = [
        [-0.66, -0.2],
        [-0.34, -0.58],
        [0.08, -0.35],
        [0.55, -0.5],
        [0.66, 0.08],
        [0.25, 0.48],
        [-0.3, 0.52],
        [-0.66, 0.25],
        [0, 0.08],
      ];

      return this.particles.map((_, index) => {
        const group = Math.floor(seededValue(index, 8) * clusters.length);
        const [clusterX, clusterY] = clusters[group];
        const angle = seededValue(index, 9) * Math.PI * 2;
        const distance = Math.pow(seededValue(index, 10), 1.7);
        const localX = Math.cos(angle) * distance * 0.25;
        const localY = Math.sin(angle) * distance * 0.22;

        return {
          x: centerX + (clusterX + localX) * spreadX,
          y: centerY + (clusterY + localY) * spreadY,
          z: seededValue(index, 11) * 2 - 1,
          emphasis: index % 19 === 0 ? 0.72 : index % 7 === 0 ? 0.25 : 0,
          group,
        };
      });
    }

    createLocationTargets() {
      const centerX = this.width * 0.5;
      const centerY = this.height * 0.55;
      const spreadX = Math.min(this.width * 0.39, this.height * 0.68);
      const spreadY = this.height * 0.39;
      const hubs = [
        [-0.62, -0.28],
        [-0.12, -0.68],
        [0.57, -0.38],
        [0.53, 0.35],
        [-0.31, 0.48],
      ];

      return this.particles.map((_, index) => {
        const group = index < hubs.length ? index : (index - hubs.length) % 5;
        const [hubX, hubY] = hubs[group];

        if (index < hubs.length) {
          return {
            x: centerX + hubX * spreadX,
            y: centerY + hubY * spreadY,
            z: 0.8,
            emphasis: 1,
            group,
          };
        }

        const orbitIndex = Math.floor((index - hubs.length) / 5);
        const angle = orbitIndex * GOLDEN_ANGLE + group * 0.72;
        const distance =
          0.08 + Math.pow(seededValue(index, 14), 1.45) * 0.31;

        return {
          x: centerX + (hubX + Math.cos(angle) * distance) * spreadX,
          y:
            centerY +
            (hubY + Math.sin(angle) * distance * 0.72) * spreadY,
          z: Math.sin(angle) * 0.72,
          emphasis: index % 17 === 0 ? 0.35 : 0,
          group,
        };
      });
    }

    createExperienceTargets() {
      const centerX = this.width * 0.5;
      const centerY = this.height * 0.55;
      const outerRadius = Math.min(this.width * 0.39, this.height * 0.57);
      const ringCount = 5;
      const perRing = Math.ceil(this.particles.length / ringCount);

      return this.particles.map((_, index) => {
        const group = index % ringCount;
        const position = Math.floor(index / ringCount);
        const angle =
          (position / perRing) * Math.PI * 2 +
          group * 0.48 +
          seededValue(index, 17) * 0.055;
        const radius = outerRadius * (0.38 + group * 0.135);
        const tilt = 0.35 + group * 0.055;

        return {
          x: centerX + Math.cos(angle) * radius,
          y:
            centerY +
            Math.sin(angle) * radius * tilt +
            (group - 2) * this.height * 0.018,
          z: Math.sin(angle + group * 0.8),
          emphasis: position % 17 === 0 ? 0.48 : 0,
          group,
        };
      });
    }

    createSavingsTargets() {
      const centerX = this.width * 0.5;
      const streamCount = 9;
      const perStream = Math.ceil(this.particles.length / streamCount);
      const startY = this.height * 0.18;
      const endY = this.height * 0.84;

      return this.particles.map((_, index) => {
        const group = index % streamCount;
        const position = Math.floor(index / streamCount);
        const progress = clamp(
          (position + seededValue(index, 20) * 0.32) / perStream,
          0,
          1,
        );
        const startX =
          this.width * (0.15 + (0.7 * group) / (streamCount - 1));
        const controlX = centerX + (startX - centerX) * 0.52;
        const inverse = 1 - progress;
        const curveX =
          inverse * inverse * startX +
          2 * inverse * progress * controlX +
          progress * progress * centerX;
        const laneOffset =
          (group - (streamCount - 1) / 2) *
          (1 - progress) *
          Math.min(this.width, this.height) *
          0.003;

        return {
          x:
            curveX +
            laneOffset +
            Math.sin(progress * Math.PI * 2 + group) *
              (1 - progress) *
              4,
          y: mix(startY, endY, Math.pow(progress, 0.9)),
          z: Math.cos(progress * Math.PI + group * 0.35) * 0.7,
          emphasis: position % 13 === 0 ? 0.4 : 0,
          group,
        };
      });
    }

    createConnections() {
      const compact = this.breakpoint === "mobile";
      const medium = this.breakpoint === "tablet";
      const scale = Math.min(this.width, this.height);

      this.connections = {
        default: this.buildNearestConnections(
          this.targets.default,
          compact ? 1 : 2,
          scale * (compact ? 0.17 : 0.15),
        ),
        clients: this.buildNearestConnections(
          this.targets.clients,
          compact ? 1 : medium ? 2 : 3,
          scale * (compact ? 0.19 : 0.155),
        ),
        locations: this.buildGroupedConnections(
          this.targets.locations,
          5,
          compact ? 5 : 4,
        ),
        experience: this.buildPathConnections(
          this.targets.experience,
          5,
          !compact,
        ),
        savings: this.buildPathConnections(
          this.targets.savings,
          9,
          !compact,
        ),
      };
    }

    buildNearestConnections(points, neighborLimit, maximumDistance) {
      const maximumDistanceSquared = maximumDistance * maximumDistance;
      const edges = [];
      const used = new Set();

      for (let first = 0; first < points.length; first += 1) {
        const nearest = [];

        for (let second = first + 1; second < points.length; second += 1) {
          const deltaX = points[first].x - points[second].x;
          const deltaY = points[first].y - points[second].y;
          const distanceSquared = deltaX * deltaX + deltaY * deltaY;
          if (distanceSquared > maximumDistanceSquared) continue;

          nearest.push({ index: second, distanceSquared });
        }

        nearest
          .sort((a, b) => a.distanceSquared - b.distanceSquared)
          .slice(0, neighborLimit)
          .forEach(({ index, distanceSquared }) => {
            const key = `${first}-${index}`;
            if (used.has(key)) return;
            used.add(key);
            edges.push({
              a: first,
              b: index,
              bucket: clamp(
                Math.floor(
                  (Math.sqrt(distanceSquared) / maximumDistance) * 4,
                ),
                0,
                3,
              ),
            });
          });
      }

      return edges;
    }

    buildGroupedConnections(points, groupCount, hubInterval) {
      const edges = [];
      const lastByGroup = Array(groupCount).fill(null);

      points.forEach((point, index) => {
        const previous = lastByGroup[point.group];
        if (previous !== null) {
          edges.push({ a: previous, b: index, bucket: 1 });
        }
        if (index >= groupCount && index % hubInterval === 0) {
          edges.push({ a: point.group, b: index, bucket: 2 });
        }
        lastByGroup[point.group] = index;
      });

      for (let index = 0; index < groupCount; index += 1) {
        edges.push({
          a: index,
          b: (index + 1) % groupCount,
          bucket: 3,
        });
      }

      return edges;
    }

    buildPathConnections(points, groupCount, includeCrossLinks) {
      const edges = [];
      const lastByGroup = Array(groupCount).fill(null);

      points.forEach((point, index) => {
        const previous = lastByGroup[point.group];
        if (previous !== null) {
          edges.push({ a: previous, b: index, bucket: 1 });
        }
        if (
          includeCrossLinks &&
          index % 19 === 0 &&
          lastByGroup[(point.group + 1) % groupCount] !== null
        ) {
          edges.push({
            a: lastByGroup[(point.group + 1) % groupCount],
            b: index,
            bucket: 3,
          });
        }
        lastByGroup[point.group] = index;
      });

      return edges;
    }

    clonePositions(positions) {
      return positions.map((position) => ({ ...position }));
    }

    getTransitionProgress(now) {
      if (!this.transitioning) return 1;
      const duration = Math.max(1, this.config.transitionDuration);
      return clamp((now - this.transitionStarted) / duration, 0, 1);
    }

    captureCurrentPositions(now) {
      if (!this.fromPositions.length || !this.toPositions.length) {
        return this.clonePositions(this.targets[this.state] || []);
      }

      const progress = this.getTransitionProgress(now);
      const eased = easeInOutCubic(progress);
      const contraction = Math.sin(progress * Math.PI) * 0.1;
      const centerX = this.width * 0.5;
      const centerY = this.height * 0.55;

      return this.toPositions.map((target, index) => {
        const start = this.fromPositions[index] || target;
        const position = {
          x: mix(start.x, target.x, eased),
          y: mix(start.y, target.y, eased),
          z: mix(start.z || 0, target.z || 0, eased),
          emphasis: mix(
            start.emphasis || 0,
            target.emphasis || 0,
            eased,
          ),
          group: target.group || 0,
        };

        position.x = mix(position.x, centerX, contraction);
        position.y = mix(position.y, centerY, contraction);
        return position;
      });
    }

    setState(nextState, options = {}) {
      const {
        announce = false,
        immediate = false,
      } = options;
      const validState =
        nextState === DEFAULT_STATE ||
        this.config.statistics.some((item) => item.state === nextState);
      if (!validState || !this.targets[nextState]) return;

      if (nextState === this.state && !immediate) {
        this.updateControlState(nextState, announce);
        return;
      }

      const now = performance.now();
      const currentPositions = this.captureCurrentPositions(now);
      this.previousState = this.state;
      this.state = nextState;
      this.fromPositions = immediate
        ? this.clonePositions(this.targets[nextState])
        : currentPositions;
      this.toPositions = this.clonePositions(this.targets[nextState]);
      this.transitionStarted = now;
      this.transitioning = !immediate && !this.motionQuery.matches;

      if (!this.transitioning) {
        this.fromPositions = this.clonePositions(this.targets[nextState]);
      }

      this.updateControlState(nextState, announce);
      this.draw(now);
      this.scheduleFrame();
    }

    updateControlState(nextState, announce) {
      this.section.dataset.activeState = nextState;

      this.buttons.forEach((button) => {
        const active =
          nextState !== DEFAULT_STATE &&
          button.dataset.synergiImpactState === nextState;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      const statistic = this.config.statistics.find(
        (item) => item.state === nextState,
      );

      if (this.visualState) {
        this.visualState.textContent =
          statistic?.visualLabel || "Global operations";
      }

      if (announce && this.status) {
        this.status.textContent = statistic
          ? `${statistic.description} visualization selected.`
          : "Default global operations visualization selected.";
      }
    }

    getFrameInterval() {
      if (this.breakpoint === "mobile") return 1000 / 30;
      if (this.breakpoint === "tablet") return 1000 / 45;
      return 1000 / 60;
    }

    getSpeedMultiplier() {
      return this.config.animationSpeed[this.breakpoint] || 1;
    }

    shouldAnimate() {
      return (
        this.sectionVisible &&
        !document.hidden &&
        !this.motionQuery.matches
      );
    }

    scheduleFrame() {
      if (this.frameId) return;
      if (!this.shouldAnimate()) {
        this.section.dataset.animationState = "paused";
        return;
      }
      this.section.dataset.animationState = "running";
      this.frameId = window.requestAnimationFrame(this.handleFrame);
    }

    stopFrame() {
      this.section.dataset.animationState = "paused";
      if (this.frameId) {
        window.cancelAnimationFrame(this.frameId);
        this.frameId = 0;
      }
    }

    handleFrame(now) {
      this.frameId = 0;
      if (!this.shouldAnimate()) return;

      const interval = this.getFrameInterval();
      const elapsed = now - this.lastFrame;

      if (elapsed >= interval) {
        this.lastFrame = now - (elapsed % interval);
        this.draw(now);
      }

      this.scheduleFrame();
    }

    applyIdleMotion(position, particle, index, now) {
      if (this.motionQuery.matches) return position;

      const speed = this.getSpeedMultiplier();
      const floatTime = now * this.config.animationSpeed.float * speed;
      const result = { ...position };

      if (this.state === DEFAULT_STATE) {
        const rotation =
          now * this.config.animationSpeed.rotation * speed;
        const centerX = this.width * 0.5;
        const deltaX = result.x - centerX;
        const depthScale = Math.min(this.width, this.height) * 0.13;
        const depth = result.z * depthScale;
        result.x =
          centerX +
          deltaX * Math.cos(rotation) +
          depth * Math.sin(rotation);
        result.z =
          (depth * Math.cos(rotation) -
            deltaX * Math.sin(rotation)) /
          depthScale;
        result.y += Math.sin(floatTime + particle.phase) * 1.8;
      } else if (this.state === "locations") {
        result.x +=
          Math.cos(floatTime * 0.62 + particle.phase) *
          (2 + (index % 5) * 0.16);
        result.y += Math.sin(floatTime + particle.phaseTwo) * 2.2;
      } else if (this.state === "experience") {
        const centerX = this.width * 0.5;
        const centerY = this.height * 0.55;
        const deltaX = result.x - centerX;
        const deltaY = result.y - centerY;
        const rotation =
          Math.sin(floatTime * 0.25 + (position.group || 0)) * 0.018;
        result.x =
          centerX +
          deltaX * Math.cos(rotation) -
          deltaY * Math.sin(rotation);
        result.y =
          centerY +
          deltaX * Math.sin(rotation) +
          deltaY * Math.cos(rotation);
      } else if (this.state === "savings") {
        result.x +=
          Math.sin(floatTime * 0.72 + particle.phase + result.y * 0.01) *
          2.25;
        result.y += Math.cos(floatTime * 0.45 + particle.phaseTwo) * 1.1;
      } else {
        result.x += Math.cos(floatTime + particle.phase) * 2.7;
        result.y += Math.sin(floatTime * 0.82 + particle.phaseTwo) * 2.4;
      }

      return result;
    }

    draw(now) {
      if (!this.width || !this.height || !this.targets[this.state]) return;

      const context = this.context;
      const progress = this.getTransitionProgress(now);
      const eased = easeInOutCubic(progress);
      const positions = this.captureCurrentPositions(now).map(
        (position, index) =>
          this.applyIdleMotion(
            position,
            this.particles[index],
            index,
            now,
          ),
      );

      if (progress >= 1 && this.transitioning) {
        this.transitioning = false;
        this.fromPositions = this.clonePositions(this.toPositions);
        this.previousState = this.state;
      }

      context.clearRect(0, 0, this.width, this.height);
      this.drawGuideArcs(context);

      if (this.transitioning && this.previousState !== this.state) {
        this.drawConnections(
          context,
          positions,
          this.connections[this.previousState] || [],
          (1 - eased) * 0.75,
        );
        this.drawConnections(
          context,
          positions,
          this.connections[this.state] || [],
          0.25 + eased * 0.75,
        );
      } else {
        this.drawConnections(
          context,
          positions,
          this.connections[this.state] || [],
          1,
        );
      }

      this.drawParticles(context, positions, now);
      this.lastRenderedPositions = positions;
    }

    drawGuideArcs(context) {
      if (this.state !== DEFAULT_STATE && this.state !== "locations") return;

      const width = Math.min(this.width * 0.93, this.height * 1.7);
      const centerX = this.width * 0.5;
      const centerY = this.height * 0.965;

      context.save();
      context.lineWidth = 1;
      context.strokeStyle = rgba(this.colors.accent, 0.075);

      [1, 0.74, 0.48].forEach((scale, index) => {
        context.beginPath();
        context.ellipse(
          centerX,
          centerY,
          width * 0.5 * scale,
          this.height * (0.82 - index * 0.09),
          0,
          Math.PI,
          Math.PI * 2,
        );
        context.stroke();
      });

      context.restore();
    }

    drawConnections(context, positions, edges, opacity) {
      if (!edges.length || opacity <= 0.01) return;

      const bucketOpacity = [0.17, 0.135, 0.1, 0.07];
      context.save();
      context.lineWidth = this.breakpoint === "mobile" ? 0.7 : 0.85;

      for (let bucket = 0; bucket < bucketOpacity.length; bucket += 1) {
        context.beginPath();

        edges.forEach((edge) => {
          if (edge.bucket !== bucket) return;
          const first = positions[edge.a];
          const second = positions[edge.b];
          if (!first || !second) return;
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
        });

        context.strokeStyle = rgba(
          this.colors.line,
          bucketOpacity[bucket] * opacity,
        );
        context.stroke();
      }

      context.restore();
    }

    drawParticles(context, positions, now) {
      const depthBuckets = 5;
      const twinkleTime = now * 0.00038 * this.getSpeedMultiplier();

      for (let bucket = 0; bucket < depthBuckets; bucket += 1) {
        context.beginPath();

        positions.forEach((position, index) => {
          const depth = clamp((position.z + 1) * 0.5, 0, 0.999);
          if (Math.floor(depth * depthBuckets) !== bucket) return;
          const particle = this.particles[index];
          const emphasis = position.emphasis || 0;
          const radius =
            particle.radius *
            (0.74 + depth * 0.58) *
            (1 + emphasis * 0.75);

          context.moveTo(position.x + radius, position.y);
          context.arc(position.x, position.y, radius, 0, Math.PI * 2);
        });

        const depth = (bucket + 0.5) / depthBuckets;
        context.fillStyle = rgba(
          this.colors.particle,
          0.32 + depth * 0.42,
        );
        context.fill();
      }

      context.save();
      positions.forEach((position, index) => {
        const emphasis = position.emphasis || 0;
        if (emphasis < 0.7) return;
        const pulse = this.motionQuery.matches
          ? 1
          : 0.9 +
            Math.sin(twinkleTime + this.particles[index].phase) * 0.1;
        const radius = (3.4 + emphasis * 2.6) * pulse;

        context.beginPath();
        context.arc(position.x, position.y, radius, 0, Math.PI * 2);
        context.fillStyle = rgba(
          this.colors.highlight,
          0.68 + emphasis * 0.22,
        );
        context.fill();

        context.beginPath();
        context.arc(position.x, position.y, radius + 4, 0, Math.PI * 2);
        context.strokeStyle = rgba(this.colors.accent, 0.28);
        context.lineWidth = 1;
        context.stroke();
      });
      context.restore();
    }
  }

  document
    .querySelectorAll("[data-synergi-impact]")
    .forEach(
      (section) => new SynergiImpactParticleField(section, CONFIG),
    );
})();
