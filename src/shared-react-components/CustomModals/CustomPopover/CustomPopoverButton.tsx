import React, { FC, ReactElement, useState } from 'react'
import { CustomPopover } from './CustomPopover'
import { setFunctionsForModal } from '../functions/setFunctionsDFS'
import { PopoverPosition } from '@mui/material'

export type TFunctionsAssign = {
    [key: string]: {
        close: boolean,
        function?: Function
    }
}

type TPopover = {
    body: ReactElement,
    functionsAssign?: TFunctionsAssign
    position?: PopoverPosition
}

interface ICustomPopoverButtonProps {
    button: ReactElement
    popover?: TPopover
}

export const CustomPopoverButton: FC<ICustomPopoverButtonProps> = ({
    button,
    popover
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const handleClose = () => {
        setAnchorEl(null)
    }

    const modalElement = popover?.functionsAssign
        ? setFunctionsForModal({
            reactElement: React.cloneElement(popover!.body),
            functionsAssign: popover.functionsAssign,
            setOpen: handleClose
        })
        : React.cloneElement(popover!.body)

    const handleClickPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    return (<>
        {React.cloneElement(button, {
            onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                handleClickPopover(event)
            }
        })}
        {popover && (
            <CustomPopover open={Boolean(anchorEl)} anchorPosition={popover.position}
                           anchorEl={anchorEl} handleClose={handleClose}>
                {modalElement}
            </CustomPopover>
        )}
    </>)
}