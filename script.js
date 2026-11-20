/* ═══════════════ WISE Research — настройки ═══════════════
   Всё, что нужно менять, — в этом блоке.                     */
const CONFIG = {
  // Ссылка на форму Airtable. Все кнопки «Apply now» ведут сюда.
  APPLY_URL: "https://airtable.com/",   // ← ВСТАВЬТЕ ссылку на форму Airtable

  CONTACTS: {
    telegram: "https://t.me/",          // ← ссылка на Telegram
    instagram: "https://instagram.com/",// ← ссылка на Instagram
    whatsapp: "https://wa.me/",         // ← ссылка на WhatsApp
  },

  // ⚠ ПРИМЕРЫ. Замените на реальных менторов перед публикацией.
  // photo — путь к фото (например "img/mentors/anna.jpg") или "" — тогда показываются инициалы.
  MENTORS: [
    { name: "Анна К.",    uni: "Stanford",  role: "PhD, Computer Science · исследования в AI и NLP", photo: "" },
    { name: "Daniel M.",  uni: "Oxford",    role: "DPhil, International Relations · политика Центральной Азии", photo: "" },
    { name: "Айдана Т.",  uni: "Columbia",  role: "PhD Candidate, Neuroscience · когнитивные науки", photo: "" },
    { name: "James L.",   uni: "MIT",       role: "PhD, Mechanical Engineering · робототехника", photo: "" },
    { name: "Мария С.",   uni: "Cambridge", role: "PhD, Economics · поведенческая экономика", photo: "" },
    { name: "Priya R.",   uni: "Harvard",   role: "PhD, Molecular Biology · генетика и биотех", photo: "" },
    { name: "Тимур А.",   uni: "LSE",       role: "MSc, Finance · рынки капитала и fintech", photo: "" },
    { name: "Sofia B.",   uni: "Yale",      role: "PhD Candidate, History of Art · визуальная культура", photo: "" },
  ],
};

/* Форматы программы (вкладки в шаге 02) */
const MODES = [
  { title: "Индивидуальная онлайн-программа", emoji: "💻",
    desc: "Самостоятельное исследование на тему по вашему выбору с персональным ментором. Максимум гибкости и глубины.",
    dur: "12 недель", meet: "14+ часов", out: "Научная статья", fit: "9–12 классы" },
  { title: "Групповая онлайн-программа", emoji: "👥",
    desc: "Небольшая группа до 5 студентов под руководством ментора: общая тема, индивидуальные статьи и взаимная рецензия.",
    dur: "10 недель", meet: "Группа + 4 ч 1:1", out: "Статья / постер", fit: "8–11 классы" },
  { title: "Интенсив", emoji: "⚡",
    desc: "Сжатый формат на каникулах: ежедневная работа с ментором и защита проекта на симпозиуме в конце.",
    dur: "4 недели", meet: "10+ часов", out: "Проект + выступление", fit: "9–12 классы" },
  { title: "Premium: исследование + поступление", emoji: "🎓",
    desc: "Полное сопровождение: исследование с ментором, подача в журналы и конкурсы, интеграция в эссе и заявки в университеты.",
    dur: "6 месяцев", meet: "30+ часов", out: "Статья + стратегия", fit: "10–12 классы" },
];

/* ═══════════════ Логика ═══════════════ */
document.documentElement.classList.add("js");

// Apply-кнопки и контакты
document.querySelectorAll("[data-apply]").forEach((a) => {
  a.href = CONFIG.APPLY_URL;
  a.target = "_blank";
  a.rel = "noopener";
});
document.querySelectorAll("[data-contact]").forEach((a) => {
  const url = CONFIG.CONTACTS[a.dataset.contact];
  if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
});

// Менторы (дублируем для бесконечной ленты)
(function renderMentors() {
  const track = document.getElementById("mentorTrack");
  if (!track) return;
  const palettes = [
    ["#3d3bd4", "#8c8af7"], ["#17161c", "#4a4852"], ["#c98a1a", "#e7b24a"],
    ["#5b58f0", "#b9b8ff"], ["#2b2a36", "#3d3bd4"], ["#8c6b2e", "#d9b26a"],
  ];
  const card = (m, i) => {
    const [a, b] = palettes[i % palettes.length];
    const initials = m.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2);
    const photo = m.photo ? `<img src="${m.photo}" alt="${m.name}" loading="lazy">` : initials;
    return `<article class="mentor">
      <div class="mentor__photo" style="background:linear-gradient(150deg,${a},${b})">${photo}<span class="mentor__uni">${m.uni}</span></div>
      <h3>${m.name}</h3><p>${m.role}</p></article>`;
  };
  const html = CONFIG.MENTORS.map(card).join("");
  track.innerHTML = html + html;
  track.children && [...track.children].slice(CONFIG.MENTORS.length).forEach((el) => el.setAttribute("aria-hidden", "true"));
})();

// Вкладки форматов
(function modes() {
  const tabs = document.querySelectorAll(".modes__tabs button");
  const panel = document.querySelector(".modes__panel");
  if (!panel) return;
  tabs.forEach((t) => t.addEventListener("click", () => {
    tabs.forEach((x) => x.setAttribute("aria-selected", x === t ? "true" : "false"));
    const m = MODES[+t.dataset.mode];
    panel.querySelectorAll("[data-m]").forEach((el) => { el.textContent = m[el.dataset.m]; });
    panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
  }));
})();

// Появление при скролле + счётчики
(function reveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      e.target.querySelectorAll("[data-count]").forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal").forEach((el) => {
    // каскад для соседних элементов
    const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    const idx = sibs.indexOf(el);
    if (idx > 0) el.style.transitionDelay = Math.min(idx * 80, 400) + "ms";
    io.observe(el);
  });
  document.querySelectorAll(".matters__visual").forEach((el) => io.observe(el));

  function countUp(el) {
    const end = +el.dataset.count, dur = 1400, t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
})();

// Шаги 01–05: активный шаг и счётчик слева
(function steps() {
  const steps = document.querySelectorAll(".step");
  const cur = document.querySelector(".how__current");
  const bar = document.querySelector(".how__bar span");
  if (!steps.length || !cur) return;
  let active = null;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting || e.target === active) return;
      active = e.target;
      steps.forEach((s) => s.classList.toggle("is-active", s === active));
      const n = active.dataset.step;
      cur.classList.add("swap");
      setTimeout(() => { cur.textContent = n; cur.classList.remove("swap"); }, 200);
      bar.style.width = (+n / steps.length) * 100 + "%";
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  steps.forEach((s) => io.observe(s));
  steps[0].classList.add("is-active");
})();

// Навигация: активная ссылка, мобильное меню
(function nav() {
  const nav = document.getElementById("nav");
  const burger = nav.querySelector(".burger");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  nav.querySelectorAll(".mobile-menu a").forEach((a) => a.addEventListener("click", () => {
    nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false");
  }));

  const links = [...nav.querySelectorAll(".nav__links a")];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach((s) => io.observe(s));
})();

// Плавный скролл (Lenis), если библиотека загрузилась
(function smooth() {
  if (typeof Lenis === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -100 });
    }));
  } catch (_) { /* обычный скролл */ }
})();

// Запуск анимации заголовка
requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add("loaded")));
