import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import Highlight from "@tiptap/extension-highlight";
import ImageResizeExtension from "./extensions/ImageResize";
import HighlightSearch from "./extensions/HighlightSearch";
import Toolbar from "./Toolbar";
import "./styles/editor.css";

export default function Editor({
    content,
    onUpdate,
    placeholder = "Type / for commands — headings, lists, images, callout...",
    darkMode = false,
}) {
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [setSearchQuery] = useState("");
    const [versions, setVersions] = useState([]);

    const detailsRef = useRef(null); // Reference for drop-up details

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ history: true }),
            Heading.configure({ levels: [1, 2, 3] }),
            Underline,
            Link.configure({ openOnClick: true }),
            Image,
            ImageResizeExtension,
            Placeholder.configure({ placeholder }),
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader,
            Highlight,
            HighlightSearch,
        ],
        content: content || "<p></p>",
        editorProps: {
            attributes: { spellcheck: "true" },
        },
        onUpdate({ editor }) {
            const html = editor.getHTML();
            onUpdate && onUpdate(html);

            const text = stripHtml(html).trim();
            setWordCount(text ? text.split(/\s+/).length : 0);
            setCharCount(text.length);
        },
    });

    useEffect(() => {
        if (!editor) return;
        const current = editor.getHTML();
        if ((content || "<p></p>").trim() !== (current || "").trim()) {
            editor.commands.setContent(content || "<p></p>", false);
        }
    }, [content, editor]);

    // Handle click outside to close drop-up
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (detailsRef.current && !detailsRef.current.contains(event.target)) {
                detailsRef.current.open = false;
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const createSnapshot = useCallback(() => {
        if (!editor) return;
        const snap = { ts: Date.now(), html: editor.getHTML() };
        setVersions((prev) => [snap, ...prev].slice(0, 50));
    }, [editor]);

    const restoreSnapshot = useCallback(
        (ts) => {
            const snap = versions.find((v) => v.ts === ts);
            if (!snap || !editor) return;
            editor.commands.setContent(snap.html, false);
            onUpdate && onUpdate(snap.html);
        },
        [versions, editor, onUpdate]
    );

    const insertImageFromFile = useCallback(() => {
        if (!editor) return;
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();
        input.onchange = () => {
            const file = input.files && input.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                editor.chain().focus().setImage({ src: e.target.result }).run();
                createSnapshot();
            };
            reader.readAsDataURL(file);
        };
    }, [editor, createSnapshot]);

    const insertTable = useCallback((rows = 3, cols = 3) => {
        if (!editor) return;
        editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
        createSnapshot();
    }, [editor, createSnapshot]);

    const exportAsTxt = useCallback(() => {
        if (!editor) return;
        const blob = new Blob([stripHtml(editor.getHTML())], { type: "text/plain;charset=utf-8" });
        downloadBlob(blob, "document.txt");
    }, [editor]);

    const exportAsMarkdown = useCallback(() => {
        if (!editor) return;
        const TurndownService = require("turndown");
        const turndown = new TurndownService();
        const md = turndown.turndown(editor.getHTML());
        const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
        downloadBlob(blob, "document.md");
    }, [editor]);

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    function stripHtml(html) {
        const tmp = document.createElement("div");
        tmp.innerHTML = html || "";
        return tmp.textContent || tmp.innerText || "";
    }

    const highlightAllMatches = useCallback((q) => {
        if (!editor) return;
        setSearchQuery(q || "");
        try { editor.commands.unsetHighlight(); } catch (e) { }
        if (q) try { editor.commands.highlightSearch(q); } catch (e) { }
    }, [editor, setSearchQuery]);

    return (
        <div className="editor-wrapper">
            <div className={`tiptap-editor ${darkMode ? "dark" : "light"}`}>
                <Toolbar
                    editor={editor}
                    insertImage={insertImageFromFile}
                    insertTable={() => insertTable(3, 3)}
                    exportTXT={exportAsTxt}
                    exportMD={exportAsMarkdown}
                    highlightAllMatches={highlightAllMatches}
                    createSnapshot={createSnapshot}
                    restoreSnapshot={restoreSnapshot}
                    versions={versions}
                />

                <div className="editor-container-fixed">
                    <EditorContent editor={editor} />
                </div>

                <div className="editor-footer">
                    <div>Words: {wordCount} • Chars: {charCount}</div>
                    <div className="snapshot-quick">
                        <button onClick={createSnapshot}>Save Snapshot</button>
                        <details ref={detailsRef}>
                            <summary>Snapshots ({versions.length})</summary>
                            <div className="snapshots-list">
                                {versions.map((v) => (
                                    <div key={v.ts} className="snapshot-item">
                                        <small>{new Date(v.ts).toLocaleString()}</small>
                                        <div>
                                            <button onClick={() => restoreSnapshot(v.ts)}>Restore</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
}
