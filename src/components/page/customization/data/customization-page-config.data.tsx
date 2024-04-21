import { UsersTable } from "../../users/users-table.component";
import { EPageType, TCustomizationPageConfig } from '../customization-page.component.tsx'
import {UserCard} from '../../users/user-card.component.tsx'



export const customizationPageConfig: Map<string, TCustomizationPageConfig> = new Map([
    ['users',
        {
            [EPageType.table]: {
                component: <UsersTable/>,
                title: 'Клиенты',
                button: 'нового пользователя',
            },
            [EPageType.view]: {
                component: <UserCard/>,
                button: 'клиента',
            },
        },
    ],
])