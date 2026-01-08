# Hooks

Folder ini berisi custom React hooks.

## Contoh hooks:
- **useAuth.js** - Hook untuk authentication
- **useLocalStorage.js** - Hook untuk local storage
- **useDebounce.js** - Hook untuk debounce
- **useFetch.js** - Hook untuk data fetching
- dll

## Contoh penggunaan:
```jsx
import { useAuth } from '@/hooks/useAuth'
import { useLocalStorage } from '@/hooks/useLocalStorage'

function MyComponent() {
  const { user, login, logout } = useAuth()
  const [value, setValue] = useLocalStorage('key', 'defaultValue')

  // ...
}
```
