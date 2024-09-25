import ImageExtensionBase from "@tiptap/extension-image";
import { DATA_ALIGNMENT_KEY, IMAGE_NODE } from "../constants";
import type { Alignment } from "../types";
import { alignmentVariants } from "../utils";

const ImageExtension = ImageExtensionBase.extend({
  // Adding name to the extension
  name: IMAGE_NODE,
  // we will extend the base image extension to include few custom attirbutes
  // this custom attributes will appear in the DOM for the given image.
  addAttributes() {
    return {
      ...this.parent?.(),
      // Adding custom attributes
      // Custom Attribute for height
      height: {
        default: null,
      },
      // Custom Attribute for width
      width: {
        default: null,
      },
      // this will be used to determine current alignment of the image
      [DATA_ALIGNMENT_KEY]: {
        default: "center" as Alignment,
        // use current alignment to set the style attribute
        renderHTML: (attributes) => ({
          [DATA_ALIGNMENT_KEY]: attributes[DATA_ALIGNMENT_KEY],
          style: alignmentVariants[attributes[DATA_ALIGNMENT_KEY] as Alignment],
        }),
      },
    };
  },
});

export default ImageExtension;
