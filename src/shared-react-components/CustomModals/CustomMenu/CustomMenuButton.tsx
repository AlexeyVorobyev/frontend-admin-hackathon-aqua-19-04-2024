import React, { FC, ReactElement, ReactNode, useState } from 'react'
import { CustomMenu } from './CustomMenu'

interface ICustomMenuButtonProps {
    button: ReactElement
    menuElements?: ReactNode
}

export const CustomMenuButton: FC<ICustomMenuButtonProps> = ({
    button,
    menuElements
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleClickPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    return (<>
        {React.cloneElement(button, {
            onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                handleClickPopover(event)
            }
        })}
        {menuElements && (
            <CustomMenu open={Boolean(anchorEl)}
                        anchorEl={anchorEl} handleClose={handleClose}>
                {menuElements}
            </CustomMenu>
        )}
    </>)
}