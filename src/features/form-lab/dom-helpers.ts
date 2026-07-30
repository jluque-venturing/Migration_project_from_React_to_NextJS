/**
 * Helpers de DOM con side effects para el feature form-lab.
 *
 * Toda la lógica del feature que necesita tocar `document`, crear
 * elementos auxiliares o disparar descargas vive aquí, separada de
 * `utils.ts` (que debe permanecer puro según la skill §4).
 */

export interface DownloadOptions {
  filename: string;
  content: string;
  mime?: string;
}

/**
 * Dispara la descarga de un archivo en el navegador con el contenido dado.
 * Retorna `false` si la API no está disponible (SSR o navegadores legacy).
 */
export function downloadTextFile({
  filename,
  content,
  mime = "application/json",
}: DownloadOptions): boolean {
  if (typeof document === "undefined") return false;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
  return true;
}
