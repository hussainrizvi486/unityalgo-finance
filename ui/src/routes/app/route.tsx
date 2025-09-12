import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '../../layout';

export const Route = createFileRoute('/app')({
  component: Layout,
})

