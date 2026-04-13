import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { registerSW } from "virtual:pwa-register";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./Components/ErrorFallback";
import { initializeFaro } from "@grafana/faro-react";

initializeFaro({
  url: import.meta.env.VITE_FARO_URL,
  app: {
    name: import.meta.env.VITE_FARO_APP_NAME || "lingua-tile-web",
  },
  sessionTracking: {
    enabled: true,
    samplingRate: 1.0,
  },
});

const root = createRoot(document.getElementById("root") as HTMLElement);
const queryClient = new QueryClient();
root.render(
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
    </ErrorBoundary>
  </QueryClientProvider>,
);

registerSW({
  // onNeedRefresh() {
  //   console.log("New content available, verify to update.");
  // },
  // onOfflineReady() {
  //   console.log("App ready to work offline");
  // },
  // onRegistered(r) {
  //   console.log("SW Registered:", r);
  // },
  // onRegisterError(error) {
  //   console.error("SW Registration Error:", error);
  // },
});
