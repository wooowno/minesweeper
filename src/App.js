import React, { useState } from "react";
import Board from './Board/Board';
import Bombs from "./Bombs/Bombs";
import Restart from "./Restart/Restart";
import Stopwatch from "./Stopwatch/Stopwatch";
import Level from "./Level/Level";
import { random, ij, index, sq, checkBorder } from "./utils";

// Размещает бомбы на поле, окружает их числами
function create(amount, size, indx) {
    const b = bomb(amount, size, indx);
    const brd = {};
    for (let i = 0; i < size ; i++) {
        for (let j = 0; j < size; j++) {
            const ind = index(i, j);
            if (b.has(ind)) {
                brd[ind] = {state:'B', style:''};
                for (const s of sq(i, j)) {
                    const key = index(s[0], s[1]);
                    if (!brd[key]) brd[key] = {state: '', style:''};
                    if (brd[key].state === '') {
                        brd[key].state = 1;
                    }
                    else if (brd[key].state !== 'B') brd[key].state += 1;
                }
            } else if (!brd[ind]) {
                brd[ind] = {state:'', style:''};
            }
        }
    }
    return brd;
}

// Создаёт бомбы
function bomb(amount, size, indx) {
    const b = new Set();
    const [i, j] = ij(indx);
    const is = sq(i, j).map(el => index(...el));
    is.push(index(i, j));
    while (b.size < amount) {
        const ind = index(random(size-1), random(size-1));
        if (!is.includes(ind)) b.add(ind);
    }
    return b
}

// Определяет проигрышь игрока
function lose(brd) {
    return Object.values(brd).reduce((f, v) => {
        if (f) return f;
        if (v.state === 'B' && v.style === 'cn') return true;
        return false;
    }, false)
}

// Определяет победу игрока
function win(brd) {
    return Object.values(brd).reduce((f, v) => {
        if (!f) return f;
        if (v.state === 'B' && v.style !== 'bomb') return false;
        if (v.state !== 'B' && v.style === 'bomb') return false;
        return true;
    }, true)
}

// Добавляет стиль бомбам и числам
function style(brd) {
    return Object.entries(brd).reduce((brd, [k, v]) => {
        if (v.state === '') brd[k].ss = 'p';
        else if (v.state === 'B') brd[k].ss = 'b';
        else brd[k].ss = `n${v.state}`
        return brd;
    }, brd) 
}

const dif = {
    "junior": {
        size: 9,
        bombs: 10
    },
    "middle": {
        size: 16,
        bombs: 40
    },
    "senior": {
        size: 22,
        bombs: 100
    },
}

export default function Game() {
    const [level, setLevel] = useState('junior');
    const size = dif[level].size;
    const bombs = dif[level].bombs;
    const [board, setBoard] = useState({});
    const [game, setGame] = useState('start');

    // Количество бомб минус поставленных флажков
    const bs = bombs - Object.values(board).reduce((count, v) => {
        return v.style === 'bomb' ? ++count : count;
    }, 0)
    
    // При клике на правую мышь открывает клетку
    function handleClick(ind) {
        let brd = {...board};
        if (game === 'start') {
            brd = create(bombs, size, ind);
            brd = style(brd);
            setGame('going');
        }
        const o = brd[ind];
        if (o.style === 'bomb' || game === 'lose') return;
        if (o.state === '') brd = open(brd, ind);
        if (!['bomb', ''].includes(o.state)) brd = num(brd, ind);
        brd[ind] = {style:'cn', state: o.state, ss: o.ss};
        if (lose(brd)) {
            setGame('lose');
            brd = Object.entries(brd).reduce((brd, [k, v]) => {
                if (v.state === 'B' && v.style === '') brd[k].style = 'cn';
                if (v.state !== 'B' && v.style === 'bomb') brd[k].style += ' l-bomb';
                return brd;
            }, brd)
        }
        setBoard(brd);
    }

    // При клике на левую кнопку мышки, ставит или снимает флажок
    function handleContextMenu(e, ind) {
        e.preventDefault();
        if (game === 'start') return 
        let brd = {...board};
        const o = brd[ind];
        if (o.style === '') {
            brd[ind] = {style:'bomb', state: o.state, ss: o.ss};
        } else if (o.style === 'bomb') {
            brd[ind] = {style:'', state: o.state, ss: o.ss};
        }
        if (win(brd)) setGame('win');
        setBoard(brd);
    }

    // Можно ли открыть ближайшие клетки 
    function num(brd, ind) {
        const num = Number(brd[ind].state);
        const [i, j] = ij(ind);
        const b = sq(i, j).reduce((bombs, el) =>{
            if (checkBorder(el, size)) return bombs;
            let v = index(...el);
            v = brd[v];
            v = v.style === 'bomb';
            return v ? ++bombs : bombs
        }, 0)
        if (b === num) return open(brd, ind);
        return brd;
    }

    // Открывает ближайшие клетки
    function open(brd, ind) {
        let b = {...brd}
        const [i, j] = ij(ind);
        for (const s of sq(i, j)) {
            if (checkBorder(s, size)) continue;
            const k = index(s[0], s[1]);
            let o = b[k];
            if (['cn', 'bomb'].includes(o.style)) continue;
            b[k] = {style:'cn', state: o.state, ss: o.ss};
            if(!o.state) b = open(b, k);
        }
        return b;
    }

    // Начать новую игру
    function restart() {
        setGame('start');
        setBoard({});
    }

    // Меняет размеры поля и кол-во бомб
    function changeLevel() {
        if (level === 'junior') setLevel('middle');
        if (level === 'middle') setLevel('senior');
        if (level === 'senior') setLevel('junior');
        restart();
    }

    return (
        <>
            <header>
                <Bombs value={bs}/>
                <Restart handleClick={restart} game={game}/>
                <Stopwatch game={game}/>
            </header>
            <main>
                <Board size={size} brd={board} onSContextMenu={handleContextMenu} onSquareClick={handleClick}/>
            </main>
            <footer>
                <Level level={level} changeLevel={changeLevel}/>
            </footer>
        </>
    )
}