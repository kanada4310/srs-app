import { NoteType } from "@/logic/note/note";
import { Occlusion } from "./Occlusion";

export interface ImageOcclusionNoteContent {
  type: NoteType.ImageOcclusion;
  image?: string; // imageId
  occlusions?: Occlusion[];
}
