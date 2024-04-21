import { IAlexFilter } from '../../shared-react-components/AlexFilters/AlexFilter.tsx'

import {
    AlexDatePeriodPickerControlled,
} from '../../shared-react-components/form-utils/alex-date-picker/alex-date-period-picker-controlled.component.tsx'
import {
    EDatePickerType,
} from '../../shared-react-components/form-utils/alex-date-picker/alex-date-picker.component.tsx'

export const alexFiltersMap: Map<string, IAlexFilter> = new Map([
    ['periodCreate', {
        label: 'Период создания',
        component: (
            <AlexDatePeriodPickerControlled name={'periodCreate'}
                                            configFirstInput={{
                                                label: 'Начальная дата',
                                                type: EDatePickerType.dateTime,
                                                slotProps: {
                                                    field: {
                                                        clearable: true,
                                                    },
                                                },
                                            }}
                                            configSecondInput={{
                                                label: 'Конечная дата',
                                                type: EDatePickerType.dateTime,
                                                slotProps: {
                                                    field: {
                                                        clearable: true,
                                                    },
                                                },
                                            }}/>
        ),
    }],
    ['periodUpdate', {
        label: 'Период последнего изменения',
        component: (
            <AlexDatePeriodPickerControlled name={'periodUpdate'}
                                            configFirstInput={{
                                                label: 'Начальная дата',
                                                type: EDatePickerType.dateTime,
                                                slotProps: {
                                                    field: {
                                                        clearable: true,
                                                    },
                                                },
                                            }}
                                            configSecondInput={{
                                                label: 'Конечная дата',
                                                type: EDatePickerType.dateTime,
                                                slotProps: {
                                                    field: {
                                                        clearable: true,
                                                    },
                                                },
                                            }}/>
        ),
    }],
])