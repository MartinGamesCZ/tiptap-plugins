"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ImageExtension, ImageAligner } from "@harshtalks/image-tiptap";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Slash,
  SlashCmd,
  SlashCmdProvider,
  createSuggestionsItems,
  enableKeyboardNavigation,
} from "@harshtalks/slash-tiptap";
import Link from "next/link";

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

export default function Home() {
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

  if (!editor) {
    return null;
  }

  return (
    <div className="p-12">
      <div className="text-center pb-12 prose-xl">
        <h1>Slash Command Example</h1>
        <h4>With useEditor hook</h4>
        <Link href="/context">
          <button
            type="button"
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Context Example
          </button>
        </Link>
      </div>
      <SlashCmdProvider>
        <EditorContent editor={editor} />
        <SlashCmd.Root editor={editor}>
          <SlashCmd.Cmd className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background p-4  shadow-[rgba(100,_100,_111,_0.2)_0px_7px_29px_0px] transition-all bg-white">
            <SlashCmd.Empty>No commands available</SlashCmd.Empty>
            <SlashCmd.List>
              {suggestions.map((item) => {
                return (
                  <SlashCmd.Item
                    value={item.title}
                    onCommand={(val) => {
                      item.command(val);
                    }}
                    className="flex w-full items-center space-x-2 cursor-pointer rounded-md p-2 text-left text-sm hover:bg-gray-200 aria-selected:bg-gray-200"
                    key={item.title}
                  >
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                    </div>
                  </SlashCmd.Item>
                );
              })}
            </SlashCmd.List>
          </SlashCmd.Cmd>
        </SlashCmd.Root>
        <ImageAligner.Root editor={editor}>
          <ImageAligner.AlignMenu>
            <ImageAligner.Items className="gap-4 flex items-center text-white rounded p-4">
              <ImageAligner.Item
                alignment="left"
                className="relative h-12 overflow-hidden rounded bg-neutral-950 px-5 py-2.5 text-white transition-all duration-200 hover:bg-neutral-800 hover:ring-offset-2 active:ring-2 active:ring-neutral-800"
              >
                Left
              </ImageAligner.Item>
              <ImageAligner.Item
                alignment="center"
                className="relative h-12 overflow-hidden rounded bg-neutral-950 px-5 py-2.5 text-white transition-all duration-200 hover:bg-neutral-800 hover:ring-offset-2 active:ring-2 active:ring-neutral-800"
              >
                Center
              </ImageAligner.Item>
              <ImageAligner.Item
                alignment="right"
                className="relative h-12 overflow-hidden rounded bg-neutral-950 px-5 py-2.5 text-white transition-all duration-200 hover:bg-neutral-800 hover:ring-offset-2 active:ring-2 active:ring-neutral-800"
              >
                Right
              </ImageAligner.Item>
            </ImageAligner.Items>
          </ImageAligner.AlignMenu>
        </ImageAligner.Root>
      </SlashCmdProvider>
    </div>
  );
}
