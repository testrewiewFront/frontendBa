import { useEffect } from 'react';

const useOnlineStatus = () => {
    useEffect(() => {
        const sendHeartbeat = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) return;

                await fetch('https://api.international-payments.cc/api/api/online/heartbeat', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } catch (error) {
                console.error('Помилка відправки heartbeat:', error);
            }
        };

        // Відправляємо heartbeat кожні 2 хвилини
        const interval = setInterval(sendHeartbeat, 2 * 60 * 1000);

        // Відправляємо одразу при завантаженні
        sendHeartbeat();

        // Відправляємо heartbeat при закритті вкладки
        const handleBeforeUnload = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) return;

                // Використовуємо navigator.sendBeacon для надійної відправки при закритті
                const data = JSON.stringify({});
                navigator.sendBeacon(
                    'https://api.international-payments.cc/api/api/online/logout',
                    new Blob([data], { type: 'application/json' })
                );
            } catch (error) {
                console.error('Помилка логауту:', error);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            clearInterval(interval);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
};

export default useOnlineStatus;
