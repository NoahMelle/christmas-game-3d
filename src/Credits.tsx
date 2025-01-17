import { useEffect, useState } from "react";
import styles from "./menu.module.scss";

export default function Credits() {
    const [credits, setCredits] = useState<any[]>([]);

    useEffect(() => {
        fetch("/credits.json")
            .then((response) => response.json())
            .then((data) => setCredits(data))
            .catch((error) => console.error("Error fetching credits:", error));
    }, []);

    return (
        <div className={styles.credits}>
            {credits.map((credit, index) => (
                <div key={index}>
                    <p className={styles.creditLabel}>{credit.name}</p>
                    <ul>
                        {credit.contributors.map(
                            (contributor: any, contributorIndex: number) => (
                                <li
                                    className={styles.contributorLabel}
                                    key={index + " - " + contributorIndex}
                                >
                                    <a href={contributor.link} target="_blank">
                                        {contributor.name}
                                    </a>
                                </li>
                            )
                        )}
                    </ul>
                </div>
            ))}
        </div>
    );
}
