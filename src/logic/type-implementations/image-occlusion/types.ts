import { Occlusion } from "./Occlusion";

export interface ImageOcclusionNoteContent {
  image?: string; // imageId
  occlusions?: Occlusion[];
}
