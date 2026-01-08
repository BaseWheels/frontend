# Frontend Structure Documentation

Dokumentasi struktur folder aplikasi Hot Wheels NFT Collection.

## 📁 Struktur Folder

```
src/
├── app/                      # Next.js App Router (ROUTING)
│   ├── page.jsx              # Landing/Login Page (Route: /)
│   ├── dashboard/
│   │   └── page.jsx          # Dashboard Page (Route: /dashboard)
│   ├── layout.jsx            # Root Layout (wrapper semua page)
│   ├── providers.jsx         # Privy Auth Provider
│   ├── globals.css           # Global CSS styles
│   └── manifest.js           # PWA Manifest
│
├── components/               # Reusable Components
│   ├── ui/                   # UI Components (Button, Input, Card, dll)
│   └── shared/               # Shared Components (Header, Footer, Nav, dll)
│
├── lib/                      # Utilities & Helpers
│   ├── utils.js              # General utility functions
│   ├── constants.js          # App constants
│   └── api.js                # API client
│
└── hooks/                    # Custom React Hooks
    ├── useAuth.js            # Authentication hook
    └── useLocalStorage.js    # Local storage hook
```

## 🗺️ Routing Map

| URL | File | Deskripsi |
|-----|------|-----------|
| `/` | `app/page.jsx` | Landing page dengan login (Privy Auth) |
| `/dashboard` | `app/dashboard/page.jsx` | Dashboard user setelah login |

## 📄 File Penting

### Landing/Login Page
**File:** [src/app/page.jsx](app/page.jsx)
- Halaman pertama yang dilihat user
- Menampilkan hero section, car carousel, features
- Tombol "Launch App" untuk login dengan Privy
- Auto redirect ke `/dashboard` jika sudah login

### Dashboard Page
**File:** [src/app/dashboard/page.jsx](app/dashboard/page.jsx)
- Halaman setelah user login
- Menampilkan car collection, search bar, bottom navigation
- Auto redirect ke `/` jika belum login

### Auth Provider
**File:** [src/app/providers.jsx](app/providers.jsx)
- Setup Privy authentication
- Wrapper untuk semua halaman

### Root Layout
**File:** [src/app/layout.jsx](app/layout.jsx)
- Layout utama aplikasi
- Wrap semua page dengan Providers

## 🚀 Cara Menambah Halaman Baru

### 1. Buat halaman Profile
```bash
# Buat folder dan file
mkdir src/app/profile
# Buat file page.jsx di dalamnya
```

File: `src/app/profile/page.jsx`
```jsx
export default function Profile() {
  return <div>Profile Page</div>
}
```

URL: `http://localhost:3000/profile`

### 2. Buat komponen reusable
File: `src/components/ui/Button.jsx`
```jsx
export function Button({ children, ...props }) {
  return <button {...props}>{children}</button>
}
```

## 📦 Import Path Aliases

Gunakan `@/` untuk import dari root src:
```jsx
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
```

## 🎨 Styling

- **Framework:** Tailwind CSS
- **Global styles:** `src/app/globals.css`
- **Inline styles:** Menggunakan Tailwind utility classes

## 🔐 Authentication Flow

1. User buka `/` (landing page)
2. Klik "Launch App" → Modal Privy muncul
3. Login dengan email/wallet/social
4. Auto redirect ke `/dashboard`
5. Jika user refresh, tetap login (Privy handle session)
6. Jika user logout, redirect ke `/`

## 📱 Mobile-First Design

Semua halaman dibuat dengan prioritas mobile:
- Max width: `max-w-md` (448px)
- Centered: `mx-auto`
- Responsive dengan Tailwind breakpoints
