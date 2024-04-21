import { format, getHours, getMonth, getWeek, getYear, nextDay, startOfMonth } from 'date-fns'
import { ETimeAggregation } from '../enums/ETimeAggregation'
import {EMonthOfYear} from '../enums/month-of-year.enum.ts'

export const processLabel = (value: Date, aggregation: ETimeAggregation) => {
    switch (aggregation) {
        case ETimeAggregation.MINUTE:
            return format(value, 'HH:mm', {})
        case ETimeAggregation.HOUR:
            return getHours(value) === 0
                ? format(value, 'dd.MM', {})
                : format(value, 'HH', {}) + 'ч'
        case ETimeAggregation.DAY:
            return format(value, 'dd.MM', {})
        case ETimeAggregation.WEEK:
            return `${getWeek(nextDay(value, 1))} нед`
        case ETimeAggregation.MONTH:
            const startMonth = startOfMonth(value)
            return Object.keys(EMonthOfYear)[Object.values(EMonthOfYear).indexOf(getMonth(startMonth))]
        case ETimeAggregation.YEAR:
            return getYear(value).toString()
        case ETimeAggregation.NO_AGG:
        default:
            return format(value, 'HH:mm', {})
    }
}