/* Animated starfield + grid + drifting orbs */

function StarField({ density = 1, shootingStars = true }) {
  const canvasRef = React.useRef(null);
  const propsRef = React.useRef({ density, shootingStars });
  propsRef.current = { density, shootingStars };
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf, w, h, stars = [], shooting = [];
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const base = Math.min(220, Math.round((w * h) / 9000));
      const n = Math.max(0, Math.round(base * propsRef.current.density));
      stars = Array.from({ length: n }, () => makeStar());
    }
    function makeStar() {
      const r = Math.random();
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.3 + Math.random() * 0.9,           // depth/size
        a: 0.2 + Math.random() * 0.8,           // base alpha
        tw: Math.random() * Math.PI * 2,        // twinkle phase
        ts: 0.6 + Math.random() * 1.6,          // twinkle speed
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        hue: r < 0.7 ? null : (r < 0.85 ? 195 : 285), // some colored
      };
    }
    function maybeShoot(t) {
      if (!propsRef.current.shootingStars) return;
      if (Math.random() < 0.0025 && shooting.length < 2) {
        const fromLeft = Math.random() < 0.5;
        shooting.push({
          x: fromLeft ? -20 : w + 20,
          y: Math.random() * h * 0.6,
          vx: (fromLeft ? 1 : -1) * (6 + Math.random() * 4),
          vy: 1.5 + Math.random() * 1.5,
          life: 1,
          hue: Math.random() < 0.5 ? 195 : 320,
        });
      }
    }

    let last = performance.now();
    function frame(now) {
      const dt = Math.min(50, now - last) / 16.67;
      last = now;
      ctx.clearRect(0, 0, w, h);

      // stars
      for (const s of stars) {
        s.tw += 0.025 * s.ts * dt;
        s.x += s.vx * dt; s.y += s.vy * dt;
        if (s.x < -2) s.x = w; if (s.x > w + 2) s.x = 0;
        if (s.y < -2) s.y = h; if (s.y > h + 2) s.y = 0;
        const a = s.a * (0.55 + 0.45 * Math.sin(s.tw));
        const r = s.z * 0.95;
        if (s.hue == null) ctx.fillStyle = `rgba(220,230,255,${a})`;
        else ctx.fillStyle = `hsla(${s.hue}, 95%, 70%, ${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
        if (s.z > 0.9 && a > 0.6) {
          ctx.fillStyle = `rgba(180,210,255,${a * 0.18})`;
          ctx.beginPath(); ctx.arc(s.x, s.y, r * 3.2, 0, Math.PI * 2); ctx.fill();
        }
      }

      // shooting stars
      maybeShoot(now);
      for (let i = shooting.length - 1; i >= 0; i--) {
        const s = shooting[i];
        s.x += s.vx * dt; s.y += s.vy * dt;
        s.life -= 0.012 * dt;
        if (s.life <= 0 || s.x < -100 || s.x > w + 100) { shooting.splice(i, 1); continue; }
        const tx = s.x - s.vx * 8, ty = s.y - s.vy * 8;
        const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
        grad.addColorStop(0, `hsla(${s.hue},95%,75%,0)`);
        grad.addColorStop(1, `hsla(${s.hue},95%,75%,${0.9 * s.life})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }

      raf = requestAnimationFrame(frame);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    // re-seed star count when density changes
    propsRef.current._reseed = resize;
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  // re-seed when density changes
  React.useEffect(() => {
    if (propsRef.current._reseed) propsRef.current._reseed();
  }, [density]);

  return <canvas ref={canvasRef} className="bg-canvas" />;
}

function Background({
  stars = true,
  starDensity = 1,
  shootingStars = true,
  orbs = true,
  grid = true,
  dots = true,
  vignette = true,
}) {
  return (
    <div className="bg-stack" aria-hidden="true">
      <div className="bg-base" />
      {orbs && (
        <div className="bg-orbs">
          <div className="orb o1" />
          <div className="orb o2" />
          <div className="orb o3" />
          <div className="orb o4" />
        </div>
      )}
      {grid && <div className="bg-grid" />}
      {stars && <StarField density={starDensity} shootingStars={shootingStars} />}
      {dots && <div className="bg-dots" />}
      {vignette && <div className="bg-vignette" />}
    </div>
  );
}

window.Background = Background;
