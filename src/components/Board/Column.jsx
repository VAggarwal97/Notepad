// src/components/Board/Column.jsx
import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import CardItem from "./CardItem";

export default function Column({ column, onCreate }) {
  return (
    <div className="column">
      <div className="column-header">
        <div className="col-title">{column.title}</div>
        <div className="col-count">{column.cards.length}</div>
      </div>

      {column.id === "todo" && <div className="create-btn" onClick={onCreate}>+ Create</div> }

      <Droppable droppableId={column.id}>
        {(provided)=>(
          <div className="card-list" ref={provided.innerRef} {...provided.droppableProps}>
            {column.cards.map((card, index)=>(
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(dr)=>(
                  <div ref={dr.innerRef} {...dr.draggableProps} {...dr.dragHandleProps}>
                    <CardItem card={card} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
