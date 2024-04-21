import {EGraphType} from '../enums/EGraphType.ts'

export enum EGraphTypeRU {
    AREA = 'С областями',
    BAR = 'Гистограмма',
    LINE = 'Линейный',
    STACK = 'Стек',
    TOTAL = 'Суммарный индикатор',
    RESULTS = 'Итоги',
    PIE = 'Круговая диаграмма',
    CLOCK = 'Часы',
    NONE = 'Не отображать',
}

export const graphTypeList = [
    { id: EGraphType.AREA, title: EGraphTypeRU[EGraphType.AREA] },
    { id: EGraphType.BAR, title: EGraphTypeRU[EGraphType.BAR] },
    { id: EGraphType.LINE, title: EGraphTypeRU[EGraphType.LINE] },
    { id: EGraphType.STACK, title: EGraphTypeRU[EGraphType.STACK] },
    { id: EGraphType.NONE, title: EGraphTypeRU[EGraphType.NONE] },
    { id: EGraphType.PIE, title: EGraphTypeRU[EGraphType.PIE] },
    { id: EGraphType.RESULTS, title: EGraphTypeRU[EGraphType.RESULTS] },
]