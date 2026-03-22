# Convo — Frontend

A real-time chat application built with React. Pairs with the [Convo Backend](../backend).

## Tech Stack

- **React** + **Vite**
- **Redux Toolkit** — global state (chats, theme, online users)
- **Socket.io Client** — real-time messaging and typing indicators
- **Tailwind CSS** — styling
- **Framer Motion** — page transitions and animations
- **@tanstack/react-virtual** — virtual scrolling for message lists
- **Material UI** — form components and toasts
- **Axios** — HTTP requests
- **React Router v6** — routing

## Features

- Email/password auth and Google OAuth
- Real-time messaging with typing indicators
- Online/offline presence indicators
- Read receipts (double tick, blue on seen)
- Paginated message history (30 per page, infinite scroll upward)
- Virtual scrolling — only visible messages rendered in the DOM
- Dark/light theme toggle
- Editable user profile

## Getting Started

```bash
git clone https://github.com/yourname/convo-frontend.git
cd convo-frontend
npm install
```

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Then run:

```bash
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── Auth/           # Login, Signup
│   ├── Chat/           # ChatArea, ChatItem, Sent, Recv
│   ├── Layout/         # MainContainer, Sidebar, Welcome
│   ├── User/           # Profile
│   └── miscellaneous/  # AvatarText, Modal, Toaster, Loader
├── store/
│   ├── index.js
│   ├── ChatSlice.js
│   ├── ThemeSlice.js
│   └── OnlineSlice.js
└── Utils/
    └── socket.js
```

## Deployment

Deployed on **Vercel**. Set the following environment variables in your Vercel project settings:

```
VITE_API_URL=https://your-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```
