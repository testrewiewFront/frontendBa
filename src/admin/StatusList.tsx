import { List, Datagrid, TextField, EditButton, DeleteButton, ImageField } from 'react-admin';

const StatusList = () => (
    <List>
        <Datagrid>
            <TextField source="label" />
            <TextField source="value" />
            <ImageField source="img" title="Icon" sx={{ 
                '& img': { 
                    width: 12, 
                    height: 12, 
                    backgroundColor: '#e0e0e0',
                    border: '1px solid #bdbdbd',
                    borderRadius: '2px',
                    padding: '1px'
                } 
            }} />
           
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export default StatusList;
