import React from 'react';
import { Box, Typography } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';


const NotFoundPage: React.FC = () => (
    <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        textAlign="center"
        bgcolor="#ffffff"
        borderRadius={2}
        p={4}
    >
        <ConstructionIcon color="warning" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
            Módulo en mantenimiento
        </Typography>
        <Typography variant="body1">
            Esta sección del sistema está temporalmente fuera de servicio por tareas de mantenimiento.<br />
            Por favor, inténtalo más tarde.
        </Typography>
    </Box>
);

export default NotFoundPage;