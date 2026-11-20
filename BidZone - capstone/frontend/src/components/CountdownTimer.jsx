import React, { useState, useEffect } from "react";

const CountdownTimer = ({ endTime, status, onExpire }) => {
    const calculateTimeLeft = () => {
        const difference = new Date(endTime).getTime() - new Date().getTime();
        if (difference <= 0) {
            return null;
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);

            if (!remaining && status === "active" && onExpire) {
                onExpire();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime, status]);

    if (status === "ended" || !timeLeft) {
        return <span className="timer-badge timer-ended">Auction Ended</span>;
    }

    const { days, hours, minutes, seconds } = timeLeft;

    return (
        <span className="timer-badge timer-active">
            ⏱ {days > 0 ? `${days}d ` : ""}{hours}h {minutes}m {seconds}s left
        </span>
    );
};

export default CountdownTimer;
