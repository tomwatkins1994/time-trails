import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import * as TanstackQuery from "./providers/query-client-provider"
import { routeTree } from './routeTree.gen'

export function createRouter() {
  const queryClient = new QueryClient()

  const router = routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: {
        ...TanstackQuery.getContext(),
      },
      scrollRestoration: true,
      defaultPreloadStaleTime: 0,
      Wrap: (props: { children: React.ReactNode }) => {
        return (
          <TanstackQuery.Provider>{props.children}</TanstackQuery.Provider>
        );
      },
    }),
    TanstackQuery.getContext().queryClient
  );

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}