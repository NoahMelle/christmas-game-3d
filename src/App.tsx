import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import LoadingWrapper from "./components/LoadingWrapper";
import Snowfall from "react-snowfall";
import { PlayerColors } from "./MainMenu";
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
  playerColors,
}: {
  setScene: React.Dispatch<React.SetStateAction<number>>;
  playerColors: PlayerColors;
}) {
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [winner, setWinner] = useState<number | null>(null);
  const [lastPuckReset, setLastPuckReset] = useState(Date.now());
  const [currentGamemodeState, setCurrentGamemodeState] =
    useState<GamemodeState | null>(null);
  const maxPointsWinner = 5;
  const maxTimeWinner = 4 * 60000;
  const [currentDate, setCurrentDate] = useState<Date | null>(
    new Date(maxTimeWinner)
  );

  useEffect(() => {
    if (currentGamemodeState !== null) {
      const newTargetDate = new Date(new Date().getTime() + maxTimeWinner);

      const interval = setInterval(() => {
        setCurrentDate(
          new Date(newTargetDate.getTime() - new Date().getTime())
        );

        if (new Date().getTime() >= newTargetDate.getTime()) {
          setWinner(score.p1 === score.p2 ? 3 : score.p1 > score.p2 ? 1 : 2);
          setCurrentGamemodeState(GamemodeState.Winner);

          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentGamemodeState]);

  useEffect(() => {
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
            {currentDate
              ? `${Math.floor(
                  (currentDate.getTime() / 60000) % 60
                )}:${Math.floor((currentDate.getTime() / 1000) % 60)
                  .toString()
                  .padStart(2, "0")}`
              : "0:00"}
            {" - "}
            {score.p2}
          </h1>
        </div>
      ) : null}
      {winner !== null ? (
        <div className="win-screen">
          <h2>
            {winner !== 3 ? `Player ${winner} is the winner!` : `Draw...`}
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
