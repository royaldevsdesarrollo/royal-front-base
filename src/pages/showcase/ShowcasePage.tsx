import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui'
import { PageContainer } from '@/shared/components'
import { ActionsShowcase } from './components/ActionsShowcase'
import { DataShowcase } from './components/DataShowcase'
import { FeedbackShowcase } from './components/FeedbackShowcase'
import { FormsShowcase } from './components/FormsShowcase'
import { NavigationShowcase } from './components/NavigationShowcase'

export function ShowcasePage() {
  return (
    <PageContainer title="Showcase de componentes" description="Kit esencial del scaffold con ejemplos interactivos y estados representativos.">
      <Tabs defaultValue="essentials">
        <TabsList>
          <TabsTrigger value="essentials">Esenciales</TabsTrigger>
          <TabsTrigger value="guidance">Guía</TabsTrigger>
        </TabsList>
        <TabsContent value="essentials" className="grid gap-6 pt-4 lg:grid-cols-2">
          <FormsShowcase />
          <ActionsShowcase />
          <FeedbackShowcase />
          <DataShowcase />
          <NavigationShowcase />
        </TabsContent>
        <TabsContent value="guidance" className="pt-4">
          <Accordion type="single" collapsible className="rounded-xl border px-4">
            <AccordionItem value="tokens">
              <AccordionTrigger>¿Cómo se personaliza la marca?</AccordionTrigger>
              <AccordionContent>Modifica los tokens semánticos de theme.css; los componentes no necesitan cambios.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="install">
              <AccordionTrigger>¿Cómo se agregan componentes?</AccordionTrigger>
              <AccordionContent>Usa pnpm ui:add seguido del nombre del componente para actualizar también el barrel.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
