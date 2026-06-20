# Nasze Gry — Log Faz Implementacji

## Faza 1 — Integracja obu gier ✅ GOTOWE

**Co zrobiono:**
- Nowe główne menu (`/`) z tytułem "Nasze Gry"
- Komponent `GameCard.tsx` — duże karty z ikoną SVG, nazwą gry i autorami
- Karty: Wisielec (Kuba i Darek) + Bitwa Statków (Darek i Tomek)
- Przeniesienie wisielca: ścieżki `/` → `/wisielec`, `/mode` → `/wisielec/mode` itd.
- `WisielecLayout.tsx` — CinemaBackground renderuje się tylko dla wisielca
- Przycisk "← Menu główne" na stronie startowej wisielca
- Reorganizacja katalogów: `src/pages/wisielec/`, `src/components/wisielec/`
- Tytuł aplikacji zmieniony na "Nasze Gry" w `index.html`

**Kluczowe pliki:**
- `src/pages/MainMenuPage.tsx` + `.css`
- `src/components/GameCard.tsx` + `.css`
- `src/pages/wisielec/WisielecLayout.tsx`
- `src/App.tsx` (nowy routing)

---

## Faza 2 — Bitwa Statków: szkielet i nawigacja ✅ GOTOWE

**Co zrobiono:**
- Strona startowa `/statki` — statek SVG, tytuł, autorzy (Darek i Tomek), tło oceaniczne
- `StatkiLayout.tsx` — własne ciemnoniebieskie tło z efektem fal, oddzielne od wisielca
- Wybór trybu `/statki/mode` — 3-krokowy formularz:
  - Krok 1: vs Komputer / 2 graczy (ekran) / 2 graczy online (nieaktywny — "Wkrótce")
  - Krok 2: poziom trudności 🐠 Łatwy / 🦈 Średni / 💀 Trudny (tylko vs Komputer)
  - Krok 3: formularz imion — gracz wpisuje swoje, komputer losuje z 15 śmiesznych imion morskich
- Nawigacja wstecz na każdym kroku

**Kluczowe pliki:**
- `src/pages/statki/MenuPage.tsx` + `.css`
- `src/pages/statki/ModePage.tsx` + `.css`
- `src/pages/statki/StatkiLayout.tsx` + `.css`

---

## Faza 3 — Bitwa Statków: ustawianie statków ✅ GOTOWE

**Co zrobiono:**
- Plansza 10x10 z etykietami A–J i 1–10
- Flota standardowa: Pancernik (4), 2× Krążownik (3), 3× Niszczyciel (2), 4× Łódź (1)
- Drag & drop statków z listy na planszę (z grab index — śledzi z której komórki statku trzymasz)
- Preview w kolorach: zielony = można postawić, czerwony = kolizja lub poza planszą
- Walidacja: statki nie mogą się nakładać ani stykać (nawet po skosie)
- Przycisk ⟳ obraca statek (poziomy/pionowy)
- Klik na statek na planszy — zdejmuje go i zwraca do listy
- 🎲 Losuj ustawienie — automatyczne rozmieszczenie wszystkich statków
- Przycisk "Gotowy →" aktywny dopiero gdy wszystkie 10 statków ustawione
- Wspólne utils wydzielone do `src/utils/battleshipUtils.ts`

**Kluczowe pliki:**
- `src/pages/statki/SetupPage.tsx` + `.css`
- `src/components/statki/Board.tsx` + `.css`
- `src/utils/battleshipUtils.ts`

---

## Faza 4 — Bitwa Statków: logika gry vs Komputer ✅ GOTOWE

**Co zrobiono:**
- Hook `useBattleship.ts` — pełna logika gry:
  - Dwie plansze (gracz + komputer), dwie siatki strzałów
  - Detekcja trafienia / chybienia / zatopienia (automatyczne oznaczenie całego statku)
  - Wykrywanie końca gry (wszystkie statki zatopione)
  - Komputer strzela z opóźnieniem 900ms
- AI — 3 poziomy:
  - **Łatwy**: losowe strzały
  - **Średni**: Hunt & Target — po trafieniu namierza sąsiednie pola, śledzi kierunek statku
  - **Trudny**: jak Średni + checkerboard w trybie polowania (gdy minimalny pozostały statek ≥ 2 pola)
- Ekran gry `/statki/game`:
  - Dwie plansze obok siebie
  - Status tury (twoja / komputer myśli...)
  - Wynik zatopionych statków
  - Badge ostatniego strzału (pudło / trafiony / zatopiony) z animacją pulse
  - Kursor celowniczy na planszy przeciwnika
- Ekran podsumowania `/statki/summary`:
  - Zwycięzca, strzały i celność dla obu stron
  - Przyciski: Zagraj ponownie / Menu statków / Menu główne
- Auto-nawigacja do podsumowania po 2.2s od końca gry

**Kluczowe pliki:**
- `src/hooks/useBattleship.ts`
- `src/components/statki/GameBoard.tsx` + `.css`
- `src/pages/statki/GamePage.tsx` + `.css`
- `src/pages/statki/SummaryPage.tsx` + `.css`

---

## Faza 5 — Bitwa Statków: wygląd i styl ✅ GOTOWE

**Co zrobiono:**
- `StatkiLayout.tsx` — pełne animowane tło SVG oceanu: niebo z księżycem i gwiazdami, wyspa z palmą i kokosami, powierzchnia wody z falami, promienie światła, 3 ryby (pomarańczowa, niebieska, żółta), rekin, delfin skaczący, bąbelki, wodorosty, dno oceanu
- `StatkiLayout.css` — CSS keyframes: płyniące ryby (swim-right/left), wolny rekin, skaczący delfin (dolphin-jump), wzbijające się bąbelki (bubble-rise), kołyszące wodorosty (seaweed-sway)
- `GameBoard.tsx` — lastShot używa pełnego `LastShot` (z polem `result`) — osobne klasy CSS per wynik
- `GameBoard.css` — 3 osobne animacje strzałów: pudło (splash-miss — falujący ripple), trafiony (explosion-hit — pomarańczowy wybuch), zatopiony (explosion-sunk — duży żółty błysk); CSS custom properties dla responsywności
- `GamePage.css` — plansze układają się pionowo na mobile (< 600px)
- `Board.css` — CSS custom properties `--cell`, rozmiary skalują się na tablet/mobile
- `SetupPage.css` — lista floty zamienia się w poziomy rząd na mobile, panel pod planszą

**Kluczowe pliki:**
- `src/pages/statki/StatkiLayout.tsx` + `.css`
- `src/components/statki/GameBoard.tsx` + `.css`
- `src/components/statki/Board.css`
- `src/pages/statki/GamePage.css`
- `src/pages/statki/SetupPage.css`

---

## Faza 6 — Backend i wyniki ✅ GOTOWE

**Co zrobiono:**
- Backend Node.js + Express + better-sqlite3 w `backend/`
- Tabele: `results_solo`, `results_multiplayer`, max 30 wpisów per tabela (trim w transakcji)
- Endpointy: `POST /api/results`, `GET /api/results/solo`, `GET /api/results/multiplayer`, `GET /api/health`
- `Dockerfile.backend` (Node 20 Alpine + python3/make/g++ do kompilacji better-sqlite3)
- Dwa serwisy w `docker-compose.yml`: `gry` (nginx) + `backend` (Node), volume `backend-data`
- Nginx proxy: `/api/*` → `http://backend:3001`
- Vite dev proxy: `/api` → `localhost:3001`
- `SummaryPage.tsx`: POST wyniku po załadowaniu (z ref-guard przed duplikatem), tabela top 30 z kolumnami gracz/przeciwnik/wynik/celność/strzały/data
- Graceful fallback "Serwer niedostępny" gdy backend offline

**Kluczowe pliki:**
- `backend/server.js` + `backend/package.json`
- `Dockerfile.backend`
- `docker-compose.yml` + `nginx.conf`
- `vite.config.ts`
- `src/pages/statki/SummaryPage.tsx` + `.css`

---

## Faza 7 — Warstwa 2: 2 graczy na tym samym ekranie ⏳ DO ZROBIENIA

- Każdy gracz ustawia statki osobno (ekran przekazania urządzenia)
- Ekran zasłonięcia planszy między turami
- Logika naprzemiennych tur między graczami
- Wizualne rozróżnienie plansz

---

## Faza 8 — Warstwa 3: 2 graczy online (kod dołączenia) ⏳ DO ZROBIENIA

- Socket.io dodany do backendu
- Generowanie kodu pokoju (4-5 znaków)
- UI: "Utwórz grę" → wyświetl kod / "Dołącz do gry" → wpisz kod
- Synchronizacja strzałów w czasie rzeczywistym
- Obsługa rozłączenia gracza
- Nginx proxy: `/socket.io/*` → backend

---

## Faza 9 — Testy i deploy ⏳ DO ZROBIENIA

- Testy lokalne wszystkich trybów i gier
- Weryfikacja docker-compose (wszystkie serwisy)
- Deploy na VPS
- Smoke testy na produkcji

---

## Podsumowanie

| Faza | Opis | Status |
|------|------|--------|
| 1 | Integracja gier, główne menu "Nasze Gry" | ✅ Gotowe |
| 2 | Bitwa Statków: szkielet, nawigacja, tryby, imiona | ✅ Gotowe |
| 3 | Bitwa Statków: drag & drop ustawianie statków | ✅ Gotowe |
| 4 | Bitwa Statków: logika gry, AI 3 poziomy, vs Komputer | ✅ Gotowe |
| 5 | Bitwa Statków: wygląd, tło oceaniczne, animacje | ✅ Gotowe |
| 6 | Backend, SQLite, wyniki, Docker | ✅ Gotowe |
| 7 | 2 graczy na tym samym ekranie | ⏳ Do zrobienia |
| 8 | 2 graczy online (WebSocket, kod pokoju) | ⏳ Do zrobienia |
| 9 | Testy i deploy na VPS | ⏳ Do zrobienia |
