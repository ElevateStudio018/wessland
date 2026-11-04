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
    const loadYT = () => {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    };
    // Ligger filmen som assets/hero.mp4 används den (tyst autoplay, ingen spelare). Annars YouTube.
    fetch("assets/hero.mp4", { method: "HEAD" }).then((r) => {
      if (!r.ok) throw new Error("ingen fil");
      const v = document.createElement("video");
      v.className = "hero-file"; v.src = "assets/hero.mp4";
      v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
      holder.replaceWith(v);
      v.play().catch(() => {});
    }).catch(loadYT);
    // Klipp ur filmen som loopas, [start, slut] i sekunder: 5:54–6:11 och 6:21–6:29
    const SEGMENTS = [[354, 371], [381, 389]];
    let player, seg = 0, timer, hopping = false, userPaused = false;
    const show = (on) => heroEl.classList.toggle("playing", on);
    const tick = () => {
      if (!player || !player.getPlayerState || hopping) return;
      const st = player.getPlayerState();
      const t = player.getCurrentTime();
      const [s, e] = SEGMENTS[seg];
      if (st !== 1) { show(false); return; }
      if (t >= e - 0.5) {
        // tona ut, hoppa, visa först när vi landat på klippets första bild
        show(false);
        hopping = true;
        seg = (seg + 1) % SEGMENTS.length;
        setTimeout(() => { player.seekTo(SEGMENTS[seg][0], true); hopping = false; }, 600);
        return;
      }
      show(t >= s + 0.1 && t < e - 0.5);
    };
    window.onYouTubeIframeAPIReady = () => {
      player = new YT.Player("hero-player", {
        videoId: id,
        playerVars: { autoplay: 1, mute: 1, controls: 0, playsinline: 1, modestbranding: 1, rel: 0, disablekb: 1, iv_load_policy: 3, fs: 0, start: SEGMENTS[0][0] },
        events: {
          onReady: (e) => { e.target.mute(); e.target.seekTo(SEGMENTS[0][0], true); e.target.playVideo(); },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) {
              if (toggle) toggle.textContent = "Pausa film";
              if (!timer) timer = setInterval(tick, 100);
            } else {
              show(false);
              if (e.data === YT.PlayerState.PAUSED && toggle) toggle.textContent = "Spela film";
              if (e.data === YT.PlayerState.ENDED) { seg = 0; player.seekTo(SEGMENTS[0][0], true); player.playVideo(); }
              if (e.data === YT.PlayerState.PAUSED && !userPaused) player.playVideo();
            }
          },
        },
      });
    };
    if (toggle) {
      toggle.hidden = false;
      toggle.addEventListener("click", () => {
        if (!player || !player.getPlayerState) return;
        if (player.getPlayerState() === 1) { userPaused = true; player.pauseVideo(); } else { userPaused = false; player.playVideo(); }
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
