export default function Square({value, onSContextMenu, onSquareClick}) {
    return (
        <button 
            className={
                (value?.style === 'cn' && value?.ss) 
                + ' square ' 
                + value?.style
            }
            onContextMenu={onSContextMenu}
            onClick={onSquareClick}
        >
            {value?.style === 'cn' && value?.state}
        </button>
    )
}