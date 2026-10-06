import { useState } from 'react'
import {
  Checkbox,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from '@/shared/components/ui'
import { ShowcaseSection } from './ShowcaseSection'

export function FormsShowcase() {
  const [notifications, setNotifications] = useState(true)

  return (
    <ShowcaseSection title="Formularios" description="Controles base, selección y estados accesibles.">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="showcase-name">Nombre</Label>
          <Input id="showcase-name" placeholder="Ada Lovelace" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="showcase-role">Rol</Label>
          <Select defaultValue="developer">
            <SelectTrigger id="showcase-role" className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="developer">Desarrollo</SelectItem>
              <SelectItem value="design">Diseño</SelectItem>
              <SelectItem value="product">Producto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="showcase-notes">Notas</Label>
          <Textarea id="showcase-notes" placeholder="Describe el propósito del registro..." />
        </div>
        <div className="space-y-3">
          <Label>Preferencia</Label>
          <RadioGroup defaultValue="compact">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="compact" id="compact" />
              <Label htmlFor="compact">Compacta</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="comfortable" id="comfortable" />
              <Label htmlFor="comfortable">Cómoda</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Acepto los términos</Label>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label htmlFor="notifications">Notificaciones</Label>
            <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </div>
      </div>
    </ShowcaseSection>
  )
}
