import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";

const appRouter = createBrowserRouter([
  { path: "/", element: <RootLayout />, children: [] },
]);

export default appRouter;
