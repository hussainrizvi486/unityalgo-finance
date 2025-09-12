import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '../../layout';
import { Outlet } from 'react-router-dom';

export const Route = createFileRoute('/app/')({
  // component: Layout,
  component: () => (
    <div>
      <h1>Dashboard</h1>
      <Outlet />
    </div>)
})

