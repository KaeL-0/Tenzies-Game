import {useState, useRef, useEffect, use} from 'react'
import {nanoid} from 'nanoid'
import Die from './components/Die'
import Confetti from 'react-confetti'


export default function App() {

    const [diceNumbers, setDiceNumbers] = useState(() => generateAllNewDice())
    const [time, setTime] = useState(0)
    const [rollCounter, setRollCounter] = useState(0)

    const newGameButton = useRef(null)
    const timeoutId = useRef(null)


    const dieComponentArray = diceNumbers.map(item => (
        <Die key={item.id} id={item.id} value={item.value} isHeld={item.isHeld} hold={hold}/>
    ))

    let gameWon = (
        diceNumbers.every(item => item.isHeld) &&
        diceNumbers.every(item => item.value === diceNumbers[0].value)
    )

    

    useEffect(()=>{
        gameWon && newGameButton.current.focus()
    }, [gameWon])
    
    useEffect(()=>{

        if(!gameWon){
            timeoutId.current = setInterval(()=>{
                setTime(prev => prev + 1)
            }, 10)
        } 
        
        return () => {
            // Clear interval on cleanup (component unmount or when gameWon changes)
            clearInterval(timeoutId.current);
        };

    }, [gameWon])

    function generateAllNewDice() {
        return new Array(10)
            .fill(0) // fills the array with throwaway value with the value of 0
            .map(()=> ({
                id: nanoid(),
                value: Math.ceil(Math.random() * 6),
                isHeld: false
            }))
    }   

    function hold(id) {
        setDiceNumbers(diceNumbers.map((item)=>{
            return item.id == id ? 
            {...item, isHeld: !item.isHeld} :
            item
        }))
    }

    function rollDice() {
        setDiceNumbers(diceNumbers.map(item=>{
            return item.isHeld ?
            item :
            {...item, value: Math.ceil(Math.random() * 6)}

        }))
        setRollCounter(prev=> prev + 1)
    }

    function newGame() {
        setDiceNumbers(generateAllNewDice())
        setTime(0)
        setRollCounter(0)
    }
    
    return (
        <main>

            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <p className='stopwatch'>
                {'Time Spent: '}
                {time >= 6000 && `${Math.floor((time / 100) / 60)}:`}
                {Math.floor((time/100) % 60) < 10 && '0' }{Math.floor((time/100) % 60)}:
                {time % 100}
            </p>
            <p className='rolls'>{'Number of rolls: '}{rollCounter}</p>

            <div id='diceContainer'>
                {dieComponentArray}
            </div>
            
            <button id='roll' onClick={gameWon ? newGame : rollDice} ref={newGameButton}
            >{gameWon ? 'New Game' : 'Roll'}</button>

            {gameWon && <Confetti />}

            <div aria-live="polite" className="srOnly">
                {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
            </div>

        </main>
    )
}