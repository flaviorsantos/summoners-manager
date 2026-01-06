export const formatMoney = (value: number): string => {
    if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
}

export const getRatingColorClass = (value: number): string => {
    if (value >= 90) return 'text-cyan-400 font-bold';
    if (value >= 80) return 'text-green-400 font-bold';
    if (value >= 60) return 'text-yellow-400 font-bold';
    if (value >= 50) return 'text-gray-200';
    return 'text-red-500';    
}

export const formatDate = (dayCount: number): string => {
    const date = new Date(2025, 0, 1);

    date.setDate(date.getDate() + (dayCount - 1));

    return date.toLocaleDateString('en-US', {day: '2-digit', month: 'short', year: 'numeric'});
}