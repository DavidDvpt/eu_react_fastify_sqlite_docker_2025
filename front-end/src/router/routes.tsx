import AdminLayout from "@/layouts/AdminLayout";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import RootLayout from "@/layouts/RootLayout";
import GuestOnly from "@/modules/auth/guards/GuestOnly";
import RequireAuth from "@/modules/auth/guards/RequireAuth";
import HomePage from "@/pages/HomePage";
import SignInPage from "@/pages/auth/SignInPage";
import SignUpPage from "@/pages/auth/SignUpPage";

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
            children: [{ index: true, element: <HomePage /> }],
          },
        ],
      },
    ],
  },
];

export default routes;
