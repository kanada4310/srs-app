import { getImage, saveImage } from "@/logic/image/saveImage";
import { useSettings } from "@/logic/settings/hooks/useSettings";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import {
  BubbleMenu,
  Editor,
  EditorOptions,
  Extension,
  FloatingMenu,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useRef, useEffect } from "react";

import Image from "@tiptap/extension-image";
import { ImageDrop } from "./ImageDrop";
import classes from "./NoteEditor.module.css";
import { NoteEditorControls } from "./NoteEditorControls";

import { CustomHardBreak } from "./tiptap/CustomHardBreak";

interface NoteEditorProps {
  editor: Editor | null;
  className?: string;
  controls?: React.ReactNode;
}

export function useNoteEditor(props: {
  content: string;
  onUpdate?: EditorOptions["onUpdate"];
  extensions?: any[];
  finish?: () => void;
  focusSelectNoteType?: () => void;
}) {
  return useEditor(
    {
      extensions: [
        Extension.create({
          name: "addcard",
          addKeyboardShortcuts() {
            return {
              "Mod-Enter": () => {
                props.finish && props.finish();
                return false;
              },
              "Mod-j": () => {
                this.editor.commands.blur();
                props.focusSelectNoteType && props.focusSelectNoteType();
                return false;
              },
            };
          },
        }),
        StarterKit.configure({
          hardBreak: false,
        }),
        CustomHardBreak,
        Underline,
        Link,
        Superscript,
        SubScript,
        Highlight,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Color,
        TextStyle,
        Image,
        ImageDrop,
        ...(props.extensions ?? []),
      ],
      content: props.content,
      onUpdate: props.onUpdate || (() => {}), // tiptap default
    },
    [props.content]
  );
}

function NoteEditor({ editor, controls, className }: NoteEditorProps) {
  const [settings, areSettingsReady] = useSettings();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const addImage = async (data: DataTransfer) => {
    const { files } = data;
    if (editor && files && files.length > 0) {
      for (const file of Array.from(files)) {
        const [mime] = file.type.split("/");
        if (mime === "image") {
          const imageId = await saveImage(file, file.name, file.type);
          const image = await getImage(imageId);
          if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
              console.log("Base64 Image Data:", reader.result); // 追加
              if (isMounted.current) {
                editor.commands.insertImage({ src: reader.result as string });
              }
            };
            reader.readAsDataURL(image.data);
          }
        }
      }
    }
  };

  if (!editor) {
    return null; // editorがnullの場合は何もレンダリングしない
  }

  console.log("NoteEditor editor:", editor); // 追加
  console.log("NoteEditor settings:", settings); // 追加

  return (
    <>
      <RichTextEditor
        editor={editor}
        withTypographyStyles={false}
        className={className}
        classNames={{
          root: classes.root,
          toolbar: classes.toolbar,
          content: classes.content,
        }}
      >
        {areSettingsReady && (
          <>
            {editor.isFocused && settings.useToolbar && (
              <RichTextEditor.Toolbar className={classes.toolbar} tabIndex={-1}>
                <NoteEditorControls controls={controls} editor={editor} />
              </RichTextEditor.Toolbar>
            )}
            {settings.useBubbleMenu && (
              <BubbleMenu
                editor={editor}
                tippyOptions={{ maxWidth: "none" }}
                shouldShow={({ editor }) => {
                  // only show the bubble menu for text selections, not for node selections (e.g. images)
                  return (
                    editor.isFocused && editor.state.selection.empty === false
                  );
                }}
              >
                <NoteEditorControls controls={controls} editor={editor} />
              </BubbleMenu>
            )}
            {settings.useBubbleMenu && (
              <FloatingMenu
                editor={editor}
                shouldShow={({ editor }) => {
                  return editor.isEmpty;
                }}
              >
                <NoteEditorControls controls={controls} editor={editor} />
              </FloatingMenu>
            )}
          </>
        )}

        <RichTextEditor.Content
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addImage(e.dataTransfer);
          }}
        />
      </RichTextEditor>
    </>
  );
}

export default NoteEditor;
