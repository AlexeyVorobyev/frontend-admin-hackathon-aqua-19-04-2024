export const numFormatter = (num: number | null) => {
    const countSimbl = (num?.toString().includes('.')) ? (num?.toString()?.split('.')?.pop()?.length) : (0)
    if (num === 0) return '0';
    if (num === null || num === undefined) return '';
    if (num >= 1000000000000) return (num / 1000000000000).toFixed(1) + 'Т';
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'Г';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'к';
    if (Math.abs(num) <= 0.001) return num.toFixed(1) + 'м';
    if (countSimbl === 3) return num.toFixed(3)
    if (countSimbl === 2) return num.toFixed(2)
    if (countSimbl === 1) return num.toFixed(1)
    if (countSimbl && countSimbl >= 3) return num.toFixed(2)
    return num;
}