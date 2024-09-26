import { type SlashSuggestion } from "../types";

const createSuggestionsItems = <
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  items: SlashSuggestion<T>[],
) => {
  return items;
};

export default createSuggestionsItems;
