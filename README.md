# Nasze Gry — Kuba i Darek

Zbiór przeglądarkowych gier edukacyjnych dla dzieci z drugiej klasy.  
Aktualnie dostępne: **Wisielec** i **Bitwa Statków**.

Stworzone przez Kubę i Darka.

---

## Uruchamianie (produkcja)

Pobiera obrazy z Docker Hub i uruchamia aplikację:

```bash
docker compose -f docker-compose.prod.yml up -d
```

Uruchamia 2 kontenery:
- **gry** — frontend (React + Nginx), dostępny pod `http://localhost:3000`
- **backend** — Node.js API z bazą SQLite (wyniki gier)

---

## Budowanie i publikowanie nowej wersji na Docker Hub

### 1. Zbuduj obrazy

```bash
docker compose build
```

### 2. Otaguj nową wersję i `latest`

```bash
# Frontend
docker tag kuba-gra-kuba-gra rayzki/kuba-gra:X.Y
docker tag kuba-gra-kuba-gra rayzki/kuba-gra:latest

# Backend
docker tag kuba-gra-backend rayzki/kuba-gra-backend:X.Y
docker tag kuba-gra-backend rayzki/kuba-gra-backend:latest
```

> Zamień `X.Y` na numer wersji, np. `1.1`

### 3. Wypchnij na Docker Hub

```bash
docker push rayzki/kuba-gra:X.Y
docker push rayzki/kuba-gra:latest

docker push rayzki/kuba-gra-backend:X.Y
docker push rayzki/kuba-gra-backend:latest
```

### 4. Zaktualizuj wersję w `docker-compose.yml`

Zmień tag w obu serwisach:

```yaml
image: rayzki/kuba-gra:X.Y
image: rayzki/kuba-gra-backend:X.Y
```

---

## Uruchamianie lokalne (developerskie)

```bash
npm install
npm run dev
```

Aplikacja dostępna pod `http://localhost:5173`

---

## Stack

- React + TypeScript (Vite)
- React Router
- Node.js backend (wyniki gier, SQLite)
- Nginx (serwowanie frontendu + proxy do backendu)
- Docker + Docker Compose
- 1000 haseł po polsku (18 kategorii) — Wisielec
- Wisielec: tryb 1 i 2 graczy, 3 rundy
- Bitwa Statków: tryb vs Komputer (3 poziomy) i 2 graczy lokalnie
