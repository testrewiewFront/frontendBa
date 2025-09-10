import { Admin, Resource } from 'react-admin';
import { useState, useEffect } from 'react';
import PostsList from './PostsList';
import { UserEdit } from './PostsEdit';
import PostsCreate from './PostsCreate';
import AdminsList from './AdminsList';
import AdminsEdit from './AdminsEdit';
import AdminsCreate from './AdminsCreate';
import CryptodetailsList from './CryptodetailsList';
import CryptodetailsEdit from './CryptodetailsEdit';
import CryptodetailsCreate from './CryptodetailsCreate';
import StatusList from './StatusList';
import StatusEdit from './StatusEdit';
import StatusCreate from './StatusCreate';
import adminAuthProvider from './authProvider';
import CustomLoginPage from './CustomLoginPage';
import dataProvider from '../dataProvider';

const AdminPanel = () => {
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const role = localStorage.getItem('adminRole');
        console.log('🔍 AdminPanel role check:', role);
        setUserRole(role);
    }, []);

    console.log('🎯 Current userRole:', userRole);

    return (
        <Admin
            basename="/admin"
            loginPage={CustomLoginPage}
            dataProvider={dataProvider}
            authProvider={adminAuthProvider}
        >
            {/* Клиенты - доступно для всех ролей */}
            <Resource name="users" options={{ label: "Клиенты" }} list={PostsList} edit={UserEdit} create={PostsCreate} />
            
            {/* Остальные ресурсы только для superadmin */}
            {userRole === 'superadmin' ? (
                <>
                    <Resource name="admins" options={{ label: "Админы" }} list={AdminsList} edit={AdminsEdit} create={AdminsCreate} />
                    <Resource name="cryptodetails" options={{ label: "Криптовалюты" }} list={CryptodetailsList} edit={CryptodetailsEdit} create={CryptodetailsCreate} />
                    <Resource name="status" options={{ label: "Статусы" }} list={StatusList} edit={StatusEdit} create={StatusCreate} />
                </>
            ) : userRole === 'admin' ? (
                // Для admin роли ничего дополнительного не показываем
                <></>
            ) : (
                // Пока роль не загрузилась, показываем все ресурсы
                <>
                    <Resource name="admins" options={{ label: "Админы" }} list={AdminsList} edit={AdminsEdit} create={AdminsCreate} />
                    <Resource name="cryptodetails" options={{ label: "Криптовалюты" }} list={CryptodetailsList} edit={CryptodetailsEdit} create={CryptodetailsCreate} />
                    <Resource name="status" options={{ label: "Статусы" }} list={StatusList} edit={StatusEdit} create={StatusCreate} />
                </>
            )}
        </Admin>
    );
};

export default AdminPanel;
