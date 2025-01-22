import { Crowder } from "./Crowder";
import * as THREE from "three";

const calculatePosition = (
  item: [number[], number[], [number, number, number]],
  crowderOffset: number,
  levelXOffset: number,
  levelYOffset: number,
  rotation: THREE.Euler,
  x: number,
  y: number,
  maxIterations: number
) => {
  const [baseX, baseY, baseZ] = item[0];
  const [offsetX, offsetY, offsetZ] = item[2];

  // Center the rows by adjusting y to account for max iterations
  const centeredY = y - (maxIterations - 1) / 2;

  return [
    baseX +
      (offsetX !== 0 ? centeredY * crowderOffset : 0) +
      x * levelXOffset * Math.sin(rotation.y),
    baseY + (offsetY !== 0 ? centeredY * crowderOffset : 0) + x * -levelYOffset,
    baseZ +
      (offsetZ !== 0 ? centeredY * crowderOffset : 0) +
      x * levelXOffset * Math.cos(rotation.y),
  ] as [number, number, number];
};

export default function Crowd() {
  const levels = 3;
  const crowderOffset = 3;
  const levelXOffset = 2;
  const levelYOffset = 2;

  const data: [number[], number[], [number, number, number]][] = [
    // position, rotation after iteration, number of iterations with directions
    [
      [0, 6.5, -24],
      [0, 0, 0],
      [15, 0, 0],
    ],
    [
      [-22, 6.5, 0],
      [0, Math.PI / 2, 0], // Rotate by 90 degrees in radians
      [0, 0, 15],
    ],
    [
      [0, 6.5, 24],
      [0, (Math.PI / 2) * 2, 0],
      [15, 0, 0],
    ],
    [
      [22, 6.5, 0],
      [0, (Math.PI / 2) * 3, 0],
      [0, 0, 15],
    ],
  ];

  data.map((item) => {
    const nonZeroCount = item[2].filter((value) => value !== 0).length;
    if (nonZeroCount > 1) {
      throw new Error(
        "The last number[] can only accept one value more than 0"
      );
    }
    return item;
  });

  // Generate random color function
  const randomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <group>
      {data.map((item, i) => {
        const rotation = new THREE.Euler(...item[1]); // Rotation in radians
        const baseIterations = item[2].find((value) => value !== 0) || 1;

        return Array.from({ length: levels }).flatMap((_, level) => {
          // Adjust the number of crowders based on the current level
          const crowdersInLevel = baseIterations - level * 2; // First level has all, second has 2 less, etc.

          // Ensure there are no negative iterations
          const iterations = Math.max(crowdersInLevel, 0);

          return Array.from({ length: iterations }).map((_, y) => {
            const position = calculatePosition(
              item,
              crowderOffset,
              levelXOffset,
              levelYOffset,
              rotation,
              level,
              y,
              iterations
            );

            return (
              <Crowder
                color={randomColor()} // Generate a unique color for each Crowder
                key={`${i}-${level}-${y}`}
                position={position}
                rotation={[rotation.x, rotation.y, rotation.z]}
              />
            );
          });
        });
      })}
    </group>
  );
}
