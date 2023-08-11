import React, { useState } from "react";

export default function Restart({handleClick, game}) {
    const [style, setStyle] = useState('smile');

    if (['going', 'start'].includes(game) && style !== 'smile') setStyle('smile');
    if (game === 'lose' && style !== 'frown') setStyle('frown');
    if (game === 'win' && style !== 'squint') setStyle('squint');
    return (
        <button id="restart" className={style} onClick={handleClick}></button>
    )
}