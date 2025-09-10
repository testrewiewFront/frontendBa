import { List, Datagrid, TextField, EmailField, EditButton, DeleteButton, DateField, SearchInput, SelectInput, FilterButton, TopToolbar, CreateButton } from 'react-admin';
import { Button } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';

const adminFilters = [
    <SearchInput source="email" placeholder="Search by email (first letters)" alwaysOn />,
    <SelectInput source="role" label="Role" choices={[
        { id: 'admin', name: 'Admin' },
        { id: 'superadmin', name: 'Super Admin' },
    ]} alwaysOn />,
];

const AdminListActions = () => (
    <TopToolbar>
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
            size="small"
            sx={{ ml: 1 }}
        >
            Clear Filters
        </Button>
    </TopToolbar>
);

const AdminsList = () => (
    <List filters={adminFilters} actions={<AdminListActions />}>
        <Datagrid>
            <EmailField source="email" />
            <TextField source="role" />
            <DateField source="createdAt" label="Created" showTime />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export default AdminsList;
