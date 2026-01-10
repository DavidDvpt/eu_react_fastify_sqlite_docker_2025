import SignUpPage from "@/pages/auth/SignUpPage";
import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AppLayout from "../layouts/AppLayout";
import AuthLayout from "../layouts/AuthLayout";
import RootLayout from "../layouts/RootLayout";
import HomePage from "../pages/HomePage";
import SignIngPage from "../pages/auth/SignInPage";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          { path: "signin", element: <SignIngPage />, children: [] },
          { path: "signup", element: <SignUpPage />, children: [] },
        ],
      },
      { path: "admin", element: <AdminLayout />, children: [] },
      {
        element: <AppLayout />,
        children: [{ index: true, element: <HomePage /> }],
      },
    ],
  },
]);

export default appRouter;
