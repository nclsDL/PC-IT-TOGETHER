import { BuilderProduct, ComponentSlot } from "@/store/builder-store";

export interface CompatibilityResult {
  compatible: boolean;
  reason?: string;
}

export function checkCompatibility(
  slot: ComponentSlot,
  product: BuilderProduct,
  selections: Partial<Record<ComponentSlot, BuilderProduct>>
): CompatibilityResult {
  switch (slot) {
    case "cpu":
      return { compatible: true };

    case "motherboard": {
      const cpu = selections.cpu;
      if (cpu && product.socketType && cpu.socketType) {
        if (product.socketType !== cpu.socketType) {
          return {
            compatible: false,
            reason: `Socket mismatch: CPU uses ${cpu.socketType}, motherboard uses ${product.socketType}`,
          };
        }
      }
      return { compatible: true };
    }

    case "ram": {
      const mobo = selections.motherboard;
      if (mobo && product.memoryType && mobo.memoryType) {
        if (product.memoryType !== mobo.memoryType) {
          return {
            compatible: false,
            reason: `Memory type mismatch: Motherboard supports ${mobo.memoryType}, RAM is ${product.memoryType}`,
          };
        }
      }
      return { compatible: true };
    }

    case "storage":
      return { compatible: true };

    case "gpu":
      return { compatible: true };

    case "psu": {
      let totalWattage = 0;
      const slots: ComponentSlot[] = ["cpu", "gpu", "motherboard", "ram", "storage", "cooler"];
      for (const s of slots) {
        const comp = s === slot ? product : selections[s];
        if (comp?.wattage) {
          totalWattage += comp.wattage;
        }
      }
      const requiredWattage = Math.ceil(totalWattage * 1.2);
      if (product.wattage && product.wattage < requiredWattage) {
        return {
          compatible: false,
          reason: `PSU wattage (${product.wattage}W) insufficient. Recommended: ${requiredWattage}W minimum`,
        };
      }
      return { compatible: true };
    }

    case "case": {
      const mobo = selections.motherboard;
      if (mobo && product.formFactor && mobo.formFactor) {
        const caseSize = formFactorRank(product.formFactor);
        const moboSize = formFactorRank(mobo.formFactor);
        if (caseSize < moboSize) {
          return {
            compatible: false,
            reason: `Case (${product.formFactor}) is too small for motherboard (${mobo.formFactor})`,
          };
        }
      }
      return { compatible: true };
    }

    case "cooler": {
      const cpu = selections.cpu;
      if (cpu && product.socketType && cpu.socketType) {
        const supportedSockets = product.socketType.split(",").map((s) => s.trim());
        if (!supportedSockets.includes(cpu.socketType)) {
          return {
            compatible: false,
            reason: `Cooler doesn't support CPU socket ${cpu.socketType}`,
          };
        }
      }
      return { compatible: true };
    }

    default:
      return { compatible: true };
  }
}

function formFactorRank(ff: string): number {
  const lower = ff.toLowerCase();
  if (lower.includes("itx") || lower.includes("mini-itx")) return 1;
  if (lower.includes("matx") || lower.includes("micro-atx") || lower.includes("m-atx")) return 2;
  if (lower.includes("atx")) return 3;
  if (lower.includes("eatx") || lower.includes("e-atx")) return 4;
  return 3;
}

export function getAllCompatibilityErrors(
  selections: Partial<Record<ComponentSlot, BuilderProduct>>
): string[] {
  const errors: string[] = [];
  for (const [slot, product] of Object.entries(selections)) {
    if (product) {
      const result = checkCompatibility(
        slot as ComponentSlot,
        product,
        selections
      );
      if (!result.compatible && result.reason) {
        errors.push(result.reason);
      }
    }
  }
  return errors;
}
