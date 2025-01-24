import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import LoadingWrapper from "./components/LoadingWrapper";
import Snowfall from "react-snowfall";
import { PlayerColors } from "./MainMenu";
import Scene from "./Scene";
import Controls from "./components/Controls";
import Timer from "./components/Timer";

enum GamemodeState {
    Minutes,
    Points,
    Winner,
}

export enum MenuState {
    Menu,
    Credits,
}

export default function App({
    setScene,
    playerColors,
    isCrowdDisabled,
}: {
    setScene: React.Dispatch<React.SetStateAction<number>>;
    playerColors: PlayerColors;
    isCrowdDisabled: boolean;
}) {
    const [score, setScore] = useState({ p1: 0, p2: 0 });
    const [winner, setWinner] = useState<number | null>(null);
    const [lastPuckReset, setLastPuckReset] = useState(Date.now());
    const [currentGamemodeState, setCurrentGamemodeState] =
        useState<GamemodeState | null>(null);
    const maxPointsWinner = 5;
    const maxTimeWinner = 4 * 60000; // 4 minutes in milliseconds
    const [targetDate, setTargetDate] = useState<Date | null>(null);

    const [hasGameFinished, setHasGameFinished] = useState(false);

    // Effect to handle gamemode state
    useEffect(() => {
        if (currentGamemodeState === GamemodeState.Minutes) {
            setTargetDate(new Date(Date.now() + maxTimeWinner));
        }
    }, [currentGamemodeState]);

    // Determine the winner based on the score
    const determineWinner = (currentScore: typeof score) => {
        if (currentScore.p1 === currentScore.p2) {
            setWinner(3); // Draw
        } else {
            setWinner(currentScore.p1 > currentScore.p2 ? 1 : 2);
        }
    };

    // Effect to handle score updates
    useEffect(() => {
        setLastPuckReset(Date.now());

        if (currentGamemodeState === GamemodeState.Points) {
            if (score.p1 >= maxPointsWinner || score.p2 >= maxPointsWinner) {
                setWinner(score.p1 > score.p2 ? 1 : 2);
                setCurrentGamemodeState(GamemodeState.Winner);
            }
        }
    }, [score]);

    useEffect(() => {
        if (hasGameFinished === true) {
            determineWinner(score);
        }
    }, [hasGameFinished]);

    return (
        <>
            <Snowfall
                color="rgba(255, 255, 255, 0.4)"
                style={{
                    width: "100vw",
                    height: "100vh",
                }}
            />
            {currentGamemodeState === null ? (
                <div className="gamemode-chooser">
                    <GamemodeButton
                        label={"Minutes"}
                        targetState={GamemodeState.Minutes}
                        setCurrentGamemodeState={setCurrentGamemodeState}
                    />
                    <GamemodeButton
                        label={"Points"}
                        targetState={GamemodeState.Points}
                        setCurrentGamemodeState={setCurrentGamemodeState}
                    />
                </div>
            ) : null}
            {currentGamemodeState === GamemodeState.Points ? (
                <div className="score">
                    <h1>
                        {score.p1} - {score.p2}
                    </h1>
                </div>
            ) : currentGamemodeState === GamemodeState.Minutes ? (
                <div className="score">
                    <h1>
                        {score.p1}
                        {" - "}
                        <Timer
                            setHasGameFinished={setHasGameFinished}
                            targetDate={targetDate}
                        />
                        {" - "}
                        {score.p2}
                    </h1>
                </div>
            ) : null}
            {winner !== null ? (
                <div className="win-screen">
                    <h2>
                        {winner !== 3
                            ? `Player ${winner} is the winner!`
                            : `Draw...`}
                    </h2>
                    <button
                        onClick={() => {
                            setScene(MenuState.Menu);
                        }}
                    >
                        Back
                    </button>
                </div>
            ) : null}
            <LoadingWrapper>
                <Controls />
                <Canvas
                    style={{
                        filter:
                            currentGamemodeState === null || winner !== null
                                ? "blur(10px)"
                                : "",
                    }}
                >
                    <Scene
                        score={score}
                        setScore={setScore}
                        lastPuckReset={lastPuckReset}
                        setLastPuckReset={setLastPuckReset}
                        gameStarted={
                            currentGamemodeState === GamemodeState.Winner
                                ? false
                                : currentGamemodeState !== null
                        }
                        playerColors={playerColors}
                        isCrowdDisabled={isCrowdDisabled}
                    />
                </Canvas>
            </LoadingWrapper>
        </>
    );
}

const GamemodeButton = ({
    label,
    targetState,
    setCurrentGamemodeState,
}: {
    label: string;
    targetState: GamemodeState;
    setCurrentGamemodeState: React.Dispatch<
        React.SetStateAction<GamemodeState | null>
    >;
}) => {
    return (
        <button
            className="gamemode-chooser-button"
            onClick={() => setCurrentGamemodeState(targetState)}
        >
            {label}
        </button>
    );
};
