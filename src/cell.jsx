import React from "react"

export function Cell(props) {
    return <div className={props.color}  x={props.x} y={props.y}  >{props.fig}</div>
}