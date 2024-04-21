import React, { CSSProperties, FC, useState } from 'react'
import {Box, CircularProgress, Paper} from '@mui/material'
import ButtonsCustom from './buttons-custom/buttons-custom.tsx'
import ReactChartEngine from './ReactChartEngine/ReactChartEngine'
import { TDataset } from './processFunctions/processData'
import { ETimeAggregation } from './enums/ETimeAggregation'
import { EGraphType } from './enums/EGraphType'
import ReactChartNotData from './ReactChartNotData/ReactChartNotData'
import { TThreshold } from './processFunctions/processOptions'
import {EFormatType} from './enums/format-type.enum.ts'
import DialogReactChart, {TDateRange, TGetNewDataCallback} from './dialog-react-chart/dialog-react-chart.tsx'
import {EUsePageStateMode, useAlexPageState} from '../functions/useAlexPageState/useAlexPageState.tsx'


export enum EStoredOptionsReactChart {
    showTitle = 'showTitle',
    showLegend = 'showLegend',
    showThresholds = 'showThresholds'
}


type TDefaultStoredParams = {
    [EStoredOptionsReactChart.showTitle]?: boolean
    [EStoredOptionsReactChart.showLegend]?: boolean
    [EStoredOptionsReactChart.showThresholds]?: boolean
}


type TStyles = {
    paper: CSSProperties
}


type TData = {
    title?: string
    valueFormat: EFormatType
    graphType: EGraphType
    datasets: TDataset[]
    aggregation?: ETimeAggregation
    dateRange: TDateRange,
    thresholds?: TThreshold[]
}


interface IReactChartProps {
    id?: string
    height: number
    styles?: TStyles
    data?: TData
    getNewDataCallback?: TGetNewDataCallback
    defaultStoredParams?: TDefaultStoredParams
    linkCard?: string
    loading?: boolean
    useDialogReactChart?: boolean
    useButtonForTitle?: boolean
    useButtonForLegend?: boolean
    useButtonForThresholds?: boolean
    useButtonForGraphType?: boolean
    disableAnimationForMini?: boolean
    disableAnimationForMidiMaxi?: boolean
}


export const ReactChart: FC<IReactChartProps> = ({
    id,
    height,
    styles,
    data,
    getNewDataCallback,
    linkCard,
    loading = false,
    useDialogReactChart = false,
    useButtonForLegend = false,
    useButtonForThresholds = false,
    useButtonForTitle = false,
    useButtonForGraphType = false,
    defaultStoredParams,
    disableAnimationForMini = false,
    disableAnimationForMidiMaxi = false
}) => {
    const {
        storedOptions,
        setStoredOptions
    } = useAlexPageState({
        modeRead: id ? [EUsePageStateMode.localStorage] : undefined,
        modeWrite: id ? [EUsePageStateMode.localStorage] : undefined,
        storageKey: `advancedReactChart_${id}`,
        defaultValue: new Map<EStoredOptionsReactChart, any>([
            [EStoredOptionsReactChart.showTitle,
                defaultStoredParams?.[EStoredOptionsReactChart.showTitle] !== undefined
                    ? defaultStoredParams[EStoredOptionsReactChart.showTitle]
                    : true
            ],
            [EStoredOptionsReactChart.showLegend,
                defaultStoredParams?.[EStoredOptionsReactChart.showLegend] !== undefined
                    ? defaultStoredParams[EStoredOptionsReactChart.showLegend]
                    : true
            ],
            [EStoredOptionsReactChart.showThresholds,
                defaultStoredParams?.[EStoredOptionsReactChart.showThresholds] !== undefined
                    ? defaultStoredParams[EStoredOptionsReactChart.showThresholds]
                    : true
            ]
        ])
    })

    const [openDialogReactChart, setOpenDialogReactChart] = useState<boolean>(false)
    const [localGraphType, setLocalGraphType] = useState<EGraphType | null>(null)

    const handleClickButtonForTitle = (value: boolean) => {
        setStoredOptions((prevState) => {
            prevState.set(EStoredOptionsReactChart.showTitle, value)
            return new Map(prevState)
        })
    }
    const handleClickButtonForLegend = (value: boolean) => {
        setStoredOptions((prevState) => {
            prevState.set(EStoredOptionsReactChart.showLegend, value)
            return new Map(prevState)
        })
    }
    const handleClickButtonForThresholds = (value: boolean) => {
        setStoredOptions((prevState) => {
            prevState.set(EStoredOptionsReactChart.showThresholds, value)
            return new Map(prevState)
        })
    }
    const handleClickOpenDialogReactChart = () => {
        setOpenDialogReactChart(true)
    }

    const handleClickSetGraphType = (graphType: EGraphType) => {
        setLocalGraphType(graphType)
    }

    return (<>
        {(height && !loading) ? (
            <Paper elevation={0} sx={styles?.paper}>
                {(data?.datasets?.length) ? (<>
                    {(
                        useButtonForTitle
                        || useButtonForLegend
                        || useDialogReactChart
                        || useButtonForGraphType
                    ) && (
                        <ButtonsCustom linkCard={linkCard} graphType={data.graphType}
                                       buttonForTitle={useButtonForTitle
                                              ? storedOptions.get(EStoredOptionsReactChart.showTitle)
                                              : undefined}
                                       setButtonForTitle={useButtonForTitle
                                              ? handleClickButtonForTitle
                                              : undefined}
                                       buttonForLegend={(useButtonForLegend && data.graphType !== EGraphType.RESULTS)
                                              ? storedOptions.get(EStoredOptionsReactChart.showLegend)
                                              : undefined}
                                       setButtonForLegend={(useButtonForLegend && data.graphType !== EGraphType.RESULTS)
                                              ? handleClickButtonForLegend
                                              : undefined}
                                       buttonForThresholds={(useButtonForThresholds && data.graphType !== EGraphType.RESULTS && data.thresholds?.length)
                                              ? storedOptions.get(EStoredOptionsReactChart.showThresholds)
                                              : undefined}
                                       setButtonForThresholds={(useButtonForThresholds && data.graphType !== EGraphType.RESULTS && data.thresholds?.length)
                                              ? handleClickButtonForThresholds
                                              : undefined}
                                       handleClickOpenDialogReactChart={useDialogReactChart ? handleClickOpenDialogReactChart : undefined}
                                       useButtonForGraphType={useButtonForGraphType}
                                       handleClickSetGraphType={useButtonForGraphType ? handleClickSetGraphType : undefined}/>
                    )}
                    <ReactChartEngine height={height} id={id}
                                      datasets={data.datasets} disableAnimation={disableAnimationForMini}
                                      thresholds={data.thresholds}
                                      valueFormat={data.valueFormat} aggregation={data.aggregation}
                                      title={data.title} graphType={localGraphType || data.graphType}
                                      showThresholds={storedOptions.get(EStoredOptionsReactChart.showThresholds)}
                                      showTitle={storedOptions.get(EStoredOptionsReactChart.showTitle)}
                                      showLegend={storedOptions.get(EStoredOptionsReactChart.showLegend)}/>
                    {(useDialogReactChart && getNewDataCallback) && (
                        <DialogReactChart open={openDialogReactChart} setOpen={setOpenDialogReactChart}
                                          datasets={data.datasets} valueFormat={data.valueFormat}
                                          aggregation={data.aggregation} dateRange={data.dateRange}
                                          thresholds={data.thresholds}
                                          graphType={data.graphType} linkCard={linkCard}
                                          disableAnimation={disableAnimationForMidiMaxi}
                                          useButtonForThresholds={useButtonForThresholds}
                                          useButtonForLegend={useButtonForLegend}
                                          useButtonForTitle={useButtonForTitle}
                                          useButtonForGraphType={useButtonForGraphType}
                                          getNewDataCallback={getNewDataCallback}
                                          title={data.title} id={id}/>
                    )}
                </>) : (<>
                    {linkCard && (
                        <ButtonsCustom linkCard={linkCard}/>
                    )}
                    <Box height={height} width={'100%'}>
                        <ReactChartNotData/>
                    </Box>
                </>)}
            </Paper>
        ) : (
            <Paper elevation={0} sx={{
                ...styles?.paper,
                height: height,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <CircularProgress/>
            </Paper>
        )}
    </>)
}