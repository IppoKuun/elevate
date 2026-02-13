import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Lance un nettoyage automatique du "faux navigateur" après chaque test
afterEach(() => {
  cleanup();
});