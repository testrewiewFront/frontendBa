import { Create, SimpleForm, TextInput, FileInput, FileField, required } from 'react-admin';

const StatusCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="label" validate={required()} />
            <TextInput source="value" validate={required()} />
            <FileInput source="img" label="Image" accept={{ 'image/*': [] }} validate={required()}>
                <FileField source="src" title="title" />
            </FileInput>
        </SimpleForm>
    </Create>
);

export default StatusCreate;
