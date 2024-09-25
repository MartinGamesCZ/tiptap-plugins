import { SLASH_EXTENSION_DOM_ID, navigationKeys } from "../utils/constants";

const enableKeyboardNavigation = (event: KeyboardEvent) => {
  if (navigationKeys.includes(event.key)) {
    const slashCommand = document.getElementById(SLASH_EXTENSION_DOM_ID);
    if (slashCommand) {
      return true;
    }
  }
};

export { enableKeyboardNavigation };
