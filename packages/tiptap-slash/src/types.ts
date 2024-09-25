// SlashSuggestions
//

import type { Editor, Range as TRange } from "@tiptap/react";
import type { SuggestionOptions } from "@tiptap/suggestion";
import { type ReactNode } from "react";

export type TipTapRange = TRange;

export type SlashSuggestionBase = {
  title: string;
  command: (props: { editor: Editor; range: TipTapRange }) => void;
  searchTerms?: string[];
};

export type SlashSuggestion<
  T extends Record<string, unknown> = Record<string, unknown>,
> = SlashSuggestionBase & T;

export type SlashSuggestionRecommended = SlashSuggestion<{
  description: string;
  icon: ReactNode;
}>;

export type SlashOptions<
  TSuggestion extends Record<string, unknown> = Record<string, unknown>,
> = {
  suggestion: Omit<SuggestionOptions<SlashSuggestion<TSuggestion>>, "editor">;
};
