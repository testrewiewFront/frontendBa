import { List, Datagrid, TextField, EditButton, DeleteButton, ImageField } from 'react-admin';

const CryptodetailsList = () => (
    <List>
        <Datagrid>
            <TextField source="label" />
            <TextField source="network" />
            <ImageField source="image" title="Icon" sx={{ 
                '& img': { 
                    width: 14, 
                    height: 14, 
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
    </List>
);

export default CryptodetailsList;
