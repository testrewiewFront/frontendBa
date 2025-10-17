import { useGetIdentity, List, Datagrid, TextField, BooleanField, EditButton, DeleteButton, Filter, SearchInput, SimpleList, FunctionField } from "react-admin";
import { Box, useMediaQuery, useTheme, Chip, Stack, Typography } from "@mui/material";
import { Person, Badge, Block, AccountBox } from "@mui/icons-material";

// Функція для форматування дати у формат dd.mm.yyyy
const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}.${month}.${year}`;
    } catch (error) {
        return '-';
    }
};

const ClientsFilter = (props: any) => {
    return (
        <Filter {...props}>
            <SearchInput
                source="q"
                placeholder="Пошук по імені та прізвищу"
                alwaysOn
                sx={{marginLeft: '16px'}}
            />
            <SearchInput
                source="email"
                placeholder="Пошук по email"
                alwaysOn
            />
        </Filter>
    );
};

const CustomDatagrid = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

    if (isMobile) {
        return (
            <SimpleList
                primaryText={(record: any) => `${record.name} ${record.lastName}`}
                secondaryText={(record: any) => record.email}
                tertiaryText={(record: any) => (
                    <Stack direction="column" spacing={1} sx={{ mt: 1 }}>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip 
                                icon={<Badge />} 
                                label={record.role} 
                                size="small" 
                                color="primary"
                            />
                            {record.blocked && (
                                <Chip 
                                    icon={<Block />} 
                                    label="Blocked" 
                                    size="small" 
                                    color="error"
                                />
                            )}
                            <Chip 
                                icon={<AccountBox />} 
                                label={`ID: ${record.account_id}`} 
                                size="small" 
                                variant="outlined"
                            />
                        </Stack>
                        {record.lastLogin && (
                            <Typography variant="caption" color="text.secondary">
                                Останній вхід: {formatDate(record.lastLogin)}
                            </Typography>
                        )}
                    </Stack>
                )}
                leftAvatar={() => <Person />}
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
                        color: '#666',
                        fontSize: '0.875rem',
                    },
                }}
            />
        );
    }

    return (
        <Datagrid
            rowClick="edit"
            // bulkActionButtons={false} // Розкоментуйте щоб приховати чекбокси
            sx={{
                width: '100%',
                maxWidth: '100%',
                tableLayout: 'fixed',
                minWidth: 'auto',
                '& table': {
                    width: '100%',
                    tableLayout: 'fixed',
                },
                "& .RaDatagrid-headerCell": { 
                    fontWeight: "bold", 
                    background: "#e3f2fd",
                    fontSize: isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.75rem',
                    padding: isMobile ? '4px 2px' : isTablet ? '6px 4px' : '8px 6px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                },
                "& .RaDatagrid-row:nth-of-type(even)": { background: "#f1f8e9" },
                "& .RaDatagrid-cell": {
                    fontSize: isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.75rem',
                    padding: isMobile ? '4px 2px' : isTablet ? '6px 4px' : '8px 6px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                },
                "& .MuiButton-root": {
                    minWidth: isMobile ? '28px' : '36px',
                    padding: isMobile ? '4px' : '6px 12px',
                    fontSize: isMobile ? '0.65rem' : '0.75rem',
                    margin: isMobile ? '1px' : '2px'
                },
                // Простий та надійний розподіл колонок
                "& .RaDatagrid-headerCell, & .RaDatagrid-cell": {
                    '&:nth-of-type(1)': { // Email
                        width: isMobile ? '45%' : '3%',
                        minWidth: isMobile ? '120px' : '18px'
                    },
                    '&:nth-of-type(2)': { // Name
                        width: isMobile ? '25%' : '20%',
                        minWidth: isMobile ? '80px' : '120px'
                    },
                    '&:nth-of-type(3)': { // LastName (тільки на десктопі)
                        width: '18%',
                        minWidth: '100px',
                        display: isMobile ? 'none' : 'table-cell'
                    },
                    '&:nth-of-type(4)': { // Role
                        width: isMobile ? '20%' : '12%',
                        minWidth: isMobile ? '60px' : '80px'
                    },
                    '&:nth-of-type(5)': { // Blocked
                        width: isMobile ? '10%' : '8%',
                        minWidth: '50px'
                    },
                    '&:nth-of-type(6)': { // Account_ID (тільки на десктопі)
                        width: '7%',
                        minWidth: '60px',
                        display: isMobile ? 'none' : 'table-cell'
                    },
                    '&:last-child': { // Кнопки
                        width: 'auto',
                        minWidth: isMobile ? '60px' : '80px',
                        maxWidth: isMobile ? '80px' : '120px'
                    }
                },
                // Стилі для чекбоксу в хедері
                "& .RaDatagrid-headerCell:first-child": {
                    width: isMobile ? '40px' : '50px',
                    minWidth: isMobile ? '40px' : '50px',
                    paddingLeft: isMobile ? '4px' : '15px',
                },
                "& .RaDatagrid-cell:first-child": {
                    width: isMobile ? '40px' : '50px',
                    minWidth: isMobile ? '40px' : '50px',
                    paddingLeft: isMobile ? '4px' : '8px',
                },
                // Стилі для самого чекбоксу
                "& .MuiCheckbox-root": {
                    padding: isMobile ? '4px' : '8px',
                    '& .MuiSvgIcon-root': {
                        fontSize: isMobile ? '1rem' : '1.25rem',
                    }
                }
            }}
        >
            <TextField source="email" sx={{ width: '100%' }} />
            <TextField source="name" label="Name" sx={{ width: '100%' }} />
            {!isMobile && <TextField source="lastName" label="Last Name" sx={{ width: '100%' }} />}
            <TextField source="role" sx={{ width: '100%' }} />
            <FunctionField 
                source="lastLogin" 
                label="Last Login"
                render={(record: any) => formatDate(record.lastLogin)}
                sx={{ width: '100%' }} 
            />
            <BooleanField source="blocked" label="Blocked" sx={{ width: '100%' }} />
            {!isMobile && <TextField source="account_id" sx={{ width: '100%' }} />}
            <EditButton />
            <DeleteButton />
        </Datagrid>
    );
};

const PostsList = () => {
    const { identity, isLoading } = useGetIdentity();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    if (isLoading) return (
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px' 
        }}>
            <Typography>Loading...</Typography>
        </Box>
    );

    const isSuperAdmin = identity?.role === "superadmin";
    const roleFilter = isSuperAdmin ? {} : { role: "user", create_ad: identity?.id };

    return (
        <List 
            filters={<ClientsFilter />} 
            filter={roleFilter}
            sx={{
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                '& .RaList-main': {
                    padding: isMobile ? '4px' : '8px',
                    maxWidth: '100%',
                    overflow: 'hidden',
                },
                '& .RaList-content': {
                    backgroundColor: 'transparent',
                    maxWidth: '100%',
                    overflow: 'hidden',
                },
                '& .MuiTableContainer-root': {
                    maxWidth: '100%',
                    overflow: 'auto',
                },
                '& .MuiTable-root': {
                    width: '100%',
                    tableLayout: 'fixed',
                },
            }}
        >
            <Box sx={{ 
                p: isMobile ? 1 : 2, 
                background: "#f9f9f9", 
                borderRadius: 2,
                overflow: 'auto',
                '& .MuiTableContainer-root': {
                    borderRadius: 2,
                    boxShadow: isMobile ? 1 : 2,
                }
            }}>
                <CustomDatagrid />
            </Box>
        </List>
    );
};

export default PostsList;
