import type { HSBColor, RGBColor } from "@shopify/polaris";

export class ColorProvider {
  static rgbToHex({ red, green, blue }: RGBColor): string {
    return "#" + [red, green, blue].map((x) => x.toString(16).padStart(2, "0")).join("");
  }

  static hsbToRgb({ hue, saturation, brightness }: HSBColor): RGBColor {
    const sat = (saturation * 100) / 100;
    const bright = (brightness * 100) / 100;
    const chroma = bright * sat;
    const hueSegment = (hue * 100) / 60;
    const x = chroma * (1 - Math.abs((hueSegment % 2) - 1));

    let r = 0,
      g = 0,
      b = 0;

    if (hueSegment >= 0 && hueSegment < 1) {
      r = chroma;
      g = x;
      b = 0;
    } else if (hueSegment >= 1 && hueSegment < 2) {
      r = x;
      g = chroma;
      b = 0;
    } else if (hueSegment >= 2 && hueSegment < 3) {
      r = 0;
      g = chroma;
      b = x;
    } else if (hueSegment >= 3 && hueSegment < 4) {
      r = 0;
      g = x;
      b = chroma;
    } else if (hueSegment >= 4 && hueSegment < 5) {
      r = x;
      g = 0;
      b = chroma;
    } else if (hueSegment >= 5 && hueSegment <= 6) {
      r = chroma;
      g = 0;
      b = x;
    }

    const m = bright - chroma;

    return {
      red: Math.round((r + m) * 255),
      green: Math.round((g + m) * 255),
      blue: Math.round((b + m) * 255)
    };
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
      brightness: v
    } as HSBColor;
  }
}
