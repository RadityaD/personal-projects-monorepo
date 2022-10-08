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

const LSKEY = "tttscore";

const PLAYERS = [
    {
        id: 1,
        name: 'Player 1',
        symbol: 'X'
    },
    {
        id: 2,
        name: 'Player 2',
        symbol: 'O',
    }
]


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
    const [score, setScore] = useState({
        p1: 0,
        p2: 0,
        t: 0,
    });
    const [isResetting, setReset] = useState(false);
    const [draw, setDraw] = useState(false);
    const [turn, setTurn] = useState(PLAYERS[0]);
    const [fill, setFill] = useState(BOARDS);
    const [won, setWon] = useState(false);
    const [winner, setWinner] = useState(null);

    /**
     * check winner on fill changed
     */
    const checkWinner = useCallback(() => {
        WIN.forEach((val, index) => {
            const cells = val;
            const normalizedCells = cells.map((val) => (val - 1 ));
            const [cell1, cell2, cell3] = normalizedCells;

            const isfilled = fill.every((val) => (Boolean(val)));


            if (fill[cell1] && fill[cell1] === fill[cell2] && fill[cell1] === fill[cell3]) {
                setWon(true);
                if (turn.id === 2) {
                    setWinner(PLAYERS[0]);
                    setScore((prev) => {
                        const toSend = {
                            ...prev,
                            p1: prev.p1 + 1,
                        }
                        localStorage.setItem(LSKEY, JSON.stringify(toSend));
                        return toSend;
                    });
                } else {
                    setWinner(PLAYERS[1]);
                    setScore((prev) => {
                        const toSend = {
                            ...prev,
                            p2: prev.p2 + 1,
                        }
                        localStorage.setItem(LSKEY, JSON.stringify(toSend));
                        return toSend;
                    });
                }
                return;
            }

            if (isfilled) {
                console.log({ fill });
                setDraw(true)
                setScore({
                    ...score,
                    t: score.t + 1,
                })
                return;
            }
            
            // Debug
            // console.log(index);
            // console.log('cellsVaL: ', { cell1, cell2, cell3});
            // console.log('fill: ', fill[cell1], fill[cell2], fill[cell3]);
        });

        // draw condition
        
    }, [fill, setWon, turn.id, score]);

    /**
     * 
     * @param {number} id - square id
     * @returns - void
     */
    const handleSquareClick = (id) => {
        // bail if already filled
        if (fill[id] || won || draw) return;
        setFill((prev) => {
            return prev.map((item, idx) => {
                return idx === id ? turn.symbol : item;
            });
        });

        setTurn(turn.id === 1 ? PLAYERS[1] : PLAYERS[0]);
    }

    /**
     * Reset game
     */
    const handleResetBoard = () => {
        setFill(BOARDS);
        setTurn(PLAYERS[0]);
        setWon(false);
        setDraw(false);
        setWinner(null);
    }

    useEffect(() => {
        if (!won && !draw) {
            checkWinner();
        }
    }, [fill, checkWinner, draw, won]);

    // Check local storage for persisting data
    useEffect(() => {
        if (localStorage.getItem(LSKEY)) {
            const converted = JSON.parse(localStorage.getItem(LSKEY));
            setScore(converted)
        }
    }, [])

    useEffect(() => {
        if (won || draw) {
            setReset(true);
            setTimeout(() => {
                handleResetBoard();
                setReset(false);
            }, 2000)
        }
    }, [draw, won]);


    // DEBUG
    // console.log({ fill, won });
    // console.log({ won });
    console.log({ won, draw, turn, winner });

    return (
        <div className={style.wrapper}>
            <div>
                {/* Reset Notif */}
                {isResetting && <div className={style.notif}>RESETTING IN 2 Seconds</div>}

                {/* Turn Notif*/}
                {!won && !draw && <div className={style.notif}>{`${turn.name} (${turn.symbol})`} turn</div>}

                {/* Draw Notif*/}
                {draw && !won && (
                    <div className={style.notif}>Game is a draw!!</div>
                )}
                
                {/* Winner Notif */}
                {won && (won || draw) && winner?.id && (
                    <div className={style.notif}>{winner?.name || ''} won!!</div>
                )}

                <div className={style.board}>
                    {SQUARE.map((_, idx) => {
                        return <Square key={`sq-${idx}`} id={idx} value={fill[idx]} onClick={handleSquareClick} />;
                    })}
                </div>
                
                <div className={style.stats}>
                    {PLAYERS.map((val) => {
                        return (
                            <div className={style.scoreboard} key={val.name}>
                                <div>{ `${val.name} (${val.symbol})`} </div>
                                <div className={style.score}>{val.id === 1 ? score.p1 : score.p2}</div>
                            </div>
                        )
                    })}
                
                    <div className={style.scoreboard}>
                        <div>TIE</div>
                        <div className={style.score}>{score.t}</div>
                    </div>
                </div>
                <div>{turn.name} </div>
            </div>
            
        </div>
    );
}

export default Tictactoe;