/**
 * Preprocessor and sprite manager for Theo Lucca character
 * Removes the white/light background from the input photo so Theo Lucca is a transparent game sprite
 */

export interface CharacterSprites {
  normal: HTMLCanvasElement | null;
  flipped: HTMLCanvasElement | null;
  loaded: boolean;
  aspectRatio: number;
}

export const theoSprites: CharacterSprites = {
  normal: null,
  flipped: null,
  loaded: false,
  aspectRatio: 1.45,
};

export const CHARACTER_IMAGE_URL = '/assets/aistudio/IMG-20261104-WA8802_feb80167.jpg';

export function loadAndProcessTheoImage(): Promise<CharacterSprites> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = CHARACTER_IMAGE_URL;

    img.onload = () => {
      try {
        const origW = img.naturalWidth || img.width;
        const origH = img.naturalHeight || img.height;
        const maxDim = 280;
        const scale = Math.min(1, maxDim / Math.max(origW, origH));
        const rawW = Math.max(1, Math.round(origW * scale));
        const rawH = Math.max(1, Math.round(origH * scale));

        const offCanvas = document.createElement('canvas');
        offCanvas.width = rawW;
        offCanvas.height = rawH;
        const offCtx = offCanvas.getContext('2d');

        if (!offCtx) {
          theoSprites.loaded = true;
          resolve(theoSprites);
          return;
        }

        offCtx.drawImage(img, 0, 0, rawW, rawH);
        const imgData = offCtx.getImageData(0, 0, rawW, rawH);
        const data = imgData.data;

        // Flood-fill or edge color removal from outer perimeter to remove white background
        // First find background color average from top corners
        const cornerColors: [number, number, number][] = [
          [data[0], data[1], data[2]],
          [data[(rawW - 1) * 4], data[(rawW - 1) * 4 + 1], data[(rawW - 1) * 4 + 2]],
        ];
        const avgR = (cornerColors[0][0] + cornerColors[1][0]) / 2;
        const avgG = (cornerColors[0][1] + cornerColors[1][1]) / 2;
        const avgB = (cornerColors[0][2] + cornerColors[1][2]) / 2;

        // BFS / flood fill from perimeter to remove outer background without erasing internal whites (like eyes or teeth)
        const visited = new Uint8Array(rawW * rawH);
        const queue: number[] = [];

        // Add top and bottom borders
        for (let x = 0; x < rawW; x++) {
          queue.push(x); // top row
          queue.push((rawH - 1) * rawW + x); // bottom row
          visited[x] = 1;
          visited[(rawH - 1) * rawW + x] = 1;
        }
        // Add left and right borders
        for (let y = 0; y < rawH; y++) {
          const leftIdx = y * rawW;
          const rightIdx = y * rawW + (rawW - 1);
          if (!visited[leftIdx]) {
            queue.push(leftIdx);
            visited[leftIdx] = 1;
          }
          if (!visited[rightIdx]) {
            queue.push(rightIdx);
            visited[rightIdx] = 1;
          }
        }

        let head = 0;
        while (head < queue.length) {
          const curr = queue[head++];
          const px = curr % rawW;
          const py = Math.floor(curr / rawW);
          const idx = curr * 4;

          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Check if this pixel is close to white or background color
          const distToCorner = Math.sqrt(
            Math.pow(r - avgR, 2) + Math.pow(g - avgG, 2) + Math.pow(b - avgB, 2)
          );
          const isWhiteish = (r > 215 && g > 215 && b > 215) || distToCorner < 45;

          if (isWhiteish) {
            data[idx + 3] = 0; // Transparent!

            // Enqueue neighbors
            const neighbors = [
              curr - 1, // left
              curr + 1, // right
              curr - rawW, // up
              curr + rawW, // down
            ];

            for (const n of neighbors) {
              if (n >= 0 && n < rawW * rawH && !visited[n]) {
                const nx = n % rawW;
                // prevent wrapping horizontally
                if (Math.abs(nx - px) <= 1) {
                  visited[n] = 1;
                  queue.push(n);
                }
              }
            }
          }
        }

        // Put modified transparent data back
        offCtx.putImageData(imgData, 0, 0);

        // Calculate bounding box of non-transparent content
        let minX = rawW, maxX = 0, minY = rawH, maxY = 0;
        for (let y = 0; y < rawH; y++) {
          for (let x = 0; x < rawW; x++) {
            const a = data[(y * rawW + x) * 4 + 3];
            if (a > 30) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        if (minX >= maxX || minY >= maxY) {
          minX = 0; maxX = rawW; minY = 0; maxY = rawH;
        }

        const cropW = Math.max(1, maxX - minX + 1);
        const cropH = Math.max(1, maxY - minY + 1);

        // Create cropped right-facing sprite canvas
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = cropW;
        croppedCanvas.height = cropH;
        const cropCtx = croppedCanvas.getContext('2d');
        if (cropCtx) {
          cropCtx.drawImage(offCanvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
        }

        // Create flipped left-facing sprite canvas
        const flippedCanvas = document.createElement('canvas');
        flippedCanvas.width = cropW;
        flippedCanvas.height = cropH;
        const flipCtx = flippedCanvas.getContext('2d');
        if (flipCtx) {
          flipCtx.translate(cropW, 0);
          flipCtx.scale(-1, 1);
          flipCtx.drawImage(croppedCanvas, 0, 0);
        }

        theoSprites.normal = croppedCanvas;
        theoSprites.flipped = flippedCanvas;
        theoSprites.loaded = true;
        theoSprites.aspectRatio = cropH / cropW;

        resolve(theoSprites);
      } catch {
        theoSprites.loaded = true;
        resolve(theoSprites);
      }
    };

    img.onerror = () => {
      theoSprites.loaded = true;
      resolve(theoSprites);
    };
  });
}
