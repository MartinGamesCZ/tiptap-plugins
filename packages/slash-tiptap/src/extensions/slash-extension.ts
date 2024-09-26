import { Extension } from "@tiptap/react";
import { SLASH_EXTENSION_NAME } from "../utils/constants";
import Suggestion from "@tiptap/suggestion";
import renderItems from "./render-items";
import type { SlashOptions } from "../types";

const slashExtenstionSuggestion = Extension.create<SlashOptions>({
  name: SLASH_EXTENSION_NAME,
  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({ editor, range, props }) => {
          props.command({ editor, range });
        },
        render: renderItems,
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export default slashExtenstionSuggestion;
