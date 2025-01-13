import { CameraControls } from "@react-three/drei";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import Rink from "./assets/Rink";
import { Puck } from "./assets/Puck";
import { Player } from "./assets/Player";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useEffect, useRef } from "react";
import { Goal } from "./assets/Goal";
import { degToRad } from "three/src/math/MathUtils.js";
import { useControls } from "leva";

export default function Scene({
  isOnLeft,
  setIsOnLeft,
  score,
  setScore,
  lastPuckReset,
  setLastPuckReset,
}: Readonly<{
  isOnLeft: boolean;
  setIsOnLeft: React.Dispatch<React.SetStateAction<boolean>>;
  score: { p1: number; p2: number };
  setScore: React.Dispatch<React.SetStateAction<{ p1: number; p2: number }>>;
  lastPuckReset: number;
  setLastPuckReset: React.Dispatch<React.SetStateAction<number>>;
}>) {
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
    if (isPuckOnLeft !== isOnLeft) {
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

    setIsOnLeft(z > 0);
  });

  useEffect(() => {
    console.log(score);
    setLastPuckReset(Date.now());
  }, [score]);

  return (
    <>
      <directionalLight position={[2, 11, -3]} intensity={2} />
      <ambientLight intensity={0.6} />
      <CameraControls makeDefault ref={cameraControlRef} />
      <Physics debug={debugPhysics}>
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
          color="red"
          startingPos={p1StartingPos}
          playerNumber={1}
          lastPuckReset={lastPuckReset}
        />
        <Player
          color="blue"
          startingPos={p2StartingPos}
          playerNumber={2}
          lastPuckReset={lastPuckReset}
        />
        <Puck innerRef={puckRef} lastPuckReset={lastPuckReset} />
      </Physics>
    </>
  );
}
