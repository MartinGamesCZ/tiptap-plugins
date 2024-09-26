import {
  BubbleMenu,
  type BubbleMenuProps,
  Editor,
  useCurrentEditor,
} from "@tiptap/react";
import * as React from "react";
import type { Alignment } from "../types";
import {
  DATA_ALIGNMENT_KEY,
  IMAGE_NODE,
  PROSE_ACTIVE_NODE,
} from "../constants";
import { Slot } from "@radix-ui/react-slot";
import ImageResizer, { type ImageResizerProps } from "./image-resize";

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    imageResize: {
      setImage: (options: {
        height?: number;
        width?: number;
        src: string;
        alt?: string;
        title?: string;
        [DATA_ALIGNMENT_KEY]: Alignment;
      }) => ReturnType;
    };
  }
}

// It contains all the types needed to implement the ImageAligner component
export namespace ImageAligner {
  export type RootProps = ImageResizerProps & {
    children?: React.ReactNode;
    editor?: Editor | null;
  };

  export type AlignMenuProps = Omit<BubbleMenuProps, "editor">;

  export type AlignerContext = Editor | null;

  export type ItemsProps = React.ComponentPropsWithoutRef<"div">;
  export type ItemsRef = React.ElementRef<"div">;
  export type ItemsDisplayName = "ImageAligner.Items";

  export type ItemProps = React.ComponentPropsWithoutRef<"button"> & {
    alignment: Alignment;
    asChild?: boolean;
  };
  export type ItemRef = React.ElementRef<"button">;
  export type ItemDisplayName = "ImageAligner.Item";
}

// ImageAligner component implementation
// We start with a context that contains our editor instance.
// It can come from the Root component or the useCurrentEditor hook.
// We use this context to render the BubbleMenu component.
const alignerContext = React.createContext<ImageAligner.AlignerContext>(null);

// NOTE: The AlignMenu should appear on top of the Resizer,
// For workaround, I have a Root component that wraps the Aligner and Resizer. Aligner is an optional prop.
// If Aligner is not provided, it will just render the resizer.
// If Aligner is provided, we can use AlignMenu, Items, and Item components to render the alignment options.
const Root = ({
  children,
  editor: propEditor,
  ...resizerProps
}: ImageAligner.RootProps) => {
  const { editor: editorContext } = useCurrentEditor() || null;
  const editor = propEditor || editorContext;

  return (
    <alignerContext.Provider value={editor}>
      {/* BubbleMenu should appear on top  */}
      {children}
      {/* Image Resizer should come here  */}
      <ImageResizer editor={editor} {...resizerProps} />
    </alignerContext.Provider>
  );
};

// AlignMenu component implementation - wraps the individual alignment options with BubbleMenu
const AlignMenu = ({
  shouldShow,
  children,
  ...props
}: ImageAligner.AlignMenuProps) => {
  const editor = React.useContext(alignerContext);

  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      {...props}
      shouldShow={(args) => {
        const { editor } = args;

        // don't show bubble menu if:
        // - the editor is not active with image node
        return editor.isActive("image") && (shouldShow?.(args) || true);
      }}
    >
      {children}
    </BubbleMenu>
  );
};

// Items component implementation - wraps the individual alignment options
const Items = React.forwardRef<ImageAligner.ItemsRef, ImageAligner.ItemsProps>(
  (props, ref) => {
    return <div ref={ref} {...props} />;
  },
);

Items.displayName = "ImageAligner.Items" as ImageAligner.ItemsDisplayName;

// Item component implementation - individual alignment option - button by default.
const Item = React.forwardRef<ImageAligner.ItemRef, ImageAligner.ItemProps>(
  ({ onClick, alignment, asChild, ...props }, ref) => {
    const editor = React.useContext(alignerContext);

    const Component = asChild ? Slot : "button";

    if (!editor) {
      return null;
    }

    const getImageInfo = () => {
      if (editor.isActive(IMAGE_NODE)) {
        const imageNodeInfo =
          document.querySelector<HTMLImageElement>(PROSE_ACTIVE_NODE);

        return imageNodeInfo;
      }

      return null;
    };

    const isItemActive = () => {
      const imageNodeInfo = getImageInfo();
      if (imageNodeInfo) {
        const imageAlignment = imageNodeInfo.getAttribute(DATA_ALIGNMENT_KEY);

        if (imageAlignment === alignment) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    };

    const updateImageAlignment = () => {
      const imageNodeInfo = getImageInfo();
      if (imageNodeInfo) {
        const selection = editor.state.selection;
        const setImage = editor.commands.setImage;

        setImage({
          src: imageNodeInfo.src,
          ...(imageNodeInfo.alt && { alt: imageNodeInfo.alt }),
          ...(imageNodeInfo.title && { title: imageNodeInfo.title }),
          ...(imageNodeInfo.width && { width: imageNodeInfo.width }),
          ...(imageNodeInfo.height && { height: imageNodeInfo.height }),
          [DATA_ALIGNMENT_KEY]: alignment,
        });

        editor.commands.setNodeSelection(selection.from);
      }
    };

    return (
      <Component
        ref={ref}
        {...props}
        onClick={(e) => {
          // update image alignment
          updateImageAlignment();
          if (onClick) {
            onClick(e);
          }
        }}
        data-isActive={isItemActive()}
        data-alignment={alignment}
      />
    );
  },
);

Item.displayName = "ImageAligner.Item" as ImageAligner.ItemDisplayName;

// ImageAligner component
const ImageAligner = {
  Root,
  AlignMenu,
  Items,
  Item,
};

export default ImageAligner;
