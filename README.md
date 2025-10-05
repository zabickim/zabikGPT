# Chatbot Project (Next.js + Express + OpenAI)

Prosty projekt chatbot-a z OpenAI, z backendem w Express i frontendem w Next.js + Tailwind.  
Backend obsługuje streaming SSE, frontend wyświetla wiadomości w czasie rzeczywistym.

---

## 📁 Struktura projektu

```text
root/
├─ frontend/ # Next.js + Tailwind
└─ backend/ # Express + TypeScript
```

---

## ⚙️ Wymagania

- Node.js v18+
- npm 9+
- Klucz API OpenAI (dla backendu)

---

## 📝 Konfiguracja

1. Uzupełnij swój klucz OpenAI w `.env.example`:

```env
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

2. Skopiuj plik `.env.example` do `.env` w backendzie:

```bash
cp backend/.env.example backend/.env
```

3. Skopiuj plik `.env.example` do `.env` we frontendzie:

```bash
cp frontend/.env.example frontend/.env
```

---

## 🚀 Uruchamianie projektu lokalnie

### Backend

cd backend
npm install
npm run dev

Serwer działa na: http://localhost:5000

### Frontend

cd frontend
npm install
npm run dev

Frontend działa na: http://localhost:3000
