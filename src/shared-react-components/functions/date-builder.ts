interface IDateBuilderParams {
    year?: 'current' | number
    month?: 'current' | number
    date?: 'current' | number
    hours?: 'current' | number
    minutes?: 'current' | number
    ms?: 'current' | number
}

const checkCondition = (value: 'current' | number | undefined): boolean => (value === 'current' || value === undefined)

/**
 * Обёртка конструктора Date, для более удобного создания даты
 * */
export const dateBuilder = (params: IDateBuilderParams): (() => Date) => {
    const currentDate = new Date()
    return () => (
        new Date(
            checkCondition(params.year) ? currentDate.getFullYear() : params.year as number,
            checkCondition(params.month) ? currentDate.getMonth() : params.month as number,
            checkCondition(params.date) ? currentDate.getDate() : params.date as number,
            checkCondition(params.hours) ? currentDate.getHours() : params.hours as number,
            checkCondition(params.minutes) ? currentDate.getMinutes() : params.minutes as number,
            checkCondition(params.ms) ? currentDate.getMilliseconds() : params.ms as number
        )
    )
}