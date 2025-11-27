// src/components/Board/CardItem.jsx
import React from "react";

export default function CardItem({ card }) {
  const colorClass = card.color === "blue" ? "border-blue" : card.color === "yellow" ? "border-yellow" : card.color === "red" ? "border-red" : "";
  return (
    <div className={`card ${colorClass}`}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
        <div style={{flex:1}}>
          <div className="card-title">{card.title}</div>
        </div>
        <div style={{marginLeft:8}}>
          <div className="badge id">{card.id}</div>
        </div>
      </div>

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div className="card-meta">
          {card.total ? <div className="subtask">✔ {card.subtasks}/{card.total}</div> : <div style={{color:'#94a3b8'}}> </div>}
        </div>

        <div style={{display:'flex', alignItems:'center', gap:8}}>
          {card.deadline && <div className="badge deadline">{card.deadline}</div>}
          <img src={card.avatar} alt="a" className="card-avatar" />
        </div>
      </div>
    </div>
  );
}
