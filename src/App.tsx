import { useEffect, useState } from 'react'

enum Direction {
    North = 'N',
    South = 'S',
    East = 'E',
    West = 'W',
}

enum Instruction {
    Right = 'R',
    Left = 'L',
    Forward = 'F',
}

interface Position {
    x: number
    y: number
    direction: Direction
}

interface Move {
    instruction: Instruction
}

interface MowerLand {
    x: number
    y: number
}

export default function App() {
    const [MowerPosition, setMowerPosition] = useState<Position>({
        x: 0,
        y: 0,
        direction: Direction.North,
    })

    const [MowerLandCoordo, setMowerLandCoordo] = useState<MowerLand>({
        x: 5,
        y: 5,
    })

    const turnRight = () => {
        setMowerPosition(
            (prevPosition) =>
                ({
                    ...prevPosition,
                    direction:
                        prevPosition.direction === Direction.North
                            ? Direction.East
                            : prevPosition.direction === Direction.East
                            ? Direction.South
                            : prevPosition.direction === Direction.South
                            ? Direction.West
                            : Direction.North,
                }) as Position
        )
    }

    const turnLeft = () => {
        setMowerPosition(
            (prevPosition) =>
                ({
                    ...prevPosition,
                    direction:
                        prevPosition.direction === Direction.North
                            ? Direction.West
                            : prevPosition.direction === Direction.West
                            ? Direction.South
                            : prevPosition.direction === Direction.South
                            ? Direction.East
                            : Direction.North,
                }) as Position
        )
    }

    const MoveForward = () => {
        setMowerPosition((prevPosition) => {
            let newX = prevPosition.x
            let newY = prevPosition.y
            switch (prevPosition.direction) {
                case 'N':
                    newY = newY + 1
                    if (newY > MowerLandCoordo.y) {
                        newY = MowerLandCoordo.y
                    }
                    break
                case 'S':
                    newY = newY - 1
                    if (newY < 0) {
                        newY = 0
                    }
                    break
                case 'E':
                    newX = newX + 1
                    if (newX > MowerLandCoordo.x) {
                        newX = MowerLandCoordo.x
                    }
                    break
                case 'W':
                    newX = newX - 1
                    if (newX < 0) {
                        newX = 0
                    }
                    break
                default:
                    break
            }
            return {
                ...prevPosition,
                x: newX,
                y: newY,
            }
        })
    }

    const moveMower = (move: Move['instruction']) => {
        switch (move) {
            case 'R':
                turnRight()
                break
            case 'L':
                turnLeft()
                break
            case 'F':
                MoveForward()
                break
            default:
                break
        }
    }

    const moveMowerSequence = (sequence: string) => {
        if (sequence === '') {
            setMowerPosition({
                x: MowerPosition.x,
                y: MowerPosition.y,
                direction: MowerPosition.direction,
            })
        }

        const sequenceSplit = sequence.split('')

        for (const move of sequenceSplit) {
            if (
                move === Instruction.Right ||
                move === Instruction.Left ||
                move === Instruction.Forward
            ) {
                moveMower(move)
            } else {
                alert('Mauvaise indication')
            }
        }
    }

    const moveMowers = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms))

    const fetchData = async (): Promise<void> => {
        try {
            const response = await fetch('../mowler.txt')
            if (!response.ok) {
                throw new Error('Error fetching data')
            }
            const data = await response.text()
            const dataSplit = data.split('\n')

            const [
                landCoordo,
                MowerFirstPosition,
                mowerInstructionFirst,
                mowerSecondPosition,
                mowerSecondInstruction,
            ] = dataSplit

            const [landX, landY] = landCoordo.split('')

            const [MowerCoordoX, mowerCoordoY, , mowerCoordoDir] =
                MowerFirstPosition.split('')

            setMowerLandCoordo({
                x: parseInt(landX),
                y: parseInt(landY),
            })

            setMowerPosition({
                x: parseInt(MowerCoordoX),
                y: parseInt(mowerCoordoY),
                direction: mowerCoordoDir as Direction,
            })

            moveMowerSequence(mowerInstructionFirst)

            await moveMowers(3000)

            const [
                mowerSecondCoordoX,
                mowerSecondCoordoY,
                ,
                mowerSecondCoordoDir,
            ] = mowerSecondPosition.split('')

            setMowerPosition({
                x: parseInt(mowerSecondCoordoX, 10),
                y: parseInt(mowerSecondCoordoY, 10),
                direction: mowerSecondCoordoDir as Direction,
            })

            moveMowerSequence(mowerSecondInstruction)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div>
            <p>x: {MowerPosition.x}</p>
            <p>y: {MowerPosition.y}</p>
            <p>direction: {MowerPosition.direction}</p>
        </div>
    )
}

// 55
// 44 S
// LFRRFFLFRFF
// attendu : Pour la tondeuse 1 [1, 3] et orientation W
// 22 N
// FFRLLRFRLF
// attendu : Pour la tondeuse 2 [2, 5] et orientation N
