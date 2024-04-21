import React, {FC} from 'react'
import {Box, Button, IconButton, Popover} from '@mui/material'
import {useNavigate} from 'react-router-dom'
import {EStorageParamsDialogReactChart} from '../dialog-react-chart.tsx'
import {useStylesButton} from '../../utils/styles.ts'
import {TStoredOptions} from '../../../functions/useAlexPageState/useAlexPageState.tsx'
import {AlexIcon} from '../../../alex-icon/alex-icon.component.tsx'

interface IDialogReactChartMenu {
    options: TStoredOptions
    setOptions: React.Dispatch<React.SetStateAction<TStoredOptions>>
    linkCard?: string
    useButtonForTitle?: boolean
    useButtonForLegend?: boolean
    useButtonForThresholds?: boolean
}

export const DialogReactChartMenu: FC<IDialogReactChartMenu> = ({
                                                                    options,
                                                                    setOptions,
                                                                    linkCard,
                                                                    useButtonForLegend = false,
                                                                    useButtonForTitle = false,
                                                                    useButtonForThresholds = false,
                                                                }) => {
    const classes = useStylesButton()
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
    const handleClickPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClosePopover = () => {
        setAnchorEl(null)
    }

    const navigate = useNavigate()

    return (
        <>
            <IconButton onClick={(e) => handleClickPopover(e)}
                        className={classes.button}>
                <AlexIcon icon={'moreHoriz'}/>
            </IconButton>
            <Popover
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                elevation={1}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box style={{display: 'flex', flexDirection: 'column'}}>
                    {(useButtonForTitle && options.has(EStorageParamsDialogReactChart.showTitle)) && (
                        <Button sx={{justifyContent: 'flex-start', color: '#000'}}
                                onClick={() => setOptions((prevState) => {
                                    prevState.set(
                                        EStorageParamsDialogReactChart.showTitle,
                                        !prevState.get(EStorageParamsDialogReactChart.showTitle),
                                    )
                                    return new Map(prevState)
                                })}
                                variant="text">
                            {options.get(EStorageParamsDialogReactChart.showTitle)
                                ? `Скрыть наименование графика`
                                : `Показать наименование графика`}
                        </Button>
                    )}
                    {(
                        useButtonForLegend
                        && options.has(EStorageParamsDialogReactChart.showLegend)
                        && !options.get(EStorageParamsDialogReactChart.showTable)
                    ) && (
                        <Button sx={{justifyContent: 'flex-start', color: '#000'}}
                                onClick={() => setOptions((prevState) => {
                                    prevState.set(
                                        EStorageParamsDialogReactChart.showLegend,
                                        !prevState.get(EStorageParamsDialogReactChart.showLegend),
                                    )
                                    return new Map(prevState)
                                })}
                                variant="text">
                            {options.get('showLegend')
                                ? 'Скрыть легенду графика'
                                : 'Показать легенду графика'}
                        </Button>
                    )}
                    {(
                        useButtonForThresholds
                        && options.has(EStorageParamsDialogReactChart.showThresholds)
                        && !options.get(EStorageParamsDialogReactChart.showTable)
                    ) && (
                        <Button sx={{justifyContent: 'flex-start', color: '#000'}}
                                onClick={() => setOptions((prevState) => {
                                    prevState.set(
                                        EStorageParamsDialogReactChart.showThresholds,
                                        !prevState.get(EStorageParamsDialogReactChart.showThresholds),
                                    )
                                    return new Map(prevState)
                                })}
                                variant="text">
                            {options.get(EStorageParamsDialogReactChart.showThresholds)
                                ? 'Скрыть линии ограничения'
                                : 'Показать линии ограничения'
                            }
                        </Button>
                    )}
                    {linkCard !== undefined && (
                        <Button sx={{justifyContent: 'flex-start', color: '#000'}}
                                onClick={() => navigate(linkCard)}
                                variant="text">{'Просмотр карточки'}
                        </Button>
                    )}
                </Box>
            </Popover>
        </>
    )
}