import {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {Box, Stack, Typography, useTheme} from '@mui/material'
import useWindowSize from '../../../shared-react-components/functions/useWindowSize.tsx'
import {ReactChart} from '../../../shared-react-components/alex-react-chart/ReactChart.tsx'
import {
    EUsePageStateMode,
    useAlexPageState,
} from '../../../shared-react-components/functions/useAlexPageState/useAlexPageState.tsx'
import {TTimeAgg} from '../../../shared-react-components/alex-react-chart/types/time-agg.type.ts'
import {ETimeAggregation} from '../../../shared-react-components/alex-react-chart/enums/ETimeAggregation.ts'
import {ERangeType} from '../../../shared-react-components/alex-react-chart/enums/range-type.enum.ts'
import {mainPageVarsBehaviourMap} from './main-page-vars-behaviour-map.ts'
import {dateBuilder} from '../../../shared-react-components/functions/date-builder.ts'
import ChoosePeriod from '../../../shared-react-components/alex-react-chart/choose-period/choose-period.tsx'
import Aggregation from '../../../shared-react-components/alex-react-chart/aggregation/Aggregation.tsx'
import {EFormatType} from '../../../shared-react-components/alex-react-chart/enums/format-type.enum.ts'
import {EGraphType} from '../../../shared-react-components/alex-react-chart/enums/EGraphType.ts'
import {
    TGetNewDataCallback,
} from '../../../shared-react-components/alex-react-chart/dialog-react-chart/dialog-react-chart.tsx'
import {
    MainPageUserRegistrationHistoryDocument,
    MainPageUserRegistrationHistoryQuery, MainPageUserTotalAmountDocument, MainPageUserTotalAmountQuery,
    TStatUserRegistrationHistoryInput, TStatValueAttributes,
} from '../../../core/apollo/types/graphql/graphql.ts'
import {useLazyQuery} from '@apollo/client'
import {AlexDataView} from '../../../shared-react-components/form-utils/AlexDataView/AlexDataView.tsx'

export enum EStoredOptionsMainPage {
    timeAgg = 'timeAgg',
}

export const MainPage: FC = () => {
    const {
        storedOptions,
        setStoredOptions,
        variables,
    } = useAlexPageState<TStatUserRegistrationHistoryInput>({
        modeRead: [
            EUsePageStateMode.queryString,
            EUsePageStateMode.localStorage,
        ],
        modeWrite: [
            EUsePageStateMode.queryString,
            EUsePageStateMode.localStorage,
        ],
        storageKey: 'mapsPageSettings',
        varsBehaviorMap: mainPageVarsBehaviourMap,
        defaultValue: new Map<EStoredOptionsMainPage, any>([
            [EStoredOptionsMainPage.timeAgg, {
                periodStorage: ERangeType.WEEK,
                startDash: dateBuilder({date: new Date().getDate() - 7})(),
                endDash: new Date(),
                aggregation: ETimeAggregation.DAY,
            } as TTimeAgg],
        ]),
    })

    const theme = useTheme()

    const refBox = useRef<HTMLDivElement | null>(null)
    const [windowHeight, setWindowHeight] = useState<number | null>(null)

    const windowSize = useWindowSize()
    useEffect(() => {
        refBox.current && setWindowHeight(refBox.current.offsetHeight)
    }, [windowSize])

    const timeAgg: TTimeAgg | undefined = useMemo(() => storedOptions.get(EStoredOptionsMainPage.timeAgg), [storedOptions])

    const handleSetTimeAgg = (value: TTimeAgg) => {
        setStoredOptions((prevState) => {
            prevState.set(EStoredOptionsMainPage.timeAgg, value)
            return new Map(prevState)
        })
    }

    const [lazyGetUserTotalAmount, {
        data: userTotalAmountQueryData,
        loading: userTotalAmountQueryLoading,
    }] = useLazyQuery<MainPageUserTotalAmountQuery>(
        MainPageUserTotalAmountDocument,
    )

    const [lazyGetUserRegistrationHistory, {
        data: userRegistrationHistoryQueryData,
        loading: userRegistrationHistoryQueryLoading,
    }] = useLazyQuery<MainPageUserRegistrationHistoryQuery>(
        MainPageUserRegistrationHistoryDocument,
    )

    const [lazyGetUserRegistrationHistoryCallback] = useLazyQuery<MainPageUserRegistrationHistoryQuery>(
        MainPageUserRegistrationHistoryDocument,
    )

    useEffect(() => {
        lazyGetUserTotalAmount()
    }, [])

    useEffect(() => {
        if (variables) {
            lazyGetUserRegistrationHistory({
                variables: {
                    input: variables,
                },
            })
        }
    }, [variables])

    const getNewGraphValuesCallback: TGetNewDataCallback = useCallback(async (aggregation, range) => {
        const data = await lazyGetUserRegistrationHistoryCallback({
            variables: {
                input: {
                    timeAggregation: aggregation,
                    datePeriod: {
                        startDate: (new Date(range.startDateTime)).toISOString(),
                        endDate: (new Date(range.endDateTime)).toISOString(),
                    },
                },
            },
        })

        if (data?.data?.stat.userRegistrationHistoryList.data) {
            return {
                dateRange: {
                    startDateTime: range.startDateTime,
                    endDateTime: range.endDateTime,
                },
                graphType: EGraphType.LINE,
                valueFormat: EFormatType.TIME,
                datasets: [{
                    title: 'Регистраций пользователей',
                    inverted: false,
                    valueFormat: EFormatType.TIME,
                    color: '#123456',
                    summary: data.data.stat.userRegistrationHistoryList.summary,
                    measures: data.data.stat.userRegistrationHistoryList.data as TStatValueAttributes[],
                }],
            }
        } else {
            return null
        }
    }, [])

    const userRegistrationHistoryData = useMemo(
        () => userRegistrationHistoryQueryData?.stat.userRegistrationHistoryList,
        [userRegistrationHistoryQueryData],
    )

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flex: 1,
            overflowY: 'scroll',
            height: '100%',
        }}>
            <Stack direction={'column'} gap={theme.spacing(3)} padding={theme.spacing(3)} boxSizing={'border-box'}
                   width={'100%'} flex={1}>

                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} gap={theme.spacing(3)}>

                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} gap={theme.spacing(6)}>
                        <AlexDataView label={'Всего клиентов'}>
                            {userTotalAmountQueryData?.stat.userTotalAmount.data.toString()}
                        </AlexDataView>

                        <AlexDataView label={'Средний возраст'}>
                            35
                        </AlexDataView>

                        <AlexDataView label={'Мужчины'}>
                            68%
                        </AlexDataView>

                        <AlexDataView label={'Женщины'}>
                            32%
                        </AlexDataView>
                    </Stack>

                    <Stack direction={'row'} alignItems={'center'} gap={theme.spacing(3)}>
                        <Stack direction={'row'} spacing={'20px'} alignItems={'center'}>
                            <Typography variant={'h4'}>Выберите период</Typography>
                            <Box width={'300px'}>
                                {timeAgg && (
                                    <ChoosePeriod timeAgg={timeAgg}
                                                  setTimeAgg={handleSetTimeAgg}/>
                                )}
                            </Box>
                        </Stack>

                        <Stack direction={'row'} spacing={'20px'} alignItems={'center'}>
                            <Typography variant={'h4'}>Агрегация</Typography>
                            <Box width={'200px'}>
                                {timeAgg && (
                                    <Aggregation timeAgg={timeAgg}
                                                 setTimeAgg={handleSetTimeAgg}/>
                                )}
                            </Box>
                        </Stack>
                    </Stack>

                </Stack>
                <Stack alignItems={'center'} justifyContent={'center'} flex={1} ref={refBox}>
                    {(windowHeight && timeAgg && userRegistrationHistoryData) && (
                        <ReactChart
                            getNewDataCallback={getNewGraphValuesCallback}
                            defaultStoredParams={{
                                showTitle: false,
                            }}
                            loading={userRegistrationHistoryQueryLoading}
                            data={{
                                dateRange: {
                                    startDateTime: timeAgg?.startDash,
                                    endDateTime: timeAgg?.endDash,
                                },
                                graphType: EGraphType.LINE,
                                valueFormat: EFormatType.TIME,
                                datasets: [{
                                    title: 'Всего клиентов',
                                    inverted: false,
                                    valueFormat: EFormatType.TIME,
                                    color: '#623A5A',
                                    measures: userRegistrationHistoryData.data,
                                    summary: userRegistrationHistoryData.summary,
                                }],
                            }}
                            height={windowHeight} useButtonForGraphType
                            useButtonForLegend
                            useDialogReactChart useButtonForThresholds
                            styles={{
                                paper: {
                                    width: '100%',
                                    position: 'relative',
                                },
                            }}/>
                    )}
                </Stack>
            </Stack>
        </Box>
    )
}