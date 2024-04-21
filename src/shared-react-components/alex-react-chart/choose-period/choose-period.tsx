import React, {FC, useEffect, useState} from 'react'
import {Box, Button, Container, IconButton, Paper, Popover, Portal, Stack, useTheme} from '@mui/material'
import {
    addDays,
    addMonths,
    addWeeks,
    addYears,
    endOfDay,
    setSeconds,
    startOfDay,
    startOfYesterday,
    subDays,
} from 'date-fns'
import {TTimeAgg} from '../types/time-agg.type'
import {ERangeType} from '../enums/range-type.enum'
import {validateDate} from '../utils/validate-date.function'
import {EDatePickerType} from '../../form-utils/alex-date-picker/alex-date-picker.component'
import {
    AlexDatePeriodPicker,
    TAlexDatePeriodPickerValue,
} from '../../form-utils/alex-date-picker/alex-date-period-picker.component'
import {AlexSelect} from '../../form-utils/AlexSelect/AlexSelect.tsx'
import {SelectRadio} from '../select-radio/select-radio.tsx'

interface IProps {
    timeAgg: TTimeAgg,
    setTimeAgg: (value: TTimeAgg) => void
}

const ChoosePeriod: FC<IProps> = ({
                                      timeAgg,
                                      setTimeAgg,
                                  }) => {

    const periods = Object.values(ERangeType)
    const [curPeriod, setCurPeriod] = useState<ERangeType>(timeAgg.periodStorage)
    const checkPeriod = curPeriod === ERangeType.NO ? '' : curPeriod

    const [startDateTime, setStartDateTime] = useState<Date>(timeAgg.startDash)
    const [endDateTime, setEndDateTime] = useState<Date>(timeAgg.endDash)

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<any>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleDatePeriod = (startOfTheDay: any, endOfTheDay: any) => {
        setTimeAgg({
            ...timeAgg,
            periodStorage: curPeriod,
            startDash: startOfTheDay && validateDate(startOfTheDay) && startOfTheDay.toISOString(),
            endDash: endOfTheDay && validateDate(endOfTheDay) && endOfTheDay.toISOString(),
        })
        setStartDateTime(startOfTheDay)
        setEndDateTime(endOfTheDay)
    }

    useEffect(() => {
        let endOfTheDay = setSeconds(endOfDay(new Date()), 0)
        let startOfTheDay = subDays(new Date(), 1)
        switch (curPeriod) {
            case ERangeType.YESTERDAY:
                startOfTheDay = startOfYesterday()
                endOfTheDay = endOfDay(startOfTheDay)
                break
            case ERangeType.TODAY:
                startOfTheDay = startOfDay(new Date())
                break
            case ERangeType.LASTDAY:
                break
            case ERangeType.WEEK:
                startOfTheDay = startOfDay(addWeeks(endOfTheDay, -1))
                break
            case ERangeType.MONTH:
                startOfTheDay = startOfDay(addMonths(endOfTheDay, -1))
                break
            case ERangeType.YEAR:
                startOfTheDay = startOfDay(addYears(endOfTheDay, -1))
                break
            case ERangeType.NO:
                startOfTheDay = new Date(startDateTime)
                endOfTheDay = new Date(endDateTime)
                break
        }
        handleDatePeriod(startOfTheDay, endOfTheDay)
    }, [curPeriod])

    const handleStartDateTime = (date: Date) => {
        if (date && validateDate(date)) {
            setTimeAgg({...timeAgg, periodStorage: ERangeType.NO, startDash: date})
            setCurPeriod(ERangeType.NO)
            setStartDateTime(date)
        }
    }

    const handleEndDateTime = (date: Date) => {
        if (date && validateDate(date)) {
            setTimeAgg({...timeAgg, periodStorage: ERangeType.NO, endDash: date})
            setCurPeriod(ERangeType.NO)
            setEndDateTime(date)
        }
    }

    const handleChange = (value: TAlexDatePeriodPickerValue) => {
        if (value.startDate !== startDateTime.toString()) {
            handleStartDateTime(new Date(value.startDate))
        }
        if (value.finishDate !== endDateTime.toString()) {
            handleEndDateTime(new Date(value.finishDate))
        }
    }

    useEffect(() => {
        const currentMomentEffect = new Date()
        if (startDateTime >= endDateTime && startDateTime < currentMomentEffect) {
            const endDateUpdate = new Date(addDays(new Date(startDateTime), 1))
            if (endDateUpdate < currentMomentEffect) {
                setTimeAgg({...timeAgg, endDash: endDateUpdate})
                setEndDateTime(endDateUpdate)
            } else {
                setTimeAgg({...timeAgg, endDash: currentMomentEffect})
                setEndDateTime(currentMomentEffect)
            }
        }
    }, [startDateTime, endDateTime])

    const theme = useTheme()

    return (
        <Box>
            <Button
                onClick={handleClick}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    maxWidth: '290px',
                    padding: theme.spacing(1),
                    borderRadius: 0,
                }}
            >
                <Box
                    onClick={handleClick}
                    style={{
                        width: '100%',
                        height: '100%',
                        top: 0,
                        left: 0,
                        zIndex: 1000,
                        position: 'absolute',
                    }}
                />
                <AlexDatePeriodPicker
                    configFirstInput={{
                        type: EDatePickerType.dateTime,
                        disabled: true,
                        format: 'dd/MM/yy'
                    }}
                    configSecondInput={{
                        type: EDatePickerType.dateTime,
                        disabled: true,
                        format: 'dd/MM/yy'
                    }}
                    value={{
                        startDate: startDateTime.toString(),
                        finishDate: endDateTime.toString(),
                    }}
                    onChange={() => {
                    }}/>
            </Button>
            {open ? (
                <Portal>
                    <Popover open={open}
                             anchorEl={anchorEl}
                             anchorOrigin={{
                                 vertical: 'bottom',
                                 horizontal: 'left',
                             }}
                             onClose={handleClose}>
                        <Paper
                            data-testid="graph-container-date-settings"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                maxWidth: '380px',
                                padding: theme.spacing(2),
                                backgroundColor: 'white',
                            }}>
                            <Stack direction={'column'} gap={theme.spacing(2)}>
                                <SelectRadio option={periods}
                                             value={checkPeriod}
                                             setValue={setCurPeriod as (value: string) => void}/>
                                <AlexDatePeriodPicker
                                    configFirstInput={{
                                        type: EDatePickerType.dateTime,
                                    }}
                                    configSecondInput={{
                                        type: EDatePickerType.dateTime,
                                    }}
                                    value={{
                                        startDate: startDateTime.toString(),
                                        finishDate: endDateTime.toString(),
                                    }}
                                    onChange={handleChange}/>
                            </Stack>
                        </Paper>
                    </Popover>
                </Portal>
            ) : null}
        </Box>
    )
}

export default ChoosePeriod
