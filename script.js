/* ============================================================
   Smart map preview placement. Prefer opening above the trigger,
   but use the side that fits (or has more free viewport space).
   Kept first so this small navigation enhancement is isolated from
   every optional section that follows in the page script.
   ============================================================ */
(function initSmartMapPreview() {
  var wraps = document.querySelectorAll(".visit-map-hover");
  if (!wraps.length) return;

  function place(wrap) {
    var popup = wrap.querySelector(".visit-map-popup");
    var trigger = wrap.querySelector(".visit-map-icon") || wrap;
    if (!popup || !trigger) return;

    var triggerRect = trigger.getBoundingClientRect();
    var mobilePreview = window.matchMedia("(max-width: 980px)").matches;
    var locationPanel = wrap.closest(".visit-location-panel");
    if (mobilePreview && locationPanel) {
      var wrapRect = wrap.getBoundingClientRect();
      var panelRect = locationPanel.getBoundingClientRect();
      var popupShift = (panelRect.left + panelRect.width / 2) - (wrapRect.left + wrapRect.width / 2);
      popup.style.setProperty("--map-popup-shift-x", popupShift.toFixed(2) + "px");
    } else {
      popup.style.removeProperty("--map-popup-shift-x");
    }

    var popupHeight = Math.max(popup.offsetHeight, popup.scrollHeight, 1);
    var viewportMargin = 16;
    var popupGap = 14;
    var needed = popupHeight + popupGap;
    var spaceAbove = triggerRect.top - viewportMargin;
    var spaceBelow = window.innerHeight - triggerRect.bottom - viewportMargin;
    var openBelow = spaceAbove < needed && (spaceBelow >= needed || spaceBelow > spaceAbove);

    wrap.classList.toggle("is-popup-below", openBelow);
  }

  wraps.forEach(function (wrap) {
    var trigger = wrap.querySelector(".visit-map-icon");
    var popup = wrap.querySelector(".visit-map-popup");
    var schedule = function () {
      window.requestAnimationFrame(function () { place(wrap); });
    };
    wrap.addEventListener("pointerenter", schedule);
    wrap.addEventListener("focusin", schedule);
    if (trigger && popup) {
      trigger.setAttribute("aria-expanded", "false");
      trigger.addEventListener("click", function (event) {
        if (!window.matchMedia("(max-width: 980px)").matches) return;

        /* On touch screens the first tap is a preview; a second tap on the
           same button follows the link to the full Google Maps page. */
        if (!wrap.classList.contains("is-touch-open")) {
          event.preventDefault();
          wraps.forEach(function (other) {
            other.classList.remove("is-touch-open");
            var otherTrigger = other.querySelector(".visit-map-icon");
            var otherPopup = other.querySelector(".visit-map-popup");
            if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
            if (otherPopup) otherPopup.setAttribute("aria-hidden", "true");
          });
          wrap.classList.add("is-touch-open");
          trigger.setAttribute("aria-expanded", "true");
          popup.setAttribute("aria-hidden", "false");
          schedule();
        }
      });
    }
    var image = wrap.querySelector(".visit-map-popup img");
    if (image) {
      if (image.complete) schedule();
      else image.addEventListener("load", schedule, { once: true });
    }
  });

  document.addEventListener("pointerdown", function (event) {
    wraps.forEach(function (wrap) {
      if (!wrap.classList.contains("is-touch-open") || wrap.contains(event.target)) return;
      wrap.classList.remove("is-touch-open");
      var trigger = wrap.querySelector(".visit-map-icon");
      var popup = wrap.querySelector(".visit-map-popup");
      if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
        trigger.blur();
      }
      if (popup) popup.setAttribute("aria-hidden", "true");
    });
  });

  var refreshOpenPreview = function () {
    wraps.forEach(function (wrap) {
      if (wrap.matches(":hover") || wrap.contains(document.activeElement)) place(wrap);
    });
  };
  window.addEventListener("resize", refreshOpenPreview, { passive: true });
  window.addEventListener("scroll", refreshOpenPreview, { passive: true });
})();

const translations = {
  bg: {
    "nav.story": "За нас",
    "nav.selection": "Селекция",
    "nav.products": "Продукти",
    "nav.services": "Услуги",
    "nav.visit": "Посетете ни",
    "nav.contacts": "Контакти",
    "hero.eyebrow": "Специализирана пекарна за Еклери",
    "hero.title": "Еклери по оригинална рецепта.",
    "hero.copy": "Място, в което фокусът е един: различни видове еклери по оригинална рецепта, приготвени на място с истински съставки, неустоим крем и фина глазура.",
    "hero.primary": "Посетете ни",
    "hero.secondary": "Запознайте се с нас",
    "hero.panelLabel": "Отворено",
    "hero.panelHours": "Пон.-Пет. 6:00-16:30",
    "hero.panelSub": "Събота 6:00-14:00",
    "strip.one": "Оригинална рецепта",
    "strip.two": "Еклери всеки ден",
    "strip.three": "Еклери с активен въглен",
    "strip.four": "Еклери по поръчка",
    "story.eyebrow": "Кои сме ние",
    "story.title": "Всичко започна с една мечта.",
    "story.copy": "Всичко започна с една мечта – да живеем край морето. Дълго време се чудехме къде да пуснем котва. Царево ни намигаше със спокойствието си, Бургас ни изкушаваше с атмосферата си, но накрая сърцето ни избра Варна – достатъчно близо до родния ни Русе и достатъчно голяма, за да сбъднем една стара мечта.",
    "story.copy2": "А каква е тя? Да правим това, което умеем най-добре – истински еклери!",
    "story.copy3": "След 15 години опит в създаването на еклери, безброй часове в кухнята, много усмивки и още повече щастливи хора, решихме, че е време да донесем тази сладка страст и на морето.",
    "story.copy4": "Вярваме, че един хубав еклер не е просто десерт. Той е малък повод да се усмихнеш, да отпразнуваш деня или просто да си подариш няколко сладки минути щастие.",
    "story.copy5": "Така започна нашето ново приключение във Варна – с много смелост, щипка вълнение, аромат на прясно изпечени кори, пухкав крем и огромно желание да ви покажем какъв е вкусът на истинския еклер.",
    "story.copy6": "Добре дошли в нашия сладък свят! Заповядайте да опитате история, създавана с любов – хапка по хапка.",
    "selection.eyebrow": "Селекция",
    "selection.title": "Витрина с ритъм, блясък и аромат.",
    "products.signature.kicker": "Само по поръчка",
    "products.signature.title": "Еклерово Руло",
    "products.signature.copy": "Специално произведение, което приготвяме само по поръчка - нежен крем, фина глазура и характерният почерк на Еклерия.",
    "products.case.kicker": "Всеки ден",
    "products.case.title": "Нашите еклерови произведения",
    "products.case.copy": "Карамел, шам фъстък, бял шоколад и тъмен шоколад - вкусове с ясна рецепта и ежедневна свежест.",
    "products.charcoal.kicker": "Единствен по рода си",
    "products.charcoal.title": "Еклер с активен въглен",
    "products.charcoal.copy": "Разпознаваем специалитет на Еклерия - смел вкус, драматичен цвят и витрина, която се помни.",
    "productsSection.eyebrow": "Продукти",
    "productsSection.title": "Еклери, които остават в паметта.",
    "productsSection.copy": "В началото на Варна, на ул. \"Под Игото\" 58, Еклерия превръща десерта в малък ритуал: истински съставки, неустоим крем, фина глазура и свежест, която се усеща още от първата хапка.",
    "caramel.number": "Продукт 01",
    "product.pistachio.number": "Продукт 02",
    "product.white.number": "Продукт 03",
    "product.dark.number": "Продукт 04",
    "product.charcoal.number": "Продукт 05",
    "caramel.title": "Карамел",
    "caramel.copy": "Еклер с копринен крем и лъскава карамелена глазура, която се стича бавно и оставя дълбок, топъл послевкус. Свеж, лек и изкушаващо балансиран.",
    "caramel.note1": "Приготвен на място",
    "caramel.note2": "Истински съставки",
    "caramel.note3": "Фин карамелен завършек",
    "productCats.eclairs": "Еклери",
    "productCats.order": "Поръчкови",
    "productCats.other": "Друго",
    "product.roll.number": "Продукт 06",
    "roll.title": "Еклерово руло",
    "roll.copy": "Руло с пухкаво тесто и нежен крем, завършено със заливка по ваш избор, което се предлага по предварително направена поръчка.",
    "roll.glaze1": "Карамел",
    "roll.glaze2": "Черен ганаш",
    "roll.glaze3": "Бял ганаш",
    "roll.glaze4": "Пистачио",
    "roll.glaze5": "Млечен шоколад",
    "flavor.pistachio.title": "Шам фъстък",
    "flavor.pistachio.copy": "Еклер с изразителна глазура от шам фъстък, фин ядков характер и свеж крем, който балансира сладостта с елегантна плътност.",
    "flavor.white.title": "Бял шоколад",
    "flavor.white.copy": "Нежен еклер с копринена глазура от бял шоколад, мек крем и светъл, чист финал.",
    "flavor.dark.title": "Тъмен шоколад",
    "flavor.dark.copy": "По-дълбок шоколадов профил с лъскава глазура, наситен вкус и елегантен какаов финал.",
    "flavor.liquid.title": "Течен шоколад",
    "flavor.liquid.copy": "Богат, мек и изразително шоколадов.",
    "flavor.charcoal.title": "Активен въглен",
    "flavor.charcoal.copy": "Специалитетът на Еклерия: еклер с активен въглен, контрастен крем и драматична визия, създадена да се помни.",
    "otherProducts.kicker": "Друго",
    "otherProducts.copy": "Закуски и сезонни предложения присъстват като допълнение към основния фокус на Еклерия: еклерите.",
    "atelier.eyebrow": "В ателието",
    "atelier.title": "Кадрите са част от вкуса.",
    "atelier.copy": "Три кратки кадъра от ателието: кремът, глазурата и финалният детайл. Всичко се приготвя на място - внимателно, чисто и с характер.",
    "gallery.eyebrow": "Галерия",
    "gallery.title": "Гланц, крем и характер.",
    "services.eyebrow": "Услуги",
    "services.title": "От витрината до вашата трапеза.",
    "services.intro": "Искате да опитате от нашите изкусителни произведения или да обсъдим възможност за партньорство? Не се колебайте да ни посетите или да се свържете с нас.",
    "services.one.title": "Кетъринг услуги",
    "services.one.copy": "Поръчайте от нашите сладки произведения за вашия специален повод.",
    "services.two.title": "Доставка до адрес",
    "services.two.copy": "Доставяме пресни еклери до дома или на посочен от вас адрес във Варна - бързо, грижливо опаковани и уточнени директно с екипа.",
    "services.three.title": "Зареждане на магазини и HoReCa",
    "services.three.copy": "Зареждаме магазини, кафетерии и сладкарници с печива и десерти за партньори, които търсят постоянство и разпознаваем вкус.",
    "visit.eyebrow": "Посетете ни",
    "visit.title": "гр. Варна, ул. Под Игото 58",
    "visit.titleLine1": "гр. Варна, ул.",
    "visit.titleLine2": "Под Игото 58",
    "visit.map": "Виж на картата",
    "review.title": "Оценете ни в Google",
    "review.copy": "Вашата обратна връзка е ценна за нас. Ще се радваме да ни оцените.",
    "visit.copy": "Заповядайте за пресни еклери по оригинална рецепта, закуски и поръчки за специални поводи.",
    "hours.title": "Работно време",
    "hours.weekdays": "Понеделник - Петък",
    "hours.saturday": "Събота",
    "hours.sunday": "Неделя",
    "hours.closed": "Почивен ден",
    "contact.title": "Форми за контакт",
    "footer.note": "Специализирана пекарна за еклери във Варна.",
    "footer.copyright": "© 2026 Пекарна Еклерия. Специализирана пекарна за еклери във Варна. Всички права запазени."
  },
  en: {
    "nav.story": "About us",
    "nav.selection": "Selection",
    "nav.products": "Products",
    "nav.services": "Services",
    "nav.visit": "Visit",
    "nav.contacts": "Contacts",
    "hero.eyebrow": "Specialized eclair bakery",
    "hero.title": "Original-recipe eclairs.",
    "hero.copy": "A place with one clear focus: different kinds of original-recipe eclairs, prepared on site with real ingredients, irresistible cream and fine glaze.",
    "hero.primary": "Visit us",
    "hero.secondary": "Meet the bakery",
    "hero.panelLabel": "Open",
    "hero.panelHours": "Mon-Fri 6:00-16:30",
    "hero.panelSub": "Saturday 6:00-14:00",
    "strip.one": "Original recipe",
    "strip.two": "Fresh eclairs daily",
    "strip.three": "Activated charcoal eclairs",
    "strip.four": "Eclairs to order",
    "story.eyebrow": "Who we are",
    "story.title": "It all started with a dream.",
    "story.copy": "It all started with a dream – to live by the sea. For a long time we wondered where to drop anchor. Tsarevo winked at us with its calm, Burgas tempted us with its atmosphere, but in the end our hearts chose Varna – close enough to our home town of Ruse and big enough to make an old dream come true.",
    "story.copy2": "And what is that dream? To do what we do best – real eclairs!",
    "story.copy3": "After 15 years of experience making eclairs, countless hours in the kitchen, many smiles and even more happy people, we decided it was time to bring this sweet passion to the seaside as well.",
    "story.copy4": "We believe a good eclair is not just a dessert. It is a small reason to smile, to celebrate the day, or simply to treat yourself to a few sweet minutes of happiness.",
    "story.copy5": "That's how our new adventure in Varna began – with plenty of courage, a pinch of excitement, the aroma of freshly baked shells, airy cream and a huge desire to show you the taste of a real eclair.",
    "story.copy6": "Welcome to our sweet world! Come and taste a story crafted with love – bite by bite.",
    "selection.eyebrow": "Selection",
    "selection.title": "A display with rhythm, gloss and aroma.",
    "products.signature.kicker": "By order only",
    "products.signature.title": "Eclair Roll",
    "products.signature.copy": "A special creation we make strictly to order - delicate cream, fine glaze and Ekleria's signature touch.",
    "products.case.kicker": "Daily",
    "products.case.title": "Our eclair creations",
    "products.case.copy": "Caramel, pistachio, white chocolate and dark chocolate - flavors with a clear recipe and daily freshness.",
    "products.charcoal.kicker": "One of a kind",
    "products.charcoal.title": "Activated charcoal eclair",
    "products.charcoal.copy": "A recognizable Ekleria specialty - bold taste, dramatic color and a display that stays in memory.",
    "productsSection.eyebrow": "Products",
    "productsSection.title": "Eclairs made to be remembered.",
    "productsSection.copy": "At 58 Pod Igoto Street in Varna, Ekleria turns dessert into a small ritual: real ingredients, irresistible cream, fine glaze and freshness you can feel from the first bite.",
    "caramel.number": "Product 01",
    "product.pistachio.number": "Product 02",
    "product.white.number": "Product 03",
    "product.dark.number": "Product 04",
    "product.charcoal.number": "Product 05",
    "caramel.title": "Caramel",
    "caramel.copy": "An eclair with silky cream and glossy caramel glaze that drips slowly and leaves a warm, deep finish. Fresh, light and temptingly balanced.",
    "caramel.note1": "Prepared on site",
    "caramel.note2": "Real ingredients",
    "caramel.note3": "Fine caramel finish",
    "productCats.eclairs": "Eclairs",
    "productCats.order": "Made to order",
    "productCats.other": "Other",
    "product.roll.number": "Product 06",
    "roll.title": "Eclair Roll",
    "roll.copy": "A roll with airy pastry and delicate cream, finished with a glaze of your choice, available by advance order.",
    "roll.glaze1": "Caramel",
    "roll.glaze2": "Dark ganache",
    "roll.glaze3": "White ganache",
    "roll.glaze4": "Pistachio",
    "roll.glaze5": "Milk chocolate",
    "flavor.pistachio.title": "Pistachio",
    "flavor.pistachio.copy": "An eclair with expressive pistachio glaze, a fine nutty character and fresh cream that balances sweetness with elegant depth.",
    "flavor.white.title": "White chocolate",
    "flavor.white.copy": "A delicate eclair with silky white chocolate glaze, soft cream and a clean, light finish.",
    "flavor.dark.title": "Dark chocolate",
    "flavor.dark.copy": "A deeper chocolate profile with glossy glaze, rich flavor and an elegant cocoa finish.",
    "flavor.liquid.title": "Liquid chocolate",
    "flavor.liquid.copy": "Rich, soft and distinctly chocolate-forward.",
    "flavor.charcoal.title": "Activated charcoal",
    "flavor.charcoal.copy": "Ekleria's specialty: an activated charcoal eclair with contrasting cream and a dramatic look made to be remembered.",
    "otherProducts.kicker": "Other",
    "otherProducts.copy": "Breakfast pastries and seasonal items appear as an addition to Ekleria's main focus: eclairs.",
    "atelier.eyebrow": "In the atelier",
    "atelier.title": "The footage is part of the flavor.",
    "atelier.copy": "Three short glimpses from the atelier: cream, glaze and the final detail. Everything is prepared on site - carefully, cleanly and with character.",
    "gallery.eyebrow": "Gallery",
    "gallery.title": "Gloss, cream and character.",
    "services.eyebrow": "Services",
    "services.title": "From our display to your table.",
    "services.intro": "Would you like to try our tempting creations or discuss a partnership? Don't hesitate to visit us or get in touch.",
    "services.one.title": "Catering services",
    "services.one.copy": "Order from our sweet creations for your special occasion.",
    "services.two.title": "Delivery to your address",
    "services.two.copy": "We deliver fresh eclairs to your home or any address in Varna - quick, carefully packed and arranged directly with the team.",
    "services.three.title": "Retail and HoReCa supply",
    "services.three.copy": "We supply shops, cafes and patisseries with bakes and desserts for partners looking for consistency and a recognizable flavor.",
    "visit.eyebrow": "Visit us",
    "visit.title": "Varna, 58 Pod Igoto St.",
    "visit.titleLine1": "Varna,",
    "visit.titleLine2": "58 Pod Igoto St.",
    "visit.map": "View on the map",
    "review.title": "Rate us on Google",
    "review.copy": "Your feedback matters to us. We'd love your rating.",
    "visit.copy": "Visit us for fresh original-recipe eclairs, pastries and orders for special occasions.",
    "hours.title": "Opening hours",
    "hours.weekdays": "Monday - Friday",
    "hours.saturday": "Saturday",
    "hours.sunday": "Sunday",
    "hours.closed": "Day off",
    "contact.title": "Contact options",
    "footer.note": "Specialized eclair bakery in Varna.",
    "footer.copyright": "© 2026 Bakery Ekleria. Specialized eclair bakery in Varna. All rights reserved."
  }
};

// Default to Bulgarian unless the visitor has explicitly chosen a language before.
let currentLanguage = localStorage.getItem("ekleria-language") || "bg";

// --- hero intro line: a fast, fluid glyph reveal with stable word wrapping ---
const heroCopyEl = document.querySelector(".hero-copy");
const reduceMotionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
let heroCopyTimers = [];
let heroCopyRun = 0;

// The Google face is stylesheet-defined but its binary may still be in flight
// during the first paint. Resolve only when Montserrat is usable; after the
// timeout, pin this line to the fallback so it cannot swap underneath the user.
const heroCopyFontReady = document.fonts && document.fonts.load
  ? Promise.race([
      document.fonts.load('600 18px "Montserrat"')
        .then((faces) => faces.length > 0)
        .catch(() => false),
      new Promise((resolve) => setTimeout(() => resolve(false), 2500))
    ])
  : Promise.resolve(false);

function writeOnHeroCopy(text) {
  const el = heroCopyEl;
  if (!el || !text) return;

  heroCopyTimers.forEach(clearTimeout);
  heroCopyTimers = [];
  const run = ++heroCopyRun;

  el.classList.add("is-font-pending");
  heroCopyFontReady.then((fontLoaded) => {
    if (run !== heroCopyRun) return;
    el.classList.toggle("font-fallback", !fontLoaded);
    el.classList.remove("is-font-pending");
    renderHeroCopy(text, run);
  });
}

function renderHeroCopy(text, run) {
  const el = heroCopyEl;
  if (!el || run !== heroCopyRun) return;

  // reduced motion (or no support): just show the full line
  if (reduceMotionMQ.matches) {
    el.classList.remove("is-queued", "is-writing");
    el.textContent = text;
    return;
  }

  el.classList.remove("is-writing");
  el.textContent = "";
  el.setAttribute("aria-label", text); // screen readers get the whole line at once

  // Each word stays as one wrapping unit, while its glyphs flow in rapidly.
  // This keeps Safari line wrapping stable without the old word-by-word jumps.
  const words = text.split(" ");
  let glyphIndex = 0;
  words.forEach((word, i) => {
    const wordSpan = document.createElement("span");
    wordSpan.className = "tw-word";
    Array.from(word).forEach((glyph) => {
      const glyphSpan = document.createElement("span");
      glyphSpan.className = "tw-char";
      glyphSpan.textContent = glyph;
      glyphSpan.style.setProperty("--tw-index", glyphIndex++);
      wordSpan.appendChild(glyphSpan);
    });
    el.appendChild(wordSpan);
    if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
  });

  // Keep the glyphs queued until the interface has painted. Starting the
  // sequence during initial parsing made it finish behind the loading frame.
  el.classList.add("is-queued");
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (run !== heroCopyRun) return;
    const startTimer = setTimeout(() => {
      if (run !== heroCopyRun) return;
      el.classList.remove("is-queued");
      el.classList.add("is-writing");
      const finishTimer = setTimeout(() => {
        if (run === heroCopyRun) el.classList.remove("is-writing");
      }, glyphIndex * 40 + 560);
      heroCopyTimers.push(finishTimer);
    }, 220);
    heroCopyTimers.push(startTimer);
  }));
}

function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  localStorage.setItem("ekleria-language", language);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = translations[language][element.dataset.i18n];
    if (value) element.textContent = value;
  });

  // replay the writing effect for the (possibly just-swapped) hero line
  writeOnHeroCopy(translations[language]["hero.copy"]);

  document.querySelectorAll(".lang").forEach((button) => {
    const isActive = button.dataset.lang === language;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (typeof buildServiceSizers === "function") buildServiceSizers();
  if (typeof renderService === "function") renderService(false);
}

const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");

function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  if (menuToggle) menuToggle.setAttribute("aria-expanded", String(open));
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    setMenu(!document.body.classList.contains("menu-open"));
  });
  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) setMenu(false);
  });
}

document.querySelectorAll(".lang").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

const header = document.querySelector(".site-header");

function updateHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();

const heroVideos = {
  main: document.querySelector("[data-hero-video='main']")
};

// Responsive hero clip + resilient autoplay.
//  - phones load the vertical cut, desktops the wide one (only the matching clip is fetched)
//  - keeps trying to play through the first-load race, tab switches and
//    Low Power Mode / battery-saver (which pauses autoplay). It never gives up:
//    it retries on every readiness event, on visibility, and on the first user gesture.
const heroSources = {
  desktopHd: "assets/videos/home_video_desktop_hd.mp4",
  desktopSafe: "assets/videos/home_video_desktop.mp4",
  mobile: "assets/videos/home_video_mobile.mp4"
};

const heroMobileMQ = window.matchMedia("(max-width: 760px)");
const isSafariBrowser = /^((?!chrome|chromium|android|crios|fxios|edgios).)*safari/i.test(navigator.userAgent);
let heroDesktopFallbackActive = false;
const wantedHeroSrc = () => {
  if (heroMobileMQ.matches) return heroSources.mobile;
  return (isSafariBrowser || heroDesktopFallbackActive)
    ? heroSources.desktopSafe
    : heroSources.desktopHd;
};

function kickHeroVideo(video) {
  if (!video) return;
  // re-assert the flags every time — Low Power Mode can clear the effective muted state
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute("muted", "");
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.loop = true;
  const p = video.play();
  if (p && typeof p.catch === "function") p.catch(() => {});
}

function applyHeroSource() {
  const src = wantedHeroSrc();
  Object.values(heroVideos).forEach((video) => {
    if (!video) return;
    const cur = video.currentSrc || video.getAttribute("src") || "";
    if (!cur.endsWith(src)) {
      video.setAttribute("src", src);
      video.load();
    }
    kickHeroVideo(video);
  });
}

if (heroVideos.main) {
  const mainVideo = heroVideos.main;

  // A partial deployment must not leave Chrome frozen on the poster. If the
  // preferred HD file is missing or cannot be decoded, switch once to the
  // widely compatible desktop file that is also declared in the HTML.
  mainVideo.addEventListener("error", () => {
    const failedSrc = mainVideo.currentSrc || mainVideo.getAttribute("src") || "";
    if (heroMobileMQ.matches || heroDesktopFallbackActive || !failedSrc.includes("home_video_desktop_hd.mp4")) return;
    heroDesktopFallbackActive = true;
    applyHeroSource();
  });

  applyHeroSource();

  // retry playback on every readiness milestone — this is what fixes the
  // "black frame until you refresh" first-load race.
  ["loadedmetadata", "loadeddata", "canplay", "canplaythrough", "stalled", "suspend"].forEach((ev) =>
    mainVideo.addEventListener(ev, () => kickHeroVideo(mainVideo))
  );

  // if the system pauses it (Low Power Mode / under-20% battery saver), nudge it back
  mainVideo.addEventListener("pause", () => {
    if (!document.hidden && !mainVideo.ended) {
      setTimeout(() => { if (!document.hidden && mainVideo.paused) kickHeroVideo(mainVideo); }, 250);
    }
  });

  // resume when the tab becomes visible again
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) Object.values(heroVideos).forEach(kickHeroVideo);
  });

  // battery-saver / autoplay-blocked browsers only permit playback after a user gesture —
  // resume on the very first interaction of any kind
  const resumeOnGesture = () => Object.values(heroVideos).forEach(kickHeroVideo);
  ["pointerdown", "touchstart", "click", "keydown", "scroll"].forEach((ev) =>
    window.addEventListener(ev, resumeOnGesture, { passive: true })
  );

  // keep the two device cuts in sync when crossing the phone/desktop breakpoint
  if (heroMobileMQ.addEventListener) heroMobileMQ.addEventListener("change", applyHeroSource);
  else if (heroMobileMQ.addListener) heroMobileMQ.addListener(applyHeroSource);

  // one more attempt after full load
  window.addEventListener("load", () => kickHeroVideo(mainVideo));

  // short watchdog: if it still hasn't started shortly after load, keep trying for a few seconds
  let kicks = 0;
  const heroWatchdog = setInterval(() => {
    kicks += 1;
    if (mainVideo.paused && !document.hidden) kickHeroVideo(mainVideo);
    if ((!mainVideo.paused && mainVideo.currentTime > 0) || kicks > 14) clearInterval(heroWatchdog);
  }, 700);
}

// Play each video only while it is on screen. This keeps the number of
// simultaneously decoding videos low, which is what iOS Safari needs - otherwise
// a heavier clip (e.g. the full-HD atelier video) can stay on a black frame.
if ("IntersectionObserver" in window) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.muted = true;
        const playback = video.play();
        if (playback && playback.catch) playback.catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll("video").forEach((video) => videoObserver.observe(video));
}

const productStage = document.querySelector("[data-product-stage]");
const productTrack = document.querySelector("[data-product-track]");
const productProgress = document.querySelector("[data-product-progress]");
const productCount = document.querySelector("[data-product-count]");
let productSlides = productTrack ? Array.from(productTrack.children) : [];
let productMaxTranslate = 0;
let productTicking = false;

function refreshProductStageMetrics() {
  if (!productTrack) return;
  productSlides = Array.from(productTrack.children);
  productMaxTranslate = Math.max(productTrack.scrollWidth - productTrack.clientWidth, 0);
}

function updateProductStage() {
  if (!productStage || !productTrack) return;

  const viewportWidth = window.innerWidth;

  if (viewportWidth <= 980) {
    productTrack.style.transform = "translate3d(0, 0, 0)";
    if (productProgress) productProgress.style.width = "100%";
    if (productCount) productCount.textContent = `01 / ${String(productSlides.length).padStart(2, "0")}`;
    return;
  }

  const stageRect = productStage.getBoundingClientRect();
  const scrollable = productStage.offsetHeight - window.innerHeight;
  const rawProgress = Math.min(Math.max(-stageRect.top / Math.max(scrollable, 1), 0), 1);
  productTrack.style.transform = `translate3d(${-productMaxTranslate * rawProgress}px, 0, 0)`;

  // only touch the DOM text/width when the active slide actually changes
  const activeIndex = Math.min(productSlides.length - 1, Math.floor(rawProgress * productSlides.length));
  if (activeIndex !== updateProductStage._last) {
    updateProductStage._last = activeIndex;
    if (productProgress) productProgress.style.width = `${(activeIndex / Math.max(productSlides.length - 1, 1)) * 100}%`;
    if (productCount) productCount.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(productSlides.length).padStart(2, "0")}`;
    // let only the on-screen slide run its (heavy) levitate/beam animations
    for (var i = 0; i < productSlides.length; i++) {
      productSlides[i].classList.toggle("is-active", i === activeIndex);
    }
  }
}

function requestProductStageUpdate() {
  if (productTicking) return;
  productTicking = true;
  requestAnimationFrame(() => {
    updateProductStage();
    productTicking = false;
  });
}

window.addEventListener("scroll", requestProductStageUpdate, { passive: true });
window.addEventListener("resize", () => {
  refreshProductStageMetrics();
  updateProductStage();
});
refreshProductStageMetrics();
updateProductStage();

document.querySelectorAll("[data-product-target]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!productStage || !productTrack) return;

    event.preventDefault();

    const targetIndex = Math.min(Math.max(Number(link.dataset.productTarget) || 0, 0), productSlides.length - 1);

    if (window.innerWidth <= 980) {
      productSlides[targetIndex]?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const scrollable = productStage.offsetHeight - window.innerHeight;
    const progress = productSlides.length <= 1 ? 0 : targetIndex / (productSlides.length - 1);
    const targetTop = productStage.getBoundingClientRect().top + window.scrollY + (scrollable * progress);
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  });
});

const heroServices = {
  bg: [
    "Поръчайте еклери за дома",
    "Зареждаме магазини, сладкарници и кафетерии",
    "Производство на еклери по поръчка",
    "Не се колебайте да се свържете с нас"
  ],
  en: [
    "Order eclairs for home",
    "We supply shops, patisseries and cafés",
    "Custom eclair production to order",
    "Don't hesitate to contact us"
  ]
};

const servicesTrack = document.querySelector("[data-services-rotator]");
let servicesIndex = 0;

// Hidden copies of every phrase keep the pill at the width of the longest one,
// so it never changes size while the texts rotate.
function buildServiceSizers() {
  if (!servicesTrack) return;
  servicesTrack.querySelectorAll(".hero-services-sizer").forEach((el) => el.remove());
  const list = heroServices[currentLanguage] || heroServices.bg;
  list.forEach((phrase) => {
    const sizer = document.createElement("span");
    sizer.className = "hero-services-text hero-services-sizer";
    sizer.setAttribute("aria-hidden", "true");
    sizer.textContent = phrase;
    servicesTrack.appendChild(sizer);
  });
}

function renderService(animate) {
  if (!servicesTrack) return;
  const list = heroServices[currentLanguage] || heroServices.bg;
  const text = servicesTrack.querySelector(".hero-services-text:not(.hero-services-sizer)");
  if (!text) return;
  const next = list[servicesIndex % list.length];
  if (!animate) {
    text.textContent = next;
    return;
  }
  text.classList.add("is-out");
  setTimeout(() => {
    text.textContent = next;
    text.classList.remove("is-out");
    text.classList.add("is-in");
    requestAnimationFrame(() => requestAnimationFrame(() => text.classList.remove("is-in")));
  }, 450);
}

if (servicesTrack) {
  setInterval(() => {
    servicesIndex = (servicesIndex + 1) % heroServices.bg.length;
    renderService(true);
  }, 2800);
}

setLanguage(currentLanguage);
buildServiceSizers();
renderService(false);

// "Посетете ни" scrolls to the contacts and briefly highlights the phone.
document.querySelectorAll("[data-contact-cta]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const phone = document.querySelector('.contact-grid a[href^="tel"]');
    if (!phone) return;
    setTimeout(() => {
      phone.classList.add("is-highlighted");
      setTimeout(() => phone.classList.remove("is-highlighted"), 2600);
    }, 700);
  });
});

// Atelier: single player that plays the clips one after another (0 → 1 → 2 → 3 → loop).
document.querySelectorAll(".visit-review-qr").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.stopPropagation();
  });
});

const atelierPlayer = document.querySelector("[data-atelier-player]");
const atelierPlaylist = [
  "assets/videos/atelier-1.mp4",
  "assets/videos/aterlier-0.mp4",
  "assets/videos/atelier-3.mp4",
  "assets/videos/atelier-2.mp4",
];
let atelierIndex = 0;

if (atelierPlayer) {
  atelierPlayer.src = atelierPlaylist[0];
  const atCount = document.querySelector("[data-atelier-count]");
  const atPP = document.querySelector("[data-atelier-playpause]");

  function atLoad(index) {
    atelierIndex = (index + atelierPlaylist.length) % atelierPlaylist.length;
    atelierPlayer.src = atelierPlaylist[atelierIndex];
    atelierPlayer.load();
    atelierPlayer.play().catch(() => {});
    if (atCount) atCount.textContent = `${atelierIndex + 1} / ${atelierPlaylist.length}`;
  }

  atelierPlayer.addEventListener("ended", () => atLoad(atelierIndex + 1));
  const atNext = document.querySelector("[data-atelier-next]");
  const atPrev = document.querySelector("[data-atelier-prev]");
  if (atNext) atNext.addEventListener("click", () => atLoad(atelierIndex + 1));
  if (atPrev) atPrev.addEventListener("click", () => atLoad(atelierIndex - 1));
  if (atPP) {
    atPP.addEventListener("click", () => {
      if (atelierPlayer.paused) atelierPlayer.play().catch(() => {});
      else atelierPlayer.pause();
    });
  }
  // tap/click the video itself toggles play/pause (main control on touch devices)
  atelierPlayer.addEventListener("click", () => {
    if (atelierPlayer.paused) atelierPlayer.play().catch(() => {});
    else atelierPlayer.pause();
  });
  atelierPlayer.addEventListener("play", () => atPP && atPP.classList.remove("paused"));
  atelierPlayer.addEventListener("pause", () => atPP && atPP.classList.add("paused"));

  if (atCount) atCount.textContent = `1 / ${atelierPlaylist.length}`;
}

/* ============================================================
   Scroll reveal — sections & cards float up into view like a
   buoy settling on a wave. Progressive enhancement: if this
   never runs, CSS keeps everything visible.
   ============================================================ */
(function initScrollReveal() {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  function run() {
    var groups = [
      ".hero-content > *",
      ".section-heading > *",
      ".section-copy > *",
      ".products-intro > *",
      ".product-categories a",
      ".product",
      ".product-detail",
      ".product-flavors article",
      ".service-list article",
      ".visit-card",
      ".visit-aside > *",
      ".video-player",
      ".products-overview"
    ];
    var nodes = [];
    groups.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (!el.hasAttribute("data-reveal")) nodes.push(el);
      });
    });
    if (!nodes.length) return;

    document.documentElement.classList.add("js-reveal");

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // small stagger among siblings for a "spilling" cascade
        var sibs = Array.prototype.slice.call(el.parentNode ? el.parentNode.children : []);
        var idx = Math.max(0, sibs.indexOf(el));
        el.style.setProperty("--reveal-delay", Math.min(idx * 80, 320) + "ms");
        el.classList.add("is-visible");
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    nodes.forEach(function (el) {
      el.setAttribute("data-reveal", "");
      // anything already on screen at load reveals immediately (no flash)
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
        el.classList.add("is-visible");
      } else {
        io.observe(el);
      }
    });

    // safety net: if the observer never fires (broken/unsupported edge cases),
    // reveal anything still hidden after a while so content can't get stuck
    setTimeout(function () {
      document.querySelectorAll("[data-reveal]:not(.is-visible)").forEach(function (el) {
        el.classList.add("is-visible");
      });
    }, 15000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();

/* ============================================================
   Extra flair — scroll-progress bar + magnetic buttons.
   Pure enhancement; guarded so nothing breaks if unsupported.
   ============================================================ */
(function initFlair() {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function run() {
    // --- scroll progress bar ---
    if (!reduce) {
      var bar = document.createElement("div");
      bar.className = "scroll-progress";
      document.body.appendChild(bar);
      var ticking = false;
      function update() {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        var p = max > 0 ? h.scrollTop / max : 0;
        bar.style.transform = "scaleX(" + p.toFixed(4) + ")";
        ticking = false;
      }
      window.addEventListener("scroll", function () {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      }, { passive: true });
      window.addEventListener("resize", update, { passive: true });
      update();
    }

    // --- magnetic buttons + language pills (fine-pointer only) ---
    var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (fine && !reduce) {
      var magnets = document.querySelectorAll(".button, .lang, .menu-toggle");
      magnets.forEach(function (el) {
        el.style.transition = (el.style.transition ? el.style.transition + "," : "") + " transform .25s cubic-bezier(.22,1,.36,1)";
        el.addEventListener("pointermove", function (e) {
          var r = el.getBoundingClientRect();
          var mx = e.clientX - (r.left + r.width / 2);
          var my = e.clientY - (r.top + r.height / 2);
          el.style.transform = "translate(" + (mx * 0.18).toFixed(1) + "px," + (my * 0.28).toFixed(1) + "px)";
        });
        el.addEventListener("pointerleave", function () {
          el.style.transform = "";
        });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();

/* ============================================================
   Sequential ingredient highlight — each listed item lights up
   one at a time, first → last, on a loop (no two active at once).
   Applies to every eclair slide that has a list (Карамел, Руло, …).
   ============================================================ */
(function initIngredientSweep() {
  function run() {
    var lists = document.querySelectorAll(".product-slide-copy ul");
    if (!lists.length) return;

    lists.forEach(function (ul) {
      var items = Array.prototype.slice.call(ul.querySelectorAll("li"));
      if (!items.length) return;

      var i = 0;
      function step() {
        items.forEach(function (li) { li.classList.remove("is-marked"); });
        items[i % items.length].classList.add("is-marked");
        i++;
      }
      step(); // start on the first item
      setInterval(step, 2000);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();

/* ============================================================
   EXPERIMENT — trio eclairs: show each eclair x3 on the podium
   (roll is excluded via .roll-render). Remove this block + the
   matching CSS "EXPERIMENT" layer to revert.
   ============================================================ */
(function initTrioEclairs() {
  function run() {
    var pedestals = document.querySelectorAll(".eclair-pedestal.boutique-render:not(.roll-render)");
    pedestals.forEach(function (fig) {
      if (fig.classList.contains("trio")) return;
      var img = fig.querySelector("img");
      if (!img) return;
      for (var k = 0; k < 2; k++) {
        var clone = img.cloneNode(true);
        clone.removeAttribute("loading");
        clone.setAttribute("aria-hidden", "true");
        fig.appendChild(clone);
      }
      fig.classList.add("trio");
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();

/* ============================================================
   Auto-hide the header on scroll down, reveal on scroll up.
   ============================================================ */
(function initHeaderAutohide() {
  var header = document.querySelector(".site-header");
  if (!header) return;
  var lastY = window.scrollY;
  var ticking = false;
  var introDismissed = window.scrollY > 1;
  var wheelGestureLocked = false;
  var wheelGestureTimer = 0;
  var wheelIntent = "";
  var wheelIntentUntil = 0;
  var touchY = null;
  var touchIntent = "";
  var touchIntentUntil = 0;
  // After a menu/anchor link is tapped the page auto-scrolls; keep the header
  // visible through that ride and only resume hiding once the user moves again.
  var suppress = false;
  document.addEventListener("click", function (event) {
    var link = event.target && event.target.closest && event.target.closest('a[href^="#"]');
    if (link) {
      suppress = true;
      header.classList.remove("header-hidden");
    }
  }, true);
  ["touchmove", "keydown"].forEach(function (ev) {
    window.addEventListener(ev, function () { suppress = false; }, { passive: true });
  });

  /* Mobile Safari/Chrome can batch small scroll deltas, so the generic
     five-pixel threshold sometimes misses the first reverse swipe. Read the
     finger direction directly and reveal the header on that first upward
     intent, before momentum scrolling has finished. */
  window.addEventListener("touchstart", function (event) {
    if (window.innerWidth > 980 || !event.touches.length) return;
    touchY = event.touches[0].clientY;
    suppress = false;
  }, { passive: true });

  window.addEventListener("touchmove", function (event) {
    if (window.innerWidth > 980 || touchY === null || !event.touches.length) return;
    var nextTouchY = event.touches[0].clientY;
    var delta = nextTouchY - touchY;
    if (Math.abs(delta) < 3) return;

    touchIntent = delta > 0 ? "up" : "down";
    touchIntentUntil = performance.now() + 260;
    if (!document.body.classList.contains("menu-open")) {
      header.classList.toggle("header-hidden", touchIntent === "down");
    }
    touchY = nextTouchY;
  }, { passive: true });

  window.addEventListener("touchend", function () { touchY = null; }, { passive: true });

  function finishIntroWheelGestureSoon() {
    window.clearTimeout(wheelGestureTimer);
    wheelGestureTimer = window.setTimeout(function () {
      wheelGestureLocked = false;
    }, 180);
  }

  /* At the very top, the first downward mouse-wheel gesture dismisses only
     the floating navigation. A fresh second gesture starts page movement. */
  window.addEventListener("wheel", function (event) {
    suppress = false;
    var headerWasHidden = header.classList.contains("header-hidden");
    if (Math.abs(event.deltaY) >= 1) {
      wheelIntent = event.deltaY > 0 ? "down" : "up";
      wheelIntentUntil = performance.now() + 260;

      if (!document.body.classList.contains("menu-open")) {
        header.classList.toggle("header-hidden", wheelIntent === "down");
      }
    }

    /* A single reverse gesture must reveal the navigation immediately. It
       must not wait for the page to accumulate several pixels of movement. */
    if (event.deltaY < 0) {
      wheelGestureLocked = false;
      header.classList.remove("header-hidden");
      return;
    }

    if (window.innerWidth <= 980 || event.deltaY <= 0) return;

    if (wheelGestureLocked) {
      event.preventDefault();
      finishIntroWheelGestureSoon();
      return;
    }

    if (window.scrollY <= 1 && !headerWasHidden) {
      event.preventDefault();
      introDismissed = true;
      wheelGestureLocked = true;
      header.classList.add("header-hidden");
      finishIntroWheelGestureSoon();
    }
  }, { passive: false });

  function update() {
    var y = Math.max(0, window.scrollY);
    if (y <= 1 && y < lastY) introDismissed = false;

    if (performance.now() < wheelIntentUntil && wheelIntent) {
      header.classList.toggle("header-hidden", wheelIntent === "down");
      lastY = y;
      ticking = false;
      return;
    }

    if (window.innerWidth <= 980 && performance.now() < touchIntentUntil && touchIntent) {
      header.classList.toggle("header-hidden", touchIntent === "down");
      lastY = y;
      ticking = false;
      return;
    }

    if (suppress || document.body.classList.contains("menu-open") || (y <= 1 && !introDismissed)) {
      header.classList.remove("header-hidden");
    } else if (y > lastY + .5) {
      header.classList.add("header-hidden");   // scrolling down
    } else if (y < lastY - .5) {
      header.classList.remove("header-hidden"); // scrolling up
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
})();
