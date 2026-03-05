import AdminLayout from "@/layouts/AdminLayout";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import RootLayout from "@/layouts/RootLayout";
import GuestOnly from "@/modules/auth/guards/GuestOnly";
import RequireAuth from "@/modules/auth/guards/RequireAuth";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import SignInPage from "@/pages/auth/SignInPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import { Navigate } from "react-router-dom";

const routes = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        element: <GuestOnly />,
        children: [
          {
            path: "auth",
            element: <AuthLayout />,
            children: [
              { path: "signin", element: <SignInPage /> },
              { path: "signup", element: <SignUpPage /> },
            ],
          },
        ],
      },
      { path: "admin", element: <AdminLayout />, children: [] },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { index: true, element: <Navigate to="/home" replace /> },
              { path: "home", element: <HomePage /> },
              { path: "*", element: <NotFoundPage />, children: [] },
            ],
          },
        ],
      },
      { path: "*", element: <NotFoundPage />, children: [] },
    ],
  },
];

export default routes;
