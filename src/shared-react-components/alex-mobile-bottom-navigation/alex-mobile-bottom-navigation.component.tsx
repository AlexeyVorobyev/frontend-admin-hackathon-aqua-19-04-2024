import {BottomNavigation, BottomNavigationAction, SvgIconTypeMap, useTheme} from '@mui/material'
import {FC, SyntheticEvent, useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {AlexIcon} from '../alex-icon/alex-icon.component.tsx'
import {EIconToNameMap} from '../alex-icon/alex-icon-icon-to-name-map.data.ts'
import {OverridableComponent} from '@mui/material/OverridableComponent'

export type TBottomNavigationConfig = {
    path: string | null,
    name: string
    icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> | EIconToNameMap | `${EIconToNameMap}`
}

type TStyles = {
    inactiveIconColor?: string,
    activeIconColor?: string,
    fill?: boolean,
    stroke?: boolean
}

interface IAlexMobileBottomNavigationProps {
    config: TBottomNavigationConfig[]
    styles?: TStyles
    disabledOnRoutes?: string[]
}

export const AlexMobileBottomNavigation: FC<IAlexMobileBottomNavigationProps> = ({
                                                                                     config,
                                                                                     styles,
                                                                                     disabledOnRoutes= [],
                                                                                 }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [value, setValue] = useState<string>(location.pathname)

    useEffect(() => {
        setValue(location.pathname)
    }, [location])

    const theme = useTheme()

    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setValue(newValue)
    }

    useEffect(() => {
        if (config.map((item) => item.path).includes(value)) {
            navigate(value)
        }
    }, [value])

    return (
        <BottomNavigation sx={{
            width: '100%',
            display: disabledOnRoutes.includes(location.pathname) ? 'none' : undefined
        }} value={value} onChange={handleChange}>
            {config.map((item, index) => (
                <BottomNavigationAction
                    key={index}
                    label={item.name}
                    value={item.path}
                    icon={
                        <AlexIcon
                            fill={styles?.fill}
                            stroke={styles?.stroke} icon={item.icon}
                            color={value === item.path
                                ? (styles?.activeIconColor || theme.palette.secondary.main)
                                : (styles?.inactiveIconColor || '#000000')
                            }
                        />
                    }
                />
            ))}
        </BottomNavigation>
    )
}