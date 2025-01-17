import { useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "../menu.module.scss";

const ColorPicker = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
    const [currentColor, setCurrentColor] = useState(""); 

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleColor = (color: string) => {
        setCurrentColor(color);
        setIsDropdownOpen(false);
    };

    return (
        <div className={styles.colorPicker}>
            <div className={styles.topContainer}>
                <div
                    className={`${styles.ball} ${styles.current}`}
                    data-color={currentColor}
                    style={{ backgroundColor: currentColor }}
                ></div>
                <button onClick={toggleDropdown}>
                    <ChevronDown />
                </button>
            </div>
            {isDropdownOpen && (
                <div className={styles.popup}>
                    <div className={styles.balls}>
                        {[
                            "red",
                            "orange",
                            "yellow",
                            "green",
                            "blue",
                            "purple",
                        ].map((color) => (
                            <button
                                key={color}
                                className={"ball" + color}
                                style={{ backgroundColor: color }}
                                onClick={() => toggleColor(color)}
                            ></button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorPicker;
