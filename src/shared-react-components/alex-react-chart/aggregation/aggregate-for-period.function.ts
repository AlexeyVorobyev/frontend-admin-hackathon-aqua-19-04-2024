import {differenceInMinutes} from "date-fns"
import { ETimeAggregationOptionsAggregation } from './Aggregation'

export const aggregateForPeriod = (startTime: Date, endTime: Date) => {
    const result = []
    const difference = differenceInMinutes(new Date(endTime), new Date(startTime))
    if (difference < 7200) result.push(ETimeAggregationOptionsAggregation.NO_AGG)
    if (difference < 1440) result.push(ETimeAggregationOptionsAggregation.MINUTE)
    if (difference < 64800) result.push(ETimeAggregationOptionsAggregation.HOUR)
    if (difference > 2880 && difference < 2102400) result.push(ETimeAggregationOptionsAggregation.DAY)
    if (difference > 10080 && difference < 525600) result.push(ETimeAggregationOptionsAggregation.WEEK)
    if (difference > 87600) result.push(ETimeAggregationOptionsAggregation.MONTH)
    if (difference > 1051200) result.push(ETimeAggregationOptionsAggregation.YEAR)
    return result
}
