import sharp from "sharp";
import { mkdirSync } from "node:fs";

mkdirSync("public/icons", { recursive: true });

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#0B0F14"/>
  <path d="M176 128h56v200h120v56H176z" fill="#F5A623"/>
</svg>`;

const targets = [
  { file: "public/icons/icon-192.png", size: 192 },
  { file: "public/icons/icon-512.png", size: 512 },
  { file: "public/icons/icon-512-maskable.png", size: 512 },
  { file: "public/icons/apple-touch-icon.png", size: 180 },
];

for (const { file, size } of targets) {
  await sharp(Buffer.from(icon)).resize(size, size).png().toFile(file);
  console.log("wrote", file);
}
