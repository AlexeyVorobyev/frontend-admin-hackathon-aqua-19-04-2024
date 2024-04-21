import React, {useCallback, useMemo} from 'react'
import ReactChartPie from '../graphTypeComponents/ReactChartPie/ReactChartPie'
import ReactChartLine from '../graphTypeComponents/ReactChartLine/ReactChartLine'
import ReactChartBar from '../graphTypeComponents/ReactChartBar/ReactChartBar'
import {ChartData, ChartOptions} from 'chart.js'
import {processOptions, TThreshold} from '../processFunctions/processOptions'
import {processData, TDataset} from '../processFunctions/processData'
import {ETimeAggregation} from '../enums/ETimeAggregation'
import {EGraphType} from '../enums/EGraphType'
import {Stack, Typography} from '@mui/material'
import {EFormatType} from '../enums/format-type.enum.ts'

export type TReactChartPartialInterface = {
    id?: string
    title?: string
    valueFormat?: EFormatType
    graphType?: EGraphType
    datasets: TDataset[]
    thresholds?: TThreshold[]
}

export interface IReactChartProps {
    title?: string
    showTitle?: boolean
    showThresholds?: boolean
    showLegend?: boolean
    height: number
    id?: string
    valueFormat: EFormatType
    graphType: EGraphType
    datasets: TDataset[]
    aggregation?: ETimeAggregation
    autoResponsive?: boolean
    disableAnimation?: boolean
    thresholds?: TThreshold[]
}

const ReactChartEngine: React.FC<IReactChartProps> = ({
                                                          id,
                                                          title,
                                                          graphType,
                                                          datasets,
                                                          valueFormat,
                                                          showTitle = true,
                                                          showLegend = true,
                                                          showThresholds = true,
                                                          autoResponsive = true,
                                                          height,
                                                          aggregation = ETimeAggregation.NO_AGG,
                                                          disableAnimation = false,
                                                          thresholds,
                                                      }) => {
    const processOptionsCallback = useCallback((): ChartOptions<any> => (
        processOptions({
            graphType: graphType,
            showThresholds: showThresholds,
            formatValue: valueFormat,
            aggregation: aggregation,
            autoResponsive: autoResponsive,
            disableAnimation: disableAnimation,
            thresholds: thresholds,
        })
    ), [graphType, valueFormat, showTitle, aggregation, showThresholds])

    const processDataCallback = useCallback((): ChartData<any> => (
        processData({
            graphType: graphType,
            datasets: datasets,
        })
    ), [graphType, datasets])

    const padding = graphType === EGraphType.RESULTS ? 0 : 10
    const curHeight = height - padding * 2
    const heightTable = useMemo(() => {
        if (datasets.length < 2) {
            return datasets.length * 30 + 40
        } else {
            return (2 * 30 + 35)
        }
    }, [datasets])

    return curHeight ? (
        <div key={id} style={{height: '100%', width: '100%', padding: padding, boxSizing: 'border-box'}}>
            {[EGraphType.LINE, EGraphType.AREA].includes(graphType) && (
                <ReactChartLine title={title} showTitle={showTitle} showLegend={showLegend} height={curHeight}
                                heightTable={heightTable} options={processOptionsCallback()}
                                data={processDataCallback()}/>
            )}
            {[EGraphType.BAR, EGraphType.STACK, EGraphType.TOTAL].includes(graphType) && (
                <ReactChartBar title={title} showTitle={showTitle} showLegend={showLegend} height={curHeight}
                               heightTable={heightTable} options={processOptionsCallback()}
                               data={processDataCallback()}/>
            )}
            {(graphType === EGraphType.PIE) && (
                <ReactChartPie showLegend={showLegend} data={processDataCallback()}
                               options={processOptionsCallback()} height={curHeight}
                               showTitle={showTitle} formatValue={valueFormat}
                               title={title}/>
            )}
            {(graphType === EGraphType.NONE) && (
                <Stack height={curHeight} alignItems={'center'} justifyContent={'center'}>
                    <Typography variant={'h5'}>График не отображается</Typography>
                </Stack>
            )}
        </div>
    ) : null
}

export default ReactChartEngine
