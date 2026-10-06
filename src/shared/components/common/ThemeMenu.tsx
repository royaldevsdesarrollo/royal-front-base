import { Laptop, Moon, Sun } from 'lucide-react'
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui'
import { useAppStore } from '@/shared/stores'
import type { AppTheme } from '@/shared/types'

const THEME_OPTIONS: Array<{ icon: typeof Sun, label: string, value: AppTheme }> = [
  { icon: Sun, label: 'Claro', value: 'light' },
  { icon: Moon, label: 'Oscuro', value: 'dark' },
  { icon: Laptop, label: 'Sistema', value: 'system' },
]

export function ThemeMenu() {
  const setTheme = useAppStore(state => state.setTheme)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon" aria-label="Cambiar tema">
          <Sun className="dark:hidden" />
          <Moon className="hidden dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {THEME_OPTIONS.map(({ icon: Icon, label, value }) => (
          <DropdownMenuItem key={value} onSelect={() => setTheme(value)}>
            <Icon />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
