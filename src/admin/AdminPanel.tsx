import { Admin, Resource } from 'react-admin';
import useOnlineStatus from '../hooks/useOnlineStatus';
import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, useMediaQuery, Box } from '@mui/material';
import PostsList from './PostsList';
import { UserEdit } from './PostsEdit';
import PostsCreate from './PostsCreate';
import AdminsList from './AdminsList';
import AdminsEdit from './AdminsEdit';
import AdminsCreate from './AdminsCreate';
import CryptodetailsList from './CryptodetailsList';
import CryptodetailsEdit from './CryptodetailsEdit';
import CryptodetailsCreate from './CryptodetailsCreate';
import StatusList from './StatusList';
import StatusEdit from './StatusEdit';
import StatusCreate from './StatusCreate';
import adminAuthProvider from './authProvider';
import CustomLoginPage from './CustomLoginPage';
import CustomLayout from './CustomLayout';
import Dashboard from './Dashboard';
import dataProvider from '../dataProvider';

const AdminPanel = () => {
    const [userRole, setUserRole] = useState<string | null>(null);
    const isMobile = useMediaQuery('(max-width:768px)');
    const isTablet = useMediaQuery('(max-width:1024px)');
    
    // Відстеження онлайн статусу
    useOnlineStatus();

    useEffect(() => {
        const role = localStorage.getItem('adminRole');
        console.log('🔍 AdminPanel role check:', role);
        setUserRole(role);
    }, []);

    console.log('🎯 Current userRole:', userRole);

    // Modern responsive theme configuration
    const responsiveTheme = createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: '#2563eb', // Modern blue
                light: '#3b82f6',
                dark: '#1d4ed8',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#7c3aed', // Modern purple
                light: '#8b5cf6',
                dark: '#6d28d9',
                contrastText: '#ffffff',
            },
            background: {
                default: '#f8fafc',
                paper: '#ffffff',
            },
            text: {
                primary: '#1e293b',
                secondary: '#64748b',
            },
            success: {
                main: '#10b981',
                light: '#34d399',
                dark: '#059669',
            },
            warning: {
                main: '#f59e0b',
                light: '#fbbf24',
                dark: '#d97706',
            },
            error: {
                main: '#ef4444',
                light: '#f87171',
                dark: '#dc2626',
            },
        },
        typography: {
            fontSize: isMobile ? 12 : 14,
            h1: { fontSize: isMobile ? '1.5rem' : '2rem' },
            h2: { fontSize: isMobile ? '1.3rem' : '1.75rem' },
            h3: { fontSize: isMobile ? '1.2rem' : '1.5rem' },
            h4: { fontSize: isMobile ? '1.1rem' : '1.25rem' },
            h5: { fontSize: isMobile ? '1rem' : '1.125rem' },
            h6: { fontSize: isMobile ? '0.9rem' : '1rem' },
        },
        components: {
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        width: isMobile ? '160px' : isTablet ? '180px' : '200px',
                        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                        borderRight: '1px solid #e2e8f0',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        '& .MuiListItem-root': {
                            margin: isMobile ? '2px 4px' : '4px 6px',
                            borderRadius: '6px',
                            '&:hover': {
                                backgroundColor: '#f1f5f9',
                            },
                            '&.Mui-selected': {
                                backgroundColor: '#e0e7ff',
                                '&:hover': {
                                    backgroundColor: '#ddd6fe',
                                },
                            },
                        },
                        '& .MuiListItemIcon-root': {
                            minWidth: isMobile ? '28px' : '32px',
                            color: '#64748b',
                            '& .MuiSvgIcon-root': {
                                fontSize: isMobile ? '1.2rem' : '1.4rem',
                            },
                        },
                        '& .MuiListItemText-primary': {
                            fontSize: isMobile ? '0.75rem' : '0.875rem',
                            fontWeight: 500,
                            color: '#334155',
                        },
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                       
                        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        '& .RaAppBar-title': {
                            fontSize: isMobile ? '1rem' : '1.25rem',
                            fontWeight: 600,
                            color: '#ffffff',
                        },
                        '& .MuiIconButton-root': {
                            color: '#ffffff',
                        },
                    },
                },
            },
            MuiTableContainer: {
                styleOverrides: {
                    root: {
                        overflowX: 'auto',
                        width: '100%',
                        maxWidth: '100%',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e2e8f0',
                        '& .MuiTable-root': {
                            minWidth: isMobile ? '300px' : isTablet ? '400px' : '500px',
                            width: '100%',
                            tableLayout: 'fixed',
                        },
                        '& .RaDatagrid-table': {
                            tableLayout: 'fixed',
                            width: '100%',
                        },
                        '& .RaDatagrid-headerCell': {
                            padding: isMobile ? '4px 6px' : isTablet ? '6px 8px' : '8px 12px',
                            fontSize: isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.75rem',
                            fontWeight: 6,
                            backgroundColor: '#f8fafc',
                            borderBottom: '2px solid #e2e8f0',
                            color: '#475569',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: isMobile ? '80px' : isTablet ? '100px' : '120px',
                        },
                        '& .RaDatagrid-cell': {
                            padding: isMobile ? '4px 6px' : isTablet ? '6px 8px' : '8px 12px',
                            fontSize: isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.75rem',
                            borderBottom: '1px solid #f1f5f9',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: isMobile ? '80px' : isTablet ? '100px' : '120px',
                            '&:hover': {
                                backgroundColor: '#f8fafc',
                            },
                        },
                        '& .RaDatagrid-row': {
                            '&:hover': {
                                backgroundColor: '#f8fafc',
                            },
                            '&:nth-of-type(even)': {
                                backgroundColor: '#fafbfc',
                            },
                        },
                        // Спеціальні стилі для кнопок дій
                        '& .RaDatagrid-cell:last-child': {
                            width: isMobile ? '60px' : '80px',
                            minWidth: isMobile ? '60px' : '80px',
                            maxWidth: isMobile ? '60px' : '80px',
                        },
                        // Адаптивні стилі для різних колонок
                        '& .column-id': {
                            width: isMobile ? '40px' : '60px',
                            minWidth: isMobile ? '40px' : '60px',
                        },
                        '& .column-email': {
                            width: isMobile ? '120px' : isTablet ? '100px' : '200px',
                            minWidth: isMobile ? '120px' : isTablet ? '150px' : '200px',
                        },
                        '& .column-name': {
                            width: isMobile ? '80px' : isTablet ? '100px' : '120px',
                            minWidth: isMobile ? '80px' : isTablet ? '100px' : '120px',
                        },
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        margin: isMobile ? '8px' : '16px',
                        padding: isMobile ? '16px' : '24px',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                        border: '1px solid rgb(226, 240, 227)',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            transform: 'translateY(-1px)',
                        },
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        padding: isMobile ? '8px 16px' : '10px 20px',
                        borderRadius: '8px',
                        fontWeight: 500,
                        textTransform: 'none',
                        boxShadow: 'none',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
                            transform: 'translateY(-1px)',
                        },
                    },
                    contained: {
                        background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                        },
                    },
                    outlined: {
                        borderColor: '#e2e8f0',
                        color: '#64748b',
                        '&:hover': {
                            borderColor: '#2563eb',
                            backgroundColor: '#f8fafc',
                            color: '#2563eb',
                        },
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            '& fieldset': {
                                borderColor: '#e2e8f0',
                            },
                            '&:hover fieldset': {
                                borderColor: '#cbd5e1',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#2563eb',
                                borderWidth: '2px',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: '#64748b',
                            '&.Mui-focused': {
                                color: '#2563eb',
                            },
                        },
                    },
                },
            },
        },
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 768,
                lg: 1024,
                xl: 1200,
            },
        },
    });

    // Додаємо глобальні стилі для кращого контролю
    const globalStyles = {
        '& .RaLayout-content': {
            padding: isMobile ? '8px !important' : isTablet ? '12px !important' : '16px !important',
            maxWidth: '100% !important',
            overflow: 'hidden !important',
        },
        '& .RaList-main': {
            maxWidth: '100% !important',
            overflow: 'hidden !important',
        },
        '& .MuiTableContainer-root': {
            maxWidth: `calc(100vw - ${isMobile ? '160px' : isTablet ? '180px' : '200px'}) !important`,
            width: '100% !important',
            overflow: 'auto !important',
            tableLayout: 'fixed !important',
            '& table': {
                width: '100% !important',
                tableLayout: 'fixed !important',
                minWidth: 'auto !important',
            },
        },
        '& .MuiTable-root': {
            width: '100% !important',
            tableLayout: 'fixed !important',
            minWidth: 'auto !important',
        },
        // Додаткові стилі для React Admin
        '& .RaDatagrid-root': {
            '& .RaDatagrid-table': {
                minWidth: 'auto !important',
            },
        },
        '& .RaList-content': {
            overflow: 'hidden !important',
        },
        // Приховуємо деякі колонки на мобільних
        ...(isMobile && {
            '& .column-lastName, & .column-account_id, & .column-created_at': {
                display: 'none !important',
            },
        }),
        // Приховуємо деякі колонки на планшетах
        ...(isTablet && !isMobile && {
            '& .column-created_at': {
                display: 'none !important',
            },
        }),
    };

    return (
        <ThemeProvider theme={responsiveTheme}>
            <CssBaseline />
            <Box >
                <Admin
                    basename="/admin"
                    loginPage={CustomLoginPage}
                    layout={CustomLayout}
                    dashboard={Dashboard}
                    dataProvider={dataProvider}
                    authProvider={adminAuthProvider}
                    theme={responsiveTheme}
                >
                {/* Клиенты - доступно для всех ролей */}
                <Resource name="users" options={{ label: "Клиенты" }} list={PostsList} edit={UserEdit} create={PostsCreate} />
                
                {/* Остальные ресурсы только для superadmin */}
                {userRole === 'superadmin' ? (
                    <>
                        <Resource name="admins" options={{ label: "Админы" }} list={AdminsList} edit={AdminsEdit} create={AdminsCreate} />
                        <Resource name="cryptodetails" options={{ label: "Криптовалюты" }} list={CryptodetailsList} edit={CryptodetailsEdit} create={CryptodetailsCreate} />
                        <Resource name="status" options={{ label: "Статусы" }} list={StatusList} edit={StatusEdit} create={StatusCreate} />
                    </>
                ) : userRole === 'admin' ? (
                    // Для admin роли ничего дополнительного не показываем
                    <></>
                ) : (
                    // Пока роль не загрузилась, показываем все ресурсы
                    <>
                        <Resource name="admins" options={{ label: "Админы" }} list={AdminsList} edit={AdminsEdit} create={AdminsCreate} />
                        <Resource name="cryptodetails" options={{ label: "Криптовалюты" }} list={CryptodetailsList} edit={CryptodetailsEdit} create={CryptodetailsCreate} />
                        <Resource name="status" options={{ label: "Статусы" }} list={StatusList} edit={StatusEdit} create={StatusCreate} />
                    </>
                )}
                </Admin>
            </Box>
        </ThemeProvider>
    );
};

export default AdminPanel;
