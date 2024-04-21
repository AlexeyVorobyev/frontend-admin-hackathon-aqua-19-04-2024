import {theme} from '../../theme/theme.ts'
import {AlexCheckBox} from '../../../shared-react-components/form-utils/AlexCheckBox/AlexCheckBox.tsx'
import {TCustomDataTableColumn} from '../../../shared-react-components/alex-data-table/alex-data-table.component.tsx'
import {TUserAttributes} from '../../../core/apollo/types/graphql/graphql.ts'

export function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export const UsersTableColumns: TCustomDataTableColumn[] = [
    {
        id: 'id',
        label: 'ID',
        display: false,
    },
    {
        id: 'email',
        label: 'Почта',
    },
    {
        id: 'createdAt',
        label: 'Дата создания',
    },
    {
        id: 'numBoughts',
        label: 'Количеcтво покупок',
        format: () => getRandomInt(40),
        sort:false
    },
    {
        id: 'numBalls',
        label: 'Количеcтво бонусных баллов',
        format: () => getRandomInt(10000),
        sort:false
    },
    {
        id: 'numBallsBoughts',
        label: 'Оплачено баллами',
        format: () => getRandomInt(20000),
        sort:false
    },
    {
        id: 'numRubBoughts',
        label: 'Оплачено рублями',
        format: () => getRandomInt(40000),
        sort:false
    },
    {
        id: 'updatedAt',
        label: 'Дата последнего изменения',
        display: false,
    },
    {
        id: 'verified',
        label: 'Подтверждён',
        format: (value: TUserAttributes) => (
            <AlexCheckBox value={value.verified} checked={value.verified} size={30} disabled color={{
                outline: theme.palette.primary.dark,
                checked: theme.palette.primary.main,
            }}/>
        ),
        formatText: (value: TUserAttributes) => value.verified ? 'Да' : 'Нет',
    },
]

