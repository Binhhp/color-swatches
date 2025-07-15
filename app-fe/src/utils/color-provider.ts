import type { HSBColor } from "@shopify/polaris";

export class ColorProvider {
  static hsbToHex({ hue, saturation, brightness }: HSBColor): string {
    // Normalize values
    const h = (hue * 100) / 360; // Convert to 0-1 range
    const s = (saturation * 100) / 100; // Convert to 0-1 range  
    const v = (brightness * 100) / 100; // Convert to 0-1 range

    let r = 0, g = 0, b = 0;

    if (s === 0) {
      // Achromatic (gray)
      r = g = b = v;
    } else {
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const p = v * (1 - s);
      const q = v * (1 - f * s);
      const t = v * (1 - (1 - f) * s);

      switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
      }
    }

    const red = Math.round(r * 255);
    const green = Math.round(g * 255);
    const blue = Math.round(b * 255);

    return "#" + [red, green, blue].map((x) => x.toString(16).padStart(2, "0")).join("");
  }

  static hexToHsba(hex: string): HSBColor {
    // Remove # and normalize
    let c = hex?.replace("#", "").trim() ?? "";
    if (c.length === 3) {
      c = [0, 1, 2].map((i) => (c[i] ?? "") + (c[i] ?? "")).join("");
    }
    if (c.length !== 6) {
      // fallback to black
      return { hue: 0, saturation: 0, brightness: 0 };
    }
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    // Convert RGB to HSB/HSV
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    let h = 0;
    if (delta === 0) {
      h = 0;
    } else if (max === rNorm) {
      h = 60 * (((gNorm - bNorm) / delta) % 6);
    } else if (max === gNorm) {
      h = 60 * ((bNorm - rNorm) / delta + 2);
    } else if (max === bNorm) {
      h = 60 * ((rNorm - gNorm) / delta + 4);
    }
    if (h < 0) h += 360;

    const s = max === 0 ? 0 : (delta / max) * 100;
    const v = max * 100;

    // If HSBColor supports alpha, add it. Otherwise, just return h,s,v
    return {
      hue: h,
      saturation: s,
      brightness: v,
      alpha: 1
    } as HSBColor;
  }
}

