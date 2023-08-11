import React from "react";

export default function Level({level, changeLevel}) {
    const style = level;
    return (
        <button id="level" className={style} onClick={changeLevel}></button>
    )
}