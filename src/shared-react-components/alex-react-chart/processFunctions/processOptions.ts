
import { format } from 'date-fns'
import { ChartOptions } from 'chart.js'
import { processLabel } from './processLabel'
import { ETimeAggregation } from '../enums/ETimeAggregation'
import { EGraphType } from '../enums/EGraphType'
import {EFormatType} from '../enums/format-type.enum.ts'
import {formatMetricValueStory} from '../legendComponents/LegendFromGraph/format-metric-value-story.function.ts'
import {numFormatter} from '../utils/num-formatter.function.ts'

export type TThreshold = {
    value: number
    color: string
}

interface IOptions {
    graphType: EGraphType
    formatValue: EFormatType
    aggregation: ETimeAggregation
    autoResponsive: boolean
    disableAnimation: boolean
    thresholds?: TThreshold[]
    showThresholds: boolean
}

export const processOptions = (options: IOptions): ChartOptions<any> => ({
    animation: {
        duration: options.disableAnimation ? 0 : undefined
    },
    responsive: options.autoResponsive
        ? true
        : options.graphType === EGraphType.PIE,
    tension: (options.graphType === EGraphType.AREA || options.graphType === EGraphType.STACK) && 0.5,
    maintainAspectRatio: options.graphType === EGraphType.PIE,
    elements: {
        point: (options.graphType === EGraphType.AREA || options.graphType === EGraphType.STACK) && {
            radius: 0
        }
    },
    plugins: {
        ...((options.thresholds && options.showThresholds) && {
            annotation: {
                annotations: options.thresholds.map((item, index) => ({
                    type: 'line',
                    drawTime: 'afterDatasetsDraw',
                    mode: 'horizontal',
                    scaleID: 'y-axis-0',
                    borderWidth: 3,
                    id: index,
                    yMin: item.value,
                    yMax: item.value,
                    borderColor: item.color
                }))
            }
        }),
        legend: {
            display: false,
            position: 'bottom' as const,
            align: 'start' as const,
        },
        tooltip: {
            intersect: false,
            callbacks: {
                title: function (data: any) {
                    /*TODO Пофиксить тултип на PIE типе графика. Сейчас отображается только внутри границ*/
                    return options.graphType === EGraphType.PIE
                        ? data[0].label
                        : format(new Date(data[0].label), 'dd.MM.yyyy HH:mm', {})
                },
                label: function (data: any) {
                    const curValueFormat = options.graphType === EGraphType.TOTAL && options.formatValue === EFormatType.TIME
                        ? data?.raw.map((elem: any) => formatMetricValueStory(elem))
                        : options.formatValue === EFormatType.TIME ? formatMetricValueStory(data?.formattedValue.replace(/[\s.,%]/g, '')) : data?.formattedValue
                    return options.graphType !== EGraphType.PIE
                        ? `${data?.dataset?.label.split(',')[0]}: ${curValueFormat}`
                        : curValueFormat
                }
            }
        }
    },
    scales: options.graphType !== EGraphType.PIE && {
        y: {
            stacked: options.graphType === EGraphType.STACK,
            ticks: {
                font: {
                    size: 10,
                },
                callback: function (value: any) {
                    return options.formatValue === EFormatType.TIME ? formatMetricValueStory(value) : numFormatter(value)
                }
            }
        },
        x: {
            grid: {
                display: !(options.graphType === EGraphType.BAR)
            },
            stacked: options.graphType === EGraphType.STACK,
            ticks: {
                maxTicksLimit: 10,
                font: {
                    size: 10,
                },
                // @ts-ignore
                callback: function (value: any) {
                    // @ts-ignore
                    return processLabel(this.getLabelForValue(value), options.aggregation)
                }
            }
        }
    },
})