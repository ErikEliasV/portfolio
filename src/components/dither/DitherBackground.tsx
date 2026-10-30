"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { bayerThresholds } from "@/lib/dither/bayer";
import { hexToRgb01, PLANET_PALETTE, WAVE_PALETTE } from "@/lib/dither/palette";
import { shouldRenderFrame } from "@/lib/frame-throttle";
import { getIntroState } from "@/lib/intro/timeline";
import { FRAGMENT_SHADER, VERTEX_SHADER } from "./shaders";

const MOUSE_IDLE_MS = 1500;

interface GlState {
  program: WebGLProgram;
  buffer: WebGLBuffer;
  uResolution: WebGLUniformLocation | null;
  uTime: WebGLUniformLocation | null;
  uPlanet: WebGLUniformLocation | null;
  uMouse: WebGLUniformLocation | null;
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (!gl.isContextLost()) console.warn("[dither] shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function setup(gl: WebGLRenderingContext): GlState | null {
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  if (!vs || !fs || !program || !buffer) return null;

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    if (!gl.isContextLost()) console.warn("[dither] program:", gl.getProgramInfoLog(program));
    return null;
  }
  gl.useProgram(program);

  // Triângulo de tela cheia
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  // Uniforms constantes
  gl.uniform1fv(gl.getUniformLocation(program, "uBayer"), new Float32Array(bayerThresholds()));
  gl.uniform3fv(gl.getUniformLocation(program, "uWave"), new Float32Array(WAVE_PALETTE.flatMap(hexToRgb01)));
  gl.uniform3fv(
    gl.getUniformLocation(program, "uPlanetPal"),
    new Float32Array(Object.values(PLANET_PALETTE).flatMap(hexToRgb01)),
  );

  return {
    program,
    buffer,
    uResolution: gl.getUniformLocation(program, "uResolution"),
    uTime: gl.getUniformLocation(program, "uTime"),
    uPlanet: gl.getUniformLocation(program, "uPlanet"),
    uMouse: gl.getUniformLocation(program, "uMouse"),
  };
}

// Fundo fixo: ondas + planeta em dither. Sem `introProgress`, o planeta fica invisível.
export function DitherBackground({ introProgress }: { introProgress?: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    // Sem WebGL: fica só a grade + o fundo do body
    if (!gl) {
      canvas.style.display = "none";
      return;
    }

    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");

    let state: GlState | null = null;
    let raf = 0;
    let lastRender = -Infinity;
    let prevNow: number | null = null;
    let time = 0;
    let isMobile = mobileQuery.matches;
    let viewport = { width: window.innerWidth, height: window.innerHeight };
    const mouse = { x: 0.5, y: 0.5, strength: 0, lastMove: -Infinity };

    const progress = () => (introProgress ? introProgress.get() : 1);

    const resize = () => {
      isMobile = mobileQuery.matches;
      viewport = { width: window.innerWidth, height: window.innerHeight };
      const planetDiameter = 2 * getIntroState(0, viewport, isMobile).planet.radius * viewport.height;
      const [min, max] = isMobile ? [3, 8] : [4, 12];
      const pixel = Math.min(max, Math.max(min, Math.round(planetDiameter / 70)));
      canvas.width = Math.ceil(viewport.width / pixel);
      canvas.height = Math.ceil(viewport.height / pixel);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = () => {
      if (!state || gl.isContextLost()) return;
      const planet = getIntroState(progress(), viewport, isMobile).planet;
      gl.uniform2f(state.uResolution, canvas.width, canvas.height);
      gl.uniform1f(state.uTime, time);
      gl.uniform4f(state.uPlanet, planet.x, planet.y, planet.radius, planet.opacity);
      gl.uniform3f(state.uMouse, mouse.x, mouse.y, mouse.strength);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!shouldRenderFrame(now, lastRender, isMobile ? 30 : 60)) return;
      // Limita o passo para não saltar depois de um engasgo
      const dt = prevNow === null ? 0 : Math.min(now - prevNow, 100) / 1000;
      prevNow = now;
      lastRender = now;
      time += dt;

      const moving = now - mouse.lastMove < MOUSE_IDLE_MS;
      mouse.strength = moving ? Math.min(1, mouse.strength + dt * 4) : Math.max(0, mouse.strength - dt * 1.5);
      draw();
    };

    const animated = () => !reducedQuery.matches;

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const start = () => {
      stop();
      if (!state || document.hidden) return;
      if (animated()) {
        prevNow = null; // retoma sem salto: o tempo oculto não conta
        raf = requestAnimationFrame(frame);
      } else {
        time = 0;
        mouse.strength = 0;
        draw();
      }
    };

    const init = () => {
      state = setup(gl);
      if (!state) {
        canvas.style.display = "none";
        return;
      }
      canvas.style.display = "";
      resize();
      start();
    };

    const onResize = () => {
      resize();
      if (!animated()) draw();
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType !== "mouse" || !animated()) return;
      mouse.x = event.clientX / window.innerWidth;
      mouse.y = event.clientY / window.innerHeight;
      mouse.lastMove = performance.now();
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      stop();
      state = null;
      canvas.style.display = "none";
    };

    const onContextRestored = () => init();

    // Com movimento reduzido, redesenha só quando o scroll muda o planeta
    const unsubscribeProgress = introProgress?.on("change", () => {
      if (!animated()) draw();
    });

    init();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reducedQuery.addEventListener("change", start);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    return () => {
      stop();
      unsubscribeProgress?.();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedQuery.removeEventListener("change", start);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      if (state && !gl.isContextLost()) {
        gl.deleteBuffer(state.buffer);
        gl.deleteProgram(state.program);
      }
    };
  }, [introProgress]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full [image-rendering:pixelated]"
      />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-grid" />
    </>
  );
}
