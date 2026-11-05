import Matter from "matter-js";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
export type Skill = { name: string; icon: { path: string } };

type SkillPileProps = {
  skills: Skill[];
  title: string;
  titleId: string;

  heroHost: HTMLElement | null;
};

type PillSize = {
  w: number;
  h: number;
  icon: { x: number; y: number; s: number };
  text: { x: number; y: number };
};

type TitleLayout = { lines: string[]; fontSize: number; lineGap: number; height: number };

export function SkillPile({ skills, title, titleId, heroHost }: SkillPileProps) {
  const headRef = useRef<SVGSVGElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const layerRef = useRef<SVGSVGElement>(null);
  const pillRefs = useRef<(SVGGElement | null)[]>([]);
  const heroPillRefs = useRef<(SVGGElement | null)[]>([]);
  const heroSceneRef = useRef<SVGGElement>(null);
  const clipBoxRef = useRef<SVGRectElement>(null);
  const clipRef = useRef<SVGClipPathElement>(null);
  const sceneRef = useRef<SVGGElement>(null);

  const [layout, setLayout] = useState<TitleLayout>({
    lines: [title],
    fontSize: 0,
    lineGap: 0,
    height: 0,
  });
  const [titleStyle, setTitleStyle] = useState<React.CSSProperties>({});
  const [sizes, setSizes] = useState<PillSize[] | null>(null);
  const [pillFont, setPillFont] = useState<React.CSSProperties>({});
  const [live, setLive] = useState(false);

  useLayoutEffect(() => {
    const svg = headRef.current;
    if (!svg) return;
    const h2 = svg.parentElement!;

    const measure = () => {
      const cs = getComputedStyle(h2);
      const fontSize = parseFloat(cs.fontSize);
      setTitleStyle({
        fontFamily: cs.fontFamily,
        fontWeight: cs.fontWeight as React.CSSProperties["fontWeight"],
        fontSize: `${fontSize}px`,
        letterSpacing: cs.letterSpacing,
        wordSpacing: cs.wordSpacing,
      });
      const probe = document.createElementNS("http://www.w3.org/2000/svg", "text");
      probe.textContent = title;
      svg.appendChild(probe);
      const fits = probe.getComputedTextLength() <= svg.clientWidth;
      probe.remove();
      const lines = fits ? [title] : title.split(" ");
      const lineGap = fontSize * 0.9;
      setLayout({
        lines,
        fontSize,
        lineGap,
        height: fontSize * 1.02 + (lines.length - 1) * lineGap,
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(h2);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [title]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const flag = { cancelled: false };
    const run = () => {
      if (flag.cancelled) return;
      const items = Array.from(list.querySelectorAll<HTMLElement>(".pill"));
      const first = items[0];
      if (!first) return;
      const cs = getComputedStyle(first);
      setPillFont({
        fontFamily: cs.fontFamily,
        fontWeight: cs.fontWeight as React.CSSProperties["fontWeight"],
        fontSize: cs.fontSize,
        letterSpacing: cs.letterSpacing,
      });
      setSizes(
        items.map((li) => {
          const r = li.getBoundingClientRect();
          const ir = li.querySelector("svg")!.getBoundingClientRect();
          const range = document.createRange();
          range.selectNodeContents(li.lastChild!);
          const tr = range.getBoundingClientRect();
          return {
            w: r.width,
            h: r.height,
            icon: { x: ir.left - r.left, y: ir.top - r.top, s: ir.width },
            text: { x: tr.left - r.left, y: tr.top - r.top + tr.height / 2 },
          };
        }),
      );
    };
    (document.fonts?.ready ?? Promise.resolve()).then(run);
    return () => {
      flag.cancelled = true;
    };
  }, [skills]);

  useEffect(() => {
    const box = boxRef.current;
    const head = headRef.current;
    const layer = layerRef.current;
    if (!sizes || !box || !head || !layer || !heroHost) return;

    const { Engine, Bodies, Body, Composite, Constraint, Vector, Query, Sleeping } = Matter;
    setLive(true);

    const engine = Engine.create({ gravity: { x: 0, y: 1.1 }, enableSleeping: true });
    const dim = { width: box.clientWidth, height: box.clientHeight };

    const pageTop = -(box.getBoundingClientRect().top + window.scrollY);
    const heroH = heroHost.getBoundingClientRect().height;
    const bodies = sizes.map(({ w, h }) =>
      Bodies.rectangle(
        w / 2 + Math.random() * Math.max(1, dim.width - w),
        pageTop + h + Math.random() * heroH * 0.55,
        w,
        h,
        {
          chamfer: { radius: h / 2 },
          restitution: 0.35,
          friction: 0.2,
          frictionAir: 0.012,
          density: 0.002,
          angle: (Math.random() - 0.5) * 0.8,
        },
      ),
    );
    Composite.add(engine.world, bodies);

    const world = { walls: [] as Matter.Body[] };
    const buildWalls = () => {
      Composite.remove(engine.world, world.walls);
      const t = 400;

      const ceiling = -(box.getBoundingClientRect().top + window.scrollY);
      const span = dim.height - ceiling;
      const midY = ceiling + span / 2;
      world.walls = [
        Bodies.rectangle(dim.width / 2, dim.height + t / 2, dim.width * 3, t, { isStatic: true }),
        Bodies.rectangle(dim.width / 2, ceiling - t / 2, dim.width * 3, t, { isStatic: true }),
        Bodies.rectangle(-t / 2, midY, t, span + 2 * t, { isStatic: true }),
        Bodies.rectangle(dim.width + t / 2, midY, t, span + 2 * t, { isStatic: true }),
      ];
      Composite.add(engine.world, world.walls);
    };
    buildWalls();

    const radiusOf = (el: Element) => parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
    const setRect = (el: SVGRectElement | null, target: HTMLElement, origin: DOMRect) => {
      if (!el) return;
      const r = target.getBoundingClientRect();
      el.setAttribute("x", String(r.left - origin.left));
      el.setAttribute("y", String(r.top - origin.top));
      el.setAttribute("width", String(r.width));
      el.setAttribute("height", String(r.height));
      el.setAttribute("rx", String(radiusOf(target)));
    };

    const section = layer.parentElement!;
    const layoutLayer = () => {
      const sr = section.getBoundingClientRect();
      const top = sr.top + window.scrollY;
      layer.style.top = `${-top}px`;
      layer.style.left = `${-sr.left}px`;
      layer.style.width = `${document.documentElement.clientWidth}px`;
      layer.style.height = `${top + section.offsetHeight}px`;
      const origin = layer.getBoundingClientRect();
      setRect(clipBoxRef.current, box, origin);
      const hr = head.getBoundingClientRect();

      clipRef.current?.querySelectorAll("text").forEach((t) =>
        t.setAttribute("transform", `translate(${hr.left - origin.left} ${hr.top - origin.top})`),
      );
      const br = box.getBoundingClientRect();
      sceneRef.current?.setAttribute(
        "transform",
        `translate(${br.left - origin.left} ${br.top - origin.top})`,
      );
      const ho = heroHost.getBoundingClientRect();
      heroSceneRef.current?.setAttribute(
        "transform",
        `translate(${br.left - ho.left} ${br.top - ho.top})`,
      );
    };

    const draw = () => {
      if (clipRef.current?.querySelector("text:not([transform])")) layoutLayer();
      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        const { w, h } = sizes[i];
        const t = `translate(${b.position.x} ${b.position.y}) rotate(${(b.angle * 180) / Math.PI}) translate(${-w / 2} ${-h / 2})`;
        pillRefs.current[i]?.setAttribute("transform", t);
        heroPillRefs.current[i]?.setAttribute("transform", t);
      }
    };
    layoutLayer();
    draw();

    const pointer = { x: -9999, y: -9999, px: -9999, py: -9999, inside: false };
    const held: {
      drag: { body: Matter.Body; constraint: Matter.Constraint; id: number } | null;
      samples: { x: number; y: number; t: number }[];
    } = { drag: null, samples: [] };

    const local = (clientX: number, clientY: number) => {
      const r = box.getBoundingClientRect();
      return { x: clientX - r.left, y: clientY - r.top };
    };
    const inside = (el: Element, x: number, y: number) => {
      const r = el.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    };

    const visibleAt = (x: number, y: number) =>
      inside(box, x, y) || inside(heroHost, x, y) || inside(head, x, y);
    const hit = (clientX: number, clientY: number) => {
      const p = local(clientX, clientY);
      const body = visibleAt(clientX, clientY) ? Query.point(bodies, p)[0] : undefined;
      return { p, body };
    };

    const onMove = (e: PointerEvent) => {
      const p = local(e.clientX, e.clientY);
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.inside = visibleAt(e.clientX, e.clientY);
      if (held.drag && e.pointerId === held.drag.id) {
        held.drag.constraint.pointA = { x: p.x, y: p.y };
        held.samples.push({ x: p.x, y: p.y, t: performance.now() });
        if (held.samples.length > 6) held.samples.shift();
      } else if (e.pointerType === "mouse") {
        document.documentElement.classList.toggle("is-over-pill", !!hit(e.clientX, e.clientY).body);
      }
    };

    const onDown = (e: PointerEvent) => {
      if (e.button > 0) return;
      const { p, body } = hit(e.clientX, e.clientY);
      if (!body) return;
      Sleeping.set(body, false);
      const constraint = Constraint.create({
        pointA: { x: p.x, y: p.y },
        bodyB: body,
        pointB: Vector.rotate(Vector.sub(p, body.position), -body.angle),
        stiffness: 0.2,
        damping: 0.1,
        length: 0,
      });
      Composite.add(engine.world, constraint);
      held.drag = { body, constraint, id: e.pointerId };
      held.samples = [{ x: p.x, y: p.y, t: performance.now() }];
      document.documentElement.classList.add("is-holding-pill");
      e.preventDefault();
    };

    const release = (e: PointerEvent) => {
      const drag = held.drag;
      if (!drag || e.pointerId !== drag.id) return;
      Composite.remove(engine.world, drag.constraint);

      const s = held.samples;
      if (s.length >= 2) {
        const a = s[0];
        const z = s[s.length - 1];
        const dt = Math.max(8, z.t - a.t);
        const vx = ((z.x - a.x) / dt) * 16.7;
        const vy = ((z.y - a.y) / dt) * 16.7;
        const len = Math.hypot(vx, vy);
        const cap = 36;
        const k = len > cap ? cap / len : 1;
        Sleeping.set(drag.body, false);
        Body.setVelocity(drag.body, { x: vx * k, y: vy * k });
      }
      held.drag = null;
      held.samples = [];
      document.documentElement.classList.remove("is-holding-pill");
    };

    const onMouseDown = (e: MouseEvent) => {
      if (hit(e.clientX, e.clientY).body) e.preventDefault();
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t && hit(t.clientX, t.clientY).body) e.preventDefault();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("mousedown", onMouseDown);

    const loop = { frame: 0, last: 0 };

    const step = (now: number) => {
      loop.frame = requestAnimationFrame(step);
      const dt = loop.last ? Math.min(32, now - loop.last) : 16.7;
      loop.last = now;

      {
        if (pointer.inside && !held.drag) {
          const vx = pointer.x - pointer.px;
          const vy = pointer.y - pointer.py;
          const speed = Math.min(40, Math.hypot(vx, vy));
          for (const b of bodies) {
            const dx = b.position.x - pointer.x;
            const dy = b.position.y - pointer.y;
            const d = Math.hypot(dx, dy);
            if (d < 110 && speed > 0.5) {
              Sleeping.set(b, false);
              const k = (1 - d / 110) * speed * 0.00018 * b.mass;
              Body.applyForce(b, b.position, {
                x: (dx / (d || 1)) * k + vx * k * 0.02,
                y: (dy / (d || 1)) * k - k * 0.4,
              });
            }
          }
        }
        const steps = Math.ceil(dt / 16.667);
        for (let k = 0; k < steps; k++) Engine.update(engine, dt / steps);
      }
      pointer.px = pointer.x;
      pointer.py = pointer.y;
      draw();
    };

    const start = () => {
      if (loop.frame || document.hidden) return;
      loop.last = 0;
      loop.frame = requestAnimationFrame(step);
    };
    const stop = () => {
      cancelAnimationFrame(loop.frame);
      loop.frame = 0;
    };

    start();

    const ro = new ResizeObserver(() => {
      const w = box.clientWidth;
      const h = box.clientHeight;
      if (w === dim.width && h === dim.height) return;
      dim.width = w;
      dim.height = h;
      buildWalls();
      layoutLayer();
      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        const half = sizes[i].w / 2;
        Body.setPosition(b, {
          x: Math.min(dim.width - half, Math.max(half, b.position.x)),
          y: Math.min(b.position.y, dim.height - sizes[i].h),
        });
      }
    });
    ro.observe(box);

    const hostRo = new ResizeObserver(() => {
      layoutLayer();
      buildWalls();
    });
    hostRo.observe(document.body);
    hostRo.observe(head);
    window.addEventListener("resize", layoutLayer);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      hostRo.disconnect();
      window.removeEventListener("resize", layoutLayer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("mousedown", onMouseDown);
      document.documentElement.classList.remove("is-over-pill", "is-holding-pill");
      Engine.clear(engine);
      setLive(false);
    };
  }, [sizes, heroHost]);

  const titleLines = layout.lines.map((line, i) => (
    <text key={line} x="0" y={layout.fontSize * 0.8 + i * layout.lineGap}>
      {line}
    </text>
  ));

  return (
    <>
      <h2 className="section-title section-title--window" id={titleId}>
        <span className="sr-only">{title}</span>
        <svg
          ref={headRef}
          className="title-svg"
          height={layout.height || undefined}
          aria-hidden="true"
          focusable="false"
        >
          {layout.fontSize > 0 && titleLines}
        </svg>
      </h2>

      <div className={`pile${live ? " is-live" : ""}`} ref={boxRef}>
        <ul className="pile-list" ref={listRef}>
          {skills.map(({ name, icon }) => (
            <li className="pill" key={name}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d={icon.path} />
              </svg>
              {name}
            </li>
          ))}
        </ul>
      </div>

      {sizes && (
        <svg ref={layerRef} className="pill-layer" aria-hidden="true" focusable="false">
          <defs>
            <clipPath id={`${titleId}-clip`} ref={clipRef}>
              <rect ref={clipBoxRef} />
              {layout.lines.map((line, i) => (
                <text
                  key={line}
                  x="0"
                  y={layout.fontSize * 0.8 + i * layout.lineGap}
                  style={titleStyle}
                >
                  {line}
                </text>
              ))}
            </clipPath>
          </defs>
          <g clipPath={`url(#${titleId}-clip)`}>
            <g ref={sceneRef} style={pillFont}>
              {renderPills(skills, sizes, pillRefs)}
            </g>
          </g>
        </svg>
      )}

      {sizes &&
        heroHost &&
        createPortal(
          <svg className="hero-pill-layer" aria-hidden="true" focusable="false">
            <g ref={heroSceneRef} style={pillFont}>
              {renderPills(skills, sizes, heroPillRefs)}
            </g>
          </svg>,
          heroHost,
        )}
    </>
  );
}

function renderPills(
  skills: Skill[],
  sizes: PillSize[],
  refs: React.RefObject<(SVGGElement | null)[]>,
): ReactNode {
  return skills.map(({ name, icon }, i) => {
    const s = sizes[i];
    return (
      <g
        key={name}
        ref={(el) => {
          refs.current[i] = el;
        }}
      >
        <rect y="5" width={s.w} height={s.h} rx={s.h / 2} className="pill-shadow" />
        <rect width={s.w} height={s.h} rx={s.h / 2} className="pill-body" />
        <path
          d={icon.path}
          className="pill-icon"
          transform={`translate(${s.icon.x} ${s.icon.y}) scale(${s.icon.s / 24})`}
        />
        <text x={s.text.x} y={s.text.y} dominantBaseline="central" className="pill-text">
          {name}
        </text>
      </g>
    );
  });
}
