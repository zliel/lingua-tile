import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { registerSW } from "virtual:pwa-register";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./Components/ErrorFallback";

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

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
