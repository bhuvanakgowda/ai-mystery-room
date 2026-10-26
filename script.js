const cases = [
  {
    id: "01",
    title: "The Missing Heirloom",
    category: "THEFT · FAMILY ESTATE",
    difficulty: "EASY",
    symbol: "◇",
    time: "8–12 MIN",
    desc: "A priceless emerald brooch vanished during a family gathering. The doors were locked, and everyone has a story.",
    scene: "The brooch disappeared from a locked study between 7:30 PM and 8:00 PM.",
    clues: [
      ["The Open Window", "The window was open, but the dust on the sill was undisturbed."],
      ["The Tea Receipt", "A receipt shows the housekeeper collected tea at 7:42 PM."],
      ["The Torn Note", "A note reads: 'I need the brooch before the guests leave.' The handwriting resembles the nephew's."],
      ["The Family Photo", "A photo taken at 7:50 PM shows the niece wearing a scarf that could conceal a small object."]
    ],
    suspects: ["The Nephew", "The Niece", "The Housekeeper", "The Host"],
    answer: "The Nephew",
    solution: "The torn note is the strongest clue. The undisturbed dust suggests nobody entered through the window. The nephew is the intended suspect in this fictional case."
  },
  {
    id: "02",
    title: "Midnight at Platform 9",
    category: "DISAPPEARANCE · STATION",
    difficulty: "MEDIUM",
    symbol: "⌁",
    time: "12–18 MIN",
    desc: "A courier vanished before the last train. His satchel remained behind, but a crucial item is missing.",
    scene: "At 11:40 PM, a courier was seen waiting on Platform 9. At midnight, the platform was empty.",
    clues: [
      ["The Timetable", "The last train was delayed by 12 minutes."],
      ["The Station Log", "A maintenance worker entered the platform corridor at 11:48 PM and exited at 11:56 PM."],
      ["The Ticket Stub", "A ticket in the satchel is for a train departing from Platform 4."],
      ["The Witness", "A vendor remembers the courier asking about the service exit."]
    ],
    suspects: ["The Maintenance Worker", "The Vendor", "The Courier's Partner", "A Passenger"],
    answer: "The Maintenance Worker",
    solution: "The maintenance worker's access to the corridor overlaps with the disappearance window. This is the intended suspect in the fictional case."
  },
  {
    id: "03",
    title: "The Last Gallery Light",
    category: "SABOTAGE · ART GALLERY",
    difficulty: "HARD",
    symbol: "✳",
    time: "15–22 MIN",
    desc: "The gallery lights failed before a major unveiling, and a painting was damaged.",
    scene: "The gallery went dark for six minutes. When the lights returned, a painting had been cut.",
    clues: [
      ["The Security Panel", "The override was entered using a staff code assigned to the curator."],
      ["The Paint Smudge", "Blue pigment was found on a technician's glove."],
      ["The Shift Roster", "The curator left at 8:10 PM, but the outage began at 8:24 PM."],
      ["The Spare Key", "The gallery assistant signed out a cabinet key at 8:18 PM."]
    ],
    suspects: ["The Curator", "The Technician", "The Gallery Assistant", "A Visitor"],
    answer: "The Gallery Assistant",
    solution: "The assistant's key access aligns with the outage window. This is the intended suspect based on the fictional evidence."
  }
];

const grid = document.getElementById("caseGrid");
const dialog = document.getElementById("caseDialog");
const content = document.getElementById("dialogContent");
const toast = document.getElementById("toast");

let toastTimer;

function notify(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function renderCases() {
  if (!grid) return;

  grid.innerHTML = cases.map((c) => `
    <article class="card">
      <div class="visual">
        <small>CASE FILE / ${c.id}</small>
        <label>${c.difficulty}</label>
        ${c.symbol}
      </div>

      <div class="cardbody">
        <span class="category">${c.category}</span>
        <h3>${c.title}</h3>
        <p>${c.desc}</p>

        <div class="meta">
          <span>⌕ ${c.clues.length} EVIDENCE ITEMS</span>
          <span>◷ ${c.time}</span>
        </div>

        <button class="open" data-id="${c.id}">
          OPEN CASE FILE ↗
        </button>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll("[data-id]").forEach((button) => {
    button.addEventListener("click", () => {
      openCase(button.dataset.id);
    });
  });
}

function openCase(id) {
  const selectedCase = cases.find((item) => item.id === id);

  if (!selectedCase || !dialog || !content) return;

  content.innerHTML = `
    <div class="kicker">CONFIDENTIAL / CASE FILE ${selectedCase.id}</div>

    <h2>${selectedCase.title}</h2>

    <p class="dialogintro">${selectedCase.scene}</p>

    <div class="eyebrow">EVIDENCE LOG /</div>

    ${selectedCase.clues.map((clue, index) => `
      <article class="evidence">
        <b>${String(index + 1).padStart(2, "0")} / ${clue[0]}</b>
        <p>${clue[1]}</p>
      </article>
    `).join("")}

    <label class="label" for="suspect">
      YOUR CONCLUSION — WHO IS RESPONSIBLE?
    </label>

    <select id="suspect">
      <option value="">Choose a suspect...</option>
      ${selectedCase.suspects.map((suspect) => `
        <option value="${suspect}">${suspect}</option>
      `).join("")}
    </select>

    <button class="submit" id="submit">
      SUBMIT YOUR CONCLUSION
    </button>

    <div id="result"></div>
  `;

  dialog.showModal();

  document.getElementById("submit").addEventListener("click", () => {
    const guess = document.getElementById("suspect").value;
    const result = document.getElementById("result");

    if (!guess) {
      result.innerHTML = `
        <div class="result">
          Please choose a suspect before submitting.
        </div>
      `;
      return;
    }

    const isCorrect = guess === selectedCase.answer;

    result.innerHTML = `
      <div class="result">
        <b>
          ${isCorrect
            ? "CASE SOLVED — GOOD DETECTIVE WORK!"
            : "NOT QUITE — REVIEW THE EVIDENCE."}
        </b>

        <br><br>

        ${selectedCase.solution}

        <br><br>

        <b>Intended answer:</b> ${selectedCase.answer}
      </div>
    `;

    if (isCorrect) {
      notify("Case solved! Great detective work.");
    }
  });
}

const closeButton = document.getElementById("close");

if (closeButton && dialog) {
  closeButton.addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
}

const profileButton = document.getElementById("profile");

if (profileButton) {
  profileButton.addEventListener("click", () => {
    notify("Welcome, Investigator. Choose a case to begin.");
  });
}

renderCases();
