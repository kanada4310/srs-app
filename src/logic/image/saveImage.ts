import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { Image } from "./image";

export async function saveImage(
  imageData: Blob,
  fileName?: string,
  mimeType?: string
): Promise<string> {
  const image: Image = {
    id: uuidv4(),
    data: imageData,
    fileName: fileName,
    mimeType: mimeType,
  };
  await db.images.add(image);
  return image.id!;
}

export async function getImage(id: string): Promise<Image | undefined> {
  return db.images.get(id);
}

export async function deleteImage(id: string): Promise<void> {
  await db.images.delete(id);
}
