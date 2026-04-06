import { QueryClientProvider } from "@tanstack/react-query";
import { ApiStatus } from "@/lib/axios/ApiStatus";
import { authMeThunk, selectAuthStatus } from "@/modules/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useRef } from "react";
import { RouterProvider } from "react-router-dom";
import { queryClient } from "./lib/react-query/queryClient";
import appRouter from "./router/appRouter";

function App() {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);
  const hasBootstrappedAuth = useRef(false);

  useEffect(() => {
    if (hasBootstrappedAuth.current || authStatus !== ApiStatus.IDLE) {
      return;
    }

    hasBootstrappedAuth.current = true;
    void dispatch(authMeThunk());
  }, [authStatus, dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={appRouter} />
    </QueryClientProvider>
  );
}
export default App;
