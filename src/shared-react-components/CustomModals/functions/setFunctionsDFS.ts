import React, { ReactElement } from 'react'
import { TFunctionsAssign } from '../CustomPopover/CustomPopoverButton'

interface ISetFunctionsArgs {
    reactElement: ReactElement
    functionsAssign: TFunctionsAssign
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const setFunctionsForModal = (args: ISetFunctionsArgs): ReactElement => {
    const {
        reactElement,
        functionsAssign,
        setOpen
    } = args
    const dfs = (reactElement: ReactElement): ReactElement => {
        if (Object.keys(functionsAssign).includes(reactElement.props.id)) {
            const id = reactElement.props.id
            reactElement = React.cloneElement(reactElement, {
                onClick: () => {
                    if (functionsAssign[id].close) {
                        setOpen(false)
                    }
                    if (functionsAssign[id].function) {
                        functionsAssign[id].function?.()
                    }
                },
            })
        }

        if (!reactElement.props.children) {
            return React.cloneElement(reactElement)
        }
        if (reactElement.props.children.length && typeof reactElement.props.children !== 'string') {
            reactElement = React.cloneElement(reactElement, {
                children: reactElement.props.children.map((child: ReactElement) => dfs(child))
            })
        } else if (typeof reactElement.props.children === 'object') {
            reactElement = React.cloneElement(reactElement, {
                children: React.cloneElement(dfs(reactElement.props.children))
            })
        }

        return React.cloneElement(reactElement)
    }

    return dfs(reactElement)
}