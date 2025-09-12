import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute("/")({
  component: () => <h1>Welcome Home</h1>,
})