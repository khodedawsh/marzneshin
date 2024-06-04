/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as DashboardImport } from './routes/_dashboard'
import { Route as AuthImport } from './routes/_auth'
import { Route as DashboardIndexImport } from './routes/_dashboard/index'
import { Route as DashboardUsersImport } from './routes/_dashboard/users'
import { Route as DashboardSettingsImport } from './routes/_dashboard/settings'
import { Route as DashboardServicesImport } from './routes/_dashboard/services'
import { Route as DashboardNodesImport } from './routes/_dashboard/nodes'
import { Route as DashboardHostsImport } from './routes/_dashboard/hosts'
import { Route as AuthLoginImport } from './routes/_auth/login'

// Create/Update Routes

const DashboardRoute = DashboardImport.update({
  id: '/_dashboard',
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const DashboardIndexRoute = DashboardIndexImport.update({
  path: '/',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardUsersRoute = DashboardUsersImport.update({
  path: '/users',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardSettingsRoute = DashboardSettingsImport.update({
  path: '/settings',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardServicesRoute = DashboardServicesImport.update({
  path: '/services',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardNodesRoute = DashboardNodesImport.update({
  path: '/nodes',
  getParentRoute: () => DashboardRoute,
} as any)

const DashboardHostsRoute = DashboardHostsImport.update({
  path: '/hosts',
  getParentRoute: () => DashboardRoute,
} as any)

const AuthLoginRoute = AuthLoginImport.update({
  path: '/login',
  getParentRoute: () => AuthRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/_dashboard': {
      id: '/_dashboard'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof DashboardImport
      parentRoute: typeof rootRoute
    }
    '/_auth/login': {
      id: '/_auth/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof AuthLoginImport
      parentRoute: typeof AuthImport
    }
    '/_dashboard/hosts': {
      id: '/_dashboard/hosts'
      path: '/hosts'
      fullPath: '/hosts'
      preLoaderRoute: typeof DashboardHostsImport
      parentRoute: typeof DashboardImport
    }
    '/_dashboard/nodes': {
      id: '/_dashboard/nodes'
      path: '/nodes'
      fullPath: '/nodes'
      preLoaderRoute: typeof DashboardNodesImport
      parentRoute: typeof DashboardImport
    }
    '/_dashboard/services': {
      id: '/_dashboard/services'
      path: '/services'
      fullPath: '/services'
      preLoaderRoute: typeof DashboardServicesImport
      parentRoute: typeof DashboardImport
    }
    '/_dashboard/settings': {
      id: '/_dashboard/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof DashboardSettingsImport
      parentRoute: typeof DashboardImport
    }
    '/_dashboard/users': {
      id: '/_dashboard/users'
      path: '/users'
      fullPath: '/users'
      preLoaderRoute: typeof DashboardUsersImport
      parentRoute: typeof DashboardImport
    }
    '/_dashboard/': {
      id: '/_dashboard/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof DashboardIndexImport
      parentRoute: typeof DashboardImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  AuthRoute: AuthRoute.addChildren({ AuthLoginRoute }),
  DashboardRoute: DashboardRoute.addChildren({
    DashboardHostsRoute,
    DashboardNodesRoute,
    DashboardServicesRoute,
    DashboardSettingsRoute,
    DashboardUsersRoute,
    DashboardIndexRoute,
  }),
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_auth",
        "/_dashboard"
      ]
    },
    "/_auth": {
      "filePath": "_auth.tsx",
      "children": [
        "/_auth/login"
      ]
    },
    "/_dashboard": {
      "filePath": "_dashboard.tsx",
      "children": [
        "/_dashboard/hosts",
        "/_dashboard/nodes",
        "/_dashboard/services",
        "/_dashboard/settings",
        "/_dashboard/users",
        "/_dashboard/"
      ]
    },
    "/_auth/login": {
      "filePath": "_auth/login.tsx",
      "parent": "/_auth"
    },
    "/_dashboard/hosts": {
      "filePath": "_dashboard/hosts.tsx",
      "parent": "/_dashboard"
    },
    "/_dashboard/nodes": {
      "filePath": "_dashboard/nodes.tsx",
      "parent": "/_dashboard"
    },
    "/_dashboard/services": {
      "filePath": "_dashboard/services.tsx",
      "parent": "/_dashboard"
    },
    "/_dashboard/settings": {
      "filePath": "_dashboard/settings.tsx",
      "parent": "/_dashboard"
    },
    "/_dashboard/users": {
      "filePath": "_dashboard/users.tsx",
      "parent": "/_dashboard"
    },
    "/_dashboard/": {
      "filePath": "_dashboard/index.tsx",
      "parent": "/_dashboard"
    }
  }
}
ROUTE_MANIFEST_END */
