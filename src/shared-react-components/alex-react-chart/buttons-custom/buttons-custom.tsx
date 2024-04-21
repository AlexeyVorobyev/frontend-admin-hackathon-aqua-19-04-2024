import React, {FC} from 'react'
import {Box, Button, IconButton, MenuItem, Popover, Stack, useTheme} from '@mui/material'
import {useNavigate} from 'react-router-dom'
import {CustomMenuButton} from '../../CustomModals/CustomMenu/CustomMenuButton'
import {EGraphType} from '../enums/EGraphType'
import {graphTypeList} from '../utils/graph-type.ts'
import {AlexIcon} from '../../alex-icon/alex-icon.component.tsx'
import {useStylesButton} from '../utils/styles.ts'

interface ButtonsCustomProps {
    buttonForTitle?: boolean
    setButtonForTitle?: (index: boolean) => void
    buttonForLegend?: boolean
    setButtonForLegend?: (index: boolean) => void
    buttonForThresholds?: boolean
    setButtonForThresholds?: (index: boolean) => void
    handleClickOpenDialogReactChart?: (e: React.MouseEvent<HTMLButtonElement>) => void
    linkCard?: string
    useButtonForGraphType?: boolean
    handleClickSetGraphType?: (graphType: EGraphType) => void
    graphType?: EGraphType
}

const ButtonsCustom: FC<ButtonsCustomProps> = ({
                                                   buttonForTitle,
                                                   setButtonForTitle,
                                                   buttonForLegend,
                                                   setButtonForLegend,
                                                   buttonForThresholds,
                                                   setButtonForThresholds,
                                                   handleClickOpenDialogReactChart,
                                                   linkCard,
                                                   useButtonForGraphType = false,
                                                   handleClickSetGraphType,
                                                   graphType,
                                               }) => {
    const classesButton = useStylesButton()
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

    const handleClickPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClosePopover = () => {
        setAnchorEl(null)
    }
    const handleView = (buttonFor: boolean, setButtonFor: (index: boolean) => void) => {
        const newButtonFor = !buttonFor
        setButtonFor(newButtonFor)
    }

    const theme = useTheme()

    return (
        <Stack direction={'row'} alignItems={'center'}
               spacing={theme.spacing(1)}
               sx={{
                   position: 'absolute',
                   top: theme.spacing(1),
                   right: theme.spacing(1),
               }}>
            {(
                useButtonForGraphType
                && handleClickSetGraphType
                && graphType
            ) && (
                <CustomMenuButton
                    button={(
                        <IconButton className={classesButton.button}
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                    }}>
                            <AlexIcon icon={'barChart'}/>
                        </IconButton>
                    )}
                    menuElements={
                        graphTypeList.map((item) => (
                            <MenuItem
                                onClick={() => handleClickSetGraphType(item.id as unknown as EGraphType)}>
                                {item.title}
                            </MenuItem>
                        ))
                    }
                />
            )}
            {handleClickOpenDialogReactChart !== undefined && (
                <IconButton className={classesButton.button}
                            style={{
                                width: '28px',
                                height: '28px',
                            }}
                            onClick={(e) => handleClickOpenDialogReactChart(e)}>
                    <AlexIcon icon={'search'}/>
                </IconButton>
            )}
            <IconButton className={classesButton.button}
                        style={{
                            width: '28px',
                            height: '28px',
                        }}
                        onClick={(e) => handleClickPopover(e)}>
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
                    {(buttonForTitle !== undefined && setButtonForTitle !== undefined) && (
                        <Button sx={{justifyContent: 'flex-start', color: '#000'}}
                                onClick={() => handleView(buttonForTitle, setButtonForTitle)}
                                variant="text">{buttonForTitle ? 'Скрыть наименование графика' : 'Показать наименование графика'}
                        </Button>
                    )}
                    {(buttonForLegend !== undefined && setButtonForLegend !== undefined) && (
                        <Button sx={{justifyContent: 'flex-start', color: '#000'}}
                                onClick={() => handleView(buttonForLegend, setButtonForLegend)}
                                variant="text">
                            {buttonForLegend ? 'Скрыть легенду графика' : 'Показать легенду графика'}
                        </Button>
                    )}
                    {(buttonForThresholds !== undefined && setButtonForThresholds !== undefined) && (
                        <Button sx={{justifyContent: 'flex-start', color: '#000'}}
                                onClick={() => handleView(buttonForThresholds, setButtonForThresholds)}
                                variant="text">
                            {buttonForThresholds ? 'Скрыть линии ограничения' : 'Показать линии ограничения'}
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
        </Stack>
    )
}

export default ButtonsCustom
