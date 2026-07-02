<script lang="ts">
  import { onMount } from "svelte";
  import { onCelebrate } from "../lib/events";

  let canvas: HTMLCanvasElement;

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rot: number;
    vr: number;
    size: number;
    color: string;
    life: number;
  }

  const COLORS = ["#F5A623", "#34D399", "#2DD4BF", "#CFD8E3"];

  onMount(() => {
    const ctx = canvas.getContext("2d")!;
    let particles: Particle[] = [];
    let raf = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function burst(intensity: "lesson" | "topic" = "lesson") {
      const count = intensity === "topic" ? 160 : 90;
      const cx = window.innerWidth / 2;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 7;
        particles.push({
          x: cx + (Math.random() - 0.5) * 120,
          y: window.innerHeight * 0.32,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.3,
          size: 5 + Math.random() * 6,
          color: COLORS[(Math.random() * COLORS.length) | 0],
          life: 1,
        });
      }
      if (!raf) loop();
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.vy += 0.18; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= 0.012;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      particles = particles.filter((p) => p.life > 0 && p.y < canvas.height + 40);
      if (particles.length) {
        raf = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    const off = onCelebrate((d) => burst(d.intensity));
    return () => {
      off();
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  });
</script>

<canvas
  bind:this={canvas}
  class="pointer-events-none fixed inset-0 z-[60]"
  aria-hidden="true"
></canvas>
