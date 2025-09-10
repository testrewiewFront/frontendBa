import { Create, SimpleForm, TextInput, FileInput, FileField, required, useInput } from 'react-admin';
import { Box, Typography, TextField, Slider } from '@mui/material';
import { useState, useEffect } from 'react';

const ColorPickerInput = ({ source, label, validate }: { source: string; label: string; validate?: any }) => {
    const { field, fieldState } = useInput({ source, validate });
    
    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <input
                    type="color"
                    value={field.value || '#000000'}
                    onChange={(e) => field.onChange(e.target.value)}
                    style={{
                        width: '50px',
                        height: '40px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                />
                <TextField
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="#000000"
                    size="small"
                    sx={{ width: '120px' }}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                />
            </Box>
        </Box>
    );
};

const RGBAColorPickerInput = ({ source, label, validate }: { source: string; label: string; validate?: any }) => {
    const { field, fieldState } = useInput({ source, validate });
    const [color, setColor] = useState('#000000');
    const [alpha, setAlpha] = useState(1);

    useEffect(() => {
        if (field.value) {
            // Parse existing RGBA value
            const rgbaMatch = field.value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (rgbaMatch) {
                const [, r, g, b, a] = rgbaMatch;
                const hex = `#${[r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('')}`;
                setColor(hex);
                setAlpha(a ? parseFloat(a) : 1);
            }
        }
    }, [field.value]);

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const updateRGBA = (newColor: string, newAlpha: number) => {
        const rgb = hexToRgb(newColor);
        if (rgb) {
            const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${newAlpha})`;
            field.onChange(rgba);
        }
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setColor(newColor);
        updateRGBA(newColor, alpha);
    };

    const handleAlphaChange = (_: Event, newValue: number | number[]) => {
        const newAlpha = Array.isArray(newValue) ? newValue[0] : newValue;
        setAlpha(newAlpha);
        updateRGBA(color, newAlpha);
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                {label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <input
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                    style={{
                        width: '50px',
                        height: '40px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                />
                <TextField
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="rgba(0, 0, 0, 1)"
                    size="small"
                    sx={{ width: '180px' }}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 1 }}>
                <Typography variant="body2" sx={{ minWidth: '50px' }}>
                    Alpha:
                </Typography>
                <Slider
                    value={alpha}
                    onChange={handleAlphaChange}
                    min={0}
                    max={1}
                    step={0.01}
                    sx={{ width: '120px' }}
                />
                <Typography variant="body2" sx={{ minWidth: '40px' }}>
                    {alpha.toFixed(2)}
                </Typography>
            </Box>
        </Box>
    );
};

const CryptodetailsCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="label" validate={required()} />
            <TextInput source="network" validate={required()} />
            <TextInput source="address" validate={required()} />
            <ColorPickerInput source="color" label="Color" validate={required()} />
            <RGBAColorPickerInput source="bg" label="Background Color" validate={required()} />
            <FileInput source="image" label="Image" accept={{ 'image/*': [] }} validate={required()}>
                <FileField source="src" title="title" />
            </FileInput>
        </SimpleForm>
    </Create>
);

export default CryptodetailsCreate;
