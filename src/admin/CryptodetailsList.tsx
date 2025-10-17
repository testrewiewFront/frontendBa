import { List, Datagrid, TextField, EditButton, DeleteButton, ImageField, SimpleList } from 'react-admin';
import { useMediaQuery, useTheme, Box, Chip, Stack, Avatar } from '@mui/material';
import { CurrencyBitcoin } from '@mui/icons-material';

const ResponsiveDatagrid = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (isMobile) {
        return (
            <SimpleList
                primaryText={(record: any) => record.label}
                secondaryText={(record: any) => (
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5, alignItems: 'center' }}>
                        <Chip 
                            label={record.network} 
                            size="small" 
                            color="primary"
                            variant="outlined"
                        />
                        {record.color && (
                            <Box
                                sx={{
                                    width: 16,
                                    height: 16,
                                    backgroundColor: record.color,
                                    borderRadius: '50%',
                                    border: '1px solid #ccc'
                                }}
                            />
                        )}
                    </Stack>
                )}
                leftAvatar={(record: any) => 
                    record.image ? (
                        <Avatar 
                            src={record.image} 
                            sx={{ width: 32, height: 32 }}
                        />
                    ) : (
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                            <CurrencyBitcoin />
                        </Avatar>
                    )
                }
                linkType="edit"
                sx={{
                    '& .MuiListItem-root': {
                        borderBottom: '1px solid #e0e0e0',
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                        },
                    },
                    '& .MuiListItemText-primary': {
                        fontWeight: 'bold',
                        fontSize: '1rem',
                    },
                }}
            />
        );
    }

    return (
        <Datagrid
            sx={{
                '& .RaDatagrid-headerCell': {
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    fontWeight: 'bold',
                    padding: isMobile ? '8px 4px' : '16px 8px'
                },
                '& .RaDatagrid-cell': {
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    padding: isMobile ? '8px 4px' : '16px 8px'
                },
            }}
        >
            <TextField source="label" />
            <TextField source="network" />
            <ImageField source="image" title="Icon" sx={{ 
                '& img': { 
                    width: isMobile ? 12 : 14, 
                    height: isMobile ? 12 : 14, 
                    backgroundColor: '#e0e0e0',
                    border: '1px solid #bdbdbd',
                    borderRadius: '2px',
                    padding: '1px',
                    objectFit: 'contain'
                } 
            }} />
            <TextField source="color" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    );
};

const CryptodetailsList = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <List
            sx={{
                '& .RaList-main': {
                    padding: isMobile ? '8px' : '16px',
                },
            }}
        >
            <ResponsiveDatagrid />
        </List>
    );
};

export default CryptodetailsList;
