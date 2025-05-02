import { create } from "zustand";
import * as fabric from "fabric";

type CanvaStore = {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
};

export const useCanvaStore = create<CanvaStore>((set) => ({
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),
}));
