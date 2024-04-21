import {EStoredOptionsMainPage} from './main-page.component.tsx'
import {TTimeAgg} from '../../../shared-react-components/alex-react-chart/types/time-agg.type.ts'
import {TStatUserRegistrationHistoryInput} from '../../../types/graphql/graphql.ts'


export const mainPageVarsBehaviourMap = (params: any): TStatUserRegistrationHistoryInput => {
    const timeAgg = params[EStoredOptionsMainPage.timeAgg] as TTimeAgg

    return {
        timeAggregation: timeAgg.aggregation,
        datePeriod: {
            startDate: (new Date(timeAgg.startDash)).toISOString(),
            endDate: (new Date(timeAgg.endDash)).toISOString()
        }
    }
}