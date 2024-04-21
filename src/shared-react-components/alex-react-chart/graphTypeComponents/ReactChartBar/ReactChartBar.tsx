import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    ChartData,
    ChartOptions,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import LegendFromSummary from '../../legendComponents/LegendFromSummary/LegendFromSummary'
import annotationPlugin from 'chartjs-plugin-annotation'
import {Typography, useTheme} from '@mui/material'
// @ts-ignore
import {ChartJSOrUndefined} from 'react-chartjs-2/dist/types'
import useWindowSize from '../../../functions/useWindowSize.tsx'
import {Tooltip as TooltipMui} from '@mui/material'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    annotationPlugin
)

interface IProps {
    showLegend: boolean,
    height: number,
    heightTable: number
    data: ChartData<'bar'>,
    options: ChartOptions<'bar'>
    showTitle: boolean
    title?: string
}

const ReactChartBar: React.FC<IProps> = ({
    showLegend,
    height,
    heightTable,
    data,
    options,
    title,
    showTitle
}) => {
    const chartRef = useRef<ChartJSOrUndefined<'bar'>>(null)
    const [readyToMount, setReadyToMount] = useState<boolean>(Boolean(chartRef.current))
    const windowsResize = useWindowSize()

    const theme = useTheme()

    const titleRef = useRef<HTMLElement>(null)

    const computeHeight = useCallback(() => {
        if (showTitle && showLegend) {
            return height - heightTable - (titleRef.current?.offsetHeight || 24)
        }
        else if (showTitle) {
            return height - (titleRef.current?.offsetHeight || 24)
        }
        else if (showLegend) {
            return height - heightTable
        }
        else {
            return height
        }
    },[showLegend, height, heightTable, windowsResize, titleRef, showTitle])

    const [computedHeight, setComputedHeight] = useState<number>(computeHeight())

    useLayoutEffect(() => {
        setComputedHeight(computeHeight())
    },[showLegend, height, heightTable, windowsResize, titleRef, showTitle])

    useEffect(() => {
        console.debug(computedHeight)
        if (chartRef.current) {
            chartRef.current.resize(
                undefined,
                computedHeight
            )
        }
    }, [computedHeight])

    useEffect(() => {
        setReadyToMount(Boolean(chartRef.current))
    }, [])

    return (<>
        {(showTitle && title) && (
            <TooltipMui title={title}>
                <Typography ref={titleRef} fontWeight={600} maxWidth={'calc(100% - 100px)'}
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                            color={theme.palette.secondary.main}>
                    {title}
                </Typography>
            </TooltipMui>
        )}
        <div style={{
            height: computedHeight,
            width: '100%'
        }}>
            <Bar
                width={'100%'}
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

export default ReactChartBar
