import React, { createContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const BoardsContext = createContext();

const STORAGE_KEY = "kanban_data_v1";

const defaultBoard = {
    id: "default-board",
    name: "Design Sprint",
    columns: [
        {
            id: "todo", title: "TO DO", cards: [
                { id: "NHP-12", title: "New template illustration main cover photo", desc: "Design cover", priority: "medium", dueDate: "2025-02-28", avatar: "/mnt/data/7c192b8f-42b8-4fba-9fd2-914a10d9725f.png", subtasks: [{ id: 1, text: "sketch", done: true }, { id: 2, text: "refine", done: false }], comments: [] }
            ]
        },
        {
            id: "draft", title: "DRAFTING", cards: [
                { id: "NHP-16", title: "Main website illustration", desc: "", priority: "low", avatar: "/mnt/data/7c192b8f-42b8-4fba-9fd2-914a10d9725f.png", subtasks: [], comments: [] },
                { id: "NHP-18", title: "In-product tour illustration assets", desc: "", priority: "high", dueDate: "28 FEB", avatar: "/mnt/data/7c192b8f-42b8-4fba-9fd2-914a10d9725f.png", subtasks: [], comments: [] },
            ]
        },
        {
            id: "review", title: "IN REVIEW", cards: [
                { id: "NHP-20", title: "Templates - Sales pipeline", desc: "", priority: "medium", subtasks: [{ id: 1, text: "draft", done: false }], avatar: "/mnt/data/7c192b8f-42b8-4fba-9fd2-914a10d9725f.png", comments: [] },
            ]
        },
        { id: "approved", title: "APPROVED", cards: [] },
    ],
};

export function BoardsProvider({ children }) {
    const [boards, setBoards] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                const initial = [defaultBoard];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
                return initial;
            }
            return JSON.parse(raw);
        } catch (e) {
            console.error("Failed to load boards", e);
            return [defaultBoard];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
    }, [boards]);

    // helper methods
    const addBoard = (name = "New Board") => {
        const newBoard = { id: uuidv4(), name, columns: [] };
        setBoards((b) => [...b, newBoard]);
        return newBoard;
    };

    const updateBoard = (boardId, updater) => {
        setBoards((prev) => prev.map(b => b.id === boardId ? updater(b) : b));
    };

    const deleteBoard = (boardId) => {
        setBoards((prev) => prev.filter(b => b.id !== boardId));
    };

    return (
        <BoardsContext.Provider value={{ boards, setBoards, addBoard, updateBoard, deleteBoard }}>
            {children}
        </BoardsContext.Provider>
    );
}
