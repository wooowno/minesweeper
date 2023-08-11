import React from "react";
import Square from '../Square/Square';

export default function Board({size, brd, onSContextMenu, onSquareClick}) {
    let board = new Array(size).fill(0);
    let i = 0;
    board = board.map(_ => {
        let row = new Array(size).fill(0);
        let j = 0;
        row = row.map(_ => {
            const ind = [i, j].toString();
            return <td key={j++}><Square 
                value={brd[ind]} 
                onSContextMenu={(e) => onSContextMenu(e, ind)} 
                onSquareClick={() => onSquareClick(ind)}
            /></td>
        })
        return <tr key={i++}>{row}</tr>
    })
    return <table>{board}</table>
}
