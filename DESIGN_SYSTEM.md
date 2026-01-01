# HekaBio Design System

## Overview

The HekaBio Design System provides a comprehensive set of reusable UI components built with React, TypeScript, and Tailwind CSS. All components follow TailAdmin design patterns and use the HekaBio brand colors.

## Brand Colors

### Primary (Teal)
- **brand-500**: `#00B8A9` - Main brand color
- **brand-50** to **brand-950**: Full teal palette

### Accent (Cyan)
- **cyan-500**: `#0891b2`
- **cyan-50** to **cyan-950**: Full cyan palette

### Status Colors
- **success-500**: `#12b76a` (Green)
- **error-500**: `#f04438` (Red)
- **warning-500**: `#f79009` (Orange)

### Grays
- **gray-50** to **gray-950**: Neutral palette

## Typography

### Font Family
- **Primary**: Quicksand (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Font Sizes
- **theme-xs**: 12px / 18px
- **theme-sm**: 14px / 20px
- **theme-xl**: 20px / 30px
- **title-sm**: 30px / 38px
- **title-md**: 36px / 44px
- **title-lg**: 48px / 60px
- **title-xl**: 60px / 72px
- **title-2xl**: 72px / 90px

## Components

### 1. Button

Versatile button component with multiple variants and sizes.

**Usage:**
```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md">
  Click Me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- `loading`: boolean
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode

**Variants:**
- **Primary**: Teal background, white text
- **Secondary**: Gray background, dark text
- **Outline**: Teal border, teal text
- **Ghost**: Transparent background, teal text
- **Danger**: Red background, white text

---

### 2. Input

Text input with label, icons, and error states.

**Usage:**
```tsx
import { Input } from '@/components/ui';
import { IconUser } from '@tabler/icons-react';

<Input
  label="Email"
  placeholder="Enter your email"
  leftIcon={<IconUser size={18} />}
  error="This field is required"
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode
- `fullWidth`: boolean
- All standard HTML input attributes

---

### 3. Select

Dropdown select with custom styling.

**Usage:**
```tsx
import { Select } from '@/components/ui';

<Select
  label="Country"
  placeholder="Select a country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
  ]}
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `options`: SelectOption[]
- `placeholder`: string
- `fullWidth`: boolean

---

### 4. Checkbox

Custom styled checkbox.

**Usage:**
```tsx
import { Checkbox } from '@/components/ui';

<Checkbox label="I agree to terms" />
```

**Props:**
- `label`: string
- `error`: string
- All standard HTML checkbox attributes

---

### 5. Radio

Custom styled radio button.

**Usage:**
```tsx
import { Radio } from '@/components/ui';

<Radio name="option" value="1" label="Option 1" />
<Radio name="option" value="2" label="Option 2" />
```

**Props:**
- `label`: string
- `error`: string
- All standard HTML radio attributes

---

### 6. Card

Container component with optional header and footer.

**Usage:**
```tsx
import { Card } from '@/components/ui';

<Card
  header={<h3>Card Title</h3>}
  footer={<Button>Action</Button>}
  padding="md"
  shadow="sm"
>
  Card content here
</Card>
```

**Props:**
- `header`: ReactNode
- `footer`: ReactNode
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `shadow`: 'none' | 'sm' | 'md' | 'lg'
- `hover`: boolean

---

### 7. Badge

Small status indicator or label.

**Usage:**
```tsx
import { Badge } from '@/components/ui';

<Badge variant="success" dot>
  Active
</Badge>
```

**Props:**
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
- `size`: 'sm' | 'md' | 'lg'
- `dot`: boolean

---

### 8. Modal

Dialog modal with backdrop.

**Usage:**
```tsx
import { Modal, Button } from '@/components/ui';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary">Confirm</Button>
    </>
  }
>
  Modal content here
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `footer`: ReactNode
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `closeOnOverlayClick`: boolean

---

## Shadows

- **theme-xs**: Minimal shadow
- **theme-sm**: Small shadow
- **theme-md**: Medium shadow (default for cards)
- **theme-lg**: Large shadow
- **theme-xl**: Extra large shadow (modals)

## Z-Index Hierarchy

- **z-1**: 1
- **z-9**: 9
- **z-99**: 99
- **z-999**: 999 (Headers, sticky elements)
- **z-9999**: 9999
- **z-99999**: 99999
- **z-999999**: 999999 (Modals, dropdowns)

## Focus States

All interactive components include:
- **focus:outline-none**: Remove default outline
- **focus:ring-4**: 4px focus ring
- **focus:ring-brand-500/20**: Teal ring at 20% opacity

## Disabled States

All components support disabled states with:
- **opacity-50**: 50% opacity
- **cursor-not-allowed**: Not-allowed cursor
- **disabled:bg-gray-50**: Gray background for inputs

## Accessibility

All components are built with accessibility in mind:
- Proper ARIA labels
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Semantic HTML

## Best Practices

1. **Always use components from the design system** instead of creating custom styled elements
2. **Use the brand colors** defined in the Tailwind config
3. **Maintain consistency** across all pages and features
4. **Test accessibility** with keyboard navigation and screen readers
5. **Follow naming conventions** for component props and variants

## Examples

See the Login Page (`src/features/auth/pages/LoginPage.tsx`) for real-world usage examples.

---

**Last Updated**: January 2026
**Version**: 1.0.0
