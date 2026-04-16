import Layout from "@/layouts/Layout";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import LeftMenuLayout from "@/layouts/LeftMenuLayout";
import RootLayout from "@/layouts/RootLayout";
import GuestOnly from "@/modules/auth/guards/GuestOnly";
import RequireAuth from "@/modules/auth/guards/RequireAuth";
import HomePage from "@/pages/HomePage";
import ManagePage from "@/pages/manage/ManagePage";
import NotFoundPage from "@/pages/NotFoundPage";
import StockPage from "@/pages/stock/StockPage";
import TradePage from "@/pages/trade/TradePage";
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
      { path: "admin", element: <Layout />, children: [] },
      {
        element: <RequireAuth />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { index: true, element: <Navigate to="/home" replace /> },
              { path: "home", element: <HomePage /> },
              { path: "trading", element: <Navigate to="/trade" replace /> },
              { path: "trade", element: <TradePage /> },
              { path: "trade/:id", element: <TradePage /> },
              { path: "trade/:id/:action", element: <TradePage /> },
              { path: "stock", element: <StockPage /> },
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
