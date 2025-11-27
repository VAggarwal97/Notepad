// src/components/Board/index.jsx
import React, { useState, useMemo } from "react";
import Column from "./Column";
import CreateModal from "./CreateModal";
import { DragDropContext } from "@hello-pangea/dnd";

const initial = {
  columns: [
    {
      id: "todo",
      title: "TO DO",
      cards: [
        {
          id: "NHP-12",
          title: "New template illustration main cover photo",
          avatar: "/mnt/data/7c192b8f-42b8-4fba-9fd2-914a10d9725f.png",
          subtasks: 1,
          total: 2,
        },
      ],
    },
    {
      id: "draft",
      title: "DRAFTING",
      cards: [
        {
          id: "NHP-16",
          title: "Main website illustration",
          avatar: "/mnt/data/7c192b8f-42b8-4fba-9fd2-914a10d9725f.png",
          subtasks: 0,
          total: 0,
        },
        {
          id: "NHP-18",
          title: "In-product tour illustration assets",
          avatar: "/mnt/data/7c192b8f-42b8-4fba-9fd2-914a10d9725f.png",
          subtasks: 0,
          total: 0,
          deadline: "28 FEB",
        },
        {
          id: "NHP-32",
          title: "New logo for new product",
          avatar: "/mnt/data/7c192b8f-42b8-4fba-9fd2-914a10d9725f.png",
          subtasks: 0,
          total: 0,
          color: "blue",
        },
      ],
    },
    {
      id: "review",
      title: "IN REVIEW",
      cards: [
        {
          id: "NHP-20",
          title: "Templates - Sales pipeline",
          avatar: "/mnt/data/7c192b8f-42b8-4fba-9fd2-914a10d9725f.png",
          subtasks: 1,
          total: 2,
          color: "blue",
        },
        {
          id: "NHP-28",
          title: "Project management illustrations",
          avatar: "/mnt/data/7c192b8f-42b8-4fba-9fd2-914a10d9725f.png",
          subtasks: 2,
          total: 10,
        },
        {
          id: "NHP-19",
          title: "Change-boarding existing users illustration",
          avatar: "/mnt/data/7c192b8f-42b8-4fba-9fd2-914a10d9725f.png",
          subtasks: 2,
          total: 10,
        },
      ],
    },
    {
      id: "approved",
      title: "APPROVED",
      cards: [
        {
          id: "NHP-14",
          title: "Templates - Month End Process",
          avatar: "/mnt/data/7c192b8f-42b8-4fba-9fd2-914a10d9725f.png",
          subtasks: 0,
          total: 0,
        },
        {
          id: "NHP-22",
          title: "Onboarding illustrations",
          avatar: "/mnt/data/7c192b8f-42b8-4fba-9fd2-914a10d9725f.png",
          subtasks: 0,
          total: 0,
          color: "yellow",
        },
      ],
    },
    {
      id: "created",
      title: "CREATED",
      cards: [
        {
          id: "NHP-11",
          title: "Templates - Asset creation",
          avatar: "/mnt/data/7c192b8f-42b8-4fba-9fd2-914a10d9725f.png",
          subtasks: 0,
          total: 0,
        },
        {
          id: "NHP-13",
          title: "Templates - Website design process",
          avatar: "/mnt/data/7c192b8f-42b8-4fba-9fd2-914a10d9725f.png",
          subtasks: 0,
          total: 0,
        },
      ],
    },
  ],
};

export default function BoardMain() {
  const [data, setData] = useState(initial);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const columns = data.columns;

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const srcColIdx = columns.findIndex((c) => c.id === source.droppableId);
    const destColIdx = columns.findIndex(
      (c) => c.id === destination.droppableId
    );
    const srcCol = { ...columns[srcColIdx] };
    const destCol = { ...columns[destColIdx] };

    const [moved] = srcCol.cards.splice(source.index, 1);
    destCol.cards.splice(destination.index, 0, moved);

    const newCols = [...columns];
    newCols[srcColIdx] = srcCol;
    newCols[destColIdx] = destCol;
    setData({ columns: newCols });
  };

  const handleCreate = (colId, card) => {
    const newCols = columns.map((c) =>
      c.id === colId ? { ...c, cards: [...c.cards, card] } : c
    );
    setData({ columns: newCols });
    setShowModal(false);
  };

  const filtered = useMemo(() => {
    if (!query) return columns;
    return columns.map((col) => ({
      ...col,
      cards: col.cards.filter(
        (card) =>
          (card.title || "").toLowerCase().includes(query.toLowerCase()) ||
          (card.id || "").toLowerCase().includes(query.toLowerCase())
      ),
    }));
  }, [query, columns]);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: "#0ea5e9",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: 8,
          }}
        >
          New Task
        </button>
        <input
          placeholder="Filter board..."
          onChange={(e) => setQuery(e.target.value)}
          className="px-3 py-2 rounded-md"
        />
      </div>

      <div className="board-columns" role="list">
        <DragDropContext onDragEnd={onDragEnd}>
          {filtered.map((col) => (
            <Column
              key={col.id}
              column={col}
              onCreate={() => setShowModal(true)}
            />
          ))}
        </DragDropContext>
      </div>

      {showModal && (
        <CreateModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
          columns={columns}
        />
      )}
    </>
  );
}
