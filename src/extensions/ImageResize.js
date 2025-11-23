// src/extensions/ImageResize.js
import Image from "@tiptap/extension-image";

const ImageResizeExtension = Image.extend({
    addAttributes() {
        return {
            ...this.parent ? this.parent() : {},
            width: {
                default: null,
                renderHTML: attrs => {
                    if (!attrs.width) return {};
                    return { width: attrs.width };
                },
            },
            class: {
                default: "resizable-image",
            },
        };
    },
});

export default ImageResizeExtension;
