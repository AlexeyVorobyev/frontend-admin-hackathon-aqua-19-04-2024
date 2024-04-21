import React, { FC, ReactNode, useCallback, useEffect } from 'react'
import { MenuProps } from '@mui/material'
import Menu from '@mui/material/Menu'

interface IProps extends MenuProps {
    children: ReactNode
    handleClose: () => void
}

export const CustomMenu: FC<IProps> = ({
    children,
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
        <Menu
            {...props}
            onClick={(event: any) => {
                event.stopPropagation()
                if (event.nativeEvent.target.classList.contains('MuiBackdrop-root')) {
                    handleClose()
                }
            }}>
            {children}
        </Menu>
    )
}