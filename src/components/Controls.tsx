import styles from "../controls.module.scss";

export default function Controls() {
    return (
        <div className={styles.controlsContainer}>
            <div className={styles.playerControls}>
                <div className={styles.controlGroup}>
                    <div className={styles.keyboardLayout}>
                        <div></div>
                        <div className={styles.controlButton}>W</div>
                        <div></div>
                        <div className={styles.controlButton}>A</div>
                        <div className={styles.controlButton}>S</div>
                        <div className={styles.controlButton}>D</div>
                    </div>
                </div>
                <div className={styles.controlGroup}>
                    <div className={styles.rotateButtons}>
                        <div className={styles.controlButton}>V</div>
                        <div className={styles.controlButton}>B</div>
                    </div>
                </div>
            </div>
            <div className={styles.playerControls}>
                <div className={styles.controlGroup}>
                    <div className={styles.keyboardLayout}>
                        <div></div>
                        <div className={styles.controlButton}>↑</div>
                        <div></div>
                        <div className={styles.controlButton}>←</div>
                        <div className={styles.controlButton}>↓</div>
                        <div className={styles.controlButton}>→</div>
                    </div>
                </div>
                <div className={styles.controlGroup}>
                    <div className={styles.rotateButtons}>
                        <div className={styles.controlButton}>,</div>
                        <div className={styles.controlButton}>.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
