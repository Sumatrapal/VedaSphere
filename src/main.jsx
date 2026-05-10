// ─────────────────────────────────────────────────────────────────────────────
// main.jsx  —  App entry point
// ─────────────────────────────────────────────────────────────────────────────
import { StrictMode } from "react";
import { createRoot }  from "react-dom/client";
import VedaSphere      from "./VedaSphere";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <VedaSphere />
  </StrictMode>
);
