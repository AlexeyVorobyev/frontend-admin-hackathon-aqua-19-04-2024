import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ArcElement, Chart as ChartJS, ChartData, ChartOptions, Legend, Tooltip } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import LegendFromGraph from '../../legendComponents/LegendFromGraph/LegendFromGraph'
import {Grid, Typography, useTheme} from '@mui/material'
import {EFormatType} from '../../enums/format-type.enum.ts'

ChartJS.register(ArcElement, Tooltip, Legend)

interface IProps {
    height: number
    showLegend: boolean
    showTitle: boolean
    formatValue: EFormatType
    title?: string
    data: ChartData<'pie'>
    options: ChartOptions<'pie'>
}

const ReactChartPie: React.FC<IProps> = ({
    data,
    height,
    options,
    showLegend,
    showTitle,
    formatValue,
    title
}) => {
    const chartRef = useRef(null)
    const [readyToMount, setReadyToMount] = useState<boolean>(false)
    const titleRef = useRef<HTMLElement>(null)
    const [computedHeight, setComputedHeight] = useState<number>(
        showTitle
            ? height - (titleRef.current ? titleRef.current.offsetHeight : 50)
            : height
    )

    useLayoutEffect(() => {
        setComputedHeight(
            showTitle
                ? height - (titleRef.current ? titleRef.current.offsetHeight : 50)
                : height
        )
    }, [showTitle, height])

    useEffect(() => {
        setReadyToMount(Boolean(chartRef.current))
    }, [])

    const theme = useTheme()

    return (<>
        {(showTitle && title) && (
            <Typography ref={titleRef} fontWeight={600}
                        color={theme.palette.secondary.main} paddingBottom={'15px'}>
                {title}
            </Typography>
        )}
        <Grid container style={{
            height: computedHeight,
            display: 'flex',
            alignItems: 'center',
        }}>
            {height ? (
                <Grid item height={computedHeight} xs={4}
                      justifyContent={'center'}
                      alignItems={'center'} padding={'10px'}
                      display={'flex'}>
                    <Pie data={data} options={options} ref={chartRef}/>
                </Grid>
            ) : <div>Загрузка ...</div>}
            {(showLegend && computedHeight && chartRef.current && readyToMount) && (
                <Grid item xs={8}>
                    <LegendFromGraph chart={chartRef.current} readyToMount={readyToMount} height={computedHeight}
                                     setReadyToMount={setReadyToMount} formatValue={formatValue}/>
                </Grid>
            )}
        </Grid>
    </>)
}

export default ReactChartPie
