// ============================================================
//  DRILL MODAL – ISOLERT OG KONFLIKTSIKKER
// ============================================================

(function () {
    "use strict";

    // --------------------------------------------------------
    //  ØVELSESDATA  – legg inn flere senere
    // --------------------------------------------------------
    const drillData = {
        1: {
            title: "4v4 + 3 støttespillere",
            subtitle: "Spillforståelse og samhandling",

            intro:
                "Denne øvelsen handler om å utvikle pasningsspill, posisjonsforståelse og samarbeid.",

            goals: [
                "Lære å spille sammen som lag og støtte hverandre.",
                "Bedre orientering og posisjonering.",
                "Skape gode støttevinkler."
            ],

            setup: [
                "4 mot 4 spillere inne på banen.",
                "3 støttespillere som hjelper laget med ball.",
                "Bane: 25 × 20 meter.",
                "Små mål eller markeringer.",
                "Støttespillere står langs sidene."
            ],

            execution: [
                "Lag med ballen prøver å score på mål.",
                "Støttespillerne kan kun ta én berøring.",
                "Bytt roller ved balltap.",
                "Press mye, beveg deg og kommuniser tydelig."
            ],

            variations: [
                "Kun én berøring for alle spillere.",
                "Bytt støttespillere hvert 2. minutt.",
                "Begrens antall pasninger før avslutning."
            ],

            coachTips: [
                "Stå slik at du ser både ball og medspillere.",
                "Gi korte, tydelige beskjeder.",
                "Ros gode valg underveis."
            ],

            playerTips: [
                "Vær spillbar – beveg deg i riktig øyeblikk.",
                "Se deg rundt før du mottar ball.",
                "Bruk støttespillerne riktig.",
                "Kommuniser: 'Her!', 'Vend!', 'Mann på!'"
            ]
        }
    };

    // --------------------------------------------------------
    //  LISTE-HJELPER
    // --------------------------------------------------------
    function fillList(id, items) {
        const el = document.getElementById(id);
        if (!el) return;

        el.innerHTML = "";
        items.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            el.appendChild(li);
        });
    }

    // --------------------------------------------------------
    //  DROPDOWNS (Variasjoner / Trenertips)
    // --------------------------------------------------------
    function activateDropdowns() {
        document.querySelectorAll("#drillModal .dropdown-card").forEach(card => {
            card.onclick = () => {
                card.classList.toggle("open");
            };
        });
    }

    // --------------------------------------------------------
    //  ÅPNE DRILLMODAL
    // --------------------------------------------------------
    window.openDrillModal = function (id) {
        const drill = drillData[id];
        if (!drill) return;

        // Header
        document.getElementById("drillTitle").textContent = drill.title;
        document.querySelector(".drill-subtitle").textContent = drill.subtitle;

        // Intro
        document.getElementById("drillIntroText").textContent = drill.intro;

        // Cards
        fillList("drillGoals", drill.goals);
        fillList("drillSetup", drill.setup);
        fillList("drillExecution", drill.execution);

        // Dropdown-kort
        fillList("drillVariasjoner", drill.variations);
        fillList("drillTrenerTips", drill.coachTips);

        // Tips grid
        const tipsGrid = document.getElementById("drillTips");
        tipsGrid.innerHTML = "";
        drill.playerTips.forEach(tip => {
            const box = document.createElement("div");
            box.className = "tip-box";
            box.textContent = tip;
            tipsGrid.appendChild(box);
        });

        // Aktiver dropdowns etter HTML er satt inn
        activateDropdowns();

        // Vis modal
        document.getElementById("drillModal").style.display = "flex";
    };

    // --------------------------------------------------------
    //  LUKK MODAL
    // --------------------------------------------------------
    window.closeDrillModal = function () {
        document.getElementById("drillModal").style.display = "none";
    };

    // Klikk utenfor = lukk
    window.addEventListener("click", (event) => {
        const modal = document.getElementById("drillModal");
        if (event.target === modal) {
            closeDrillModal();
        }
    });

})();
