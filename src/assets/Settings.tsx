import React, { SetStateAction } from "react";
import { PlayerColors } from "../MainMenu";
import ColorPicker from "./ColorPicker";
import styles from "../menu.module.scss";

export default function Settings({
    playerColors,
    setPlayerColors,
    isCrowdDisabled,
    setIsCrowdDisabled,
}: Readonly<{
    playerColors: PlayerColors;
    setPlayerColors: React.Dispatch<SetStateAction<PlayerColors>>;
    isCrowdDisabled: boolean;
    setIsCrowdDisabled: React.Dispatch<SetStateAction<boolean>>;
}>) {
    return (
        <div className={styles.settings}>
            <h2 className={styles.settingsHeader}>Settings</h2>
            <div className={styles.settingsGroup}>
                <h3 className={styles.settingLabel}>Colors:</h3>
                <div>
                    <div className={styles.settingGroup}>
                        <h4>P1 Color</h4>
                        <ColorPicker
                            setPlayerColors={setPlayerColors}
                            player="p1"
                            playerColors={playerColors}
                        />
                    </div>
                    <div className={styles.settingGroup}>
                        <h4>P2 Color</h4>
                        <ColorPicker
                            setPlayerColors={setPlayerColors}
                            player="p2"
                            playerColors={playerColors}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.settingsGroup}>
                <h3 className={styles.settingLabel}>Gameplay:</h3>
                <div className={styles.settingGroup}>
                    <label htmlFor="enable-crowd">Enable crowd</label>
                    <input
                        type="checkbox"
                        checked={!isCrowdDisabled}
                        onChange={() => setIsCrowdDisabled((prev) => !prev)}
                        id="enable-crowd"
                    />
                </div>
            </div>
        </div>
    );
}
