import React, { FC, useEffect, useMemo } from 'react'
import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import { theme } from '../../theme/theme'
import { AlexDataView } from '../../../shared-react-components/form-utils/AlexDataView/AlexDataView'
import { useLazyQuery, useQuery } from '@apollo/client'
import { CabinetPageGetMeDocument, CabinetPageGetMeQuery } from '../../../core/apollo/types/graphql/graphql.ts'
import { AlexChip } from '../../../shared-react-components/AlexChip/AlexChip.tsx'
import { AlexContentProvider } from '../../../shared-react-components/alex-content/alex-content-provider.component.tsx'
import { EERoleToRusName } from '../../enum/erole-to-rus-name.enum.ts'


interface IProps {
}

export const CabinetPage: FC<IProps> = () => {
    const [lazyGetMeQuery, {
        data: getMeQueryData,
        loading: getMeQueryDataLoading,
    }] = useLazyQuery<CabinetPageGetMeQuery>(CabinetPageGetMeDocument)

    useEffect(() => {
        lazyGetMeQuery()
    },[])

    const meData = useMemo(() => getMeQueryData?.user.recordMe, [getMeQueryData])

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            height: '100%',
            flex: 1,
            overflowY: 'scroll',
        }}>
            {getMeQueryDataLoading && (
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <CircularProgress/>
                </Box>
            )}
            {(!getMeQueryDataLoading && meData) && (
                <Box sx={{
                    width: '100%',
                    padding: theme.spacing(2),
                    boxSizing: 'border-box',
                }}>
                    <AlexContentProvider pointConfig={[
                        {
                            name: 'main',
                            title: 'Основная информация',
                            body: (
                                <Grid container spacing={theme.spacing(2)}>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'ID'}>
                                            {meData.id}
                                        </AlexDataView>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'Почта'}>
                                            {meData.email}
                                        </AlexDataView>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'Идентификационный номер бизнеса'}>
                                            e86c3015-8ba6-447f-83cc-0f26efe8b609
                                        </AlexDataView>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'Дата создания'}>
                                            {meData.createdAt}
                                        </AlexDataView>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <AlexDataView label={'Дата последнего изменения'}>
                                            {meData.updatedAt}
                                        </AlexDataView>
                                    </Grid>
                                </Grid>
                            ),
                        },
                    ]}/>
                </Box>
            )}
        </Box>
    )
}