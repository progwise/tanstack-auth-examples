import { QueryClient } from "@tanstack/react-query";
import {
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import type { ReactNode } from "react";
import React, { Suspense } from "react";

import css from "../styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title: "TanStack Start Auth Example",
        },
      ],
      links: [{ rel: "stylesheet", href: css }],
    }),
    component: RootComponent,
  }
);

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((result) => ({
          default: result.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        }))
      );

const TanStackQueryDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/react-query-devtools").then((result) => ({
          default: result.ReactQueryDevtools,
          // For Embedded Mode
          // default: res.TanStackQueryDevtoolsPanel
        }))
      );

function RootComponent() {
  return (
    <RootDocument>
      <header>
        <h1>TanStack Start Auth Example</h1>
        <p>
          This is an example of how to use{" "}
          <a href="https://tanstack.com/router/latest/docs/framework/react/start/overview">
            TanStack Start
          </a>{" "}
          with authentication using no oAuth library and the (
          <a href="https://oauth.net/2/grant-types/authorization-code/">
            OAuth 2.0 Auth Code Grant
          </a>{" "}
          flow. )
        </p>
        <p>
          Client-secret lives only on the server side and implementation should
          be safe.
        </p>
        <p>
          The access-tokens are stored in separate localStorage items to allow
          reloading the page without loosing the tokens. This is just a simple
          demo.
        </p>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <a href="progwise.net">Progwise</a> &copy; {new Date().getFullYear()}
      </footer>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <Meta />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Suspense>
          <TanStackRouterDevtools />
        </Suspense>
        <Suspense>
          <TanStackQueryDevtools />
        </Suspense>
      </body>
    </html>
  );
}
