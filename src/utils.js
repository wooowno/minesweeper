// Возвращает список индексов окружающих клеток
export function sq(i, j) {
    return [
        [i-1, j-1], [i-1, j], 
        [i-1, j+1], [i, j-1], 
        [i, j+1], [i+1, j-1], 
        [i+1, j], [i+1, j+1]
    ]
}

// Возвращает рандомное целое число от min до max включительно
export function random(max, min=0) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

//  Превращает строку индексов в массив чисел
export function ij(ind) {
    const ijs = ind.split(',');
    const i = Number(ijs[0]), j = Number(ijs[1]);
    return [i, j]
}

// Превращает массив индексов в строку
export function index(i, j) {
    return [i, j].toString()
}

// Проверяет границы поля
export function checkBorder(el, size) {
    const b1 = el[0] < 0;
    const b2 = el[1] < 0;
    const b3 = el[0] === size;
    const b4 = el[1] === size;
    return b1 || b2 || b3 || b4
}
