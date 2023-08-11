import React, { useEffect, useState } from "react";

export default function Stopwatch({game}) {
    const [seconds, setSeconds] = useState('000');
    const [start, setStart] = useState(true);
    const [running, setRunning] = useState(false);
    useEffect(() => {
        let interval;
        if (running && seconds !== '999') {
            interval = setInterval(() => {
                setSeconds((prevTime) => {
                    let v = parseInt(prevTime);
                    v = (++v).toString();
                    while (v.length < 3) v = '0' + v;
                    return v;
                });
            }, 1000)
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [running, seconds]);

    if (game === 'start' && start) {
        setRunning(false);
        setSeconds('000');
        setStart(false);
    }
    if (game === 'going' && !running) {
        setRunning(true);
        setStart(true);
    }
    if (['win', 'lose'].includes(game) && running) {
        setRunning(false);
        setStart(true);
    }

    return <aside className="num">{seconds}</aside>
}