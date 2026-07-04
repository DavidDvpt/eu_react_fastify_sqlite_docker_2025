import Layout from "@/layouts/Layout";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import LeftMenuLayout from "@/layouts/LeftMenuLayout";
import RootLayout from "@/layouts/RootLayout";
import GuestOnly from "@/modules/auth/guards/GuestOnly";
import RequireAuth from "@/modules/auth/guards/RequireAuth";
import HomePage from "@/pages/HomePage";
import ManagePage from "@/pages/managePage/ManagePage";
import NotFoundPage from "@/pages/NotFoundPage";
import { Navigate } from "react-router-dom";
import InventoryPage from "@/pages/inventoryPage/InventoryPage";
import SignInPage from "@/pages/authPages/SignInPage";
import SignUpPage from "@/pages/authPages/SignUpPage";

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
      { path: "admin", element: <Layout />, children: [] },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { index: true, element: <Navigate to="/home" replace /> },
              { path: "home", element: <HomePage /> },
              { path: "home/:id/:action", element: <HomePage /> },
              {
                path: "trading",
                element: <Navigate to="/inventory" replace />,
              },
              { path: "inventory", element: <InventoryPage /> },
              { path: "inventory/:id", element: <InventoryPage /> },
              { path: "inventory/:id/:action", element: <InventoryPage /> },
              {
                element: <LeftMenuLayout />,
                children: [
                  {
                    path: "manage",
                    children: [
                      {
                        index: true,
                        element: <Navigate to="/manage/category" replace />,
                      },
                      { path: ":tab", element: <ManagePage /> },
                      { path: ":tab/create", element: <ManagePage /> },
                      { path: ":tab/:id/edit", element: <ManagePage /> },
                    ],
                  },
                ],
              },

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
