import {
  Avatar,
  AvatarFallback,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui'
import { ShowcaseSection } from './ShowcaseSection'

const PEOPLE = [
  { initials: 'AL', name: 'Ada Lovelace', role: 'Engineering', status: 'Activa' },
  { initials: 'GH', name: 'Grace Hopper', role: 'Platform', status: 'Activa' },
  { initials: 'AT', name: 'Alan Turing', role: 'Research', status: 'Invitado' },
] as const

export function DataShowcase() {
  return (
    <ShowcaseSection title="Datos" description="Tabla responsive, avatar y paginación.">
      <div className="space-y-5 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Persona</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PEOPLE.map(person => (
              <TableRow key={person.name}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8"><AvatarFallback>{person.initials}</AvatarFallback></Avatar>
                    <span className="font-medium">{person.name}</span>
                  </div>
                </TableCell>
                <TableCell>{person.role}</TableCell>
                <TableCell>{person.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationPrevious href="#" text="Anterior" /></PaginationItem>
            <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
            <PaginationItem><PaginationNext href="#" text="Siguiente" /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </ShowcaseSection>
  )
}
