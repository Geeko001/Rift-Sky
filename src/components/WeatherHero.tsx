import { type WeatherData } from '../api/weather';
import { Cloud, Sun, CloudRain } from 'lucide-react';

interface WeatherHeroProps {
    weather: WeatherData;
    locationName: string;
}

const getWeatherIcon = (code: number) => {
    if (code <= 1) return <Sun className="w-8 h-8 text-primary" />;
    if (code <= 3) return <Cloud className="w-8 h-8 text-gray-400" />;
    if (code <= 67) return <CloudRain className="w-8 h-8 text-blue-400" />;
    return <Cloud className="w-8 h-8 text-gray-400" />;
};

const getWeatherDescription = (code: number) => {
    if (code <= 1) return 'Clear Sky';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Fog';
    if (code <= 67) return 'Rain';
    if (code <= 77) return 'Snow';
    return 'Overcast';
};

const WeatherHero = ({ weather, locationName }: WeatherHeroProps) => {
    const { current_weather, daily, hourly } = weather;
    const todayMax = daily.temperature_2m_max[0];
    const todayMin = daily.temperature_2m_min[0];

    // Get next 24 hours for scroll
    const currentHourIndex = hourly.time.findIndex(t => new Date(t).getTime() >= new Date().setMinutes(0, 0, 0));
    const next24Hours = hourly.time.slice(currentHourIndex, currentHourIndex + 24).map((t, i) => ({
        time: t,
        temp: hourly.temperature_2m[currentHourIndex + i],
        iconCode: hourly.precipitation_probability[currentHourIndex + i] > 30 ? 60 : 0, // Simplified icon logic for hourly
    }));

    return (
        <div className="flex flex-col items-center justify-center p-6 text-center w-full max-w-[480px] mx-auto">
            <div className="text-gray-400 text-sm mb-2 flex items-center gap-1">
                <span>{locationName}</span>
            </div>

            <div className="mb-2">
                {getWeatherIcon(current_weather.weathercode)}
            </div>

            <h1 className="text-[128px] leading-none font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                {Math.round(current_weather.temperature)}°
            </h1>

            <p className="text-xl font-medium text-gray-300 mt-2">
                {getWeatherDescription(current_weather.weathercode)}
            </p>

            <div className="flex gap-4 text-gray-400 mt-2 text-sm">
                <span>H: {Math.round(todayMax)}°</span>
                <span>L: {Math.round(todayMin)}°</span>
            </div>

            {/* Hourly Scroll */}
            <div className="w-full mt-12 overflow-x-auto pb-4 hide-scrollbar">
                <div className="flex gap-6 px-4">
                    {next24Hours.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center min-w-[3.5rem] gap-2">
                            <span className="text-xs text-gray-500">
                                {new Date(item.time).toLocaleTimeString([], { hour: 'numeric' })}
                            </span>
                            {item.iconCode > 50 ? <CloudRain size={20} className="text-blue-400" /> : <Sun size={20} className="text-yellow-100/50" />}
                            <span className="text-sm font-medium">{Math.round(item.temp)}°</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeatherHero;
