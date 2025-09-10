import { Create, SimpleForm, TextInput, PasswordInput, SelectInput, ArrayInput, SimpleFormIterator, DateInput, NumberInput } from "react-admin";
import { useGetIdentity } from "react-admin";
import { Box, Typography, Card, Grid } from '@mui/material';
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
                const response = await axios.get('http://localhost:5000/api/status/public');
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
                const response = await axios.get('http://localhost:5000/api/cryptodetails/public');
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
        <Create transform={(data) => ({
            ...data,
            created_at: new Date().toISOString()
        })}>
            <SimpleForm>
                <Box sx={{ width: '100%', px: 2 }}>
                    <Card sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
                        <Typography 
                            variant="h5" 
                            sx={{ mb: 2, fontWeight: 'bold', background: 'linear-gradient(45deg, #2196F3, #21CBF3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                        >
                            Дані користувача
                        </Typography>
                        <TextInput source="email" required validate={emailValidation} fullWidth />
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
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

                    <Card sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
                        <Typography 
                            variant="h5" 
                            sx={{ mb: 2, fontWeight: 'bold', background: 'linear-gradient(45deg, #FF9800, #FF5722)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                        >
                            Транзакції
                        </Typography>
                        <ArrayInput label="" source="transactions">
                            <SimpleFormIterator>
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
                                        { id: 'deposit', name: 'Deposit (Поповнення)' },
                                        { id: 'withdrawal', name: 'Withdrawal (Зняття)' }
                                    ]}
                                    defaultValue="deposit"
                                    fullWidth
                                />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </Card>

                    <Card sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                        <Typography 
                            variant="h5" 
                            sx={{ mb: 2, fontWeight: 'bold', background: 'linear-gradient(45deg, #9C27B0, #E91E63)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                        >
                            Деталі EUR
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextInput source="detailsEUR.label" label="Label" fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextInput source="detailsEUR.nuberDetails" label="Number Details" fullWidth />
                            </Grid>
                            <Grid item xs={12}>
                                <TextInput source="detailsEUR.description" label="Description" fullWidth multiline rows={3} />
                            </Grid>
                        </Grid>
                    </Card>
                </Box>
            </SimpleForm>
        </Create>
    );
};

export default PostsCreate;
