import { useGetIdentity, List, Datagrid, TextField, BooleanField, EditButton, DeleteButton, DateField, Filter, SearchInput } from "react-admin";
import { Box } from "@mui/material";

const RoleFilter = (props: any) => {

    return (
        <Filter {...props}>
            <SearchInput
                source="name"
                placeholder="Search by name + lastName"
                alwaysOn
                sx={{ width: 250, mb: 2 }}
            />
            <SearchInput
                source="email"
                placeholder="Search by email"
                alwaysOn
                sx={{ width: 250, mb: 2 }}
            />
        </Filter>
    );
};

const CustomDatagrid = () => {
    return (
        <Datagrid
            rowClick="edit"
            sx={{
                "& .RaDatagrid-headerCell": { fontWeight: "bold", background: "#e3f2fd" },
                "& .RaDatagrid-row:nth-of-type(even)": { background: "#f1f8e9" }
            }}
        >
            <TextField source="email" />
            <TextField source="name" label="Name" />
            <TextField source="lastName" label="Last Name" />
            <TextField source="role" />
            <BooleanField source="blocked" label="Blocked" />
            <TextField source="account_id" />
            <DateField source="created_at" label="Created" showTime />
            <DateField
                source="lastLogin"
                label="Last Login"
                showTime
                options={{ day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }}
            />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    );
};

const PostsList = () => {
    const { identity, isLoading } = useGetIdentity();


    if (isLoading) return <div>Loading...</div>;

    const isSuperAdmin = identity?.role === "superadmin";

    const roleFilter = isSuperAdmin ? {} : { role: "user", create_ad: identity?.id };

    return (
        <List filters={isSuperAdmin ? <RoleFilter /> : undefined} filter={roleFilter}>
            <Box sx={{ p: 2, background: "#f9f9f9", borderRadius: 2 }}>
                <CustomDatagrid />
            </Box>
        </List>
    );
};

export default PostsList;
