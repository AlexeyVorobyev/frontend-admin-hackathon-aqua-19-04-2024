import {ERangeType} from '../enums/range-type.enum.ts'
import {ETimeAggregation} from '../enums/ETimeAggregation.ts'

export type TTimeAgg = {
    periodStorage: ERangeType
    startDash: Date
    endDash: Date
    aggregation: ETimeAggregation
}