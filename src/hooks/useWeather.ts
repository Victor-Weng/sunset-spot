import { useState, useEffect } from "react";

interface Weather {
    temp: number;
    description: string;
    icon: string;
}

export function useWeather() {
    const [weather, setWeather] = useState<Weather | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
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

                // Fetch weather data
                const response = await fetch(
                    `/api/weather?lat=${latitude}&lon=${longitude}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch weather data");
                }

                const data = await response.json();
                setWeather(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch weather"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    return { weather, loading, error };
}
