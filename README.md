
# Tiptap Extensions

Tiptap extensions and headless components for image nodes and a slash command for React.js

## @harshtalks/tiptap-image

It extends tiptap image extension to support image resizing and alignment.
Existing third party/unofficial plugins are not flexible.
This package contains -
1. UI headless components to render alignment menu in a bubble menu.
2. Image extension extended from tiptap-extension-image to support resizing and alignment out of the box

It supports both useEditor hook and EditorProvider from tiptap.


## Installation

Install my-project with npm

```bash
  pnpm add @harshtalks/tiptap-image
```

 You can use npm, bun, or yarn etc.

 ## Usage

 ```tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ImageExtension, ImageAligner } from "@harshtalks/tiptap-image";
import "./globals.css";
import { useCallback } from "react";

export default function Home() {
  const editor = useEditor({
    extensions: [StarterKit, ImageExtension],
    content:
      "<p>This is a basic example of implementing images. Drag to re-order.</p>",
  });

  const addImage = useCallback(() => {
    const url = window.prompt("URL");

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="p-12">
      <button type="button" onClick={addImage}>
        Add Image
      </button>

      <div>
        <ImageAligner.Root editor={editor}>
          <ImageAligner.AlignMenu>
            <ImageAligner.Items className="bg-white flex items-center border text-white rounded p-4">
              <ImageAligner.Item alignment="left">Left Align</ImageAligner.Item>
              <ImageAligner.Item alignment="center">
                Center Align
              </ImageAligner.Item>
              <ImageAligner.Item alignment="right">
                Right Align
              </ImageAligner.Item>
            </ImageAligner.Items>
          </ImageAligner.AlignMenu>
        </ImageAligner.Root>
      </div>

      <EditorContent className="p-8 border rounded-md" editor={editor} />
    </div>
  );
}

```
 

