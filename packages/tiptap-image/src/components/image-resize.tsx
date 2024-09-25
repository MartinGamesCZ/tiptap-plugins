import { Editor, useCurrentEditor, type SingleCommands } from "@tiptap/react";
import Moveable, { type MoveableProps } from "react-moveable";
import {
  DATA_ALIGNMENT_KEY,
  IMAGE_NODE,
  PROSE_ACTIVE_NODE,
} from "../constants";
import type { Alignment } from "../types";
import * as React from "react";

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

export interface ImageResizerProps
  extends Omit<MoveableProps, "target" | "container"> {
  editor?: Editor | null;
}

const ImageResizer = ({
  editor,
  onResize,
  onResizeEnd,
  onScale,
  ...moveableProps
}: ImageResizerProps) => {
  // no editor, no resizer
  if (!editor) {
    // early exit
    return null;
  }

  // show only when the active node is an image
  if (!editor.isActive(IMAGE_NODE)) {
    return null;
  }

  const updateImageSize = () => {
    // get the image node
    const imageNodeInfo =
      document.querySelector<HTMLImageElement>(PROSE_ACTIVE_NODE);

    if (imageNodeInfo) {
      const selection = editor.state.selection;
      const setImage = editor.commands.setImage as SingleCommands["setImage"];

      const width = Number(imageNodeInfo.style.width.replace("px", ""));
      const height = Number(imageNodeInfo.style.height.replace("px", ""));

      setImage({
        src: imageNodeInfo.src,
        [DATA_ALIGNMENT_KEY]: imageNodeInfo.getAttribute(
          DATA_ALIGNMENT_KEY,
        ) as Alignment,
        ...(imageNodeInfo.alt && { alt: imageNodeInfo.alt }),
        ...(imageNodeInfo.title && { title: imageNodeInfo.title }),
        width,
        height,
      });

      editor.commands.setNodeSelection(selection.from);
    }
  };

  return (
    <Moveable
      target={document.querySelector<HTMLDivElement>(PROSE_ACTIVE_NODE)}
      container={null}
      origin={false}
      /* Resize event edges */
      edge={false}
      throttleDrag={0}
      /* When resize or scale, keeps a ratio of the width, height. */
      keepRatio={true}
      /* resizable*/
      /* Only one of resizable, scalable, warpable can be used. */
      resizable={true}
      throttleResize={0}
      onResize={(e) => {
        const {
          target,
          width,
          height,
          // dist,
          delta,
        } = e;
        if (delta[0]) target.style.width = `${width}px`;
        if (delta[1]) target.style.height = `${height}px`;

        onResize?.(e);
      }}
      // { target, isDrag, clientX, clientY }: any
      onResizeEnd={(e) => {
        updateImageSize();
        onResizeEnd?.(e);
      }}
      /* scalable */
      /* Only one of resizable, scalable, warpable can be used. */
      scalable={true}
      throttleScale={0}
      /* Set the direction of resizable */
      renderDirections={["w", "e", "s", "n"]}
      onScale={(e) => {
        const {
          target,
          // scale,
          // dist,
          // delta,
          transform,
        } = e;
        target.style.transform = transform;
        onScale?.(e);
      }}
      {...moveableProps}
    />
  );
};

export default ImageResizer;
