import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { EOrder, getComparator } from './utilis/getComparator'
import { EnhancedTableHead, TData } from './EnhancedTableHead/EnhancedTableHead'
import { stableSort } from './utilis/stableSort'
// @ts-ignore
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types'

interface ILegendFromSummaryProps {
    chart: ChartJSOrUndefined<any>
    heightTable: number
}

/**
 *  Компонент, предоставляющий функционал легенды для графика chartJS2.
 *  Работает по принципу передачи ссылки на график.
 *
 *  @param chart {ChartJSOrUndefined<any>} Ссылка (ref) на chartJS2 график
 *  @param heightTable {number} Высота отображаемой легенды в пикселях
 * */
const LegendFromSummary: React.FC<ILegendFromSummaryProps> = ({
    chart,
    heightTable
}) => {
    const toElemHid = chart?.legend?.legendItems?.map((item: any) => item.hidden)
    const [order, setOrder] = useState<EOrder>(EOrder.asc)
    const [orderBy, setOrderBy] = useState<keyof TData>('sum')

    const [rows, setRows] = useState([])
    const [elemHidden, setElemHidden] = useState(toElemHid)

    const visibleRows = useMemo(() => (
        stableSort(rows, getComparator(order, orderBy))
    ), [order, orderBy, rows])

    useEffect(() => {
        let newRows: any = []
        chart?.legend?.legendItems?.map((elem: any) => {
            newRows.push({
                name: elem.namem,
                datasetIndex: elem.datasetIndex,
                fillStyle: elem.fillStyle,
                strokeStyle: elem.strokeStyle,
                hidden: elem.hidden,
                text: elem.text?.split(',')[0],
                min: Number(elem.text?.split(',')[1]),
                max: Number(elem.text?.split(',')[2]),
                avg: Number(elem.text?.split(',')[3]),
                last: Number(elem.text?.split(',')[4]),
                sum: Number(elem.text?.split(',')[5]),
            })
        })
        setRows(newRows)
    }, [chart, elemHidden])

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof TData,
    ) => {
        const isAsc = orderBy === property && order === EOrder.asc
        setOrder(isAsc ? EOrder.desc : EOrder.asc)
        setOrderBy(property)
    }

    return (
        <TableContainer style={{ height: heightTable }}
                        sx={{
                            '&::-webkit-scrollbar': {
                                width: 5,
                                height: 5
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: null
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#b2b2b2',
                                borderRadius: 2
                            }
                        }}>
            <Table aria-label="a dense table" size="small" style={{
                height: 'max-content',
                tableLayout: 'auto',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}>
                <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                />
                <TableBody>
                    {visibleRows.map((elem: any) => {

                        const handleClick = () => {
                            chart?.setDatasetVisibility(elem.datasetIndex, !chart.isDatasetVisible(elem.datasetIndex))
                            setElemHidden([])
                            chart?.update()
                        }

                        return (
                            <TableRow key={elem.name}>
                                <TableCell onClick={handleClick}>
                                    <div style={{
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                        <span style={{
                            background: elem.fillStyle,
                            border: 'solid',
                            borderColor: elem.strokeStyle,
                            borderWidth: 3,
                            display: 'inline-block',
                            height: '15px',
                            marginRight: '10px',
                            width: '30px'
                        }}/>
                                        <p style={{
                                            margin: '0',
                                            padding: '0',
                                            textDecoration: elem.hidden ? 'line-through' : ''
                                        }}>
                                            {elem.text}
                                        </p></div>
                                </TableCell>
                                <TableCell align="right">{elem.min ? elem.min.toFixed(2) : '—'}</TableCell>
                                <TableCell align="right">{elem.max ? elem.max.toFixed(2) : '—'}</TableCell>
                                <TableCell align="right">{elem.avg ? elem.avg.toFixed(2) : '—'}</TableCell>
                                <TableCell align="right">{elem.last ? elem.last.toFixed(2) : '—'}</TableCell>
                                <TableCell align="right">{elem.sum ? elem.sum.toFixed(2) : '—'}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default LegendFromSummary
