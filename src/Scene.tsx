import { CameraControls, Environment } from "@react-three/drei";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import Rink from "./assets/Rink";
import { Puck } from "./assets/Puck";
import { Player } from "./assets/Player";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useEffect, useRef } from "react";
import { Goal } from "./assets/Goal";
import { PlayerColors } from "./MainMenu";
import { degToRad } from "three/src/math/MathUtils.js";
import { useControls } from "leva";
import { Crowd } from "./assets/Crowd";
import { Trees } from "./assets/Trees";
import { Arena } from "./assets/Arena";

export default function Scene({
  score,
  setScore,
  lastPuckReset,
  setLastPuckReset,
  gameStarted,
  playerColors,
}: Readonly<{
  score: { p1: number; p2: number };
  setScore: React.Dispatch<React.SetStateAction<{ p1: number; p2: number }>>;
  lastPuckReset: number;
  setLastPuckReset: React.Dispatch<React.SetStateAction<number>>;
  gameStarted: boolean;
  playerColors: PlayerColors;
}>) {
  const isOnLeft = useRef(true);

  const puckRef = useRef<RapierRigidBody | null>(null);
  const cameraControlRef = useRef<CameraControls | null>(null);
  const lookPosLeft = useRef(new Vector3());
  const lookPosRight = useRef(new Vector3());
  const rinkDimensions = useRef(new Vector3());

  const { debugPhysics } = useControls({
    debugPhysics: false,
  });

  const startingDistance = useRef(6);
  const p1StartingPos = useRef(new Vector3(0, 2, startingDistance.current));
  const p2StartingPos = useRef(new Vector3(0, 2, -startingDistance.current));

  useFrame(() => {
    if (!puckRef.current) {
      return;
    }

    // z > 0 means puck is on the left side
    const { z } = puckRef.current.translation();

    const isPuckOnLeft = z > 0;
    if (isPuckOnLeft !== isOnLeft.current) {
      const newMovePos = new Vector3(
        rinkDimensions.current.x / 2,
        8,
        isPuckOnLeft
          ? rinkDimensions.current.z / 2
          : -rinkDimensions.current.z / 2
      );

      const lookPos = isPuckOnLeft ? lookPosLeft.current : lookPosRight.current;

      cameraControlRef.current?.moveTo(
        newMovePos.x,
        newMovePos.y,
        newMovePos.z,
        true
      );
      cameraControlRef.current?.lookInDirectionOf(
        lookPos.x,
        lookPos.y,
        lookPos.z,
        true
      );
    }

    isOnLeft.current = isPuckOnLeft;
  });

  useEffect(() => {
    console.log(score);
    setLastPuckReset(Date.now());
  }, [score]);

  return (
    <>
      <CameraControls makeDefault ref={cameraControlRef} />
      <Environment
        preset="city"
        environmentIntensity={0.3}
        environmentRotation={[0, degToRad(45), 0]}
      />
      <Physics debug={debugPhysics}>
        <Trees />
        <Crowd />
        <Arena />
        <Rink
          lookPosLeft={lookPosLeft}
          lookPosRight={lookPosRight}
          rinkDimensions={rinkDimensions}
        />
        <Goal setScore={setScore} player={"p1"} position={[0, 1.7, -9]} />
        <Goal
          rotation={[0, degToRad(180), 0]}
          setScore={setScore}
          player={"p2"}
          position={[0, 1.6, 9]}
        />
        <Player
          color={playerColors.p1}
          startingPos={p1StartingPos}
          playerNumber={1}
          lastPuckReset={lastPuckReset}
          uuid="player1"
          gameStarted={gameStarted}
        />
        <Player
          color={playerColors.p2}
          startingPos={p2StartingPos}
          uuid="player2"
          playerNumber={2}
          lastPuckReset={lastPuckReset}
          gameStarted={gameStarted}
        />
        <Puck
          innerRef={puckRef}
          lastPuckReset={lastPuckReset}
          gameStarted={gameStarted}
        />
      </Physics>
    </>
  );
}
