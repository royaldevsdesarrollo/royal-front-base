import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina clases de Tailwind resolviendo conflictos.
 * Une con `clsx` y deduplica con `tailwind-merge`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
