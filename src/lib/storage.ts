const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryReady = Boolean(CLOUD && PRESET);

/**
 * Carrega uma imagem para o Cloudinary (upload não assinado, sem backend)
 * e devolve o URL seguro. Grátis e sem cartão.
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (!CLOUD || !PRESET) {
    throw new Error("Cloudinary não configurado (.env.local).");
  }
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
    { method: "POST", body: form },
  );
  if (!res.ok) throw new Error("Falha no upload para o Cloudinary.");

  const data = (await res.json()) as { secure_url: string };
  return data.secure_url;
}
