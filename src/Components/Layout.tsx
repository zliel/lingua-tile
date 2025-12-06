import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import NavBar from "./NavBar";
import PWAInstallPrompt from "./PWAInstallPrompt";
import PageSkeleton from "./skeletons/PageSkeleton";
import { Suspense } from "react";

export default function Layout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <NavBar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </Box>
      <PWAInstallPrompt />
    </Box>
  );
}
