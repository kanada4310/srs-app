import { Card } from "@/logic/card/card";
import { NoteContent } from "@/logic/note/NoteContent";
import { NoteType } from "@/logic/note/note";
import { Title } from "@mantine/core";
import DOMPurify from "dompurify";

export default function displayDoubleSidedQuestion(
  card: Card<NoteType.DoubleSided>,
  content?: NoteContent<NoteType.DoubleSided>
) {
  function FrontComponent() {
    return (
      <Title
        order={3}
        fw={600}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            (card.content.frontIsField1 ? content?.field1 : content?.field2) ??
              "error"
          ),
        }}
      ></Title>
    );
  }
  return <FrontComponent />;
}
