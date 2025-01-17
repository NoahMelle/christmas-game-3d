import React, { SetStateAction } from "react";
import { PlayerColors } from "../MainMenu";
import ColorPicker from "./ColorPicker";
import styles from "../menu.module.scss";

export default function Settings({
    playerColors,
    setPlayerColors,
}: Readonly<{
    playerColors: PlayerColors;
    setPlayerColors: React.Dispatch<SetStateAction<PlayerColors>>;
}>) {
    const handleColorChange = (e: React.FormEvent, player: string) => {
        setPlayerColors((prev) => ({
            ...prev,
            [player]: (e.target as HTMLInputElement).value,
        }));
    };

    return (
        <div className={styles.settings}>
            <input
                type="color"
                value={playerColors.p1}
                onChange={(e) => handleColorChange(e, "p1")}
            />
            <input
                type="color"
                value={playerColors.p2}
                onChange={(e) => handleColorChange(e, "p2")}
            />
            <ColorPicker />
        </div>
    );
}
