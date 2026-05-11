import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import router from "./routes";
import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/react-query";
import { Toaster } from "sonner";
import { store } from "./store";
import { Provider } from "react-redux";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
        <Toaster richColors />
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
);
