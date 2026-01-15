export interface WeatherData {
    current_weather: {
        temperature: number;
        weathercode: number;
        windspeed: number;
        time: string;
        is_day: number;
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
        precipitation_probability: number[];
        relative_humidity_2m: number[];
        apparent_temperature: number[];
        visibility: number[];
    };
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        weathercode: number[];
        uv_index_max: number[];
        sunrise: string[];
        sunset: string[];
    };
}

export interface AirQualityData {
    current: {
        us_aqi: number;
    };
}

export interface GeocodingData {
    results?: {
        id: number;
        name: string;
        latitude: number;
        longitude: number;
        country: string;
        admin1?: string;
    }[];
}

export async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityData> {
    const params = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lon.toString(),
        current: 'us_aqi',
    });

    const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to fetch air quality data');
    }
    return response.json();
}

export async function fetchGeocoding(name: string): Promise<GeocodingData> {
    const params = new URLSearchParams({
        name: name,
        count: '5',
        language: 'en',
        format: 'json',
    });

    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to fetch geocoding data');
    }
    return response.json();
}

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
    const params = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lon.toString(),
        hourly: 'temperature_2m,precipitation_probability,relative_humidity_2m,apparent_temperature,visibility',
        daily: 'weathercode,temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset',
        current_weather: 'true',
        timezone: 'auto',
    });

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    return response.json();
}

export function getRainStartMinutes(hourly: WeatherData['hourly']): number | null {
    const now = new Date();
    const currentHourIndex = hourly.time.findIndex(t => new Date(t).getTime() > now.getTime());

    if (currentHourIndex === -1) return null;

    for (let i = 0; i < 4; i++) {
        const idx = currentHourIndex + i;
        if (idx >= hourly.precipitation_probability.length) break;

        if (hourly.precipitation_probability[idx] > 30) {
            const rainTime = new Date(hourly.time[idx]);
            const diffMs = rainTime.getTime() - now.getTime();
            return Math.max(0, Math.floor(diffMs / 60000));
        }
    }
    return null;
}
