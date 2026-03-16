"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ComponentSlot =
  | "cpu"
  | "motherboard"
  | "ram"
  | "storage"
  | "gpu"
  | "psu"
  | "case"
  | "cooler";

export const BUILDER_STEPS: { slot: ComponentSlot; label: string }[] = [
  { slot: "cpu", label: "CPU" },
  { slot: "motherboard", label: "Motherboard" },
  { slot: "ram", label: "RAM" },
  { slot: "storage", label: "Storage" },
  { slot: "gpu", label: "GPU" },
  { slot: "psu", label: "PSU" },
  { slot: "case", label: "Case" },
  { slot: "cooler", label: "Cooling" },
];

export interface BuilderProduct {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  image: string;
  slug: string;
  brand: string;
  socketType?: string | null;
  memoryType?: string | null;
  formFactor?: string | null;
  wattage?: number | null;
  componentType: string;
  specs?: Record<string, unknown> | null;
}

interface BuilderStore {
  currentStep: number;
  selections: Partial<Record<ComponentSlot, BuilderProduct>>;
  errors: string[];
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  selectComponent: (slot: ComponentSlot, product: BuilderProduct) => void;
  removeComponent: (slot: ComponentSlot) => void;
  clearBuild: () => void;
  getBuildTotal: () => number;
  getSelectedCount: () => number;
}

export const useBuilderStore = create<BuilderStore>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      selections: {},
      errors: [],
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < BUILDER_STEPS.length - 1) {
          set({ currentStep: currentStep + 1 });
        }
      },
      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },
      selectComponent: (slot, product) => {
        set({
          selections: { ...get().selections, [slot]: product },
        });
      },
      removeComponent: (slot) => {
        const selections = { ...get().selections };
        delete selections[slot];
        set({ selections });
      },
      clearBuild: () =>
        set({ selections: {}, currentStep: 0, errors: [] }),
      getBuildTotal: () => {
        return Object.values(get().selections).reduce(
          (total, product) =>
            total + (product?.salePrice ?? product?.price ?? 0),
          0
        );
      },
      getSelectedCount: () => {
        return Object.keys(get().selections).length;
      },
    }),
    { name: "pc-it-together-builder" }
  )
);
