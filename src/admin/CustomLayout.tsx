import { Layout, LayoutProps } from 'react-admin';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface CustomLayoutProps extends LayoutProps {
    children: ReactNode;
}

const CustomLayout = (props: CustomLayoutProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Layout {...props}>
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: '#f8fafc',
                    '& .RaLayout-content': {
                        padding: isMobile ? '8px' : '16px',
                        maxWidth: '100%',
                        margin: '0 auto',
                        background: 'transparent',
                        overflow: 'hidden',
                    },
                    '& .RaLayout-contentWithSidebar': {
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100vh',
                    },
                    // Покращення для мобільних пристроїв
                    [theme.breakpoints.down('md')]: {
                        '& .RaLayout-content': {
                            padding: '12px',
                        },
                    },
                    // Анімації для переходів
                    '& .RaLayout-main': {
                        transition: 'margin-left 0.3s ease-in-out',
                        overflow: 'hidden',
                        maxWidth: '100%',
                    },
                    // Контроль над таблицями
                    '& .RaList-main': {
                        overflow: 'hidden',
                        maxWidth: '100%',
                    },
                    '& .MuiTableContainer-root': {
                        maxWidth: '100%',
                        overflow: 'auto',
                    },
                }}
            >
                {props.children}
            </Box>
        </Layout>
    );
};

export default CustomLayout;
