import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/api/';
import './index.css';
// import Application from './app.tsx';
// import { Provider } from 'react-redux'
// import { store } from "./store"
import { routeTree } from './routeTree.gen' // auto-generated

import { RouterProvider, createRouter } from '@tanstack/react-router'
const router = createRouter({ routeTree })





createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <Provider store={store}> */}
      <RouterProvider router={router} />
      {/* </Provider> */}
    </QueryClientProvider>
  </StrictMode >,
)
