import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App, { Dashboard } from './App.tsx';
import InboxDetail from './InboxDetail';
import { loadInbox } from './inboxRoutes';

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    hydrateFallbackElement: <p role="status">Loading inbox…</p>,
    children: [
      { index: true, Component: Dashboard },
      { path: 'inboxes/:inboxId', Component: InboxDetail, loader: loadInbox },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
