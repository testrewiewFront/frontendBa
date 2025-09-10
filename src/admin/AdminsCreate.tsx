import { Create, SimpleForm, TextInput, SelectInput, required, email } from 'react-admin';

const AdminsCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="email" validate={[required(), email()]} />
            <TextInput source="password" type="password" validate={required()} />
            <SelectInput 
                source="role" 
                choices={[
                    { id: 'admin', name: 'Admin' },
                    { id: 'superadmin', name: 'SuperAdmin' },
                ]}
                validate={required()}
                defaultValue="admin"
            />
        </SimpleForm>
    </Create>
);

export default AdminsCreate;
