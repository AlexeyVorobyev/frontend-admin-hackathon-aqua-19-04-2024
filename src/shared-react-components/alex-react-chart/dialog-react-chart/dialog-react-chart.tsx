import React, {useEffect, useRef, useState} from 'react'
import {Box, Dialog, IconButton, MenuItem, Paper, Stack, Typography, useTheme} from '@mui/material'
import ReactChartEngine, {IReactChartProps, TReactChartPartialInterface} from '../ReactChartEngine/ReactChartEngine'
import {makeStyles} from '@mui/styles'
import {TDataset} from '../processFunctions/processData'
import {ETimeAggregation} from '../enums/ETimeAggregation'
import ReactChartNotData from '../ReactChartNotData/ReactChartNotData'
import {CustomMenuButton} from '../../CustomModals/CustomMenu/CustomMenuButton'
import {EGraphType} from '../enums/EGraphType'
import {useStylesButton} from '../utils/styles.ts'
import {previousMonday, startOfDay} from 'date-fns'
import {EUsePageStateMode, useAlexPageState} from '../../functions/useAlexPageState/useAlexPageState.tsx'
import {graphTypeList} from '../utils/graph-type.ts'
import {AlexIcon} from '../../alex-icon/alex-icon.component.tsx'
import {ERangeType} from '../enums/range-type.enum.ts'
import {TTimeAgg} from '../types/time-agg.type.ts'
import {DialogReactChartMenu} from './dialog-react-chart-menu/dialog-react-chart-menu.tsx'
import ChoosePeriod from '../choose-period/choose-period.tsx'
import Aggregation from '../aggregation/Aggregation.tsx'

const useStyles = makeStyles(theme => ({
    paper: {
        overflowY: 'unset',
    },
    customizedButton: {
        position: 'absolute',
        right: '1%',
        top: '1.5%',
        display: 'flex',
        gap: '5px',

        fill: 'none',
    }
}))

export type TDateRange = {
    endDateTime: Date,
    startDateTime: Date
}

export type TGetNewDataCallback = (aggregation: ETimeAggregation, range: TDateRange) => Promise<TReactChartPartialInterface | null>

interface IDialogReactChartProps extends Omit<IReactChartProps, 'showTitle' | 'showLegend' | 'height'> {
    open: boolean
    setOpen: (e: boolean) => void
    useButtonForTitle?: boolean
    useButtonForLegend?: boolean
    useButtonForThresholds?: boolean
    useButtonForGraphType?: boolean
    dateRange: TDateRange
    getNewDataCallback: TGetNewDataCallback
    linkCard?: string
    disableAnimation?: boolean
}

export enum EStorageParamsDialogReactChart {
    showTitle = 'showTitle',
    showLegend = 'showLegend',
    showTable = 'showTable',
    showThresholds = 'showThresholds'
}

/**
 *  Компонент, предоставляющий диалоговое окно миди/макси формата графика.
 *  Основывается на ReactChartEngine.
 *
 * */
const DialogReactChart: React.FC<IDialogReactChartProps> = ({
    open,
    setOpen,
    useButtonForLegend = false,
    useButtonForTitle = false,
    useButtonForGraphType = false,
    useButtonForThresholds = false,
    dateRange,
    getNewDataCallback,
    linkCard,
    title,
    graphType,
    valueFormat,
    datasets,
    id,
    aggregation,
    disableAnimation = false,
    thresholds
}) => {
    const classes = useStyles()
    const classesButton = useStylesButton()
    const boxRefFullScreen = useRef<HTMLDivElement>(null)
    const [heightFullScreen, setHeightFullScreen] = useState<number>(700)
    const [fullScreen, setFullScreen] = useState<boolean>(false)

    useEffect(() => {
        if (boxRefFullScreen.current) {
            setHeightFullScreen(boxRefFullScreen.current.clientHeight)
        }
    })

    const handleClose = () => {
        setTimeout(() => setFullScreen(false), 200)
        setOpen(false)
    }

    const [localDataSets, setLocalDataSets] = useState<TDataset[]>(datasets)
    const [timeAgg, setTimeAgg] = useState<TTimeAgg>({
        periodStorage: ERangeType.NO,
        startDash: dateRange.startDateTime || startOfDay(previousMonday(new Date())),
        endDash: dateRange.endDateTime || new Date(),
        aggregation: aggregation || ETimeAggregation.NO_AGG
    })

    const {
        storedOptions,
        setStoredOptions
    } = useAlexPageState({
        storageKey: `dialogReactChart_${id}`,
        modeWrite: id ? [EUsePageStateMode.localStorage] : undefined,
        modeRead: id ? [EUsePageStateMode.localStorage] : undefined,
        defaultValue: new Map<string, any>([
            [EStorageParamsDialogReactChart.showTitle, true],
            [EStorageParamsDialogReactChart.showLegend, true],
            [EStorageParamsDialogReactChart.showTable, false],
            [EStorageParamsDialogReactChart.showThresholds, true],
        ])
    })

    useEffect(() => {
        if (
            timeAgg.aggregation === aggregation &&
            timeAgg.endDash === dateRange.endDateTime &&
            timeAgg.startDash === dateRange.startDateTime
        ) {
            setLocalDataSets(datasets)
            return
        }

        getNewDataCallback(
            timeAgg.aggregation,
            {
                startDateTime: timeAgg.startDash,
                endDateTime: timeAgg.endDash
            })
            .then((response) => {
                if (response) {
                    setLocalDataSets(response.datasets)
                }
            })
    }, [timeAgg])

    const [localGraphType, setLocalGraphType] = useState<EGraphType>(graphType)

    const theme = useTheme()

    return (
        <Dialog onClose={handleClose} maxWidth={'lg'} fullWidth
                fullScreen={fullScreen}
                classes={{ paper: classes.paper }} open={open}>
            <Paper
                ref={boxRefFullScreen}
                style={{
                    position: 'relative',
                    height: fullScreen ? '100%' : 700,
                    width: '100%',
                    border: '5px solid #465b8c',
                }}
            >
                {(datasets?.length) ? (
                    <Stack direction={'column'}>
                        <Stack direction={'row'} paddingLeft={theme.spacing(2)}
                               paddingRight={theme.spacing(2)} useFlexGap alignItems={'center'}>
                            <Stack direction={'row'} spacing={'20px'} alignItems={'center'}>
                                <Typography variant={'h5'}>Выберите период</Typography>
                                <Box width={'300px'}>
                                    <ChoosePeriod timeAgg={timeAgg}
                                                  setTimeAgg={setTimeAgg}/>
                                </Box>
                            </Stack>

                            <Stack direction={'row'} spacing={'20px'} alignItems={'center'}>
                                <Typography variant={'h5'}>Агрегация</Typography>
                                <Box width={'200px'}>
                                    <Aggregation timeAgg={timeAgg}
                                                 setTimeAgg={setTimeAgg}/>
                                </Box>
                            </Stack>

                            <Stack direction={'row'} spacing={theme.spacing(1)} marginLeft={'auto'}
                                   sx={{ fill: 'none' }}>
                                {useButtonForGraphType && (
                                    <CustomMenuButton
                                        button={(
                                            <IconButton className={classesButton.button}>
                                                <AlexIcon icon={'barChart'}/>
                                            </IconButton>
                                        )}
                                        menuElements={
                                            graphTypeList.map((item) => (
                                                <MenuItem
                                                    onClick={() => setLocalGraphType(item.id as unknown as EGraphType)}>
                                                    {item.title}
                                                </MenuItem>
                                            ))
                                        }
                                    />
                                )}
                                <DialogReactChartMenu options={storedOptions} setOptions={setStoredOptions}
                                                      linkCard={linkCard}
                                                      useButtonForThresholds={thresholds?.length
                                                          ? useButtonForThresholds
                                                          : false}
                                                      useButtonForTitle={useButtonForTitle}
                                                      useButtonForLegend={useButtonForLegend}/>
                                <IconButton className={classesButton.button}
                                            onClick={() => setFullScreen(!fullScreen)}>
                                    <AlexIcon icon={fullScreen ? 'collapse' : 'expand'}/>
                                </IconButton>
                                <IconButton className={classesButton.button}
                                            onClick={handleClose}>
                                    <AlexIcon icon={'close'}/>
                                </IconButton>
                            </Stack>
                        </Stack>
                        {localDataSets && (
                            <ReactChartEngine height={heightFullScreen - 20 - 35} autoResponsive={false}
                                              disableAnimation={disableAnimation} id={id} thresholds={thresholds}
                                              datasets={localDataSets} valueFormat={valueFormat}
                                              title={title} graphType={localGraphType} aggregation={timeAgg.aggregation}
                                              showThresholds={storedOptions.get(EStorageParamsDialogReactChart.showThresholds)}
                                              showTitle={storedOptions.get(EStorageParamsDialogReactChart.showTitle)}
                                              showLegend={storedOptions.get(EStorageParamsDialogReactChart.showLegend)}/>
                        )}
                    </Stack>
                ) : (<>
                    <Box position={'absolute'} top={'20px'} right={'20px'}>
                        <IconButton className={classesButton.button}
                                    onClick={handleClose}>
                            <AlexIcon icon={'close'}/>
                        </IconButton>
                    </Box>
                    <ReactChartNotData/>
                </>)}
            </Paper>
        </Dialog>
    )
}

export default DialogReactChart
