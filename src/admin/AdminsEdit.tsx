import { Edit, SimpleForm, TextInput, SelectInput, required, email } from 'react-admin';

const AdminsEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="email" validate={[required(), email()]} />
            <TextInput source="password" type="password" />
            <SelectInput 
                source="role" 
                choices={[
                    { id: 'admin', name: 'Admin' },
                    { id: 'superadmin', name: 'SuperAdmin' },
                ]}
                validate={required()}
            />
        </SimpleForm>
    </Edit>
);

export default AdminsEdit;
