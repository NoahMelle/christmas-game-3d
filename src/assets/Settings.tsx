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
    return (
        <div className={styles.settings}>
            <div className={styles.settingGroup}>
                P1 Color
                <ColorPicker
                    setPlayerColors={setPlayerColors}
                    player="p1"
                    playerColors={playerColors}
                />
            </div>
            <div className={styles.settingGroup}>
            P2 Color
                <ColorPicker
                    setPlayerColors={setPlayerColors}
                    player="p2"
                    playerColors={playerColors}
                />
            </div>
        </div>
    );
}
