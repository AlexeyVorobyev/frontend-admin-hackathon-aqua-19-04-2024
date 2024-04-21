import React, {FC, useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react'
import {
    CategoryScale,
    Chart as ChartJS,
    ChartData,
    ChartOptions,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js'
import {Line} from 'react-chartjs-2'
import LegendFromSummary from '../../legendComponents/LegendFromSummary/LegendFromSummary'
import annotationPlugin from 'chartjs-plugin-annotation'
import useWindowSize from '../../../functions/useWindowSize.tsx'
// @ts-ignore
import {ChartJSOrUndefined} from 'react-chartjs-2/dist/types'
import {Tooltip as TooltipMui, Typography, useTheme} from '@mui/material'


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Filler,
    Tooltip,
    Legend,
    annotationPlugin,
)

interface IProps {
    showLegend: boolean,
    height: number,
    heightTable: number
    data: ChartData<'line'>,
    options: ChartOptions<'line'>
    showTitle: boolean
    title?: string
}

const ReactChartLine: FC<IProps> = ({
                                        showLegend,
                                        height,
                                        heightTable,
                                        data,
                                        options,
                                        title,
                                        showTitle,
                                    }) => {
    const chartRef = useRef<ChartJSOrUndefined<'line'>>(null)
    const [readyToMount, setReadyToMount] = useState<boolean>(Boolean(chartRef.current))
    const windowsResize = useWindowSize()

    const titleRef = useRef<HTMLElement>(null)

    const computeHeight = useCallback(() => {
        if (showTitle && showLegend) {
            return height - heightTable - (titleRef.current?.offsetHeight || 24)
        } else if (showTitle) {
            return height - (titleRef.current?.offsetHeight || 24)
        } else if (showLegend) {
            return height - heightTable
        } else {
            return height
        }
    }, [showLegend, height, heightTable, windowsResize, titleRef, showTitle])

    const [computedHeight, setComputedHeight] = useState<number>(computeHeight())

    useLayoutEffect(() => {
        setComputedHeight(computeHeight())
    }, [showLegend, height, heightTable, windowsResize, titleRef, showTitle])

    useEffect(() => {
        console.debug(computedHeight)
        if (chartRef.current) {
            chartRef.current.resize(
                undefined,
                computedHeight,
            )
        }
    }, [computedHeight])

    useEffect(() => {
        setReadyToMount(Boolean(chartRef.current))
    }, [])

    const theme = useTheme()

    return (<>
        {(showTitle && title) && (
            <TooltipMui title={title}>
                <Typography ref={titleRef} fontWeight={600} maxWidth={'calc(100% - 100px)'}
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                            color={theme.palette.secondary.main}>
                    {title}
                </Typography>
            </TooltipMui>
        )}
        <div style={{
            height: computedHeight,
            width: '100%',
        }}>
            <Line width={'100%'}
                  options={options}
                  data={data}
                  ref={chartRef}
            />
        </div>
        {(showLegend && height && readyToMount && chartRef.current) && (
            <LegendFromSummary chart={chartRef.current}
                               heightTable={heightTable}/>
        )}
    </>)
}

export default ReactChartLine
