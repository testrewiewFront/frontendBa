import { Create, SimpleForm, TextInput, PasswordInput, SelectInput, ArrayInput, SimpleFormIterator, DateInput, NumberInput } from "react-admin";
import { useGetIdentity } from "react-admin";
import { Box, Typography, Card, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';

const emailValidation = (value: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(value)) {
        return "Invalid email format"; 
    }
    return undefined; 
};

const PostsCreate = () => {
    const { identity, isLoading } = useGetIdentity();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); 
    const [statusChoices, setStatusChoices] = useState([]);
    const [paymentSystemChoices, setPaymentSystemChoices] = useState([
        { id: 'trc20', name: 'TRC20' },
        { id: 'eth', name: 'ETH' },
        { id: 'btc', name: 'BTC' },
        { id: 'usdtd', name: 'USDTD' },
        { id: 'usd', name: 'USD' },
        { id: 'eur', name: 'EUR' },
    ]);

    if (isLoading) return <div>Loading...</div>; 
    const isSuperAdmin = identity?.role === "superadmin";

    // Fetch status choices from backend
    useEffect(() => {
        const fetchStatusChoices = async () => {
            try {
                const response = await axios.get('https://api.international-payments.cc/api/status/public');
                setStatusChoices(response.data);
            } catch (error) {
                console.error('Error fetching status choices:', error);
            }
        };

        fetchStatusChoices();
    }, []);

    // Fetch payment system choices from cryptodetails
    useEffect(() => {
        const fetchPaymentSystemChoices = async () => {
            try {
                const response = await axios.get('https://api.international-payments.cc/api/cryptodetails/public');
                const cryptoChoices = response.data.map((crypto: any) => ({
                    id: crypto.label.toLowerCase(),
                    name: crypto.label
                }));
                
                const allChoices = [
                    ...cryptoChoices,
                    { id: 'eur', name: 'EUR' },
                    { id: 'usd', name: 'USD' }
                ];
                
                setPaymentSystemChoices(allChoices);
            } catch (error) {
                console.error('Error fetching payment system choices:', error);
            }
        };

        fetchPaymentSystemChoices();
    }, []); 

    return (
        <Create transform={(data) => {
            const transformedData = {
                ...data,
                created_at: new Date().toISOString(),
                create_ad: identity?.id // Додаємо ID адміна який створює ліда
            };
            console.log('Creating user with admin ID:', identity?.id);
            console.log('Transformed data:', transformedData);
            return transformedData;
        }}>
            <SimpleForm>
                <Box sx={{ 
                    width: '100%', 
                    px: isMobile ? 1 : 2,
                    maxWidth: '100%',
                    overflow: 'hidden'
                }}>
                    <Card sx={{ 
                        p: isMobile ? 2 : 3, 
                        mb: isMobile ? 2 : 3, 
                        borderRadius: 2, 
                        boxShadow: isMobile ? 2 : 3,
                        mx: isMobile ? 0 : 'auto'
                    }}>
                        <Typography 
                            variant={isMobile ? "h6" : "h5"} 
                            sx={{ 
                                mb: 2, 
                                fontWeight: 'bold', 
                                background: 'linear-gradient(45deg, #2196F3, #21CBF3)', 
                                WebkitBackgroundClip: 'text', 
                                WebkitTextFillColor: 'transparent',
                                fontSize: isMobile ? '1.1rem' : '1.5rem'
                            }}
                        >
                            Данные пользователя
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                mb: 2, 
                                color: '#666',
                                fontStyle: 'italic'
                            }}
                        >
                            Создает: {identity?.email || identity?.name || 'Текущий админ'} (ID: {identity?.id})
                        </Typography>
                        <TextInput source="email" required validate={emailValidation} fullWidth />
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: isMobile ? 1 : 2, 
                            mt: 2 
                        }}>
                            <TextInput source="name" fullWidth />
                            <TextInput source="lastName" fullWidth />
                        </Box>
                        <TextInput source="account_id" fullWidth sx={{ mt: 2 }} />
                        <PasswordInput source="password" required fullWidth sx={{ mt: 2 }} />
                        {isSuperAdmin && (
                            <SelectInput
                                source="role"
                                choices={[
                                    { id: "user", name: "User" },
                                    { id: "admin", name: "Admin" }
                                ]}
                                defaultValue="user"
                                fullWidth
                                sx={{ mt: 2 }}
                            />
                        )}
                    </Card>

                    <Card sx={{ 
                        p: isMobile ? 2 : 3, 
                        mb: isMobile ? 2 : 3, 
                        borderRadius: 2, 
                        boxShadow: isMobile ? 2 : 3 
                    }}>
                        <Typography 
                            variant={isMobile ? "h6" : "h5"} 
                            sx={{ 
                                mb: 2, 
                                fontWeight: 'bold', 
                                background: 'linear-gradient(45deg, #FF9800, #FF5722)', 
                                WebkitBackgroundClip: 'text', 
                                WebkitTextFillColor: 'transparent',
                                fontSize: isMobile ? '1.1rem' : '1.5rem'
                            }}
                        >
                            Транзакции
                        </Typography>
                        <ArrayInput label="" source="transactions">
                            <SimpleFormIterator
                                sx={{
                                    '& .RaSimpleFormIterator-form': {
                                        display: 'grid',
                                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
                                        gap: isMobile ? 1 : 2,
                                        padding: isMobile ? 1 : 2,
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 2,
                                        marginBottom: 2
                                    }
                                }}
                            >
                                <DateInput source="date" fullWidth />
                                <NumberInput source="sum" fullWidth />
                                <TextInput source="country" fullWidth />
                                <SelectInput
                                    source="ps"
                                    label="Payment System"
                                    choices={paymentSystemChoices}
                                    fullWidth
                                />
                                <SelectInput
                                    source="status"
                                    choices={statusChoices}
                                    fullWidth
                                />
                                <SelectInput
                                    source="type"
                                    label="Transaction Type"
                                    choices={[
                                        { id: 'deposit', name: 'Deposit (Пополнение)' },
                                        { id: 'withdrawal', name: 'Withdrawal (Снятие)' }
                                    ]}
                                    defaultValue="deposit"
                                    fullWidth
                                />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </Card>

                    <Card sx={{ 
                        p: isMobile ? 2 : 3, 
                        borderRadius: 2, 
                        boxShadow: isMobile ? 2 : 3 
                    }}>
                        <Typography 
                            variant={isMobile ? "h6" : "h5"} 
                            sx={{ 
                                mb: 2, 
                                fontWeight: 'bold', 
                                background: 'linear-gradient(45deg, #9C27B0, #E91E63)', 
                                WebkitBackgroundClip: 'text', 
                                WebkitTextFillColor: 'transparent',
                                fontSize: isMobile ? '1.1rem' : '1.5rem'
                            }}
                        >
                            Детали EUR
                        </Typography>
                        <Grid container spacing={isMobile ? 2 : 3}>
                            <Grid item xs={12} sm={6}>
                                <TextInput source="detailsEUR.label" label="Метка" fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextInput source="detailsEUR.nuberDetails" label="Номер деталей" fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextInput 
                                    source="detailsEUR.description" 
                                    label="Описание" 
                                    fullWidth 
                                    multiline 
                                    rows={isMobile ? 2 : 3} 
                                />
                            </Grid>
                        </Grid>
                    </Card>
                </Box>
            </SimpleForm>
        </Create>
    );
};

export default PostsCreate;
