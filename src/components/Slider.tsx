import React from 'react';

interface SliderProps {
    id: string;
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    icon?: React.ReactNode;
    description?: string;
    valueColor?: 'cyan' | 'purple' | 'emerald' | 'orange' | 'pink';
    formatValue?: (value: number) => string;
    disabled?: boolean;
}

const colorClasses = {
    cyan: {
        badge: 'text-cyan-300 bg-gradient-to-r from-cyan-500/20 to-cyan-400/10 border-cyan-400/30 shadow-cyan-500/20',
        track: 'from-cyan-500 to-cyan-400',
        thumb: 'border-cyan-400 shadow-cyan-500/50',
        glow: 'shadow-cyan-500/30'
    },
    purple: {
        badge: 'text-purple-300 bg-gradient-to-r from-purple-500/20 to-purple-400/10 border-purple-400/30 shadow-purple-500/20',
        track: 'from-purple-500 to-purple-400',
        thumb: 'border-purple-400 shadow-purple-500/50',
        glow: 'shadow-purple-500/30'
    },
    emerald: {
        badge: 'text-emerald-300 bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 border-emerald-400/30 shadow-emerald-500/20',
        track: 'from-emerald-500 to-emerald-400',
        thumb: 'border-emerald-400 shadow-emerald-500/50',
        glow: 'shadow-emerald-500/30'
    },
    orange: {
        badge: 'text-orange-300 bg-gradient-to-r from-orange-500/20 to-orange-400/10 border-orange-400/30 shadow-orange-500/20',
        track: 'from-orange-500 to-orange-400',
        thumb: 'border-orange-400 shadow-orange-500/50',
        glow: 'shadow-orange-500/30'
    },
    pink: {
        badge: 'text-pink-300 bg-gradient-to-r from-pink-500/20 to-pink-400/10 border-pink-400/30 shadow-pink-500/20',
        track: 'from-pink-500 to-pink-400',
        thumb: 'border-pink-400 shadow-pink-500/50',
        glow: 'shadow-pink-500/30'
    },
};

const Slider: React.FC<SliderProps> = ({
    id,
    label,
    value,
    min,
    max,
    step,
    onChange,
    icon,
    description,
    valueColor = 'cyan',
    formatValue,
    disabled = false,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = step % 1 === 0 ? parseInt(e.target.value, 10) : parseFloat(e.target.value);
        onChange(newValue);
    };

    const displayValue = formatValue ? formatValue(value) : value.toString();
    const colors = colorClasses[valueColor];
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label 
                    htmlFor={id} 
                    className="text-sm font-semibold text-slate-200 flex items-center gap-2 transition-colors duration-200"
                >
                    <span className={`transition-all duration-300 ${disabled ? 'opacity-50' : 'opacity-100'}`}>
                        {icon}
                    </span>
                    {label}
                </label>
                <span className={`text-sm font-bold px-3 py-1.5 rounded-full border backdrop-blur-sm shadow-lg transition-all duration-300 transform hover:scale-105 ${colors.badge} ${disabled ? 'opacity-50' : 'opacity-100'}`}>
                    {displayValue}
                </span>
            </div>
            
            {/* Custom Slider */}
            <div className="relative">
                {/* Track Background */}
                <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden shadow-inner">
                    {/* Progress Track */}
                    <div 
                        className={`h-full bg-gradient-to-r ${colors.track} transition-all duration-300 ease-out relative rounded-full`}
                        style={{ width: `${percentage}%` }}
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 animate-pulse"></div>
                    </div>
                </div>
                
                {/* Hidden Native Input */}
                <input
                    id={id}
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                
                {/* Custom Thumb */}
                <div 
                    className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 ${colors.thumb} shadow-lg transition-all duration-200 transform hover:scale-110 active:scale-95 ${disabled ? 'opacity-50' : `shadow-lg ${colors.glow}`}`}
                    style={{ left: `calc(${percentage}% - 10px)` }}
                >
                    {/* Inner glow */}
                    <div className="absolute inset-0.5 bg-white/50 rounded-full"></div>
                </div>
            </div>
            
            {/* Value Indicators */}
            <div className="flex justify-between text-xs text-slate-500 px-1">
                <span className="font-mono">{formatValue ? formatValue(min) : min}</span>
                <span className="font-mono">{formatValue ? formatValue(max) : max}</span>
            </div>
            
            {description && (
                <p className="text-xs text-slate-400 italic leading-relaxed bg-slate-800/30 rounded-lg px-3 py-2 border border-slate-700/30">
                    {description}
                </p>
            )}
        </div>
    );
};

export { Slider };
