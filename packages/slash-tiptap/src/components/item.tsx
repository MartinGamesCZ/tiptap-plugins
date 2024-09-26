import { Editor, useCurrentEditor } from "@tiptap/react";
import type { TipTapRange } from "../types";
import React from "react";
import { CommandItem } from "cmdk";
import { useSelector } from "@xstate/store/react";
import slashStore from "../utils/store";

export interface SlashItemProps {
  readonly onCommand: ({
    editor,
    range,
  }: {
    editor: Editor;
    range: TipTapRange;
  }) => void;
}

const Item = React.forwardRef<
  React.ElementRef<"div">,
  Omit<React.ComponentPropsWithoutRef<typeof CommandItem>, "onSelect"> &
    SlashItemProps
>((props, ref) => {
  const { onCommand, className, children, ...restProps } = props;

  const { range, localEditor } = useSelector(
    slashStore,
    (state) => state.context,
  );

  if (!localEditor) {
    throw new Error(
      "Editor is required, Please provide editor to the Cmd.Root or use within EditorProvider.",
    );
  }

  if (!range) {
    return null;
  }

  return (
    <CommandItem
      {...restProps}
      onSelect={() => onCommand({ editor: localEditor, range: range })}
      ref={ref}
      className={className}
    >
      {children}
    </CommandItem>
  );
});

Item.displayName = "SlashItem";

export default Item;
