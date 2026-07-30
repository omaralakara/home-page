const THREE_LOCAL_MODULE = new URL("../vendor/three.module.min.js", import.meta.url).href;
const THREE_CDN_MODULE = "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.min.js";
const SECTION_SELECTOR = "[data-synergi-impact-three]";
const INITIAL_STATE = "clients";
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

const CONFIG = {
  states: {
    clients: "50+ connected relationships",
    locations: "Five connected delivery hubs",
    experience: "A century of combined experience",
    savings: "10-15% direct savings",
  },
  particleCounts: {
    desktop: 320,
    tablet: 230,
    mobile: 150,
  },
  transition: {
    gather: 420,
    form: 900,
    stagger: 170,
  },
  colors: {
    particle: 0x35b8ee,
    particleBright: 0xa8e8ff,
    particleDeep: 0x1d4e89,
    line: 0x1d73aa,
    hub: 0xffffff,
    hubGlow: 0x28abe5,
  },
};

let threePromise;

function loadThree(section) {
  const requestedModule = section.dataset.threeModule || THREE_LOCAL_MODULE;

  if (!threePromise) {
    threePromise = import(requestedModule).catch(() => import(THREE_CDN_MODULE));
  }

  return threePromise;
}

function isElementorEditor() {
  return Boolean(
    document.body.classList.contains("elementor-editor-active") ||
      window.elementorFrontend?.isEditMode?.(),
  );
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function mix(start, end, amount) {
  return start + (end - start) * amount;
}

function seededValue(index, salt = 0) {
  const value = Math.sin((index + 1) * (12.9898 + salt * 17.173)) * 43758.5453;
  return value - Math.floor(value);
}

function easeInOutCubic(value) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function easeOutExpo(value) {
  return value === 1 ? 1 : 1 - Math.pow(2, -10 * value);
}

class SynergiImpactThree {
  constructor(section, THREE) {
    this.section = section;
    this.THREE = THREE;
    this.visual = section.querySelector("[data-synergi-impact-visual]");
    this.canvas = section.querySelector("[data-synergi-impact-three-canvas]");
    this.buttons = [...section.querySelectorAll("[data-synergi-impact-state]")];
    this.status = section.querySelector("[data-synergi-impact-status]");
    this.visualState = section.querySelector("[data-synergi-impact-visual-state]");
    this.motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.mobileQuery = window.matchMedia("(max-width: 47.99rem)");
    this.tabletQuery = window.matchMedia("(max-width: 64rem)");
    this.hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    this.width = 1;
    this.height = 1;
    this.breakpoint = "desktop";
    this.count = 0;
    this.state = INITIAL_STATE;
    this.visible = !("IntersectionObserver" in window);
    this.frameId = 0;
    this.lastFrame = 0;
    this.lineVisibility = 1;
    this.transition = null;
    this.positions = new Float32Array();
    this.displayPositions = new Float32Array();
    this.colors = new Float32Array();
    this.targets = {};
    this.edges = {};
    this.activeEdges = [];
    this.phases = [];
    this.hubMeshes = [];
    this.routeCurves = [];
    this.routeTravellers = [];
    this.activeHubOpacity = 0;
    this.activeRouteOpacity = 0;
    this.pointer = {
      active: false,
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      strength: 0,
      targetStrength: 0,
      ndcX: 0,
      ndcY: 0,
    };

    this.animate = this.animate.bind(this);
    this.resize = this.resize.bind(this);
    this.handleVisibility = this.handleVisibility.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerLeave = this.handlePointerLeave.bind(this);
  }

  init() {
    if (!this.visual || !this.canvas || !this.buttons.length) return;

    try {
      this.createScene();
    } catch (error) {
      this.section.dataset.threeState = "error";
      return;
    }

    this.bindControls();
    this.bindPointer();
    this.bindLifecycle();
    this.resize();
    this.setState(INITIAL_STATE, { immediate: true, announce: false });
    this.section.dataset.threeState = "ready";
    this.section.synergiImpact = this;
  }

  createScene() {
    const { THREE } = this;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 24);
    this.camera.position.set(0, 0.05, 5.5);

    this.root = new THREE.Group();
    this.scene.add(this.root);

    this.pointGeometry = new THREE.BufferGeometry();
    this.pointMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: { value: 0.96 },
        uPixelRatio: { value: 1 },
        uSize: { value: 7.2 },
      },
      vertexShader: `
        varying vec3 vColor;
        uniform float uPixelRatio;
        uniform float uSize;

        void main() {
          vColor = color;
          vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uSize * uPixelRatio * (4.8 / max(1.0, -viewPosition.z));
          gl_Position = projectionMatrix * viewPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform float uOpacity;

        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float core = 1.0 - smoothstep(0.12, 0.48, distanceToCenter);
          float glow = 1.0 - smoothstep(0.22, 0.5, distanceToCenter);
          float alpha = (core * 0.84 + glow * 0.2) * uOpacity;
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.points = new THREE.Points(this.pointGeometry, this.pointMaterial);
    this.points.renderOrder = 3;
    this.root.add(this.points);

    this.lineGeometry = new THREE.BufferGeometry();
    this.lineMaterial = new THREE.LineBasicMaterial({
      color: CONFIG.colors.line,
      transparent: true,
      opacity: 0.2,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });
    this.lines = new THREE.LineSegments(this.lineGeometry, this.lineMaterial);
    this.lines.renderOrder = 1;
    this.root.add(this.lines);

    this.routeMaterial = new THREE.LineBasicMaterial({
      color: CONFIG.colors.particleBright,
      transparent: true,
      opacity: 0,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });
    this.routeGroup = new THREE.Group();
    this.root.add(this.routeGroup);

    this.hubGroup = new THREE.Group();
    this.root.add(this.hubGroup);
    this.createHubMeshes();

    this.raycaster = new THREE.Raycaster();
    this.pointerPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    this.pointerNdc = new THREE.Vector2();
    this.pointerWorld = new THREE.Vector3();
    this.pointerLocal = new THREE.Vector3();
  }

  createHubMeshes() {
    const { THREE } = this;
    const sphere = new THREE.SphereGeometry(0.048, 12, 8);
    const ring = new THREE.TorusGeometry(0.12, 0.004, 6, 36);

    for (let index = 0; index < 5; index += 1) {
      const material = new THREE.MeshBasicMaterial({
        color: CONFIG.colors.hub,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: CONFIG.colors.hubGlow,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const dot = new THREE.Mesh(sphere, material);
      const halo = new THREE.Mesh(ring, glowMaterial);
      halo.rotation.x = Math.PI / 2.4;
      this.hubGroup.add(dot, halo);
      this.hubMeshes.push({ dot, halo, material, glowMaterial });
    }

    this.travellerGeometry = new THREE.SphereGeometry(0.025, 8, 6);
    this.travellerMaterial = new THREE.MeshBasicMaterial({
      color: CONFIG.colors.particleBright,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
  }

  bindControls() {
    this.buttons.forEach((button) => {
      const state = button.dataset.synergiImpactState;
      const description = CONFIG.states[state];
      if (!description) return;

      const buttonText = button.textContent.trim().replace(/\s+/g, " ");
      button.setAttribute("aria-label", `${buttonText}. Show ${description}.`);
      button.addEventListener("click", () => {
        this.setState(state, { announce: true });
      });
      button.addEventListener("keydown", (event) => {
        if (button.tagName === "BUTTON" || (event.key !== "Enter" && event.key !== " ")) {
          return;
        }
        event.preventDefault();
        this.setState(state, { announce: true });
      });
    });
  }

  bindPointer() {
    this.visual.addEventListener("pointermove", this.handlePointerMove, { passive: true });
    this.visual.addEventListener("pointerleave", this.handlePointerLeave, { passive: true });
    this.visual.addEventListener(
      "pointerdown",
      (event) => {
        this.handlePointerMove(event);
        this.pointer.targetStrength = this.motionQuery.matches ? 0 : 1.1;
        this.scheduleFrame();
      },
      { passive: true },
    );
  }

  bindLifecycle() {
    if ("ResizeObserver" in window) {
      this.resizeObserver = new ResizeObserver(this.resize);
      this.resizeObserver.observe(this.visual);
    } else {
      window.addEventListener("resize", this.resize, { passive: true });
    }

    if ("IntersectionObserver" in window) {
      this.intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          this.visible = entry.isIntersecting;
          if (this.visible) this.scheduleFrame();
          else this.stopFrame();
        },
        { rootMargin: "120px 0px", threshold: 0.01 },
      );
      this.intersectionObserver.observe(this.section);
    }

    document.addEventListener("visibilitychange", this.handleVisibility);
    this.motionQuery.addEventListener("change", () => {
      if (this.motionQuery.matches) this.finishTransition();
      this.renderFrame(performance.now());
      this.scheduleFrame();
    });
    this.mobileQuery.addEventListener("change", this.resize);
    this.tabletQuery.addEventListener("change", this.resize);
    this.canvas.addEventListener("webglcontextlost", () => {
      this.section.dataset.threeState = "error";
    });
  }

  handleVisibility() {
    if (document.hidden) this.stopFrame();
    else this.scheduleFrame();
  }

  handlePointerMove(event) {
    if (!this.hoverQuery.matches || this.motionQuery.matches) return;

    const bounds = this.visual.getBoundingClientRect();
    const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
    const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
    this.pointer.ndcX = x * 2 - 1;
    this.pointer.ndcY = -(y * 2 - 1);
    this.pointerNdc.set(this.pointer.ndcX, this.pointer.ndcY);
    this.raycaster.setFromCamera(this.pointerNdc, this.camera);

    if (this.raycaster.ray.intersectPlane(this.pointerPlane, this.pointerWorld)) {
      this.root.updateMatrixWorld(true);
      this.pointerLocal.copy(this.pointerWorld);
      this.root.worldToLocal(this.pointerLocal);
      this.pointer.targetX = this.pointerLocal.x;
      this.pointer.targetY = this.pointerLocal.y;
      this.pointer.active = true;
      this.pointer.targetStrength = 1;
      this.scheduleFrame();
    }
  }

  handlePointerLeave() {
    this.pointer.active = false;
    this.pointer.targetStrength = 0;
  }

  getBreakpoint() {
    if (this.mobileQuery.matches) return "mobile";
    if (this.tabletQuery.matches) return "tablet";
    return "desktop";
  }

  getParticleCount() {
    return CONFIG.particleCounts[this.getBreakpoint()];
  }

  resize() {
    const bounds = this.visual.getBoundingClientRect();
    const width = Math.max(1, Math.round(bounds.width));
    const height = Math.max(1, Math.round(bounds.height));
    const breakpoint = this.getBreakpoint();
    const count = this.getParticleCount();
    const needsRebuild = count !== this.count || breakpoint !== this.breakpoint;

    this.width = width;
    this.height = height;
    this.breakpoint = breakpoint;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height, false);
    this.pointMaterial.uniforms.uPixelRatio.value = pixelRatio;
    this.pointMaterial.uniforms.uSize.value = breakpoint === "mobile" ? 7.7 : 7.2;
    this.camera.aspect = width / height;
    this.camera.position.z = breakpoint === "mobile" ? 6.4 : 5.5;
    this.camera.updateProjectionMatrix();
    this.root.scale.setScalar(
      breakpoint === "mobile" ? 1.02 : breakpoint === "tablet" ? 1.28 : 1.5,
    );
    this.root.position.y = breakpoint === "mobile" ? -0.04 : 0.02;

    if (needsRebuild || !this.count) {
      this.rebuildParticles(count);
    }

    this.renderFrame(performance.now());
    this.scheduleFrame();
  }

  rebuildParticles(count) {
    const { THREE } = this;
    this.count = count;
    this.positions = new Float32Array(count * 3);
    this.displayPositions = new Float32Array(count * 3);
    this.colors = new Float32Array(count * 3);
    this.phases = Array.from(
      { length: count },
      (_, index) => seededValue(index, 12) * Math.PI * 2,
    );

    const deep = new THREE.Color(CONFIG.colors.particleDeep);
    const bright = new THREE.Color(CONFIG.colors.particleBright);
    const accent = new THREE.Color(CONFIG.colors.particle);

    for (let index = 0; index < count; index += 1) {
      const color = deep.clone().lerp(accent, 0.42 + seededValue(index, 13) * 0.48);
      if (index % 19 === 0) color.lerp(bright, 0.72);
      this.colors[index * 3] = color.r;
      this.colors[index * 3 + 1] = color.g;
      this.colors[index * 3 + 2] = color.b;
    }

    this.targets = {
      clients: this.createClientTargets(count),
      locations: this.createLocationTargets(count),
      experience: this.createExperienceTargets(count),
      savings: this.createSavingsTargets(count),
    };
    this.edges = {
      clients: this.createGridEdges(
        this.targets.clients.columns,
        this.targets.clients.rows,
      ),
      locations: this.createNearestEdges(this.targets.locations.positions, 2, 0.5),
      experience: this.createGroupedEdges(this.targets.experience.groups),
      savings: this.createGroupedEdges(this.targets.savings.groups),
    };

    this.positions.set(this.targets[this.state]?.positions || this.targets.clients.positions);
    this.displayPositions.set(this.positions);
    this.pointGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.displayPositions, 3),
    );
    this.pointGeometry.setAttribute("color", new THREE.BufferAttribute(this.colors, 3));
    this.pointGeometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
    this.setActiveEdges(this.state);
    this.rebuildLocationRoutes();
    this.transition = null;
  }

  createClientTargets(count) {
    const positions = new Float32Array(count * 3);
    const columns = count < 200 ? 15 : 20;
    const rows = Math.ceil(count / columns);
    const groups = new Uint8Array(count);

    for (let index = 0; index < count; index += 1) {
      const row = Math.floor(index / columns);
      const column = index % columns;
      const xProgress = column / Math.max(1, columns - 1);
      const yProgress = row / Math.max(1, rows - 1);
      const x = mix(-1.62, 1.62, xProgress);
      const baseY = mix(-0.7, 0.7, yProgress);

      positions[index * 3] = x;
      positions[index * 3 + 1] =
        baseY +
        Math.sin(xProgress * Math.PI * 2.2) * 0.11 +
        Math.cos(row * 0.72) * 0.025;
      positions[index * 3 + 2] =
        Math.sin(x * 1.48 + baseY * 1.7) * 0.34 +
        Math.cos(baseY * 3.1) * 0.12;
      groups[index] = row;
    }

    return { positions, groups, columns, rows };
  }

  createLocationTargets(count) {
    const { THREE } = this;
    const positions = new Float32Array(count * 3);
    const groups = new Uint8Array(count);
    const rawHubs = [
      [0.72, -0.24, 0.86],
      [0.38, -0.04, 1.0],
      [-0.08, -0.3, 1.02],
      [-0.58, 0.32, 0.88],
      [-0.34, 0.78, 0.68],
    ];
    this.locationHubs = rawHubs.map(
      ([x, y, z]) => new THREE.Vector3(x * 1.08, y, z * 0.82),
    );

    for (let index = 0; index < count; index += 1) {
      if (index < this.locationHubs.length) {
        const hub = this.locationHubs[index];
        positions[index * 3] = hub.x;
        positions[index * 3 + 1] = hub.y;
        positions[index * 3 + 2] = hub.z;
        groups[index] = index;
        continue;
      }

      const progress = (index - 4.5) / count;
      const y = 1 - progress * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const angle = index * GOLDEN_ANGLE;
      const xPosition = Math.cos(angle) * radius * 1.5;
      const yPosition = y * 1.02 - 0.08;
      const zPosition = Math.sin(angle) * radius * 0.94;
      positions[index * 3] = xPosition;
      positions[index * 3 + 1] = yPosition;
      positions[index * 3 + 2] = zPosition;

      let closestHub = 0;
      let closestDistance = Infinity;
      this.locationHubs.forEach((hub, hubIndex) => {
        const dx = xPosition - hub.x;
        const dy = yPosition - hub.y;
        const dz = zPosition - hub.z;
        const distance = dx * dx + dy * dy + dz * dz;
        if (distance < closestDistance) {
          closestDistance = distance;
          closestHub = hubIndex;
        }
      });
      groups[index] = closestHub;
    }

    return { positions, groups };
  }

  createExperienceTargets(count) {
    const positions = new Float32Array(count * 3);
    const groups = new Uint8Array(count);
    const lanes = 6;
    const perLane = Math.ceil(count / lanes);

    for (let index = 0; index < count; index += 1) {
      const group = index % lanes;
      const step = Math.floor(index / lanes);
      const progress = clamp(step / Math.max(1, perLane - 1), 0, 1);
      const x = mix(-1.72, 1.72, progress);
      const angle = progress * Math.PI * 4.4 + (group / lanes) * Math.PI * 2;
      const radius = 0.34 + (group % 3) * 0.11;

      positions[index * 3] = x;
      positions[index * 3 + 1] = Math.sin(angle) * radius;
      positions[index * 3 + 2] = Math.cos(angle) * radius * 1.12;
      groups[index] = group;
    }

    return { positions, groups };
  }

  createSavingsTargets(count) {
    const positions = new Float32Array(count * 3);
    const groups = new Uint8Array(count);
    const streams = count < 200 ? 9 : 12;
    const perStream = Math.ceil(count / streams);

    for (let index = 0; index < count; index += 1) {
      const group = index % streams;
      const step = Math.floor(index / streams);
      const progress = clamp(step / Math.max(1, perStream - 1), 0, 1);
      const lane = mix(-1, 1, group / Math.max(1, streams - 1));
      const compression = mix(1, 0.52, easeInOutCubic(progress));
      const disorder =
        Math.sin(progress * Math.PI * 6 + group * 0.66) *
        0.22 *
        Math.pow(1 - progress, 1.8);
      const x = mix(-1.75, 1.75, progress);

      positions[index * 3] = x;
      positions[index * 3 + 1] =
        lane * 0.76 * compression + disorder + progress * 0.12 - 0.08;
      positions[index * 3 + 2] =
        lane * 0.12 +
        Math.cos(progress * Math.PI * 4 + group * 0.42) *
          0.1 *
          (1 - progress);
      groups[index] = group;
    }

    return { positions, groups };
  }

  createGridEdges(columns, rows) {
    const edges = [];

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const index = row * columns + column;
        if (index >= this.count) continue;
        if (column < columns - 1 && index + 1 < this.count) {
          edges.push(index, index + 1);
        }
        if (row < rows - 1 && index + columns < this.count) {
          edges.push(index, index + columns);
        }
      }
    }

    return edges;
  }

  createNearestEdges(positions, step, maxDistance) {
    const edges = [];
    const maxDistanceSquared = maxDistance * maxDistance;

    for (let index = 0; index < this.count; index += 1) {
      for (let offset = 1; offset <= step; offset += 1) {
        const next = (index + offset * 13) % this.count;
        const dx = positions[index * 3] - positions[next * 3];
        const dy = positions[index * 3 + 1] - positions[next * 3 + 1];
        const dz = positions[index * 3 + 2] - positions[next * 3 + 2];
        if (dx * dx + dy * dy + dz * dz <= maxDistanceSquared) {
          edges.push(index, next);
        }
      }
    }

    return edges;
  }

  createGroupedEdges(groups) {
    const edges = [];
    const previousByGroup = new Map();

    for (let index = 0; index < this.count; index += 1) {
      const group = groups[index];
      const previous = previousByGroup.get(group);
      if (previous !== undefined) edges.push(previous, index);
      previousByGroup.set(group, index);
    }

    return edges;
  }

  rebuildLocationRoutes() {
    const { THREE } = this;
    this.routeGroup.children.forEach((child) => {
      if (child.isLine) child.geometry?.dispose();
    });
    this.routeGroup.clear();
    this.routeCurves = [];
    this.routeTravellers = [];
    const routePairs = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 0],
    ];

    routePairs.forEach(([fromIndex, toIndex], routeIndex) => {
      const from = this.locationHubs[fromIndex].clone();
      const to = this.locationHubs[toIndex].clone();
      const control = from
        .clone()
        .add(to)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(1.48 + routeIndex * 0.035);
      const curve = new THREE.QuadraticBezierCurve3(from, control, to);
      const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(34));
      const line = new THREE.Line(geometry, this.routeMaterial);
      const traveller = new THREE.Mesh(this.travellerGeometry, this.travellerMaterial);
      line.renderOrder = 2;
      traveller.renderOrder = 4;
      this.routeGroup.add(line, traveller);
      this.routeCurves.push(curve);
      this.routeTravellers.push(traveller);
    });
  }

  setState(nextState, options = {}) {
    if (!CONFIG.states[nextState] || !this.targets[nextState]) return;
    const sameState = nextState === this.state && !this.transition;
    if (sameState && !options.immediate) {
      this.pointer.targetStrength = 1.05;
      this.scheduleFrame();
      return;
    }

    this.state = nextState;
    this.updateControls(nextState, options.announce);

    if (options.immediate || this.motionQuery.matches) {
      this.transition = null;
      this.positions.set(this.targets[nextState].positions);
      this.displayPositions.set(this.positions);
      this.setActiveEdges(nextState);
      this.lineVisibility = 1;
      this.section.dataset.transitionPhase = "idle";
      this.renderFrame(performance.now());
      return;
    }

    const now = performance.now();
    this.transition = {
      phase: "gather",
      startedAt: now,
      from: new Float32Array(this.positions),
      center: this.createGatherTargets(),
      to: this.targets[nextState].positions,
      lineFrom: this.lineVisibility,
    };
    this.section.dataset.transitionPhase = "gather";
    this.scheduleFrame();
  }

  createGatherTargets() {
    const center = new Float32Array(this.count * 3);

    for (let index = 0; index < this.count; index += 1) {
      const angle = index * GOLDEN_ANGLE;
      const radius = 0.018 + seededValue(index, 70) * 0.055;
      center[index * 3] = Math.cos(angle) * radius;
      center[index * 3 + 1] = Math.sin(angle) * radius - 0.04;
      center[index * 3 + 2] = (seededValue(index, 71) - 0.5) * 0.07;
    }

    return center;
  }

  updateTransition(now) {
    if (!this.transition) return;
    const transition = this.transition;

    if (transition.phase === "gather") {
      const rawProgress = clamp(
        (now - transition.startedAt) / CONFIG.transition.gather,
        0,
        1,
      );
      const progress = easeInOutCubic(rawProgress);
      this.copyMixedPositions(transition.from, transition.center, progress);
      this.lineVisibility = mix(transition.lineFrom, 0, progress);
      this.pointMaterial.uniforms.uSize.value =
        (this.breakpoint === "mobile" ? 7.7 : 7.2) + Math.sin(progress * Math.PI) * 2.1;

      if (rawProgress >= 1) {
        transition.phase = "form";
        transition.startedAt = now;
        this.setActiveEdges(this.state);
        this.section.dataset.transitionPhase = "form";
      }
      return;
    }

    const elapsed = now - transition.startedAt;
    const baseProgress = clamp(elapsed / CONFIG.transition.form, 0, 1);

    for (let index = 0; index < this.count; index += 1) {
      const delay = seededValue(index, 72) * CONFIG.transition.stagger;
      const localProgress = clamp(
        (elapsed - delay) / CONFIG.transition.form,
        0,
        1,
      );
      const progress = easeOutExpo(localProgress);
      const base = index * 3;
      this.positions[base] = mix(transition.center[base], transition.to[base], progress);
      this.positions[base + 1] = mix(
        transition.center[base + 1],
        transition.to[base + 1],
        progress,
      );
      this.positions[base + 2] = mix(
        transition.center[base + 2],
        transition.to[base + 2],
        progress,
      );
    }

    this.lineVisibility = easeInOutCubic(clamp((baseProgress - 0.12) / 0.88, 0, 1));
    this.pointMaterial.uniforms.uSize.value = mix(
      this.breakpoint === "mobile" ? 8.2 : 7.8,
      this.breakpoint === "mobile" ? 7.7 : 7.2,
      baseProgress,
    );

    if (elapsed >= CONFIG.transition.form + CONFIG.transition.stagger) {
      this.finishTransition();
    }
  }

  copyMixedPositions(from, to, amount) {
    for (let index = 0; index < this.positions.length; index += 1) {
      this.positions[index] = mix(from[index], to[index], amount);
    }
  }

  finishTransition() {
    if (!this.targets[this.state]) return;
    this.transition = null;
    this.positions.set(this.targets[this.state].positions);
    this.setActiveEdges(this.state);
    this.lineVisibility = 1;
    this.pointMaterial.uniforms.uSize.value = this.breakpoint === "mobile" ? 7.7 : 7.2;
    this.section.dataset.transitionPhase = "idle";
  }

  updateControls(nextState, announce) {
    this.section.dataset.activeState = nextState;

    this.buttons.forEach((button) => {
      const active = button.dataset.synergiImpactState === nextState;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    const label = CONFIG.states[nextState];
    if (this.visualState) this.visualState.textContent = label;
    if (announce && this.status) this.status.textContent = `${label} visualization selected.`;
  }

  setActiveEdges(state) {
    const { THREE } = this;
    this.activeEdges = this.edges[state] || [];
    const linePositions = new Float32Array(this.activeEdges.length * 3);
    this.lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    this.lineGeometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
  }

  shouldAnimate() {
    return this.visible && !document.hidden && !this.motionQuery.matches;
  }

  scheduleFrame() {
    if (this.frameId) return;
    if (!this.shouldAnimate()) {
      this.renderFrame(performance.now());
      return;
    }
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  stopFrame() {
    if (!this.frameId) return;
    window.cancelAnimationFrame(this.frameId);
    this.frameId = 0;
  }

  animate(now) {
    this.frameId = 0;
    if (!this.shouldAnimate()) return;

    const interval =
      this.breakpoint === "mobile"
        ? 1000 / 30
        : this.breakpoint === "tablet"
          ? 1000 / 45
          : 1000 / 60;

    if (now - this.lastFrame >= interval) {
      this.lastFrame = now;
      this.renderFrame(now);
    }

    this.scheduleFrame();
  }

  renderFrame(now) {
    if (!this.renderer || !this.count) return;

    const time = now * 0.001;
    this.updateTransition(now);
    this.pointer.x = mix(this.pointer.x, this.pointer.targetX, 0.14);
    this.pointer.y = mix(this.pointer.y, this.pointer.targetY, 0.14);
    this.pointer.strength = mix(this.pointer.strength, this.pointer.targetStrength, 0.12);
    if (!this.pointer.active && this.pointer.strength < 0.01) this.pointer.strength = 0;
    if (this.pointer.targetStrength > 1) {
      this.pointer.targetStrength = mix(this.pointer.targetStrength, this.pointer.active ? 1 : 0, 0.08);
    }

    for (let index = 0; index < this.count; index += 1) {
      const base = index * 3;
      const phase = this.phases[index];
      const idleScale = this.transition ? 0.004 : this.state === "locations" ? 0.006 : 0.008;
      let x = this.positions[base] + Math.cos(time * 0.56 + phase) * idleScale;
      let y = this.positions[base + 1] + Math.sin(time * 0.72 + phase) * idleScale;
      let z = this.positions[base + 2] + Math.sin(time * 0.44 + phase) * idleScale;

      if (this.pointer.strength > 0.01 && !this.transition) {
        const dx = x - this.pointer.x;
        const dy = y - this.pointer.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = this.breakpoint === "mobile" ? 0.34 : 0.44;
        if (distance > 0.001 && distance < radius) {
          const push = Math.pow(1 - distance / radius, 2) * 0.12 * this.pointer.strength;
          x += (dx / distance) * push;
          y += (dy / distance) * push;
          z += push * 0.18;
        }
      }

      this.displayPositions[base] = x;
      this.displayPositions[base + 1] = y;
      this.displayPositions[base + 2] = z;
    }

    this.pointGeometry.attributes.position.needsUpdate = true;
    this.updateLinesFromDisplay();
    this.updateLocationDetails(time);

    const pointerTilt = this.pointer.active ? this.pointer.ndcX * 0.012 : 0;
    const globeTurn = this.state === "locations" && !this.transition ? Math.sin(time * 0.16) * 0.12 : 0;
    const clientTurn =
      this.state === "clients" && !this.transition ? Math.sin(time * 0.12) * 0.035 : 0;
    this.root.rotation.y = mix(
      this.root.rotation.y,
      pointerTilt + globeTurn + clientTurn,
      0.04,
    );
    const targetRotationX =
      this.state === "clients"
        ? -0.22
        : this.state === "experience"
          ? Math.sin(time * 0.22) * 0.045
          : 0;
    this.root.rotation.x = mix(
      this.root.rotation.x,
      targetRotationX,
      0.04,
    );
    this.renderer.render(this.scene, this.camera);
  }

  updateLinesFromDisplay() {
    const attribute = this.lineGeometry.attributes.position;
    if (!attribute) return;
    const linePositions = attribute.array;

    for (let edgeIndex = 0; edgeIndex < this.activeEdges.length; edgeIndex += 2) {
      const first = this.activeEdges[edgeIndex] * 3;
      const second = this.activeEdges[edgeIndex + 1] * 3;
      const target = edgeIndex * 3;
      linePositions[target] = this.displayPositions[first];
      linePositions[target + 1] = this.displayPositions[first + 1];
      linePositions[target + 2] = this.displayPositions[first + 2];
      linePositions[target + 3] = this.displayPositions[second];
      linePositions[target + 4] = this.displayPositions[second + 1];
      linePositions[target + 5] = this.displayPositions[second + 2];
    }

    attribute.needsUpdate = true;
    const stateOpacity =
      this.state === "locations"
        ? 0.2
        : this.state === "clients"
          ? 0.22
          : this.state === "experience"
            ? 0.3
            : 0.32;
    this.lineMaterial.opacity = stateOpacity * this.lineVisibility;
  }

  updateLocationDetails(time) {
    if (!this.locationHubs?.length) return;
    const transitionWeight =
      this.transition?.phase === "gather"
        ? 0
        : this.transition?.phase === "form"
          ? this.lineVisibility
          : 1;
    const locationTarget = this.state === "locations" ? transitionWeight : 0;
    this.activeHubOpacity = mix(this.activeHubOpacity, locationTarget, 0.1);
    this.activeRouteOpacity = mix(this.activeRouteOpacity, locationTarget, 0.07);

    this.hubMeshes.forEach((hub, index) => {
      const location = this.locationHubs[index];
      hub.dot.position.copy(location);
      hub.halo.position.copy(location);
      hub.halo.rotation.z = time * 0.28 + index;
      hub.material.opacity = this.activeHubOpacity * 0.98;
      hub.glowMaterial.opacity =
        this.activeHubOpacity * (0.38 + Math.sin(time * 1.5 + index) * 0.08);
      const pulse = 1 + Math.sin(time * 1.35 + index) * 0.13;
      hub.dot.scale.setScalar(pulse);
      hub.halo.scale.setScalar(1.02 + pulse * 0.12);
    });

    this.routeMaterial.opacity = this.activeRouteOpacity * 0.62;
    this.travellerMaterial.opacity = this.activeRouteOpacity;
    this.routeTravellers.forEach((traveller, index) => {
      const progress = (time * 0.09 + index * 0.19) % 1;
      traveller.position.copy(this.routeCurves[index].getPointAt(progress));
      traveller.scale.setScalar(0.9 + Math.sin(time * 2 + index) * 0.18);
    });
  }
}

function bootSection(section) {
  if (section.dataset.threeState === "loading" || section.dataset.threeState === "ready") return;
  section.dataset.threeState = "loading";

  loadThree(section)
    .then((THREE) => {
      const visual = new SynergiImpactThree(section, THREE);
      visual.init();
    })
    .catch(() => {
      section.dataset.threeState = "error";
    });
}

function init() {
  if (isElementorEditor() || window.matchMedia("(max-width: 47.99rem)").matches) return;

  document.querySelectorAll(SECTION_SELECTOR).forEach((section) => {
    if (!("IntersectionObserver" in window)) {
      bootSection(section);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry], activeObserver) => {
        if (!entry.isIntersecting) return;
        activeObserver.disconnect();
        bootSection(section);
      },
      { rootMargin: "360px 0px", threshold: 0.01 },
    );
    observer.observe(section);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
