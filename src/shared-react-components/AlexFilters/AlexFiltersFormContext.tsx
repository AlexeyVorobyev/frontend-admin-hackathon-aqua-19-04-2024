import React, { FC, ReactNode, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {Box, Button, Divider, Stack, Typography, useTheme} from '@mui/material'
import {TSetStoredOptions, TStoredOptions} from '../functions/useAlexPageState/useAlexPageState.tsx'

interface IProps {
    children: ReactNode
    setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>
    storedOptions: TStoredOptions
    setStoredOptions: TSetStoredOptions
    filterListIds: string[]
    minWidth?: string
}

/**
 * Компонент инкапсулирующий логику взаимодействия с оборачивающей формой и отправкой данных в storedOptions
 * */
export const AlexFiltersFormContext: FC<IProps> = ({
                                                          children,
                                                          setAnchorEl,
                                                          storedOptions,
                                                          setStoredOptions,
                                                          filterListIds,
    minWidth = '500px'
                                                      }) => {
    const theme = useTheme()
    const methods = useForm()
    const { handleSubmit, reset } = methods

    //синхронизация фильтров в форме с текущими storedOptions
    useEffect(() => {
        const data = Object.fromEntries(Array.from(storedOptions)
            .filter((param) => filterListIds.includes(param[0])))
        reset(data)
    }, [])

    const onSubmit = (data: any) => {
        setStoredOptions((prev) => {
            return new Map([
                ...Array.from(prev)
                    .filter((param) => !filterListIds.includes(param[0])),
                ...(
                    new Map(Object.entries(data)
                        .filter((param) => {
                            if (Array.isArray(param[1])) {
                                return Boolean(param[1].length)
                            }
                            return Boolean(param[1])
                        }))
                ),
            ])
        })
        setAnchorEl(null)
    }

    const handleClear = (event: any) => {
        event.preventDefault()
        setStoredOptions((prev) => {
            return new Map(
                Array.from(prev)
                    .filter((param) => !filterListIds.includes(param[0]))
            )
        })
        reset()
        setAnchorEl(null)
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{
                    paddingTop: theme.spacing(1),
                    paddingBottom: theme.spacing(2),
                    minWidth: minWidth
                }}>
                    <Stack direction={'column'} spacing={theme.spacing(2)}
                           maxHeight={'50vh'} overflow={'scroll'}
                           sx={{
                               paddingTop: theme.spacing(1),
                               paddingLeft: theme.spacing(2),
                               paddingRight: theme.spacing(2),
                           }}>
                        {children}
                    </Stack>
                    <Divider sx={{
                        marginBottom: theme.spacing(2),
                        marginTop: theme.spacing(2),
                        paddingLeft: theme.spacing(2),
                        paddingRight: theme.spacing(2),
                    }}/>
                    <Stack direction={'row'} spacing={theme.spacing(2)} gap={theme.spacing(2)}
                           justifyContent={'flex-end'}
                           sx={{
                               paddingLeft: theme.spacing(2),
                               paddingRight: theme.spacing(2),
                           }}>
                        <Button variant={'outlined'} color={'neutral'}
                                onClick={handleClear}>
                            <Typography variant={'button'}
                                        color={theme.palette.neutral.notContrastText}>Очистить всё</Typography>
                        </Button>
                        <Button variant={'contained'} type={'submit'}>
                            <Typography variant={'button'}>Применить</Typography>
                        </Button>
                    </Stack>
                </Box>
            </form>
        </FormProvider>
    )
}
