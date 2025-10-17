import { List, Datagrid, TextField, EmailField, EditButton, DeleteButton, DateField, SearchInput, SelectInput, FilterButton, TopToolbar, CreateButton, SimpleList } from 'react-admin';
import { Button, Box, useMediaQuery, useTheme, Chip, Stack } from '@mui/material';
import { Clear as ClearIcon, Person, AdminPanelSettings } from '@mui/icons-material';

const adminFilters = [
    <SearchInput source="email" placeholder="Search by email (first letters)" alwaysOn />,
    <SelectInput source="role" label="Role" choices={[
        { id: 'admin', name: 'Admin' },
        { id: 'superadmin', name: 'Super Admin' },
    ]} alwaysOn />,
];

const AdminListActions = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <TopToolbar sx={{ 
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 1 : 0,
            alignItems: isMobile ? 'stretch' : 'center'
        }}>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                gap: 1,
                width: isMobile ? '100%' : 'auto'
            }}>
                <FilterButton />
                <CreateButton />
                <Button
                    onClick={() => {
                        const url = new URL(window.location.href);
                        url.searchParams.delete('filter');
                        window.history.pushState({}, '', url.toString());
                        window.location.reload();
                    }}
                    startIcon={<ClearIcon />}
                    variant="outlined"
                    size={isMobile ? "medium" : "small"}
                    sx={{ 
                        ml: isMobile ? 0 : 1,
                        fontSize: isMobile ? '0.875rem' : '0.75rem'
                    }}
                >
                    Clear Filters
                </Button>
            </Box>
        </TopToolbar>
    );
};

const ResponsiveDatagrid = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (isMobile) {
        return (
            <SimpleList
                primaryText={(record: any) => record.email}
                secondaryText={(record: any) => (
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                        <Chip 
                            icon={record.role === 'superadmin' ? <AdminPanelSettings /> : <Person />} 
                            label={record.role === 'superadmin' ? 'Super Admin' : 'Admin'} 
                            size="small" 
                            color={record.role === 'superadmin' ? 'primary' : 'secondary'}
                        />
                    </Stack>
                )}
                tertiaryText={(record: any) => 
                    new Date(record.createdAt).toLocaleDateString()
                }
                leftAvatar={() => <AdminPanelSettings />}
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
                    '& .MuiListItemText-secondary': {
                        fontSize: '0.875rem',
                    },
                }}
            />
        );
    }

    return (
        <Datagrid
            sx={{
                '& .RaDatagrid-headerCell': {
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                },
                '& .RaDatagrid-cell': {
                    fontSize: '0.875rem',
                },
            }}
        >
            <EmailField source="email" />
            <TextField source="role" />
            <DateField source="createdAt" label="Created" showTime />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    );
};

const AdminsList = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <List 
            filters={adminFilters} 
            actions={<AdminListActions />}
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

export default AdminsList;
