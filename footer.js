/* footer.js — robust kontakt-modal init (erstatt hele filen med dette) */

/* --- helper: vent på et element --- */
function waitForElement(selector, cb, opts = {}) {
  const timeout = opts.timeout || 4000;
  const el = document.querySelector(selector);
  if (el) return cb(el);

  const root = document.getElementById('footer') || document.body;
  let called = false;

  const mo = new MutationObserver(() => {
    const found = document.querySelector(selector);
    if (found && !called) {
      called = true;
      mo.disconnect();
      cb(found);
    }
  });

  mo.observe(root, { childList: true, subtree: true });

  setTimeout(() => {
    mo.disconnect();
    if (!called) {
      console.warn(`Timeout: Fant ikke ${selector} innen ${timeout}ms`);
    }
  }, timeout);
}

/* --- main init som kalles ved DOM loaded --- */
function initFooter() {
  // Sett år i footer hvis det finnes et element
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Vent på knapp (kan være injisert senere)
  waitForElement('#btnKontakt', () => {
    // Når knappen finnes, init kontakt-modal trygt
    initKontaktModal();
  }, { timeout: 5000 });
}

/* --- kontakt modal init --- */
function initKontaktModal() {
  // Hent elementer (kan være tilgjengelige nå)
  const btn = document.getElementById("btnKontakt");
  const modal = document.getElementById("kontakt-modal");
  if (!btn) {
    console.warn('initKontaktModal: #btnKontakt ikke funnet');
    return;
  }
  if (!modal) {
    console.warn('initKontaktModal: #kontakt-modal ikke funnet (lim inn modal HTML før </body>)');
    return;
  }

  // Unngå doble bindinger
  if (modal.dataset.bound === '1') return;
  modal.dataset.bound = '1';

  const closeBtn = document.getElementById("kontaktClose");
  const cancelBtn = document.getElementById("kontaktCancel");
  const form = document.getElementById("kontaktForm");
  const statusEl = document.getElementById("kontaktStatus");

  // Åpne modal
  window.openKontaktModal = function() {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    // sett fokus i første input om mulig
    setTimeout(() => {
      const inp = document.getElementById("kontaktNavn") || document.getElementById("kontaktEpost");
      if (inp) inp.focus();
    }, 40);
    if (statusEl) statusEl.textContent = "";
  };

  btn.addEventListener("click", function(e) {
    e.preventDefault();
    window.openKontaktModal();
  });

  // Lukk-funksjon
  function closeModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    if (form) form.reset();
    if (statusEl) statusEl.textContent = "";
  }

  // Bind lukkere (sjekk eksistens)
  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);

  // Klikk utenfor
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  // Escape
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  // EmailJS init — bytt ut med din Public Key (fra EmailJS: Account -> API Keys)
  try {
    if (typeof emailjs !== 'undefined') {
      emailjs.init('CnZ_ezfd1SXpKYA_e'); // <-- REPLACE med din Public Key
    } else {
      console.warn('emailjs ikke funnet. Husk å legge til CDN-skript før footer.js');
    }
  } catch (err) {
    console.warn('Kunne ikke init emailjs:', err);
  }

  // submit handler
  if (!form) {
    console.warn('kontaktForm ikke funnet');
    return;
  }

  // unngå multiple listeners: sett flagg på form
  if (form.dataset.subBound === '1') return;
  form.dataset.subBound = '1';

  form.addEventListener("submit", function(e){
    e.preventDefault();
    if (!statusEl) return;

    statusEl.style.color = "#eaf2ff";
    statusEl.textContent = "Sender melding...";

    const navnVal = (document.getElementById('kontaktNavn')?.value || '').trim();
    const epostVal = (document.getElementById('kontaktEpost')?.value || '').trim();
    const meldingVal = (document.getElementById('kontaktMelding')?.value || '').trim();

if (!navnVal || !meldingVal) {
    statusEl.style.color = "red";
    statusEl.textContent = "Navn og melding må fylles ut.";
    return;
}


    if (typeof emailjs === 'undefined') {
      statusEl.style.color = "red";
      statusEl.textContent = "Send mislyktes: e-post tjeneste ikke lastet.";
      return;
    }

    // SEND — bytt SERVICE_ID og TEMPLATE_ID med dine verdier fra EmailJS
    emailjs.send("service_e4rpm6c", "template_rwjhdhn", {
      navn: navnVal,
      epost: epostVal,
      melding: meldingVal
    })
    .then(() => {
      statusEl.style.color = "lightgreen";
      statusEl.textContent = "Melding sendt!";
      setTimeout(closeModal, 1200);
    })
    .catch((err) => {
      console.error('emailjs error', err);
      statusEl.style.color = "red";
      statusEl.textContent = "Noe gikk galt. Prøv igjen senere.";
    });
  });
}

/* Kjør initFooter når DOM er klar */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFooter);
} else {
  initFooter();
}
