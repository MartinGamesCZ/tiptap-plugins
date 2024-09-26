// store to manage query, and range of the query etc.

import { createStore } from "@xstate/store";
import { type TipTapRange } from "../types";
import type { Editor } from "@tiptap/react";

const slashStore = createStore(
  {
    query: "",
    range: null as TipTapRange | null,
    localEditor: null as Editor | null,
  },
  {
    setQuery: (_, event: { query: string }) => {
      return {
        query: event.query,
      };
    },
    setRange: (_, event: { range: TipTapRange }) => {
      return {
        range: event.range,
      };
    },
    setLocalEditor: (_, event: { localEditor: Editor }) => {
      return {
        localEditor: event.localEditor,
      };
    },
  },
);

export default slashStore;
