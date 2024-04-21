export const formatMetricValueStory = (num: number | null): string | number => {
    if (num === null || num === 0) return 0;

    const days = ~~(num / 86400);
    const hrs = ~~(num / 3600);
    const mins = ~~((num % 3600) / 60);
    const secs = ~~num % 60;
    if (days > 0) {
        return `${days} д.`
    } else if (hrs > 0) {
        return `${hrs} ч.`
    } else if (mins > 0) {
        return `${mins} м.`
    } else if (secs > 0) {
        return `${secs} с.`
    } else return 0

}