import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

export const renderRoutes = (routes = []) => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {routes.map((route, i) => {
          const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;
          const Element = route.element;

          return (
            <Route
              key={i}
              path={route.path}
              element={
                <Guard>
                  <Layout>{route.routes ? renderRoutes(route.routes) : <Element />}</Layout>
                </Guard>
              }
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export const publicRoutes = [
  {
    exact: 'true',
    path: '/auth/login',
    element: lazy(() => import('./views/auth/signin/Login'))
  },
  {
    exact: 'true',
    path: '*',
    element: () => <Navigate to="/auth/login" />
  }
];

export const protectedRoutes = [
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/app/dashboard/reports',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/admin/users',
        element: lazy(() => import('./views/admin/users'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/admin/add-user',
        element: lazy(() => import('./views/admin/add-user'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/admin/edit-user',
        element: lazy(() => import('./views/admin/edit-user'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/default',
        element: lazy(() => import('./views/profile'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/authors/authors-list',
        element: lazy(() => import('./views/authors/authors-list'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/authors/add-author',
        element: lazy(() => import('./views/authors/add-author'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/authors/edit-author',
        element: lazy(() => import('./views/authors/edit-author'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/reports/reports-list',
        element: lazy(() => import('./views/reports/reports-list'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/explanations/explanations-list',
        element: lazy(() => import('./views/explanations/explanations-list'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/explanations/add-explanation',
        element: lazy(() => import('./views/explanations/add-explanation'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/explanations/edit-explanation',
        element: lazy(() => import('./views/explanations/edit-explanation'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/videos/videos-list',
        element: lazy(() => import('./views/videos/videos-list'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/videos/create-video',
        element: lazy(() => import('./views/videos/create-video'))
      },
      {
        exact: 'true',
        path: '/app/dashboard/profile/*',
        element: lazy(() => import('./views/profile'))
      },
      {
        exact: 'true',
        path: '*',
        element: () => <Navigate to="/app/dashboard/reports" />
      }
    ]
  }
];
