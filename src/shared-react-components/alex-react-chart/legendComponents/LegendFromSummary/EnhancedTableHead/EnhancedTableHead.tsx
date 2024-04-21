import React, { FC } from 'react'
import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material'
import { EOrder } from '../utilis/getComparator'

export type TData = {
    min: number
    max: number
    avg: number
    last: number
    sum: number
}
type THeadCell = {
    disablePadding: boolean
    id: keyof TData
    label: string
    numeric: boolean
}
const headCells: readonly THeadCell[] = [
    {
        id: 'min',
        numeric: true,
        disablePadding: false,
        label: 'Мин',
    },
    {
        id: 'max',
        numeric: true,
        disablePadding: false,
        label: 'Макс',
    },
    {
        id: 'avg',
        numeric: true,
        disablePadding: false,
        label: 'Сред',
    },
    {
        id: 'last',
        numeric: true,
        disablePadding: false,
        label: 'Посл',
    },
    {
        id: 'sum',
        numeric: true,
        disablePadding: false,
        label: 'Сум',
    },
]

interface IEnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof TData) => void
    order: EOrder
    orderBy: string
}

export const EnhancedTableHead: FC<IEnhancedTableProps> = ({
    order,
    orderBy,
    onRequestSort
}) => {
    const createSortHandler =
        (property: keyof TData) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property)
        }

    return (
        <TableHead>
            <TableRow>
                <TableCell></TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        style={{ fontSize: 10, color: '#aba6a6' }}
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : EOrder.asc}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}