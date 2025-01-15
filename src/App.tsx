import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import LoadingWrapper from "./components/LoadingWrapper";
import Snowfall from "react-snowfall";
import Scene from "./Scene";

export default function App() {
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
            <Snowfall
                color="rgba(255, 255, 255, 0.4)"
                style={{
                    width: "100vw",
                    height: "100vh",
                }}
            />
            <LoadingWrapper>
                <Canvas>
                    <Scene
                        score={score}
                        setScore={setScore}
                        lastPuckReset={lastPuckReset}
                        setLastPuckReset={setLastPuckReset}
                    />
                </Canvas>
            </LoadingWrapper>
        </>
    );
}
