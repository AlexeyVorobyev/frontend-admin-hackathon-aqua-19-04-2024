import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React, { FC, useEffect, useState } from 'react'
import {formatMetricValueStory} from './format-metric-value-story.function.ts'
import {EFormatType} from '../../enums/format-type.enum.ts'


const useStyles = makeStyles((theme: any) => ({
    item: {
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        // whiteSpace: 'nowrap',
        // overflow: 'hidden',
        textOverflow: 'ellipsis',
        '&:hover': {
            backgroundColor: 'rgba(239,239,239,0.63)'
        }
    }
}))

interface ILegendFromGraphProps {
    chart: any
    readyToMount: boolean
    setReadyToMount: (value: boolean) => void
    formatValue: EFormatType
    height: number
}

const LegendFromGraph: FC<ILegendFromGraphProps> = ({
    chart,
    readyToMount,
    setReadyToMount,
    formatValue,
    height
}) => {
    const classes = useStyles()
    const toElemHid = chart?.legend?.legendItems?.map((item: any) => item.hidden)
    const [elemHidden, setElemHidden] = useState(toElemHid)

    useEffect(() => {
        setReadyToMount(true)
    }, [chart?.legend?.legendItems])

    return (chart?.legend?.legendItems && readyToMount) && (
        <Box style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'safe center',
            paddingLeft: 50,
            marginTop: '30px',
            overflow:'scroll',
            maxHeight: height - 30
        }}>
            {chart?.legend?.legendItems.map((elem: any, index: number) => {
                const value = formatValue === EFormatType.TIME ? formatMetricValueStory(chart.data.datasets[0].data[index]) :
                    chart.data.datasets[0].data[index]

                const handleClick = () => {
                    chart.toggleDataVisibility(elem.index, !chart.isDatasetVisible(elem.index))
                    setElemHidden([])
                    chart.update()
                }

                return (
                    <Box className={classes.item} key={elem.name} onClick={handleClick}>
                        <span style={{
                            background: elem.fillStyle,
                            border: 'solid',
                            borderRadius: '50%',
                            borderColor: elem.strokeStyle,
                            borderWidth: 3,
                            display: 'inline-block',
                            height: '15px',
                            marginRight: '10px',
                            width: '15px',
                            flexShrink: 0
                        }}/>
                        <Typography style={{
                            margin: '0',
                            color: '#000',
                            padding: '0',
                            fontSize: 12,
                            textDecoration: elem.hidden ? 'line-through' : ''
                        }}>
                            {elem.text.split(',')[0]}: {value}
                        </Typography>
                    </Box>
                )
            })}
        </Box>
    )
}

export default LegendFromGraph
