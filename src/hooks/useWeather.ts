import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherData, fetchAirQuality, getRainStartMinutes, type WeatherData } from '../api/weather';

export function useWeather() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [aqi, setAqi] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [locationName, setLocationName] = useState('Locating...');
    const [rainMinutes, setRainMinutes] = useState<number | null>(null);
    const [isMonsoon, setIsMonsoon] = useState(false);

    const fetchAllData = useCallback(async (lat: number, lon: number, name?: string) => {
        setLoading(true);
        try {
            if (name) setLocationName(name);

            const [weatherData, aqiData] = await Promise.all([
                fetchWeatherData(lat, lon),
                fetchAirQuality(lat, lon)
            ]).catch((e) => {
                // Fallback if one fails, but usually Promise.all fails fast. 
                // For robustness we could handle individually but this is fine for now.
                throw e;
            });

            setWeather(weatherData);
            setAqi(aqiData.current.us_aqi);

            const rain = getRainStartMinutes(weatherData.hourly);
            setRainMinutes(rain);

            const now = new Date();
            let currentHourIndex = weatherData.hourly.time.findIndex(t => new Date(t).getTime() > now.getTime()) - 1;
            if (currentHourIndex < 0) currentHourIndex = 0;

            const currentHumidity = weatherData.hourly.relative_humidity_2m[currentHourIndex];
            setIsMonsoon(currentHumidity > 85);

            setLoading(false);
        } catch (err) {
            setError('Failed to fetch weather data');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                if (locationName === 'Locating...') {
                    // We don't have reverse geocoding API in the free tier of Open-Meteo easily without another call
                    // For now just show coordinates if initial valid
                    setLocationName(`${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`);
                }
                fetchAllData(latitude, longitude);
            },
            () => {
                setError('Location permission denied. Please enable location or search manually.');
                setLoading(false);
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateLocation = (lat: number, lon: number, name: string) => {
        fetchAllData(lat, lon, name);
    };

    return { weather, aqi, loading, error, locationName, rainMinutes, isMonsoon, updateLocation };
}
