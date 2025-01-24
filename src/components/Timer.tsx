import React, { useEffect } from "react";

export default function Timer({
    setHasGameFinished,
    targetDate,
}: Readonly<{
    setHasGameFinished: React.Dispatch<React.SetStateAction<boolean>>;
    targetDate: Date | null;
}>) {
    const [timeDisplay, setTimeDisplay] = React.useState("00:00");
    const [timeInterval, setTimeInterval] = React.useState<number | undefined>(
        undefined
    );

    useEffect(() => {
        setTimeInterval(() =>
            setInterval(() => {
                const now = new Date().getTime();
                if (!targetDate) {
                    return;
                }
                const distance = targetDate.getTime() - now;

                const minutes = padTime(
                    Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
                );
                const seconds = padTime(
                    Math.floor((distance % (1000 * 60)) / 1000)
                );

                setTimeDisplay(`${minutes}:${seconds}`);

                if (distance < 0) {
                    clearInterval(timeInterval);
                    setTimeDisplay("00:00");
                    setHasGameFinished(true);
                }
            }, 1000)
        );

        function padTime(time: number) {
            return time.toString().padStart(2, "0");
        }

        return () => {
            if (timeInterval) {
                clearInterval(timeInterval);
            }
        };
    }, [targetDate]);

    return <span>{timeDisplay}</span>;
}
