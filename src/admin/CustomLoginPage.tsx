import { useLogin, useNotify } from 'react-admin';
import { TextField, Button, Box, Card, CardContent, Typography, useMediaQuery, useTheme, Container } from '@mui/material';
import { useState } from 'react';
import { Login as LoginIcon } from '@mui/icons-material';

const CustomLoginPage = () => {
    const login = useLogin();
    const notify = useNotify();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const handleSubmit = (e: any) => {
        e.preventDefault();
        login({ email, password }).catch(() =>
            notify('Invalid email or password', { type: 'error' })
        );
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                padding: isMobile ? 2 : 3
            }}>
                <Card sx={{ 
                    width: '100%',
                    maxWidth: isMobile ? '100%' : isTablet ? 400 : 450,
                    padding: isMobile ? 1 : 2,
                    boxShadow: isMobile ? 2 : 4,
                    borderRadius: isMobile ? 2 : 3
                }}>
                    <CardContent sx={{ 
                        padding: isMobile ? '16px' : '24px',
                        '&:last-child': { 
                            paddingBottom: isMobile ? '16px' : '24px' 
                        }
                    }}>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            mb: 3
                        }}>
                            <LoginIcon sx={{ 
                                fontSize: isMobile ? 40 : 48, 
                                color: 'primary.main',
                                mb: 2
                            }} />
                            <Typography 
                                variant={isMobile ? "h6" : "h5"} 
                                align="center" 
                                gutterBottom
                                sx={{ 
                                    fontWeight: 'bold',
                                    color: 'primary.main'
                                }}
                            >
                                Admin Login
                            </Typography>
                            <Typography 
                                variant="body2" 
                                align="center" 
                                color="textSecondary"
                                sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
                            >
                                Sign in to access admin panel
                            </Typography>
                        </Box>
                        
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="normal"
                                size={isMobile ? "small" : "medium"}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        fontSize: isMobile ? '0.875rem' : '1rem'
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: isMobile ? '0.875rem' : '1rem'
                                    }
                                }}
                            />
                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                size={isMobile ? "small" : "medium"}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        fontSize: isMobile ? '0.875rem' : '1rem'
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: isMobile ? '0.875rem' : '1rem'
                                    }
                                }}
                            />
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary" 
                                fullWidth
                                size={isMobile ? "medium" : "large"}
                                sx={{ 
                                    mt: 3,
                                    mb: 2,
                                    height: isMobile ? 44 : 48,
                                    fontSize: isMobile ? '0.875rem' : '1rem',
                                    fontWeight: 'bold',
                                    borderRadius: 2
                                }}
                            >
                                Login
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default CustomLoginPage;
