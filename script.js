// === FUNKSJON: Laste inn HTML-delene (trygg visning uten hopp) ===
async function loadPartial(id, file, callback) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`HTTP-feil: ${response.status}`);
    const content = await response.text();

    const container = document.getElementById(id);
    if (!container) return;

    // Skjul innhold midlertidig (unngå synlig hopp)
    container.style.transition = "none";
    container.style.opacity = "0";

    // Sett inn nytt innhold
    container.innerHTML = content;

    // Hvis vi oppdaterte main, juster padding umiddelbart før vi viser innholdet
    if (id === "main") {
      // sørg for at header er ferdig rendret før måling
      requestAnimationFrame(() => {
        adjustMainPadding(false); // umiddelbar justering
        // vis main i neste animasjonsframe (gir nettleser tid til layout)
        requestAnimationFrame(() => {
          container.style.transition = ""; // gjenopprett eventuell overgang
          container.style.opacity = "1";
        });
      });
    } else {
      // for andre containere vises uten ekstra delay
      container.style.opacity = "1";
    }

    if (callback) callback(content, id);
  } catch (err) {
    console.error(`Kunne ikke laste ${file}:`, err);
  }
}

// === DROPDOWN-knappen i MAIN ===
document.addEventListener("click", (e) => {
  const toggle = e.target.closest("#toggleAbout");
  if (!toggle) return;

  const content = document.getElementById("aboutText");
  if (!content) return;

  content.classList.toggle("show");
  const icon = toggle.querySelector("i");
  if (icon) {
    icon.classList.toggle("fa-caret-up");
    icon.classList.toggle("fa-caret-down");
  }
});

// === FADE-IN PÅ MAIN ===
function showMain() {
  const main = document.querySelector("main");
  if (!main) return;
  // skjul først, så vis når padding oppdatert
  main.classList.remove("visible");
  // vent to frames for å la adjustMainPadding gjøre jobben
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      main.classList.add("visible");
    });
  });
}

// === FADE-IN FOR FOOTER ===
function showFooter() {
  const footer = document.querySelector("footer");
  if (footer) {
    footer.classList.remove("visible");
    setTimeout(() => footer.classList.add("visible"), 1800);
  }
}

// === JUSTER MAIN SIN TOPPADDING ===
function adjustMainPadding(withDelay = true) {
  const doAdjust = () => {
    const header = document.querySelector(".header-container");
    const main = document.querySelector("main");
    if (header && main) {
      const headerHeight = header.getBoundingClientRect().height + 20; // litt ekstra luft
      main.style.paddingTop = `${headerHeight}px`;
      // console.log('Adjusted main padding to', headerHeight);
    }
  };

  if (withDelay) {
    setTimeout(doAdjust, 250);
  } else {
    requestAnimationFrame(doAdjust);
  }
}

// === NAVIGASJON I HEADER ===
function setupNavigation() {
  const links = document.querySelectorAll("nav a");

  links.forEach((link) => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();

      const page = link.getAttribute("href").replace(".html", "");

      // Last inn hovedinnholdet først
      await loadPartial("main", `pages/${page}.html`, () => {
        showMain();

        // 🔹 Last spesifikk JS for enkelte sider
        if (page === "vintertrening") {
          const script = document.createElement("script");
          script.src = "assets/js/vintertrening.js";
          script.defer = true;
          document.body.appendChild(script);
        }
      });

      // Marker aktiv lenke i menyen
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      adjustMainPadding();
    });
  });
} // 👈 denne manglet tidligere

// === LOGO + HEADER-TEKST ===
function setupLogoClick() {
  const logo = document.getElementById("logo");
  const headerText = document.querySelector(".header-text");
  const clickableElements = [logo, headerText];

  clickableElements.forEach((el) => {
    if (!el) return;
    el.style.cursor = "pointer";
    el.addEventListener("click", async () => {
      await loadPartial("main", "pages/main.html", showMain);
      const links = document.querySelectorAll("nav a");
      links.forEach((l) => l.classList.remove("active"));
      adjustMainPadding();
    });
  });
}

// === KONTAKT POPUP (går tilbake til siste viste side) ===
let contactPopupLoaded = false;
let lastPageBeforeContact = "pages/main.html";

async function setupContactPopup() {
  if (contactPopupLoaded) return;
  contactPopupLoaded = true;

  try {
    const response = await fetch("pages/contact.html");
    if (!response.ok) throw new Error(`HTTP-feil: ${response.status}`);
    const html = await response.text();
    document.body.insertAdjacentHTML("beforeend", html);

    const modal = document.getElementById("contact-modal");
    const closeBtn = modal.querySelector(".close-btn");
    const contactLink = document.querySelector('a[href="contact.html"]');

    // 🔹 Åpne popup og lagre aktiv side i det øyeblikket
    if (contactLink) {
      contactLink.addEventListener("click", (e) => {
        e.preventDefault();

        // Finn nåværende aktive menylenke
        const active = document.querySelector("nav a.active");
        if (active) {
          const href = active.getAttribute("href");
          if (href && href !== "contact.html") {
            lastPageBeforeContact = `pages/${href}`;
          }
        }

        modal.classList.add("show");
      });
    }

    // 🔹 Lukk popup og last forrige side
    const closeModal = async () => {
      modal.classList.remove("show");

      setTimeout(async () => {
        await loadPartial("main", lastPageBeforeContact, showMain);

        // Marker riktig menylenke som aktiv igjen
        const links = document.querySelectorAll("nav a");
        links.forEach((l) => l.classList.remove("active"));
        const match = Array.from(links).find(
          (l) => l.getAttribute("href") === lastPageBeforeContact.split("/").pop()
        );
        if (match) match.classList.add("active");
      }, 250);
    };

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    window.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  } catch (err) {
    console.error("Klarte ikke laste kontakt-popup:", err);
  }
}

// === LAST HEADER, MAIN OG FOOTER ===
loadPartial("header", "partials/header.html", () => {
  setupNavigation();
  setupLogoClick();
  setupContactPopup();
  adjustMainPadding();
});

loadPartial("main", "pages/main.html", showMain);
loadPartial("footer", "partials/footer.html", showFooter);

// === KJØR AUTOMATISK VED LASTING OG ENDRING ===
window.addEventListener("load", adjustMainPadding);

// Debounce for resize for bedre ytelse
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => adjustMainPadding(), 150);
});
