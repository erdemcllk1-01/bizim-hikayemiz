(() => {
  const gate = document.getElementById("gate");
  const site = document.getElementById("site");
  const loginForm = document.getElementById("loginForm");
  const passwordInput = document.getElementById("passwordInput");
  const passwordError = document.getElementById("passwordError");
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");
  const music = document.getElementById("siteMusic");
  const playerStatus = document.getElementById("playerStatus");
  const musicPlayer = document.querySelector(".music-player");
  const trackButtons = [...document.querySelectorAll(".track-button")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentTrack = "";
  let resumeAfterVideo = false;
  let previousFocus = null;

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (passwordInput.value === "0509") {
      passwordError.textContent = "";
      gate.classList.add("hidden");
      site.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      spawnHearts(12);
    } else {
      passwordError.textContent = "Şifre yanlış ❤️";
      passwordInput.value = "";
      passwordInput.focus();
    }
  });

  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    menuToggle.setAttribute("aria-label", expanded ? "Menüyü aç" : "Menüyü kapat");
    siteNav.classList.toggle("open", !expanded);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      closeLightbox();
    }
  });

  function closeMenu() {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Menüyü aç");
    siteNav.classList.remove("open");
  }

  trackButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const song = button.dataset.song;
      const title = button.dataset.title;
      if (currentTrack === song && !music.paused) {
        music.pause();
        playerStatus.textContent = "Müzik duraklatıldı.";
        button.querySelector(".track-action").textContent = "▶";
        button.setAttribute("aria-pressed", "false");
        resumeAfterVideo = false;
        currentTrack = "";
        return;
      }
      currentTrack = song;
      music.src = song;
      trackButtons.forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
        item.querySelector(".track-action").textContent = item === button ? "Ⅱ" : "▶";
      });
      try {
        await music.play();
        playerStatus.textContent = `Bizim şarkımız başladı… ❤️ Şimdi hikâyemize devam edelim. · ${title}`;
      } catch {
        playerStatus.textContent = "Şarkı açılamadı. Dosyanın images klasöründe olduğuna bak.";
        button.querySelector(".track-action").textContent = "▶";
      }
    });
  });

  music.addEventListener("pause", () => {
    musicPlayer.classList.remove("is-playing");
    if (currentTrack) {
      const active = trackButtons.find((button) => button.dataset.song === currentTrack);
      if (active && !resumeAfterVideo) active.querySelector(".track-action").textContent = "▶";
    }
  });
  music.addEventListener("play", () => {
    musicPlayer.classList.add("is-playing");
    const active = trackButtons.find((button) => button.dataset.song === currentTrack);
    if (active) active.querySelector(".track-action").textContent = "Ⅱ";
  });

  document.querySelectorAll("video").forEach((video) => {
    video.addEventListener("play", () => {
      resumeAfterVideo = !music.paused;
      if (resumeAfterVideo) music.pause();
    });
    const resumeMusic = async () => {
      const anotherVideoPlaying = [...document.querySelectorAll("video")].some((item) => item !== video && !item.paused && !item.ended);
      if (!anotherVideoPlaying && resumeAfterVideo && currentTrack) {
        try { await music.play(); } catch { /* The browser may require another tap. */ }
        resumeAfterVideo = false;
      }
    };
    video.addEventListener("pause", resumeMusic);
    video.addEventListener("ended", resumeMusic);
  });

  const revealSurprise = document.getElementById("revealSurprise");
  const surpriseContent = document.getElementById("surpriseContent");
  revealSurprise.addEventListener("click", () => {
    surpriseContent.classList.remove("hidden");
    revealSurprise.setAttribute("aria-expanded", "true");
    revealSurprise.textContent = "Sürpriz açıldı ♡";
    revealSurprise.disabled = true;
    spawnHearts(18);
    window.setTimeout(() => surpriseContent.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" }), 80);
  });

  const messageText = "Cemre'm, geçen günlerde belki sana sadece uzaktan bakıyordum. Şimdi ise en güzel hayallerimi seninle kuruyorum. Gülüşün ve gözlerin dünyamı güzelleştiriyor. Seninle huzurlu bir gelecek kurmak ve hayatımı seninle güzelleştirmek istiyorum. İyi ki hayatıma girdin. İyi ki biz olduk. Seni seviyorum. ❤️";
  document.getElementById("revealLoveMessage").addEventListener("click", (event) => {
    const button = event.currentTarget;
    if (button.dataset.opened === "true") return;
    button.dataset.opened = "true";
    button.textContent = "Bu mesaj sadece sana, Cemre'm ❤️";
    const message = document.getElementById("loveMessage");
    message.replaceChildren();
    messageText.split(/\s+/).forEach((word, index) => {
      const span = document.createElement("span");
      span.className = "message-word";
      span.textContent = word;
      if (!reducedMotion) span.style.animationDelay = `${Math.min(index * 0.08, 4)}s`;
      message.appendChild(span);
    });
    if (!reducedMotion) spawnHearts(12);
  });

  const lightbox = document.getElementById("photoLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeButton = document.getElementById("closeLightbox");
  document.addEventListener("click", (event) => {
    const image = event.target.closest("img.zoomable");
    if (!image) return;
    previousFocus = document.activeElement;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.remove("hidden");
    closeButton.focus();
  });
  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  function closeLightbox() {
    if (lightbox.classList.contains("hidden")) return;
    lightbox.classList.add("hidden");
    lightboxImage.removeAttribute("src");
    if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
  }

  if ("IntersectionObserver" in window) {
    const sections = [...document.querySelectorAll(".site section[id]")];
    const navLinks = [...siteNav.querySelectorAll("a")];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle("active", link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: "-25% 0px -65% 0px" });
    sections.forEach((section) => observer.observe(section));
  }

  function spawnHearts(count) {
    const holder = document.querySelector(".ambient-hearts");
    if (reducedMotion) return;
    for (let index = 0; index < count; index += 1) {
      const heart = document.createElement("span");
      heart.textContent = Math.random() > .5 ? "♡" : "♥";
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.fontSize = `${12 + Math.random() * 17}px`;
      heart.style.animationDuration = `${5 + Math.random() * 4}s`;
      heart.style.setProperty("--drift", `${Math.round(Math.random() * 70 - 35)}px`);
      holder.appendChild(heart);
      window.setTimeout(() => heart.remove(), 9500);
    }
  }
})();
