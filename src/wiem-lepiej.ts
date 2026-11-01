import "./wiem-lepiej.css";

// ===================== USTAWIENIA – tu zmieniasz wszystko dla „Wiem lepiej!” =====================

// Grafika, która się pokazuje. Plik wrzuć do folderu  public/img/
const OBRAZEK = "/img/wiem-lepiej.png";

// Dźwięk odtwarzany razem z pojawieniem się grafiki. Plik wrzuć do folderu  public/dzwieki/
// Masz plik w innym formacie? Zmień rozszerzenie (.mp3, .wav, .ogg).
// Wpisz "" (puste cudzysłowy), jeśli ma być bez dźwięku.
const DZWIEK = "/dzwieki/wiem-lepiej.mp3";

// Animacje pojawiania się grafiki. Każde kliknięcie „Wiem lepiej!” używa kolejnej z listy,
// a po ostatniej wracamy do pierwszej. Możesz zmienić kolejność, usunąć nazwy, których nie chcesz,
// albo zostawić jedną – wtedy zawsze będzie ta sama.
//   "zoom"   – powiększa się z lekkim odbiciem
//   "spin"   – rośnie i obraca się
//   "fly"    – wlatuje od dołu
//   "bounce" – spada z góry i odbija się
//   "fade"   – płynnie się pojawia
type Animacja = "zoom" | "spin" | "fly" | "bounce" | "fade";
const ANIMACJE: Animacja[] = ["spin", "fly", "bounce", "fade", "zoom"];

// ================================================================================================

// Wczytaj grafikę i dźwięk z góry, żeby po kliknięciu pojawiły się bez opóźnienia
const preloaded = new Image();
preloaded.src = OBRAZEK;
const audio = DZWIEK ? new Audio(DZWIEK) : null;
if (audio) audio.preload = "auto";

// Którą animację z listy pokazać następnym razem (rośnie z każdym kliknięciem)
let licznik = 0;

// Dokłada mały, ledwo widoczny przycisk w prawym dolnym rogu ekranu
export function mountWiemLepiej(container: HTMLElement): void {
  container.insertAdjacentHTML(
    "beforeend",
    `<button type="button" class="wl-btn">Wiem lepiej!</button>`,
  );
  container.querySelector<HTMLButtonElement>(".wl-btn")!.addEventListener("click", openDialog);
}

// Pokazuje grafikę na całym ekranie: najpierw ściemnia tło, potem grafika wchodzi z animacją
function openDialog(): void {
  const dialog = document.createElement("dialog");
  dialog.className = "wl-dialog";
  dialog.dataset.anim = ANIMACJE[licznik % ANIMACJE.length] ?? "fade"; // pusta lista = zwykłe pojawienie się
  licznik++;
  dialog.setAttribute("aria-label", "Wiem lepiej!");

  const img = document.createElement("img");
  img.src = OBRAZEK;
  img.alt = "Wiem lepiej!";
  img.addEventListener("error", () => {
    const msg = document.createElement("p");
    msg.className = "wl-error";
    msg.textContent = `Nie znaleziono pliku ${OBRAZEK} – wrzuć go do folderu public.`;
    img.replaceWith(msg);
  });

  const hint = document.createElement("p");
  hint.className = "wl-hint";
  hint.textContent = "Kliknij, aby zamknąć";

  dialog.append(img, hint);
  document.body.append(dialog);

  // Zamknięcie (kliknięcie gdziekolwiek albo Esc): usuń okno i zatrzymaj dźwięk
  dialog.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    dialog.remove();
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  });

  dialog.showModal();

  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {
      // brak pliku z dźwiękiem albo blokada przeglądarki – po prostu bez dźwięku
    });
  }
}
