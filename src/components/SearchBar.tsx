import { useState, useRef, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { fetchGeocoding, type GeocodingData } from '../api/weather';

interface SearchBarProps {
    onLocationSelect: (lat: number, lon: number, name: string) => void;
}

const SearchBar = ({ onLocationSelect }: SearchBarProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<GeocodingData['results']>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 2) {
                try {
                    const data = await fetchGeocoding(query);
                    setResults(data.results || []);
                    setIsOpen(true);
                } catch (error) {
                    console.error('Search failed', error);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 500); // Debounce

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div ref={wrapperRef} className="relative w-full max-w-[480px] mx-auto mb-6 z-50">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all font-medium"
                    placeholder="Search city..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 2 && setIsOpen(true)}
                />
            </div>

            {isOpen && results && results.length > 0 && (
                <div className="absolute mt-2 w-full bg-[#08080A]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto z-50">
                    {results.map((city) => (
                        <button
                            key={city.id}
                            className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center gap-3 border-b border-white/5 last:border-none"
                            onClick={() => {
                                onLocationSelect(city.latitude, city.longitude, `${city.name}, ${city.country}`);
                                setQuery('');
                                setIsOpen(false);
                            }}
                        >
                            <MapPin size={16} className="text-secondary shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-white font-medium">{city.name}</span>
                                <span className="text-xs text-gray-400">
                                    {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
