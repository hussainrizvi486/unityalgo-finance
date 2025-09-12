import { createFileRoute } from '@tanstack/react-router'
import Index from "@/features/point-of-sale/pages/invoice/form";

export const Route = createFileRoute('/app/invoice')({
  component: Index,
})
