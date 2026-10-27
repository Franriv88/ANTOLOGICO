// Helpers para comprimir imágenes del lado del cliente antes de guardarlas
// como data URL en Firestore. Priorizamos WebP (hasta 70% más chico que PNG,
// 25-35% más chico que JPEG) con fallback automático al formato legacy si el
// browser del tenant no lo soporta.

let _webpSupport = null;

/**
 * Detecta si el browser soporta codificar WebP vía canvas.toDataURL.
 * El resultado se cachea para no recomputar en cada llamada.
 */
export function supportsWebP() {
  if (_webpSupport !== null) return _webpSupport;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1; canvas.height = 1;
    const dataUrl = canvas.toDataURL('image/webp');
    _webpSupport = dataUrl.startsWith('data:image/webp');
  } catch {
    _webpSupport = false;
  }
  return _webpSupport;
}

/**
 * Comprime una imagen (File o Blob) a un data URL optimizado.
 *
 * @param {File|Blob} file         imagen de origen
 * @param {object}    options
 * @param {number}    options.maxPx     tamaño máximo en el lado largo (default 800)
 * @param {number}    options.quality   0..1 — calidad de WebP/JPEG (default 0.82)
 * @param {boolean}   options.keepTransparency  si true, cae a PNG en vez de JPEG
 *                                              cuando no hay WebP (default false)
 * @returns {Promise<string>}       data URL comprimida (image/webp preferentemente)
 */
export function compressImageToDataUrl(file, {
  maxPx = 800,
  quality = 0.82,
  keepTransparency = false,
} = {}) {
  return new Promise((resolve, reject) => {
    if (!file) { reject(new Error('No se recibió ningún archivo.')); return; }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      try {
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);

        if (supportsWebP()) {
          // WebP soporta transparencia y lossy, usar siempre que esté disponible.
          resolve(canvas.toDataURL('image/webp', quality));
          return;
        }
        // Fallback por si el browser no soporta WebP.
        // Si la imagen necesita transparencia (ej. logo), cae a PNG.
        // Si no, usa JPEG que es más eficiente que PNG para fotos.
        resolve(canvas.toDataURL(
          keepTransparency ? 'image/png' : 'image/jpeg',
          quality,
        ));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err || new Error('No se pudo cargar la imagen.'));
    };
    img.src = url;
  });
}
