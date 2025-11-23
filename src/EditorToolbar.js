import React, { useRef } from "react";
import "./styles/editor.css";

export default function EditorToolbar({
    editorRef,
    applyFormat,
    insertImage,
    insertTable,
    theme,
    setTheme,
    wordCount,
    charCount,
    searchValue,
    setSearchValue,
    exportTXT,
    exportMD,
    exportPDF,
    exportDOCX,
    openTagsModal,
    undo,
    redo,
}) {

    const imageInputRef = useRef(null);

    return (
        <div className="editor-toolbar">

            {/* Basic Formatting */}
            <button onClick={() => applyFormat("bold")}><b>B</b></button>
            <button onClick={() => applyFormat("italic")}><i>I</i></button>
            <button onClick={() => applyFormat("underline")}><u>U</u></button>

            {/* Insert Image */}
            <button onClick={() => imageInputRef.current.click()}>🖼 Image</button>
            <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                style={{ display: "none" }}
                onChange={(e) => insertImage(e.target.files[0])}
            />

            {/* Insert Table */}
            <button onClick={insertTable}>📊 Table</button>

            {/* Undo / Redo */}
            <button onClick={undo}>↶ Undo</button>
            <button onClick={redo}>↷ Redo</button>

            {/* Search */}
            <input
                type="text"
                className="toolbar-search"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />

            {/* Themes */}
            <select
                className="theme-dropdown"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
            >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="sepia">Sepia</option>
                <option value="solarized">Solarized</option>
            </select>

            {/* Export Buttons */}
            <div className="export-buttons">
                <button onClick={exportTXT}>TXT</button>
                <button onClick={exportMD}>MD</button>
                <button onClick={exportPDF}>PDF</button>
                <button onClick={exportDOCX}>DOCX</button>
            </div>

            {/* Tags */}
            <button onClick={openTagsModal}>🏷 Tags</button>

            {/* Word / Character Count */}
            <div className="editor-stats">
                <span>{wordCount} words</span>
                <span>{charCount} chars</span>
            </div>

        </div>
    );
}
