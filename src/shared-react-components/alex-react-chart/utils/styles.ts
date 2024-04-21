import {makeStyles} from '@mui/styles'

export const useStylesButton = makeStyles(() => ({
    button: {
        padding: 0,
        border: `1px solid ${'#333333'}`,
        borderRadius: 4,
        backgroundColor: 'white',
        width: 32,
        height: 32,
        '&:hover': {
            backgroundColor: 'white',
            border: `1px solid ${'#333333'}`,
        },
    },
}))