import { useCurrentEditor, type Editor } from "@tiptap/react";
import React, { useEffect } from "react";
import slashStore from "../utils/store";

type SlashCmdRootProps = {
  children: React.ReactNode;
  editor?: Editor | null;
};

// This component is used to set the current editor in the store,
// if user doesn't pass the editor prop, it will try to get the editor from the context
// and set it in the store
// This is required because the slash commands are not part of the editor.
// We need to throw error if the editor is not set and yet accessed in the children components to Slash CMDK

const SlashCmdRoot = (props: SlashCmdRootProps) => {
  const { children, editor: propEditor } = props;
  const { editor: contextEditor } = useCurrentEditor() || {};

  const editor = propEditor || contextEditor;

  useEffect(() => {
    if (editor) {
      slashStore.send({
        type: "setLocalEditor",
        localEditor: editor,
      });
    }
  }, [editor]);

  return <>{children}</>;
};

export default SlashCmdRoot;
