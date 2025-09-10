import { Edit, SimpleForm, TextInput, FileInput, FileField, ImageField, required, useRecordContext } from 'react-admin';
import { Box, Button, Typography } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useState } from 'react';

const ImageWithDeleteButton = () => {
    const record = useRecordContext();
    const [imageDeleted, setImageDeleted] = useState(false);

    const handleDeleteImage = () => {
        setImageDeleted(true);
        // This will be handled by the update operation
    };

    if (!record?.img || imageDeleted) {
        return <Typography variant="body2" color="textSecondary">No image</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <ImageField 
                source="img" 
                title="Current Image" 
                sx={{ 
                    '& img': { 
                        maxWidth: 100, 
                        maxHeight: 100, 
                        backgroundColor: '#e0e0e0',
                        border: '1px solid #bdbdbd',
                        borderRadius: '4px',
                        padding: '4px'
                    } 
                }} 
            />
            <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleDeleteImage}
                sx={{ 
                    ml: 1, 
                    minWidth: 'auto', 
                    width: 24, 
                    height: 24, 
                    p: 0,
                    '& .MuiSvgIcon-root': {
                        fontSize: '16px'
                    }
                }}
            >
                <DeleteIcon />
            </Button>
        </Box>
    );
};

const StatusEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="label" validate={required()} />
            <TextInput source="value" validate={required()} />
            <ImageWithDeleteButton />
            <FileInput 
                source="img" 
                label="Update Image" 
                accept={{ 'image/*': [] }} 
                multiple={false}
                sx={{
                    '& .RaFileInputPreview-removeButton': {
                        display: 'none'
                    }
                }}
            >
                <FileField source="src" title="title" />
            </FileInput>
        </SimpleForm>
    </Edit>
);

export default StatusEdit;
