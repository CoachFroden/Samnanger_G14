console.log("✅ main.js lastet!");

// Når alt er klart, last header + forside + footer
document.addEventListener("DOMContentLoaded", async () => {
  await loadHeader();
  await loadPage("forside"); // startside
  await loadFooter();
});

// ============================================================
// LASTER HEADER
// ============================================================
async function loadHeader() {
  const header = document.getElementById("header");
  try {
    const res = await fetch("header.html");
    header.innerHTML = await res.text();
    console.log("✅ Header lastet!");
  } catch {
    header.innerHTML = "<p style='color:red;text-align:center'>Feil ved lasting av header</p>";
  }
}

// ============================================================
// LASTER FOOTER
// ============================================================
async function loadFooter() {
  const footer = document.getElementById("footer");
  try {
    const res = await fetch("footer.html");
    footer.innerHTML = await res.text();
    console.log("✅ Footer lastet!");
  } catch {
    footer.innerHTML = "<p style='color:red;text-align:center'>Feil ved lasting av footer</p>";
  }
}

// ============================================================
// LASTER SIDE (HTML + JS-FILER) — MED RIKTIG REKKEFØLGE
// ============================================================
async function loadPage(page) {
  const main = document.getElementById("main");

  try {
    // last HTML (sikkert: hent, logg og saner før injeksjon)
    const res = await fetch(`${page}.html`);
    if (!res.ok) throw new Error(`Fant ikke ${page}.html`);

    const rawHtml = await res.text();

    // DEBUG logging for å se nøyaktig hva som blir hentet
    console.log("👉 LASTER FIL:", `${page}.html`);
    console.log("👉 HTML STARTER MED:", rawHtml.slice(0,120).replace(/\n/g,'␤'));

    // Enkel sanitær: fjern BOM, standalone '-->' og ') -->' og vårt tidligere ' <!-- etter -->'
    const safeHtml = rawHtml
      .replace(/\uFEFF/g, '')
      .replace(/<!--\s*etter\s*-->/gi, '')
      .replace(/^\s*-->\s*/m, '')
      .replace(/\)\s*-->/g, '');

    main.innerHTML = safeHtml;
    window.scrollTo(0, 0);
    console.log(`✅ Lastet ${page}.html (sanitert)`);



    // marker aktiv knapp
    highlightActive(page);


if (page === "laget") {
    await loadPageScript("laget.js");

    // Nå er HTML lastet og scriptet lastet → kjør builder
    if (typeof buildPlayerCards === "function") {
        buildPlayerCards();
    }

} else {
    // Last js-fil for andre sider
    await loadPageScript(`${page}.js`);
}



// ⭐ Kjør sidens init-funksjoner
if (page === "forside" && window.initForsidePage) {
    console.log("➡ initForsidePage()");
    initForsidePage();
}

  } catch (err) {
    console.error(err);
    main.innerHTML = `<p style="color:red;text-align:center">Feil: ${err.message}</p>`;
  }
}

// ============================================================
// LASTER ET JS-SCRIPT OG RETURNERER ET PROMISE
// Scriptet kjører først når DOM er ferdig oppdatert
// ============================================================
async function loadPageScript(src) {
  // fjern gamle scripts
  document.querySelectorAll("script[data-page-script]").forEach(s => s.remove());

  try {
    const res = await fetch(src);
    if (!res.ok) {
      console.log(`ℹ️ Ingen JS for ${src}`);
      return;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.dataset.pageScript = "true";

      // 🔑 VIKTIG: kampanalyse.js må være module
      if (src === "kampanalyse.js") {
        script.type = "module";
      }

      script.onload = () => {
        console.log(`✅ Lastet ${src}`);
        resolve();
      };

      script.onerror = () => {
        console.log(`⚠️ Feil ved lasting av ${src}`);
        reject();
      };

      document.body.appendChild(script);
    });

  } catch (err) {
    console.log(`⚠️ Kunne ikke laste ${src}`);
  }
}

// ============================================================
// MARKER AKTIV KNAPP (uten å matche feil knapper)
// ============================================================
function highlightActive(page) {
  const buttons = document.querySelectorAll("nav button");

  buttons.forEach(btn => {
    const onclickValue = btn.getAttribute("onclick");
    const isActive = onclickValue === `loadPage('${page}')`;
    btn.classList.toggle("active", isActive);
  });
}

/* Kontakt modal helpers appended by assistant */

// Kontakt modal helpers (added automatically)
function openKontaktModal() {
  const modal = document.getElementById("kontakt-modal");
  if (modal) {
    // store last focused element for accessibility
    try { window._lastFocusedElement = document.activeElement; } catch (e) {}
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
}

function closeKontaktModal() {
  const modal = document.getElementById("kontakt-modal");
  if (modal) {
    // restore focus
    try {
      const active = document.activeElement;
      if (active && modal.contains(active)) {
        if (window._lastFocusedElement && typeof window._lastFocusedElement.focus === 'function') {
          window._lastFocusedElement.focus();
          window._lastFocusedElement = null;
        } else {
          try { active.blur(); } catch (_) {}
          try { document.body.focus(); } catch (_) {}
        }
      }
    } catch(e){}
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
}

// Simple contact form handler (saves to localStorage and prevents default)
document.addEventListener('submit', function (e) {
  if (!e.target || e.target.id !== 'kontaktForm') return;
  e.preventDefault();
  const navn = (document.getElementById('kontaktNavn')||{}).value || '';
  const epost = (document.getElementById('kontaktEpost')||{}).value || '';
  const melding = (document.getElementById('kontaktMelding')||{}).value || '';
  // very simple storage - you can replace with API call later
  const messages = JSON.parse(localStorage.getItem('kontaktMessages' ) || '[]');
  messages.push({ navn, epost, melding, when: new Date().toISOString() });
  localStorage.setItem('kontaktMessages', JSON.stringify(messages));
  // user feedback
  alert('Meldingen er lagret lokalt. Takk!');
  // reset form and close modal
  e.target.reset();
  closeKontaktModal();
});

