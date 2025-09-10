import React, { useEffect, useState } from 'react';
import { Nav, NavMobile, HeaderMobile } from '../components';
import axios from 'axios';
import useUserStore from '../store/userStore';
import { useBalanceStore } from '../store/balanceStore'; 

const Layout = ({ children }: { children: React.ReactNode }) => {
  const setUser = useUserStore((state) => state.setUser);
  const setLoader = useUserStore((state) => state.setLoader);
  const user = useUserStore((state) => state.user);
  const { setBalance } = useBalanceStore();
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const [marketData, setMarketData] = useState<any[]>([]);

  // Fetch market data for balance calculation
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              ids: 'tether,bitcoin,ethereum,euro-coin,dash',
              order: 'market_cap_desc',
              per_page: 6,
              page: 1,
              sparkline: false,
              price_change_percentage: '1h,24h,7d,30d'
            }
          }
        );
        setMarketData(response.data);
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Calculate and set balance whenever user data or market data changes
  useEffect(() => {
    if (user?.balance && marketData.length > 0) {
      const totalBalanceUSD = Object.entries(user.balance).reduce((acc: number, [currency, amount]: [string, any]) => {
        const balance = parseFloat(amount || "0");
        if (balance === 0) return acc;
        
        let priceInUSD = 0;
        
        if (currency === 'usd') {
          priceInUSD = 1;
        } else if (currency === 'eur') {
          const eurCoin = marketData.find(coin => coin.symbol.toLowerCase() === 'eurc');
          priceInUSD = eurCoin?.current_price || 1.1;
        } else {
          const coin = marketData.find(coin => 
            coin.symbol.toLowerCase() === currency.toLowerCase() ||
            (currency === 'trc20' && coin.symbol.toLowerCase() === 'usdt')
          );
          priceInUSD = coin?.current_price || 0;
        }
        
        return acc + (balance * priceInUSD);
      }, 0);
      
      setBalance(totalBalanceUSD.toString());
    } else if (user?.balance) {
      // If no market data yet, set balance to 0 temporarily
      setBalance('0');
    }
  }, [user?.balance, marketData, setBalance]);

  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoader(true);
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log('User data:', response.data);
        setUser(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setUser(null);
      }).finally(() => {
        setLoader(false);
      });
  }, [setUser]);

  return (
    <div className='bg-[#2e2e2e] pt-[1.2vw] pb-[1.2vw] pr-[2vw] sm:p-0'>
      <div className="sm:block hidden w-full">
        <HeaderMobile />
      </div>
      <div className="flex ">
        <div className="fixed left-0 top-0 sm:hidden">
          <Nav setIsNavExpanded={setIsNavExpanded} />
        </div>
        <div className={` ${isNavExpanded ? 'w-[calc(100%-18.529vw)]' : ' w-[calc(100%-5vw)]'} transition-all duration-300 ${isNavExpanded ? 'ml-[18.529vw] ls:ml-[21.529vw]' : 'ml-[5vw]'} sm:!ml-0 bg-white min-h-[calc(100vh-2.4vw)] rounded-[2vw] sm:w-full sm:rounded-[0vw]`}>
          {children}
          <div className="hidden bg-white w-full fixed left-0 bottom-0 sm:block z-[9999]">
            <NavMobile />
          </div>
        </div>
      </div>
      {/* <div className=''>
          <Footer />
      </div> */}
    </div>
  );
};

export default Layout;
