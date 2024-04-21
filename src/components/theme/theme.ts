import {createTheme} from "@mui/material";

// Augment the palette to include an ochre color
declare module '@mui/material/styles' {
    interface Palette {
        neutral: PaletteColorOptions;
    }

    interface PaletteOptions {
        neutral?: PaletteColorOptions;
    }

    interface PaletteColorOptions {
        main?: string
        light?: string,
        dark?: string
        contrastText?: string
        notContrastText?: string
    }
}

// Update the Button's color options to include an ochre option
declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        neutral: true;
    }
}

export const theme = createTheme({
    palette: {
        primary: {
            main: '#9c27b0',
            light: '#af52bf',
            dark: '#6d1b7b',
            contrastText: '#fff',
        },
        secondary: {
            main: '#3d5afe',
            light: '#637bfe',
            dark: '#2a3eb1',
            contrastText: '#fff',
        },
        neutral: {
            main: '#757575',
            light: '#9e9e9e',
            dark: '#616161',
            contrastText: '#FFFFFF',
            notContrastText: '#616161'
        }
    },
})

export const globalStyles = () => ({
    "&::-webkit-scrollbar": {
        width: 5,
        height: 5
    },
    "&::-webkit-scrollbar-track": {
        backgroundColor: null
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#b2b2b2",
        borderRadius: 2
    },
});