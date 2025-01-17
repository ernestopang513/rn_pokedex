export const darkenColor = (hex: string | undefined, targetLuminance: number = 0.21): string | null => {
    // Convertir HEX a RGB y normalizar

    if ( !hex) { return null }
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
  
    // Ajustar luminancia
    const adjust = (c: number) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    const unadjust = (c: number) =>
      c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  
    // Calcular luminancia actual
    const luminance =
      0.2126 * adjust(r) + 0.7152 * adjust(g) + 0.0722 * adjust(b);
  
    // Si ya es suficientemente oscuro, retornar el color original
    if (luminance <= targetLuminance) return hex;
  
    // Escalar proporcionalmente para reducir luminancia
    const scale = Math.sqrt(targetLuminance / luminance);
    const darken = (c: number) =>
      Math.min(255, Math.max(0, Math.round(unadjust(adjust(c) * scale) * 255)));
  
    // Convertir a HEX de nuevo
    const newR = darken(r);
    const newG = darken(g);
    const newB = darken(b);
  
    return `#${newR.toString(16).padStart(2, "0")}${newG
      .toString(16)
      .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
  };
  