import { 
    Card, 
    CardContent, 
    Typography, 
    Grid, 
    Box, 
    useMediaQuery, 
    useTheme,
    LinearProgress,
    IconButton,
    Tooltip
} from '@mui/material';
import { 
    People as PeopleIcon,
    AdminPanelSettings as AdminIcon,
    CurrencyBitcoin as CryptoIcon,
    Assessment as StatsIcon,
    TrendingUp as TrendingUpIcon,
    Security as SecurityIcon,
    Refresh as RefreshIcon,
    ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useDataProvider, useRedirect } from 'react-admin';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: string;
    loading?: boolean;
}

const StatCard = ({ title, value, icon, color, trend, loading = false }: StatCardProps) => {

    return (
        <Card
            sx={{
                height: 'auto',
                backgroundColor: '#ffffff',
                border: '1px solid #f1f5f9',
                borderRadius: 1.5,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
                    borderColor: color,
                },
            }}
        >
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ color: color, fontSize: 16 }}>
                        {icon}
                    </Box>
                    {trend && (
                        <TrendingUpIcon sx={{ fontSize: 10, color: '#10b981' }} />
                    )}
                </Box>
                
                <Typography
                    variant="caption"
                    sx={{
                        color: '#64748b',
                        fontWeight: 500,
                        display: 'block',
                        fontSize: '0.7rem',
                        lineHeight: 1.2,
                        mb: 0.25,
                    }}
                >
                    {title}
                </Typography>
                
                {loading ? (
                    <LinearProgress sx={{ width: '100%', height: 3, mb: 0.25 }} />
                ) : (
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: '#1e293b',
                            fontSize: '1.25rem',
                            lineHeight: 1.2,
                            mb: trend ? 0.25 : 0,
                        }}
                    >
                        {value}
                    </Typography>
                )}
                
                {trend && (
                    <Typography
                        variant="caption"
                        sx={{ 
                            color: '#10b981', 
                            fontWeight: 500,
                            fontSize: '0.6rem',
                            lineHeight: 1,
                        }}
                    >
                        {trend}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

const Dashboard = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const dataProvider = useDataProvider();
    const redirect = useRedirect();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAdmins: 0,
        totalCrypto: 0,
        systemStatus: '0%'
    });

    useEffect(() => {
        const role = localStorage.getItem('adminRole');
        setUserRole(role);
        
        // Получение реальных данных
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Получаем количество пользователей
                const usersResponse = await dataProvider.getList('users', {
                    pagination: { page: 1, perPage: 1 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: {}
                });
                
                // Получаем количество онлайн админов
                const adminsResponse = await dataProvider.getList('users', {
                    pagination: { page: 1, perPage: 1 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: { role: 'admin', isOnline: true }
                });
                
                // Получаем количество криптовалют
                const cryptoResponse = await dataProvider.getList('cryptodetails', {
                    pagination: { page: 1, perPage: 1 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: {}
                });
                
                // Получаем статусы системы
                const statusResponse = await dataProvider.getList('status', {
                    pagination: { page: 1, perPage: 1 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: {}
                });
                
                setStats({
                    totalUsers: usersResponse.total || 0,
                    totalAdmins: adminsResponse.total || 0,
                    totalCrypto: cryptoResponse.total || 0,
                    systemStatus: (statusResponse.total || 0) > 0 ? '99.9%' : '0%'
                });
                
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                // Устанавливаем значения по умолчанию при ошибке
                setStats({
                    totalUsers: 0,
                    totalAdmins: 0,
                    totalCrypto: 0,
                    systemStatus: 'Ошибка'
                });
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [dataProvider]);

    const handleRefresh = () => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const [usersResponse, adminsResponse, cryptoResponse, statusResponse] = await Promise.all([
                    dataProvider.getList('users', {
                        pagination: { page: 1, perPage: 1 },
                        sort: { field: 'id', order: 'ASC' },
                        filter: {}
                    }),
                    dataProvider.getList('users', {
                        pagination: { page: 1, perPage: 1 },
                        sort: { field: 'id', order: 'ASC' },
                        filter: { role: 'admin', isOnline: true }
                    }),
                    dataProvider.getList('cryptodetails', {
                        pagination: { page: 1, perPage: 1 },
                        sort: { field: 'id', order: 'ASC' },
                        filter: {}
                    }),
                    dataProvider.getList('status', {
                        pagination: { page: 1, perPage: 1 },
                        sort: { field: 'id', order: 'ASC' },
                        filter: {}
                    })
                ]);
                
                setStats({
                    totalUsers: usersResponse.total || 0,
                    totalAdmins: adminsResponse.total || 0,
                    totalCrypto: cryptoResponse.total || 0,
                    systemStatus: (statusResponse.total || 0) > 0 ? '99.9%' : '0%'
                });
                
            } catch (error) {
                console.error('Ошибка обновления данных:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    };

    const statsArray = [
        {
            title: 'Всего пользователей',
            value: loading ? '...' : stats.totalUsers.toLocaleString(),
            icon: <PeopleIcon />,
            color: '#3b82f6', // Более яркий синий
            trend: stats.totalUsers > 0 ? `${stats.totalUsers} активных` : 'Нет данных',
        },
        {
            title: 'Админы онлайн',
            value: loading ? '...' : stats.totalAdmins.toString(),
            icon: <AdminIcon />,
            color: '#8b5cf6', // Более яркий фиолетовый
            trend: stats.totalAdmins > 0 ? `${stats.totalAdmins} активных сейчас` : 'Нет онлайн',
        },
        {
            title: 'Криптовалюты',
            value: loading ? '...' : stats.totalCrypto.toString(),
            icon: <CryptoIcon />,
            color: '#06d6a0', // Более яркий зеленый
            trend: stats.totalCrypto > 0 ? `${stats.totalCrypto} доступно` : 'Нет данных',
        },
        {
            title: 'Системный статус',
            value: loading ? '...' : stats.systemStatus,
            icon: <SecurityIcon />,
            color: '#f59e0b', // Оставляем оранжевый
            trend: stats.systemStatus === '99.9%' ? 'Стабильно' : 'Требует внимания',
        },
    ];

    return (
        <Box sx={{ p: isMobile ? 2 : 3 }}>
            {/* Заголовок */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography
                        variant={isMobile ? "h5" : "h4"}
                        sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            mb: 1,
                            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Панель управления
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', fontSize: isMobile ? '0.875rem' : '1rem' }}
                    >
                        Добро пожаловать в административную панель! Роль: {userRole || 'Загрузка...'}
                    </Typography>
                </Box>
                <Tooltip title="Обновить данные">
                    <IconButton 
                        onClick={handleRefresh}
                        disabled={loading}
                        sx={{ 
                            bgcolor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            '&:hover': {
                                bgcolor: '#f1f5f9',
                                borderColor: '#2563eb',
                            }
                        }}
                    >
                        <RefreshIcon sx={{ color: loading ? '#94a3b8' : '#2563eb' }} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Статистические карточки */}
            <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                {statsArray.map((stat, index) => (
                    <Grid item xs={12} sm={6} lg={3} key={index}>
                        <StatCard
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            color={stat.color}
                            trend={stat.trend}
                            loading={loading}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Быстрые действия */}
            <Card
                sx={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #f1f5f9',
                    borderRadius: 2,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
            >
                <CardContent sx={{ p: 2 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            color: '#1e293b',
                            mb: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            fontSize: '1rem',
                        }}
                    >
                        <StatsIcon sx={{ color: '#3b82f6', fontSize: 18 }} />
                        Быстрые действия
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Box
                                onClick={() => redirect('/admin/users')}
                                sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    border: '1px solid #e2e8f0',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: '#f8fafc',
                                        borderColor: '#2563eb',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                                    },
                                }}
                            >
                                <PeopleIcon sx={{ fontSize: 24, color: '#2563eb', mb: 0.5 }} />
                                <Typography variant="body2" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                    Управление пользователями
                                    <ArrowForwardIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                                </Typography>
                            </Box>
                        </Grid>
                        {userRole === 'superadmin' && (
                            <>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box
                                        onClick={() => redirect('/admin/admins')}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            border: '1px solid #e2e8f0',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                backgroundColor: '#f8fafc',
                                                borderColor: '#7c3aed',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)',
                                            },
                                        }}
                                    >
                                        <AdminIcon sx={{ fontSize: 24, color: '#7c3aed', mb: 0.5 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                            Администраторы
                                            <ArrowForwardIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box
                                        onClick={() => redirect('/admin/cryptodetails')}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            border: '1px solid #e2e8f0',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                backgroundColor: '#f8fafc',
                                                borderColor: '#10b981',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
                                            },
                                        }}
                                    >
                                        <CryptoIcon sx={{ fontSize: 24, color: '#10b981', mb: 0.5 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                            Криптовалюты
                                            <ArrowForwardIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Box
                                        onClick={() => redirect('/admin/status')}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            border: '1px solid #e2e8f0',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                backgroundColor: '#f8fafc',
                                                borderColor: '#f59e0b',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)',
                                            },
                                        }}
                                    >
                                        <SecurityIcon sx={{ fontSize: 24, color: '#f59e0b', mb: 0.5 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                            Статусы системы
                                            <ArrowForwardIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                                        </Typography>
                                    </Box>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Dashboard;
