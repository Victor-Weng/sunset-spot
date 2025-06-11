import { NextResponse } from "next/server";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
        return NextResponse.json(
            { error: "Latitude and longitude are required" },
            { status: 400 }
        );
    }

    if (!OPENWEATHER_API_KEY) {
        return NextResponse.json(
            { error: "OpenWeather API key is not configured" },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();

        return NextResponse.json({
            temp: data.main.temp,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
        });
    } catch (error) {
        console.error("Weather API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch weather data" },
            { status: 500 }
        );
    }
}
