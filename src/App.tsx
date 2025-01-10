import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import Scene from "./Scene";

export default function App() {
    const [isOnLeft, setIsOnLeft] = useState(true);
    const [score, setScore] = useState({ p1: 0, p2: 0 });
    const [lastPuckReset, setLastPuckReset] = useState(Date.now());

    useEffect(() => {
        console.log(score);
        setLastPuckReset(Date.now());
    }, [score]);

    return (
        <>
            <div className="score">
                <h1>
                    {score.p1} - {score.p2}
                </h1>
            </div>
            <Canvas>
                <Scene
                    isOnLeft={isOnLeft}
                    setIsOnLeft={setIsOnLeft}
                    score={score}
                    setScore={setScore}
                    lastPuckReset={lastPuckReset}
                    setLastPuckReset={setLastPuckReset}
                />
            </Canvas>
        </>
    );
}
