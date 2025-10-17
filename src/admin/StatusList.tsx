import { List, Datagrid, TextField, EditButton, DeleteButton, ImageField, SimpleList } from 'react-admin';
import { useMediaQuery, useTheme, Chip, Stack, Avatar } from '@mui/material';
import { Label } from '@mui/icons-material';

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
                            label={record.value} 
                            size="small" 
                            color="secondary"
                            variant="outlined"
                        />
                    </Stack>
                )}
                leftAvatar={(record: any) => 
                    record.img ? (
                        <Avatar 
                            src={record.img} 
                            sx={{ width: 32, height: 32 }}
                        />
                    ) : (
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                            <Label />
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
            <TextField source="value" />
            <ImageField source="img" title="Icon" sx={{ 
                '& img': { 
                    width: isMobile ? 10 : 12, 
                    height: isMobile ? 10 : 12, 
                    backgroundColor: '#e0e0e0',
                    border: '1px solid #bdbdbd',
                    borderRadius: '2px',
                    padding: '1px'
                } 
            }} />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    );
};

const StatusList = () => {
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

export default StatusList;
