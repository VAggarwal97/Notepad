// src/exportDocx.js
import htmlToDocx from "html-to-docx";

export default async function exportToDocx(html, filename = "document.docx") {
    try {
        const blob = await htmlToDocx(html, null, { table: { row: { cantSplit: true } } });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error("DOCX export error", err);
    }
}
