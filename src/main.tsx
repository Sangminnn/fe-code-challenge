import "modern-normalize";
import { OverlayProvider } from "overlay-kit";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ModalFormPage from "./components/ModalFormPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OverlayProvider>
      <ModalFormPage />
    </OverlayProvider>
  </StrictMode>
);
