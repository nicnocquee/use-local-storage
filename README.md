# useLocalStorage React Hook

A type-safe, composable React hook for synchronizing state with `localStorage`, supporting any serializable value, with cross-tab updates and legacy data migration. Powered by [superjson](https://github.com/blitz-js/superjson) for robust serialization.

## Features

- **Type-safe**: Works with any serializable value (string, number, object, array, boolean, Date, null, undefined)
- **Cross-tab sync**: Updates state across browser tabs/windows
- **Legacy migration**: Migrates old values to a new, safer format
- **Clear API**: Get, set, and clear values with a simple tuple

## Installation

```
npm install @nicnocquee/use-local-storage-hook superjson
```

> **Peer dependencies:**
>
> - `react` >= 18.3.1
> - `superjson` >= 2.2.2

## Usage

```tsx
import { useLocalStorage } from "@nicnocquee/use-local-storage-hook";

const [value, setValue, clearValue] = useLocalStorage<string>(
  "my-key",
  "default"
);
```

### Example: String

```tsx
const [name, setName] = useLocalStorage<string>("name", "Alice");
```

### Example: Object

```tsx
const [user, setUser] = useLocalStorage<{ id: number; name: string }>("user", {
  id: 1,
  name: "Alice"
});
```

### Example: Array

```tsx
const [items, setItems] = useLocalStorage<number[]>("items", [1, 2, 3]);
```

### Example: Boolean

```tsx
const [flag, setFlag] = useLocalStorage<boolean>("flag", false);
```

### Example: Clearing a value

```tsx
const [value, setValue, clearValue] = useLocalStorage("key", "default");
clearValue(); // value becomes undefined
```

## API

```ts
const [value, setValue, clearValue] = useLocalStorage<T>(key: string, initialValue?: T);
```

- `value`: The current value from localStorage (or `initialValue` if not set)
- `setValue(value: T)`: Sets the value in localStorage
- `clearValue()`: Clears the value (sets to undefined)

## Testing

This project uses [Vitest](https://vitest.dev/) and [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) for tests. To run tests:

```
npm test
```

## License

MIT
