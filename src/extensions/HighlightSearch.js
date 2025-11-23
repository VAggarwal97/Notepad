// src/extensions/HighlightSearch.js
import { Extension } from "@tiptap/core";

export default Extension.create({
    name: "highlightSearchHelper",

    addCommands() {
        return {
            highlightSearch:
                (query) =>
                    ({ editor, tr, commands }) => {
                        if (!query) return true;
                        // Clear existing highlights first
                        try {
                            commands.unsetHighlight();
                        } catch (e) { }
                        const text = editor.state.doc.textBetween(0, editor.state.doc.content.size, "\n\n");
                        const re = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
                        let m;
                        while ((m = re.exec(text)) !== null) {
                            const startIndex = m.index;
                            const endIndex = startIndex + m[0].length;
                            // convert plain index to pos: use editor.state.doc to walk
                            let accumulated = 0;
                            let foundFrom = null;
                            editor.state.doc.descendants((node, pos) => {
                                if (foundFrom !== null) return;
                                if (node.isText) {
                                    const len = node.text.length;
                                    if (accumulated + len >= startIndex) {
                                        foundFrom = pos + (startIndex - accumulated);
                                    } else {
                                        accumulated += len;
                                    }
                                }
                            });
                            if (foundFrom === null) continue;
                            // find to:
                            let accumulated2 = 0;
                            let foundTo = null;
                            editor.state.doc.descendants((node, pos) => {
                                if (foundTo !== null) return;
                                if (node.isText) {
                                    const len = node.text.length;
                                    if (accumulated2 + len >= endIndex) {
                                        foundTo = pos + (endIndex - accumulated2);
                                    } else {
                                        accumulated2 += len;
                                    }
                                }
                            });
                            if (foundTo == null) continue;
                            // apply highlight
                            commands.setTextSelection({ from: foundFrom + 1, to: foundTo + 1 }); // +1 because positions are 1-based in this selection format
                            try {
                                commands.setHighlight();
                            } catch (e) {
                                // if highlight not available, ignore
                            }
                        }
                        return true;
                    },
        };
    },
});
