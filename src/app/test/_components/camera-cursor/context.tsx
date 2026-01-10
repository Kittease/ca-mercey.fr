"use client";

import { createContext } from "react";

import { type HoveredElementData } from "./types";

export interface CameraCursorContextInterface {
  hoveredElementData: HoveredElementData | null;
  setHoveredElementData: (data: HoveredElementData | null) => void;
}

const CameraCursorContext = createContext<CameraCursorContextInterface>({
  hoveredElementData: null,
  setHoveredElementData: () => {},
});

export default CameraCursorContext;
