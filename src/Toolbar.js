import { useState } from "react";
import "./styles/toolbar.css";
import { FaBold, FaItalic, FaUnderline, FaImage, FaTable, FaUndo, FaRedo, FaLink, FaHighlighter } from "react-icons/fa";



export default function Toolbar({
    editor,
    insertImage,
    insertTable,
    exportTXT,
    exportMD,
    highlightAllMatches = [],
}) {
    const [search, setSearch] = useState("");

    if (!editor) return null;

    const apply = (fn) => {
        if (!editor) return;
        fn();
        editor.commands.focus();
    };

    return (
        <div className="editor-toolbar">
            <button onClick={() => apply(() => editor.chain().focus().toggleBold().run())}><FaBold /></button>
            <button onClick={() => apply(() => editor.chain().focus().toggleItalic().run())}><FaItalic /></button>
            <button onClick={() => apply(() => editor.chain().focus().toggleUnderline().run())}><FaUnderline /></button>
            <button onClick={() => apply(() => editor.chain().focus().toggleHighlight().run())}><FaHighlighter /></button>

            <button onClick={() => apply(() => editor.chain().focus().toggleBulletList().run())}>•</button>
            <button onClick={() => apply(() => editor.chain().focus().toggleOrderedList().run())}>1.</button>
            <button onClick={() => apply(() => editor.chain().focus().toggleCodeBlock().run())}>{"</>"}</button>
            <button onClick={() => apply(() => editor.chain().focus().toggleBlockquote().run())}>❝</button>

            <button onClick={insertImage}><FaImage /></button>
            <button onClick={insertTable}><FaTable /></button>

            <button onClick={() => apply(() => editor.chain().focus().undo().run())}><FaUndo /></button>
            <button onClick={() => apply(() => editor.chain().focus().redo().run())}><FaRedo /></button>

            <button onClick={() => {
                const url = prompt("Enter URL (https://...)");
                if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            }}><FaLink /></button>

            <div className="toolbar-search">
                <input
                    placeholder="Highlight search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") highlightAllMatches(search);
                        if (e.key === "Escape") { setSearch(""); highlightAllMatches(""); }
                    }}
                />
                <button onClick={() => highlightAllMatches(search)}>Highlight</button>
                <button onClick={() => { setSearch(""); highlightAllMatches(""); }}>Clear</button>
            </div>

            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button onClick={exportTXT}>TXT</button>
                <button onClick={exportMD}>MD</button>
            </div>
        </div>
    );
}
