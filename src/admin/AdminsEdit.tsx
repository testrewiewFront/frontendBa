import { Edit, SimpleForm, TextInput, SelectInput, required, email } from 'react-admin';
import { Box, useMediaQuery, useTheme } from '@mui/material';

const AdminsEdit = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Edit>
            <SimpleForm>
                <Box sx={{ 
                    width: '100%', 
                    maxWidth: isMobile ? '100%' : '600px',
                    mx: 'auto',
                    p: isMobile ? 1 : 2
                }}>
                    <TextInput 
                        source="email" 
                        validate={[required(), email()]} 
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextInput 
                        source="password" 
                        type="password" 
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <SelectInput 
                        source="role" 
                        choices={[
                            { id: 'admin', name: 'Admin' },
                            { id: 'superadmin', name: 'SuperAdmin' },
                        ]}
                        validate={required()}
                        fullWidth
                    />
                </Box>
            </SimpleForm>
        </Edit>
    );
};

export default AdminsEdit;
