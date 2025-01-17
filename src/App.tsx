import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import LoadingWrapper from "./components/LoadingWrapper";
import Snowfall from "react-snowfall";
import Scene from "./Scene";

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
}: {
    setScene: React.Dispatch<React.SetStateAction<number>>;
}) {
    const [score, setScore] = useState({ p1: 0, p2: 0 });
    const [winner, setWinner] = useState<number | null>(null);
    const [lastPuckReset, setLastPuckReset] = useState(Date.now());
    const [currentGamemodeState, setCurrentGamemodeState] =
        useState<GamemodeState | null>(null);
    const maxPointsWinner = 5;

    useEffect(() => {
        console.log(score);
        setLastPuckReset(Date.now());

        if (currentGamemodeState === GamemodeState.Points) {
            if (score.p1 >= maxPointsWinner || score.p2 >= maxPointsWinner) {
                setWinner(score.p1 > score.p2 ? 1 : 2);
                setCurrentGamemodeState(GamemodeState.Winner);
            }
        }
    }, [score]);

    return (
        <>
            <Snowfall
                color="rgba(255, 255, 255, 0.4)"
                style={{
                    width: "100vw",
                    height: "100vh",
                }}
            />
            <LoadingWrapper>
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
                ) : null}
                {winner !== null ? (
                    <div className="win-screen">
                        <h2>Player: {winner} is the winner!</h2>
                        <button
                            onClick={() => {
                                setScene(MenuState.Menu);
                            }}
                        >
                            Back
                        </button>
                    </div>
                ) : null}
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
