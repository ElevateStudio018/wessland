(() => {
  document.documentElement.classList.add("js");

  // Header: transparent over hero, solid after scrolling
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero, .page-hero");
  const setHeader = () => {
    if (!header) return;
    const limit = hero ? hero.offsetHeight - 90 : 0;
    header.classList.toggle("solid", window.scrollY > limit);
    header.classList.toggle("on-light", !hero);
  };
  setHeader();
  window.addEventListener("scroll", setHeader, { passive: true });
  window.addEventListener("resize", setHeader);

  // Mobile menu
  const btn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");
  if (btn && nav) {
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
      btn.textContent = open ? "Stäng" : "Meny";
      if (open) header.classList.add("solid");
      else setHeader();
    });
    nav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") { nav.classList.remove("open"); btn.textContent = "Meny"; btn.setAttribute("aria-expanded", "false"); }
    });
  }

  // Reveal on scroll
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    items.forEach((el) => io.observe(el));
  } else items.forEach((el) => el.classList.add("in"));

  // Hero video (YouTube IFrame API, muted loop background)
  const heroEl = document.querySelector(".hero");
  const holder = document.getElementById("hero-player");
  const toggle = document.querySelector(".vid-toggle");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  if (heroEl && holder && !reduce && !saveData) {
    const id = holder.dataset.video;
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    // Klipp ur filmen som loopas, [start, slut] i sekunder: 5:54–6:11 och 6:21–6:29
    const SEGMENTS = [[354, 371], [381, 389]];
    let player, seg = 0, timer;
    const next = () => {
      seg = (seg + 1) % SEGMENTS.length;
      player.seekTo(SEGMENTS[seg][0], true);
    };
    window.onYouTubeIframeAPIReady = () => {
      player = new YT.Player("hero-player", {
        videoId: id,
        playerVars: { autoplay: 1, mute: 1, controls: 0, playsinline: 1, modestbranding: 1, rel: 0, disablekb: 1, iv_load_policy: 3, fs: 0, start: SEGMENTS[0][0] },
        events: {
          onReady: (e) => { e.target.mute(); e.target.playVideo(); },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) {
              heroEl.classList.add("playing");
              if (toggle) toggle.textContent = "Pausa film";
              if (!timer) timer = setInterval(() => {
                if (player.getCurrentTime() >= SEGMENTS[seg][1] - 0.1) next();
              }, 150);
            }
            if (e.data === YT.PlayerState.PAUSED && toggle) toggle.textContent = "Spela film";
            if (e.data === YT.PlayerState.ENDED) { seg = SEGMENTS.length - 1; next(); player.playVideo(); }
          },
        },
      });
      const frame = () => document.getElementById("hero-player");
      setTimeout(() => { const f = frame(); if (f) f.classList.add("hero-video"); }, 0);
    };
    if (toggle) {
      toggle.hidden = false;
      toggle.addEventListener("click", () => {
        if (!player || !player.getPlayerState) return;
        if (player.getPlayerState() === 1) player.pauseVideo(); else player.playVideo();
      });
    }
  }

  // Contact form -> mailto (no backend needed)
  const form = document.getElementById("kontaktform");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const subject = `Förfrågan: ${d.get("amne")}`;
      const body = `Namn: ${d.get("namn")}\nTelefon: ${d.get("telefon") || "-"}\nAntal personer: ${d.get("antal") || "-"}\nÖnskat datum: ${d.get("datum") || "-"}\n\n${d.get("meddelande")}`;
      window.location.href = `mailto:info@wessland.se?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
})();
