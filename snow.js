// Lightweight snowfall, confined to the background.
(() => {
  const canvas = document.getElementById('snow-canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let w = 0, h = 0, flakes = [], frame = 0, last = 0;
  function flake(initial = false) {
    return { x: Math.random() * w, y: initial ? Math.random() * h : -12,
      r: .9 + Math.random() * 2.6, speed: 18 + Math.random() * 32,
      phase: Math.random() * Math.PI * 2, alpha: .4 + Math.random() * .55 };
  }
  function resize() {
    w = innerWidth; h = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    flakes = Array.from({length: Math.min(95, Math.max(35, Math.round(w / 13)))}, () => flake(true));
    if (motion.matches) ctx.clearRect(0, 0, w, h);
  }
  function draw(t) {
    const dt = last ? Math.min((t - last) / 1000, .05) : .016; last = t;
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i]; f.y += f.speed * dt;
      f.x += (Math.sin(t / 2300 + f.phase) * 10 + 5) * dt;
      if (f.y > h + 10) { flakes[i] = flake(); continue; }
      if (f.x > w + 10) f.x = -10;
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${f.alpha})`; ctx.fill();
    }
    frame = requestAnimationFrame(draw);
  }
  function sync() {
    cancelAnimationFrame(frame); last = 0;
    if (!motion.matches && !document.hidden) frame = requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, w, h);
  }
  addEventListener('resize', resize, {passive:true});
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  resize(); sync();
})();
