import { useState, useEffect } from "react";
import * as suncalc from "suncalc";

export function useSunsetTime() {
    const [sunsetTime, setSunsetTime] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getSunsetTime = async () => {
            try {
                // Get user's location
                const position = await new Promise<GeolocationPosition>(
                    (resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(
                            resolve,
                            reject
                        );
                    }
                );

                const { latitude, longitude } = position.coords;

                // Calculate sunset time
                const times = suncalc.getTimes(new Date(), latitude, longitude);
                setSunsetTime(times.sunset);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to calculate sunset time"
                );
            } finally {
                setLoading(false);
            }
        };

        getSunsetTime();
    }, []);

    return { sunsetTime, loading, error };
}
