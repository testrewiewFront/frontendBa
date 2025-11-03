import jsonServerProvider from 'ra-data-json-server';
import { fetchUtils } from 'react-admin';

const apiUrl = 'https://api.international-payments.cc/api';

const httpClient = (url: string, options: any = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }

    const token = localStorage.getItem('adminToken');
    if (token) {
        options.headers.set('Authorization', `Bearer ${token}`);
    }

    return fetchUtils.fetchJson(url, options);
};

// Create base data provider
const baseDataProvider = jsonServerProvider(apiUrl, httpClient);

// Helper function to transform image URLs
const transformImageUrls = (data: any): any => {
    if (Array.isArray(data)) {
        return data.map(item => transformImageUrls(item));
    }
    
    if (data && typeof data === 'object') {
        const transformed = { ...data };
        
        // Transform image URLs to include full server path
        if (transformed.image && transformed.image.startsWith('/uploads/')) {
            transformed.image = `https://api.international-payments.cc/api${transformed.image}`;
        }
        if (transformed.img && transformed.img.startsWith('/uploads/')) {
            transformed.img = `https://api.international-payments.cc/api${transformed.img}`;
        }
        
        return transformed;
    }
    
    return data;
};

// Custom data provider that handles file uploads
const dataProvider = {
    ...baseDataProvider,
    
    getList: (resource: string, params: any) => {
        // Кастомна обробка пошуку для users (клієнтів)
        if (resource === 'users' && params.filter?.q) {
            const searchQuery = params.filter.q.toLowerCase();
            // Видаляємо 'q' з фільтрів
            const { q, ...otherFilters } = params.filter;
            
            // Спочатку отримуємо всі записи з іншими фільтрами
            const customParams = {
                ...params,
                filter: otherFilters,
                pagination: { page: 1, perPage: 1000 } // Отримуємо більше записів для фільтрації
            };
            
            return baseDataProvider.getList(resource, customParams).then(response => {
                // Фільтруємо дані на клієнті по імені та прізвищу
                const filteredData = response.data.filter((item: any) => {
                    const fullName = `${item.name || ''} ${item.lastName || ''}`.toLowerCase();
                    const name = (item.name || '').toLowerCase();
                    const lastName = (item.lastName || '').toLowerCase();
                    
                    return fullName.includes(searchQuery) || 
                           name.includes(searchQuery) || 
                           lastName.includes(searchQuery);
                });
                
                // Застосовуємо пагінацію до відфільтрованих даних
                const { page, perPage } = params.pagination;
                const start = (page - 1) * perPage;
                const end = start + perPage;
                const paginatedData = filteredData.slice(start, end);
                
                return {
                    data: transformImageUrls(paginatedData),
                    total: filteredData.length
                };
            });
        }
        
        return baseDataProvider.getList(resource, params).then(response => ({
            ...response,
            data: transformImageUrls(response.data)
        }));
    },

    getOne: (resource: string, params: any) => {
        return baseDataProvider.getOne(resource, params).then(response => ({
            ...response,
            data: transformImageUrls(response.data)
        }));
    },

    getMany: (resource: string, params: any) => {
        return baseDataProvider.getMany(resource, params).then(response => ({
            ...response,
            data: transformImageUrls(response.data)
        }));
    },

    getManyReference: (resource: string, params: any) => {
        return baseDataProvider.getManyReference(resource, params).then(response => ({
            ...response,
            data: transformImageUrls(response.data)
        }));
    },
    
    create: (resource: string, params: any) => {
        // Handle file uploads for cryptodetails and status
        if ((resource === 'cryptodetails' && params.data.image?.rawFile) || 
            (resource === 'status' && params.data.img?.rawFile)) {
            
            const formData = new FormData();
            
            // Add all fields to FormData
            Object.keys(params.data).forEach(key => {
                if ((key === 'image' || key === 'img') && params.data[key]?.rawFile) {
                    formData.append(key, params.data[key].rawFile);
                } else if (params.data[key] !== null && params.data[key] !== undefined) {
                    formData.append(key, params.data[key]);
                }
            });

            return fetchUtils.fetchJson(`${apiUrl}/${resource}`, {
                method: 'POST',
                body: formData,
                headers: new Headers({
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                }),
            }).then(({ json }) => ({
                data: json,
            }));
        }

        // Use base provider for other resources
        return baseDataProvider.create(resource, params);
    },

    update: (resource: string, params: any) => {
        // Handle file uploads for cryptodetails and status
        if ((resource === 'cryptodetails' && params.data.image?.rawFile) || 
            (resource === 'status' && params.data.img?.rawFile)) {
            
            const formData = new FormData();
            
            // Add all fields to FormData
            Object.keys(params.data).forEach(key => {
                if ((key === 'image' || key === 'img') && params.data[key]?.rawFile) {
                    formData.append(key, params.data[key].rawFile);
                } else if (key !== 'id' && params.data[key] !== null && params.data[key] !== undefined) {
                    formData.append(key, params.data[key]);
                }
            });

            return fetchUtils.fetchJson(`${apiUrl}/${resource}/${params.id}`, {
                method: 'PUT',
                body: formData,
                headers: new Headers({
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                }),
            }).then(({ json }) => ({ data: json }));
        }

        // Use base provider for other resources
        return baseDataProvider.update(resource, params);
    },
};

export default dataProvider;
