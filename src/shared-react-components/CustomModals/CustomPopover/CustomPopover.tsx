import React, { FC, ReactNode, useCallback, useEffect } from 'react'
import { Popover, PopoverPosition, PopoverProps } from '@mui/material'

interface IProps extends PopoverProps {
    open: boolean
    children: ReactNode
    anchorEl: HTMLButtonElement | null
    handleClose: () => void
}

export const CustomPopover: FC<IProps> = ({
    children,
    open,
    anchorEl,
    handleClose,
    ...props
}) => {

    const handleKeyUp = useCallback((event: KeyboardEvent) => {
        event.stopPropagation()
        if (event.key === 'Escape' || event.key === 'Backspace') {
            handleClose()
        }
    }, [])

    useEffect(() => {
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])

    return (
        <Popover open={open}
                 {...props}
                 anchorEl={anchorEl}
                 onClick={(event: any) => {
                     event.stopPropagation()
                     if (event.nativeEvent.target.classList.contains('MuiBackdrop-root')) {
                         handleClose()
                     }
                 }}>
            {children}
        </Popover>
    )
}