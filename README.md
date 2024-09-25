
# Tiptap Extensions

Tiptap extensions and headless components for image nodes and a slash command for React.js

## @harshtalks/image-tiptap

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

# Tiptap Slash Command Extension

Simple tiptap extension for React to add notion like slash command to your project. It provides a flexible extension built on top of tiptap suggestion extension, and headless UI components built on cmdk package.

- Works with both useEditor hook and EditorProvider
- Type Safe
- Headless UI on top of cmdk
- Flexible and easy to use

Notes:
1. Make sure to wrap your entire editor in a `SlashCmdProvider` component.
2. for keyboard navigation, provide `enableKeyboardNavigationc` in `editorProps` handleDOMEvents.

## Installation

Installing the package using pnpm

```bash
  pnpm add @harshtalks/slash-tiptap
```

## Usage:

1. Define suggestions. Add all the commaands you want in the slash menu.
```ts
import { enableKeyboardNavigation } from "@harshtalks/tiptap-slash";

const suggestions = createSuggestionsItems([
  {
    title: "text",
    searchTerms: ["paragraph"],
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .run();
    },
  },
  {
    title: "Bullet List",
    searchTerms: ["unordered", "point"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Ordered List",
    searchTerms: ["ordered", "point", "numbers"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
]);
```

2. Create an editor instance
```tsx
import {
  Slash,
  enableKeyboardNavigation,
} from "@harshtalks/tiptap-slash";


const editor = useEditor({
  extensions: [
    StarterKit,
    ImageExtension,
    Slash.configure({
      suggestion: {
        items: () => suggestions,
      },
    }),
    Placeholder.configure({
      // Use a placeholder:
      placeholder: "Press / to see available commands",
      // Use different placeholders depending on the node type:
      // placeholder: ({ node }) => {
      //   if (node.type.name === 'heading') {
      //     return 'What’s the title?'
      //   }

      //   return 'Can you add some further context?'
      // },
    }),
  ],
  editorProps: {
    handleDOMEvents: {
      keydown: (_, v) => enableKeyboardNavigation(v),
    },
    attributes: {
      class:
        "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
    },
  },
  content: `
     <p>This is a basic example of usage. Press / to see available commands. Click on Image to resize and align.</p>
     <img src="https://placehold.co/800x400/6A00F5/white" />
   `,
});
```

3. Wrap your editor in `SlashCmdProvider` component and add `SlashCmd` component to your editor.
```tsx

export const Editor = () => {
  return (
  <SlashCmdProvider>
    <EditorContent editor={editor} />
    <SlashCmd.Root editor={editor}>
      <SlashCmd.Cmd>
        <SlashCmd.Empty>No commands available</SlashCmd.Empty>
        <SlashCmd.List>
          {suggestions.map((item) => {
            return (
              <SlashCmd.Item
                value={item.title}
                onCommand={(val) => {
                  item.command(val);
                }}
                key={item.title}
              >
                  <p>{item.title}</p>
              </SlashCmd.Item>
            );
          })}
        </SlashCmd.List>
      </SlashCmd.Cmd>
    </SlashCmd.Root>
  </SlashCmdProvider>
  );
}
