import "./style.css";
import { categories, type Question } from "./data";
import { covers } from "./covers";
import { mountWiemLepiej } from "./wiem-lepiej";

const app = document.querySelector<HTMLDivElement>("#app")!;

// Zamienia znaki specjalne, żeby tekst z data.ts nie "psuł" HTML-a
const esc = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Pytania, które jeszcze zostały w każdej kategorii (kopia – data.ts się nie zmienia)
const remaining = new Map<string, Question[]>();
for (const c of categories) {
  remaining.set(c.id, [...c.questions]);
}
const queue = (id: string): Question[] => remaining.get(id) ?? [];

// ---------- GRACZE I PUNKTY ----------

type Player = { name: string; score: number };

const PLAYERS_KEY = "quiz-gracze"; // pod tą nazwą gracze zapisują się w przeglądarce

function loadPlayers(): Player[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(PLAYERS_KEY) ?? "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter(
      (p): p is Player => typeof p?.name === "string" && Number.isInteger(p?.score),
    );
  } catch {
    return [];
  }
}

const players: Player[] = loadPlayers();

function savePlayers(): void {
  try {
    localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
  } catch {
    // brak zapisu (np. tryb prywatny) – gracze zostaną tylko do odświeżenia strony
  }
}

// Czy formularz dodawania graczy jest schowany (to też zapamiętuje przeglądarka)
const HIDE_KEY = "quiz-schowaj-dodawanie";

function loadAddHidden(): boolean {
  try {
    return localStorage.getItem(HIDE_KEY) === "1";
  } catch {
    return false;
  }
}

let addHidden = loadAddHidden();

function saveAddHidden(): void {
  try {
    localStorage.setItem(HIDE_KEY, addHidden ? "1" : "0");
  } catch {
    // brak zapisu – ustawienie zostanie tylko do odświeżenia strony
  }
}

// Wynik jako tekst, z prawdziwym minusem: −3
const fmt = (n: number): string => (n < 0 ? "\u2212" + Math.abs(n) : String(n));

// Podpina formularz i listę graczy na stronie głównej
function setupPlayers(): void {
  const form = app.querySelector<HTMLFormElement>("#add-player")!;
  const list = app.querySelector<HTMLUListElement>("#player-list")!;

  // Rysuje całą listę graczy (po dodaniu albo usunięciu gracza)
  const draw = (): void => {
    list.innerHTML = players.length
      ? players
          .map((p, i) => {
            const n = esc(p.name);
            return `
              <li class="player" data-i="${i}">
                <span class="p-name">${n}</span>
                <span class="p-score${p.score < 0 ? " neg" : ""}">${fmt(p.score)}</span>
                <span class="p-actions">
                  <button type="button" data-act="dec" aria-label="Odejmij 1 punkt: ${n}">−1</button>
                  <button type="button" data-act="inc" aria-label="Dodaj 1 punkt: ${n}">+1</button>
                  <button type="button" data-act="remove" aria-label="Usuń gracza ${n}">✕</button>
                </span>
              </li>`;
          })
          .join("")
      : `<li class="no-players">Nie ma jeszcze graczy.</li>`;
  };

  // Zmienia wynik gracza o liczbę całkowitą (może być ujemna)
  const change = (i: number, row: HTMLElement, delta: number): void => {
    const p = players[i];
    if (!p) return;
    p.score += delta;
    savePlayers();
    const el = row.querySelector<HTMLElement>(".p-score")!;
    el.textContent = fmt(p.score);
    el.classList.toggle("neg", p.score < 0);
  };

  draw();

  // Pokazywanie i chowanie formularza dodawania graczy
  const toggle = app.querySelector<HTMLButtonElement>("#toggle-add")!;
  const showForm = (show: boolean): void => {
    form.hidden = !show;
    toggle.textContent = show ? "Schowaj" : "Dodaj gracza";
    toggle.setAttribute("aria-expanded", String(show));
  };
  showForm(!addHidden);
  toggle.addEventListener("click", () => {
    addHidden = !addHidden;
    saveAddHidden();
    showForm(!addHidden);
    if (!addHidden) form.querySelector<HTMLInputElement>("input")!.focus();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector<HTMLInputElement>("input")!;
    const name = input.value.trim();
    input.value = "";
    if (!name) return;
    players.push({ name, score: 0 }); // nowy gracz zaczyna od zera
    savePlayers();
    draw();
    input.focus();
  });

  list.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-act]");
    const row = btn?.closest<HTMLElement>(".player");
    if (!btn || !row) return;
    const i = Number(row.dataset.i);
    const player = players[i];
    if (!player) return;

    switch (btn.dataset.act) {
      case "inc":
        change(i, row, 1);
        break;
      case "dec":
        change(i, row, -1);
        break;
      case "remove":
        if (confirm(`Usunąć gracza „${player.name}”?`)) {
          players.splice(i, 1);
          savePlayers();
          draw();
        }
        break;
    }
  });
}

// STRONA GŁÓWNA: obrazki kategorii + liczba pozostałych pytań + gracze
function showHome(): void {
  const tiles = categories
    .map((c) => {
      const left = queue(c.id).length;
      const name = esc(c.name);
      const cover = covers[c.id]; // obrazek z covers.ts (jeśli jest)
      return `
        <button class="tile" data-id="${esc(c.id)}" aria-label="${name}, pozostało pytań: ${left}" ${left === 0 ? "disabled" : ""}>
          ${cover ? `<img src="${esc(cover)}" alt="">` : `<span class="tile-empty">brak obrazka</span>`}
          <span class="count">${left}</span>
          <span class="name">${name}</span>
        </button>`;
    })
    .join("");

  app.innerHTML = `
    <h1>Quiz urodzinowy</h1>
    <div class="grid">${tiles}</div>
    <section class="players">
      <div class="players-head">
        <h2>Gracze</h2>
        <button type="button" id="toggle-add" aria-controls="add-player"></button>
      </div>
      <form id="add-player">
        <input type="text" placeholder="Imię gracza" maxlength="30" autocomplete="off" required aria-label="Imię nowego gracza">
        <button type="submit">Dodaj gracza</button>
      </form>
      <ul id="player-list"></ul>
    </section>`;

  app.querySelectorAll<HTMLButtonElement>(".tile").forEach((btn) => {
    btn.addEventListener("click", () => showQuestion(btn.dataset.id!));
  });

  // Jeśli obrazka nie da się wczytać (zła nazwa albo rozszerzenie), pokaż pustą ramkę
  app.querySelectorAll<HTMLImageElement>(".tile img").forEach((img) => {
    img.addEventListener("error", () => {
      const empty = document.createElement("span");
      empty.className = "tile-empty";
      empty.textContent = "brak obrazka";
      img.replaceWith(empty);
    });
  });

  setupPlayers();
}

// EKRAN PYTANIA: obrazek + tekst + przyciski „Powrót” i „Pokaż odpowiedź!”
function showQuestion(id: string): void {
  const q = queue(id)[0];
  if (!q) return;

  // Miejsce na obrazek: obrazek pytania, a gdy go nie ma, ale jest odpowiedź – ukryte miejsce na odpowiedź
  const pic = q.image
    ? `<img class="pic" src="${esc(q.image)}" alt="Pytanie">`
    : q.answerImage
      ? `<img class="pic" alt="Odpowiedź" hidden>`
      : "";

  app.innerHTML = `
    <div class="bar">
      <button class="back">Powrót</button>
      ${q.answerImage ? `<button class="reveal">Pokaż odpowiedź!</button>` : ""}
    </div>
    <div class="question">
      ${pic}
      ${q.text ? `<p class="text">${esc(q.text)}</p>` : ""}
    </div>`;

  app.querySelector(".back")!.addEventListener("click", () => {
    queue(id).shift(); // pytanie "zużyte" – licznik spada o 1
    showHome();
  });

  // „Pokaż odpowiedź!” podmienia obrazek pytania na obrazek odpowiedzi (i z powrotem)
  const answer = q.answerImage;
  const reveal = app.querySelector<HTMLButtonElement>(".reveal");
  const picEl = app.querySelector<HTMLImageElement>(".pic");
  if (answer && reveal && picEl) {
    new Image().src = answer; // wczytaj odpowiedź z góry, żeby pojawiła się od razu
    let showingAnswer = false;
    reveal.addEventListener("click", () => {
      showingAnswer = !showingAnswer;
      const src = showingAnswer ? answer : q.image; // pytanie może nie mieć własnego obrazka
      if (src) picEl.src = src;
      picEl.hidden = !src;
      picEl.alt = showingAnswer ? "Odpowiedź" : "Pytanie";
      reveal.textContent = showingAnswer ? "Pokaż pytanie" : "Pokaż odpowiedź!";
    });
  }

  mountWiemLepiej(app); // przycisk „Wiem lepiej!” w prawym górnym rogu ekranu pytania
}

showHome();
