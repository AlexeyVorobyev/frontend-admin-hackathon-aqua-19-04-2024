import React from 'react'
import {Box, Paper, Typography} from "@mui/material";

const ReactChartNotData: React.FC = () => (
    <Paper
        style={{
            backgroundColor: 'rgb(236 236 243)',
            width: '100%',
            height: '100%',
            borderRadius: 5,
            padding: 10,
            boxSizing: 'border-box'
        }}
    >
        <Box style={{
            backgroundColor: '#ffffff',
            padding: 10,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box'
        }}>
            <Typography variant={'h4'} color={'#a29e9e'} justifyContent={'center'}>
                Нет данных
            </Typography>
        </Box>
    </Paper>
)

export default ReactChartNotData
