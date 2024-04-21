import React from 'react'
import {
    Menu,
    MenuItem,
    Radio,
    TextField,
} from '@mui/material'
import {AlexIcon} from '../../alex-icon/alex-icon.component.tsx'
import {ERangeType} from '../enums/range-type.enum.ts'


export interface SelectRadioProps {
    option: string[]
    value: string
    setValue: (value: string) => void
    label?: string
    height?: number
}

export const SelectRadio: React.FC<SelectRadioProps> = ({
                                                            option,
                                                            value,
                                                            setValue,
                                                            label = null,
                                                            height = 34
                                                        }) => {

    const styleField = {
        height: height,
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value)
    }

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleCheck = (value: any) => {
        setValue(value)
        setAnchorEl(null)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const controlProps = (item: string) => ({
        checked: value === item,
        onChange: handleChange,
        value: item,
        name: 'size-radio-button-demo',
        inputProps: { 'aria-label': item },
    })

    return (<>
            <TextField
                type={'button'}
                value={value}
                label={label ? label : null}
                variant={'filled'}
                margin={'dense'}
                inputProps={{
                    style: { ...styleField, padding: '0 10px', textAlign: 'left', cursor: 'pointer' },
                }}
                InputProps={{
                    endAdornment: (
                        open ? <AlexIcon icon={'keyBoardArrowRight'}/>
                            :  <AlexIcon icon={'keyBoardArrowLeft'}/>
                    ),
                    style: {
                        borderRadius: '20px',
                    },
                    disableUnderline: true
                }}
                InputLabelProps={{
                    style: {
                        ...styleField,
                        top: `-10px`,
                        left: `-6px`,
                    },
                }}
                onChange={handleChange}
                onClick={handleClick}
                fullWidth
            />
            <Menu
                anchorEl={anchorEl}
                open={open}
                style={{ width: 350 }}
                onClose={handleClose}
            >
                {option.map((field) => field !== ERangeType.NO && (
                        <MenuItem style={{ display: 'flex', width: 330, justifyContent: 'space-between' }}
                                  onClick={() => handleCheck(field)} value={field}>
                            {field}
                            <Radio {...controlProps(field)} />
                        </MenuItem>
                    )
                )}
            </Menu>
        </>
    )

}

