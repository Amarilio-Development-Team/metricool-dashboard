'use client';

interface Props {
  code: string;
  fallback: string;
}

export const CountryName = ({ code, fallback }: Props) => {
  // 1. Calculamos la traducción directamente en el render
  let displayName = fallback;

  try {
    // Intentamos traducir usando la API del navegador
    const regionNames = new Intl.DisplayNames(['es'], { type: 'region' });
    const translated = regionNames.of(code);
    if (translated) displayName = translated;
  } catch {
    // Si falla (o en servidor si no soporta Intl), nos quedamos con el fallback
  }

  // 2. Usamos suppressHydrationWarning
  // Esto le dice a React: "Ya sé que el servidor renderizó 'fallback' y el cliente 'displayName'.
  // No lances error de hidratación, solo actualiza el texto."
  return <span suppressHydrationWarning>{displayName}</span>;
};
