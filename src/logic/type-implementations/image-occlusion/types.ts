import { Occlusion } from "./Occlusion";
import { NoteType } from "@/logic/note/note";

export interface ImageOcclusionNoteContent {
  type: NoteType.ImageOcclusion;
  image?: string; // imageId
  occlusions?: Occlusion[];
}
