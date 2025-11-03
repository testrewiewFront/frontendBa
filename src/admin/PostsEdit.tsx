import { 
    Edit, SimpleForm, TextInput, NumberInput, ArrayInput, 
    SimpleFormIterator, DateInput, SelectInput, BooleanInput,
    required, minLength
  } from 'react-admin';
  import { Box, Typography, Collapse, IconButton, Card, Divider, Grid, useMediaQuery, useTheme } from '@mui/material';
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  import { useState, useEffect } from 'react';
  import axios from 'axios';
  
  export const UserEdit = (props: any) => {
    const [openBalance, setOpenBalance] = useState(false);
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
  
    const handleBalanceToggle = () => {
      setOpenBalance(!openBalance);
    };

    // Fetch status choices from backend
    useEffect(() => {
      const fetchStatusChoices = async () => {
        try {
          const response = await axios.get('https://api.international-payments.cc/api/status/public');
          setStatusChoices(response.data);
        } catch (error) {
          console.error('Error fetching status choices:', error);
          // Keep default choices if API fails
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
          
          // Add EUR and USD to the choices
          const allChoices = [
            ...cryptoChoices,
            { id: 'eur', name: 'EUR' },
            { id: 'usd', name: 'USD' }
          ];
          
          setPaymentSystemChoices(allChoices);
        } catch (error) {
          console.error('Error fetching payment system choices:', error);
          // Keep default choices if API fails
        }
      };

      fetchPaymentSystemChoices();
    }, []);
  
    return (
      <Edit {...props}>
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
              <TextInput source="email" fullWidth />
              <Box sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 1 : 2, 
                mt: 2 
              }}>
                <TextInput source="name" fullWidth />
                <TextInput source="lastName" fullWidth />
              </Box>
              <NumberInput source="account_id" fullWidth sx={{ mt: 2 }} />
              <BooleanInput source="blocked" label="Блокировка аккаунта" sx={{ mt: 2 }} />
              <TextInput 
                source="password" 
                fullWidth 
                validate={[required(), minLength(6)]} 
                sx={{ mt: 2 }}
              />
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
                    label="Платежная система"
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
                    label="Тип транзакции"
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
              mb: isMobile ? 2 : 3, 
              borderRadius: 2, 
              boxShadow: isMobile ? 2 : 3 
            }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  cursor: 'pointer',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? 1 : 0
                }} 
                onClick={handleBalanceToggle}
              >
                <Typography 
                  variant={isMobile ? "h6" : "h5"}
                  sx={{ 
                    fontWeight: 'bold', 
                    background: 'linear-gradient(45deg, #4CAF50, #8BC34A)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent',
                    fontSize: isMobile ? '1.1rem' : '1.5rem'
                  }}
                >
                  Баланс
                </Typography>
                <IconButton 
                  size={isMobile ? "medium" : "small"} 
                  sx={{ 
                    transition: '0.3s', 
                    transform: openBalance ? 'rotate(180deg)' : 'rotate(0)' 
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Box>
              <Divider sx={{ my: isMobile ? 1 : 2 }} />
              <Collapse in={openBalance}>
                <Grid container spacing={isMobile ? 2 : 3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <NumberInput source="balance.trc20" label="Баланс TRC20" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <NumberInput source="balance.btc" label="Баланс BTC" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <NumberInput source="balance.eth" label="Баланс ETH" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <NumberInput source="balance.usd" label="Баланс USD" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <NumberInput source="balance.eur" label="Баланс EUR" fullWidth />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <NumberInput source="balance.usdtd" sx={{fontWeight: 'bold'}} label="Баланс USDT" fullWidth />
                  </Grid>
                </Grid>
              </Collapse>
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
      </Edit>
    );
  };
  
