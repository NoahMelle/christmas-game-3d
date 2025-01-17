import styles from "../menu.module.scss";
import { PlayerColors } from "../MainMenu";

const ColorPicker = ({
    setPlayerColors,
    player,
    playerColors,
}: {
    setPlayerColors: React.Dispatch<React.SetStateAction<PlayerColors>>;
    player: "p1" | "p2";
    playerColors: PlayerColors;
}) => {
    const toggleColor = (color: string) => {
        setPlayerColors((prev) => ({
            ...prev,
            [player]: color,
        }));
    };

    return (
        <div className={styles.colorPicker}>
            <div className={styles.balls}>
                {["red", "orange", "yellow", "green", "blue", "purple"].map(
                    (color) => (
                        <button
                            key={color}
                            className={
                                styles.ball +
                                " " +
                                (playerColors[player] === color &&
                                    styles.selected)
                            }
                            style={{ backgroundColor: color }}
                            onClick={() => toggleColor(color)}
                        ></button>
                    )
                )}
            </div>
        </div>
    );
};

export default ColorPicker;
