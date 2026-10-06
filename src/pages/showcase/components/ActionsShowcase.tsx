import { Bell, ChevronDown, Settings } from 'lucide-react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui'
import { ShowcaseSection } from './ShowcaseSection'

export function ActionsShowcase() {
  return (
    <ShowcaseSection title="Acciones y overlays" description="Variantes de botón, menús y superficies flotantes.">
      <div className="flex flex-wrap gap-3">
        <Button type="button">Primario</Button>
        <Button type="button" variant="secondary">Secundario</Button>
        <Button type="button" variant="outline">Outline</Button>
        <Button type="button" variant="ghost">Ghost</Button>
        <Button type="button" variant="destructive">Destructivo</Button>
        <Button type="button" disabled>Deshabilitado</Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline">
              Menú
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Editar perfil</DropdownMenuItem>
            <DropdownMenuItem>Preferencias</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog>
          <DialogTrigger asChild><Button type="button" variant="outline">Abrir dialog</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar acción</DialogTitle>
              <DialogDescription>Este dialog demuestra una decisión que requiere contexto.</DialogDescription>
            </DialogHeader>
            <DialogFooter><Button type="button">Confirmar</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Sheet>
          <SheetTrigger asChild>
            <Button type="button" variant="outline">
              <Settings />
              {' '}
              Abrir sheet
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Preferencias</SheetTitle>
              <SheetDescription>Panel lateral para tareas secundarias.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline">
              <Bell />
              {' '}
              Popover
            </Button>
          </PopoverTrigger>
          <PopoverContent className="text-sm">No tienes notificaciones nuevas.</PopoverContent>
        </Popover>

        <Tooltip>
          <TooltipTrigger asChild><Button type="button" size="icon" variant="ghost" aria-label="Configuración"><Settings /></Button></TooltipTrigger>
          <TooltipContent>Configuración</TooltipContent>
        </Tooltip>
      </div>
    </ShowcaseSection>
  )
}
