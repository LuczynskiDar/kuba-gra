# Wisielec — Plan projektu

## Cel
Przeglądarkowa gra edukacyjna w wisielca dla dzieci z drugiej klasy.
Język polski. Styl kreskówkowy/neutralny.

---

## Stack technologiczny

| Element        | Wybór                                              |
|----------------|----------------------------------------------------|
| Frontend       | React + TypeScript                                 |
| Routing        | React Router                                       |
| Grafika        | SVG (wisielec), CSS (tło)                          |
| Dźwięki        | opcjonalne, jako dodatek                           |
| Deployment     | Docker na VPS                                      |
| Środowisko dev | lokalnie najpierw, potem VPS                       |
| Repozytorium   | GitHub — `LuczynskiDar/kuba-gra`                   |

---

## Mechanika gry

- **Błędne litery:** maksymalnie 8 (po 8. błędzie — przegrana)
- **System punktów:** brak
- **Tryby:** 1 gracz i 2 graczy
- **Rundy:** 3 rundy na mecz
- **Słowa:** losowane ze wszystkich kategorii razem
- **Język słów:** polski

### Tryb 1 gracz
- Gracz zgaduje słowo
- Po 3 rundach — ekran podsumowania z wynikiem (ile słów odgadniętych)

### Tryb 2 graczy
- Gracz 1 zgaduje słowo → Gracz 2 zgaduje inne słowo → to jest 1 runda
- Po 3 rundach — ekran podsumowania: kto wygrał więcej rund
- Wygrana rundy = odgadnięcie słowa (lub mniej błędów jeśli obaj odgadną)

---

## Słownictwo

| Kategoria  | Liczba słów |
|------------|-------------|
| Zwierzęta  | 50          |
| Owoce      | 50          |
| Szkoła     | 50          |
| Sport      | 50          |
| **Łącznie**| **200**     |

- Słowa wczytywane z pliku `words.json`
- Słowo losowane losowo z całej puli 200 słów
- Wielkie litery obsługiwane (normalizacja)

---

## Grafika

- **Tło:** sala kinowa (kreskówkowa, neutralna kolorystycznie)
- **Wisielec:** rysowany SVG, 8 kroków (każdy błąd = nowy element)

### Kroki SVG wisielca (8 elementów ciała):
1. Głowa
2. Tułów
3. Lewa ręka
4. Prawa ręka
5. Lewa noga
6. Prawa noga
7. Lewa stopa
8. Prawa stopa

> Szubienica jest widoczna od początku jako tło SVG.

---

## Routing (React Router)

| Ścieżka      | Widok                              |
|--------------|------------------------------------|
| `/`          | Menu główne                        |
| `/mode`      | Wybór trybu (1 lub 2 graczy)       |
| `/game`      | Ekran gry                          |
| `/summary`   | Podsumowanie meczu                 |

---

## Struktura projektu

```
kuba-gra/
├── public/
│   └── sounds/           # opcjonalne dźwięki
├── src/
│   ├── assets/
│   │   └── cinema-bg.svg # tło sali kinowej
│   ├── components/
│   │   ├── HangmanSVG.tsx     # rysowanie wisielca krok po kroku
│   │   ├── WordDisplay.tsx    # wyświetlanie liter słowa
│   │   ├── Keyboard.tsx       # klawiatura ekranowa
│   │   └── RoundInfo.tsx      # info o rundzie i graczu
│   ├── pages/
│   │   ├── MenuPage.tsx
│   │   ├── ModePage.tsx
│   │   ├── GamePage.tsx
│   │   └── SummaryPage.tsx
│   ├── data/
│   │   └── words.json         # 200 słów w 4 kategoriach
│   ├── hooks/
│   │   └── useGame.ts         # logika gry
│   ├── types/
│   │   └── index.ts           # typy TypeScript
│   └── App.tsx
├── Dockerfile
├── docker-compose.yml
├── nginx.conf                 # serwowanie buildu przez nginx
└── package.json
```

---

## Docker / Deployment

1. Lokalnie: `npm run dev` (Vite dev server)
2. Build produkcyjny: `npm run build`
3. Docker: obraz nginx serwujący `dist/`
4. VPS: `docker compose up -d`

### Dockerfile (plan)
```
build stage  → node:alpine → npm run build
serve stage  → nginx:alpine → kopiuje dist/
```

---

## Git workflow

- Branch główny: `main`
- Pracujemy na feature branchach, PR do `main`
- Remote: `git@github.com:LuczynskiDar/kuba-gra.git`

---

## Kolejne kroki (w kolejności)

1. [x] Wygenerowanie pliku `words.json` (200 słów PL)
2. [x] Inicjalizacja projektu React + TS (Vite)
3. [x] Implementacja routingu i stron (szkielety)
4. [x] Logika gry w `useGame.ts`
5. [x] Komponent `HangmanSVG.tsx` (8 kroków SVG)
6. [x] Komponent `WordDisplay` i `Keyboard`
7. [x] Tryb 1 gracz — end-to-end
8. [ ] Tryb 2 graczy — mechanika zmian
9. [ ] Ekran podsumowania
10. [ ] Tło sali kinowej (CSS / SVG)
11. [ ] Dźwięki (opcjonalnie)
12. [ ] Testy lokalne
13. [ ] Dockerfile + docker-compose
14. [ ] Deploy na VPS
