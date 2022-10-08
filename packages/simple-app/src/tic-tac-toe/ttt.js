import React, { useState, useEffect, useCallback } from 'react';
import style from './ttt.module.css';

// start with one for readability
const SQUARE = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const WIN = [
    [1,2,3],
    [4,5,6],
    [7,8,9],
    [1,4,7],
    [2,5,8],
    [3,6,9],
    [1,5,9],
    [3,5,7]
];
const BOARDS =  [
    null, null, null,
    null, null, null,
    null, null, null
];

const Square = ({ id, onClick, value }) => {
    return (
        <div className={style.square} onClick={() => onClick(id)}>
            <div>
                {value}
            </div>
        </div>
    )
}

const Tictactoe = () => {
    const [draw, setDraw] = useState(false);
    const [turn, setTurn] = useState('O');
    const [fill, setFill] = useState(BOARDS);
    const [won, setWon] = useState(false);

    const checkWinner = useCallback(() => {
        WIN.forEach((val, index) => {
            const cells = val;
            const normalizedCells = cells.map((val) => (val - 1 ));
            const [cell1, cell2, cell3] = normalizedCells;
            

            if (fill[cell1] && fill[cell1] === fill[cell2] && fill[cell1] === fill[cell3]) {
                setWon(true);
                return;
            }
            
            // Debug
            // console.log(index);
            // console.log('cellsVaL: ', { cell1, cell2, cell3});
            // console.log('fill: ', fill[cell1], fill[cell2], fill[cell3]);
        });

        // draw condition
        if (fill.every((val) => (Boolean(val))) && !won) {
            setDraw(true)
        }
    }, [fill, setWon, won]);

    const handleSquareClick = (id) => {
        // bail if already filled
        if (fill[id] || won || draw) return;
        setFill((prev) => {
            return prev.map((item, idx) => {
                return idx === id ? turn : item;
            });
        });

        setTurn(turn === 'O' ? 'X' : 'O');
    }

    const handleResetBoard = () => {
        setFill(BOARDS);
        setTurn('O');
        setWon(false);
        setDraw(false);
    }

    useEffect(() => {
        checkWinner();
    }, [fill, checkWinner]);

    // console.log({ fill, won });
    console.log({ won });

    return (
        <div className={style.wrapper}>
            <div>
                {draw && (
                    <div>Game is a draw!!</div>
                )}

                {won && (
                    <div>Player {turn} won!!</div>
                )}

                <div className={style.board}>
                    {SQUARE.map((_, idx) => {
                        return <Square key={`sq-${idx}`} id={idx} value={fill[idx]} onClick={handleSquareClick} />;
                    })}
                </div>
                
                <div>Player {turn}'s turn </div>
                <div>
                    <button onClick={handleResetBoard}>reset</button>
                </div>
            </div>
            
        </div>
    );
}

export default Tictactoe;