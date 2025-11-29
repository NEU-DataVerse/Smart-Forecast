# Web Frontend Architecture

## 📐 Kiến trúc tổng quan

Frontend của Smart Forecast được xây dựng dựa trên:

- **Next.js 14** với App Router
- **TypeScript** cho type safety
- **Tailwind CSS** cho styling
- **shadcn/ui** cho UI components
- **Feature-based architecture** cho tổ chức code

## 🏗️ Cấu trúc thư mục

```
web/src/
├── app/                    # Next.js App Router
├── components/             # Shared components
│   ├── layouts/           # Layout components (Header, Sidebar)
│   ├── shared/            # Shared utility components
│   └── ui/                # shadcn/ui components
├── features/              # Feature modules
│   ├── auth/              # Authentication feature
│   ├── dashboard/         # Dashboard feature
│   └── ...                # Other features
├── lib/                   # Utilities & configs
├── hooks/                 # Global hooks
├── services/              # API services
├── context/               # React Context
└── types/                 # Global types
```

## 🎯 Nguyên tắc kiến trúc

### 1. Feature-Based Organization

Mỗi feature là một module độc lập với cấu trúc:

```
features/[feature-name]/
├── components/         # Feature-specific components
├── hooks/             # Feature-specific hooks
├── services/          # Feature-specific API calls
├── types/             # Feature-specific types
└── utils/             # Feature-specific utilities
```

**Ưu điểm:**

- Dễ tìm và quản lý code
- Tái sử dụng được ở cấp feature
- Dễ test và maintain
- Team work hiệu quả hơn

### 2. Component Composition

Component được xây dựng từ các component nhỏ hơn:

```tsx
// ❌ BAD - Monolithic
function Header() {
  return <header>{/* 100+ lines of code */}</header>;
}

// ✅ GOOD - Composed
function Header() {
  return (
    <header>
      <MenuToggle />
      <Logo />
      <NotificationButton />
      <UserMenu />
    </header>
  );
}
```

### 3. Separation of Concerns

Tách biệt logic và UI:

```tsx
// ❌ BAD - Mixed
function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return <div>{/* UI */}</div>;
}

// ✅ GOOD - Separated
function useUsers() {
  // Logic here
}

function UserList() {
  const { users, loading } = useUsers();
  return <div>{/* UI only */}</div>;
}
```

### 4. Type Safety

Mọi component đều có TypeScript types:

```tsx
interface ButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ variant = 'default', ...props }: ButtonProps) {
  // Implementation
}
```

## 📦 Modules chính

### 1. App Module (`/app`)

Next.js App Router - định nghĩa routes và layouts:

```
app/
├── (auth)/              # Auth route group
│   └── login/
│       └── page.tsx
├── (dashboard)/         # Dashboard route group
│   ├── layout.tsx       # Shared layout
│   ├── dashboard/
│   ├── alerts/
│   └── ...
└── page.tsx            # Root page (redirects)
```

### 2. Components Module (`/components`)

#### Layouts (`/components/layouts`)

Components định nghĩa cấu trúc trang:

```tsx
// Header structure
components/layouts/Header/
├── Header.tsx              # Main container
├── Logo.tsx               # Logo component
├── MenuToggle.tsx         # Menu button
├── NotificationButton.tsx # Notifications
└── UserMenu/
    ├── UserMenu.tsx
    ├── UserAvatar.tsx
    └── UserMenuDropdown.tsx
```

#### Shared (`/components/shared`)

Components tái sử dụng xuyên suốt app:

```tsx
// LoadingSpinner
<LoadingSpinner size="md" />
<PageLoader message="Loading data..." />

// ErrorMessage
<ErrorMessage
  type="error"
  title="Error"
  message="Something went wrong"
/>

// EmptyState
<EmptyState
  icon={Inbox}
  title="No data"
  description="No items found"
  action={<Button>Add New</Button>}
/>

// PageHeader
<PageHeader
  title="Dashboard"
  description="Overview of your system"
  actions={<Button>Action</Button>}
/>
```

#### UI (`/components/ui`)

shadcn/ui components - không nên chỉnh sửa trực tiếp:

```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
```

### 3. Features Module (`/features`)

#### Auth Feature (`/features/auth`)

```
features/auth/
├── components/
│   ├── LoginForm.tsx
│   ├── PasswordInput.tsx
│   ├── RememberMeCheckbox.tsx
│   └── LoginCard.tsx
├── hooks/
│   └── useAuth.ts
└── services/
    └── auth.service.ts
```

**Usage:**

```tsx
import { LoginForm } from '@/features/auth/components';

function LoginPage() {
  return <LoginForm />;
}
```

#### Dashboard Feature (`/features/dashboard`)

```
features/dashboard/
├── components/
│   ├── DashboardOverview.tsx
│   ├── SummaryCard/
│   ├── RecentReports/
│   └── ActiveAlerts/
└── hooks/
    └── useDashboardData.ts
```

### 4. Services Module (`/services`)

Xử lý API calls và data fetching:

```tsx
// services/api/client.ts
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // ...config
});

// services/data/dashboard.api.ts
export const getDashboardData = async () => {
  const response = await apiClient.get('/dashboard');
  return response.data;
};
```

### 5. Hooks Module (`/hooks`)

Global custom hooks:

```tsx
// hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  // Implementation
}

// Usage
const debouncedSearch = useDebounce(searchTerm, 500);
```

### 6. Context Module (`/context`)

React Context providers:

```tsx
// context/AuthContext.tsx
export const AuthProvider = ({ children }) => {
  // State management
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Usage
const { user, login, logout } = useAuth();
```

## 🔄 Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Custom Hook (optional)
    ↓
API Service
    ↓
Backend API
    ↓
Response
    ↓
State Update
    ↓
Component Re-render
```

## 🎨 Styling Guidelines

### Tailwind CSS

Sử dụng utility classes:

```tsx
// ✅ GOOD
<div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50">

// ❌ BAD - Custom CSS
<div className="custom-container">
```

### Component Variants

Sử dụng `cn()` utility để combine classes:

```tsx
import { cn } from '@/lib/utils';

function Button({ variant, className }) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded',
        variant === 'primary' && 'bg-blue-500',
        variant === 'secondary' && 'bg-gray-500',
        className,
      )}
    />
  );
}
```

## 🧪 Testing Strategy

### Unit Tests

Test từng component độc lập:

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Integration Tests

Test tương tác giữa components:

```tsx
describe('LoginForm', () => {
  it('submits form with valid data', async () => {
    render(<LoginForm />);
    // Test implementation
  });
});
```

## 📝 Best Practices

### 1. Component Organization

```tsx
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types
interface MyComponentProps {
  title: string;
}

// 3. Component
export function MyComponent({ title }: MyComponentProps) {
  // 4. State
  const [state, setState] = useState();

  // 5. Effects
  useEffect(() => {}, []);

  // 6. Handlers
  const handleClick = () => {};

  // 7. Render
  return <div>{title}</div>;
}
```

### 2. Naming Conventions

- **Components**: PascalCase (`UserMenu.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **Types**: PascalCase with suffix (`UserProfile.types.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)

### 3. File Structure

Mỗi component trong folder riêng nếu có nhiều file liên quan:

```
UserMenu/
├── UserMenu.tsx           # Main component
├── UserAvatar.tsx         # Sub-component
├── UserMenuDropdown.tsx   # Sub-component
├── index.ts              # Exports
└── UserMenu.test.tsx     # Tests (nếu có)
```

### 4. Import Organization

```tsx
// 1. External packages
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Internal absolute imports
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

// 3. Relative imports
import { SubComponent } from './SubComponent';

// 4. Types
import type { UserProfile } from './types';
```

### 5. Props Interface

Always define props interface:

```tsx
// ✅ GOOD
interface CardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Card({ title, description, children }: CardProps) {
  // ...
}

// ❌ BAD
export function Card({ title, description, children }) {
  // No types
}
```

## 🚀 Performance Optimization

### 1. Code Splitting

```tsx
// Lazy load heavy components
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
```

### 2. Memoization

```tsx
// Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);

// Memoize components
export const ExpensiveComponent = memo(({ data }) => {
  return <div>{/* Heavy render */}</div>;
});
```

### 3. Image Optimization

```tsx
import Image from 'next/image';

<Image src="/image.jpg" alt="Description" width={500} height={300} loading="lazy" />;
```

## 🔒 Security

### 1. Input Validation

```tsx
// Always validate user input
const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
```

### 2. XSS Prevention

```tsx
// Never use dangerouslySetInnerHTML without sanitization
import DOMPurify from 'dompurify';

<div
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(htmlContent),
  }}
/>;
```

### 3. Authentication

```tsx
// Check auth on protected routes
export default function ProtectedPage() {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user) redirect('/login');

  return <div>Protected content</div>;
}
```

## 📚 Tài liệu tham khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Cập nhật lần cuối:** November 24, 2025
