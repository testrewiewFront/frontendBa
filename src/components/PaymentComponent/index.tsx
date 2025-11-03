import { useState, useEffect } from "react";
import { Header } from "..";
import USDT from "../../assets/icons/usdt.svg";
import BTC from "../../assets/icons/btc.svg";
import ETH from "../../assets/icons/eth.svg";
import USDTD from "../../assets/icons/usdtd.svg";
import Balance from "../../assets/icons/balance.svg";
import EUR from "../../assets/icons/eur.svg";
import Euro from "../../assets/icons/euro.svg";
import USD from "../../assets/icons/usd.svg";
import useUserStore from '../../store/userStore';
import { useNavigate } from "react-router-dom";
import { useBalanceStore } from "../../store/balanceStore";
import axios from 'axios';

// Додаємо CSS для анімації
const animationStyles = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-10px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-10px); }
  }

  .animate-fade-in-out {
    animation: fadeInOut 2s ease-in-out;
  }

  .wallet-card {
    transition: all 0.3s ease;
  }

  .wallet-card:hover {
    transform: translateY(-5px);
  }
`;

// Icon mapping for different cryptocurrencies
const iconMap: { [key: string]: string } = {
    'USDT': USDT,
    'BTC': BTC,
    'ETH': ETH,
    'DASH': USDTD,
    'EUR': EUR,
    'USD': Balance,
};

// Interface for wallet address data
interface WalletAddress {
    id: string;
    label: string;
    network: string;
    address: string;
    color: string;
    bg: string;
    image: string;
    description?: string;
    eurLabel?: string;
}

interface StatusIcon {
    id: string;
    name: string;
    value: string;
    label: string;
    img: string;
}

const transferLimits = [
    {
        value: "1 000",
        label: "Min. per transaction"
    },
    {
        value: "3 000 000",
        label: "Max. per transaction"
    },
    {
        value: "Instantly",
        label: "Transfer term"
    }
];

const PaymentComponent = () => {
    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);
    const [activeTab, setActiveTab] = useState(0);
    const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
    const [showNotification, setShowNotification] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<string | null>("USDT");
    const { balance } = useBalanceStore();
    
    // State for wallet addresses and loading
    const [walletAddresses, setWalletAddresses] = useState<WalletAddress[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusIcons, setStatusIcons] = useState<Record<string, string>>({});

    
    // Fetch wallet addresses from cryptodetails API and user EUR details
    const fetchWalletAddresses = async () => {
        try {
            setIsLoading(true);
            
            // Fetch crypto addresses
            const cryptoResponse = await axios.get('https://backendba-oqfl.onrender.com/api/api/cryptodetails/public');
            
            // Fetch user details for EUR
            let eurWallet = null;
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const userResponse = await axios.get('https://backendba-oqfl.onrender.com/api/api/users/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    if (userResponse.data.detailsEUR && (userResponse.data.detailsEUR.label || userResponse.data.detailsEUR.nuberDetails)) {
                        eurWallet = {
                            id: 'eur-details',
                            label: 'EUR',
                            network: 'IBAN:',
                            address: userResponse.data.detailsEUR.nuberDetails || 'Not configured',
                            color: '#1976D2',
                            bg: 'rgba(25, 118, 210, 0.1)',
                            image: EUR,
                            description: userResponse.data.detailsEUR.description,
                            eurLabel: userResponse.data.detailsEUR.label
                        };
                    }
                }
            } catch (userError) {
                console.error('Error fetching user EUR details:', userError);
            }
            
            // Transform crypto data
            const transformedData: WalletAddress[] = cryptoResponse.data.map((crypto: any) => ({
                id: crypto.id || crypto._id,
                label: crypto.label,
                network: crypto.network || `${crypto.label}:`,
                address: crypto.address,
                color: crypto.color || '#4AB094',
                bg: crypto.bg || 'rgba(74, 176, 148, 0.2)',
                image: crypto.image ? `https://backendba-oqfl.onrender.com/api/api${crypto.image}` : iconMap[crypto.label] || Balance
            }));
            
            // Combine crypto and EUR wallets
            const allWallets = eurWallet ? [...transformedData, eurWallet] : transformedData;
            setWalletAddresses(allWallets);
            
            // Set first available currency as selected if none selected
            if (allWallets.length > 0 && !selectedCurrency) {
                setSelectedCurrency(allWallets[0].label);
            }
        } catch (error) {
            console.error('Error fetching wallet addresses:', error);
            setWalletAddresses([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch status icons from backend
    const fetchStatusIcons = async () => {
        try {
            const response = await fetch('/api/status/public');
            if (response.ok) {
                const statuses: StatusIcon[] = await response.json();
                const iconsMap: Record<string, string> = {};
                statuses.forEach(status => {
                    if (status.img) {
                        // Map status values to their icons
                        iconsMap[status.value] = status.img;
                        
                        // Add common aliases for better compatibility
                        if (status.value === 'completed' || status.value === 'success') {
                            iconsMap['success'] = status.img;
                            iconsMap['completed'] = status.img;
                        }
                        if (status.value === 'failed' || status.value === 'error') {
                            iconsMap['error'] = status.img;
                            iconsMap['failed'] = status.img;
                        }
                        if (status.value === 'pending' || status.value === 'processing') {
                            iconsMap['pending'] = status.img;
                            iconsMap['processing'] = status.img;
                        }
                    }
                });
                setStatusIcons(iconsMap);
            } else {
                console.error('Failed to fetch status icons:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Failed to fetch status icons:', error);
        }
    };

    useEffect(() => {
        fetchWalletAddresses();
        fetchStatusIcons();
    }, []);
    
    // Використовуємо стилі анімації
    useEffect(() => {
        // Додаємо стилі до head документа
        const styleElement = document.createElement('style');
        styleElement.innerHTML = animationStyles;
        document.head.appendChild(styleElement);
        
        // Видаляємо стилі при розмонтуванні компонента
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);
    
    const handleCopyAddress = (address: string) => {
        navigator.clipboard.writeText(address);
        setCopiedAddress(address);
        setShowNotification(true);
        
        setTimeout(() => {
            setShowNotification(false);
            setCopiedAddress(null);
        }, 2000);
    };
    
    const handleCurrencySelect = (label: string) => {
        setSelectedCurrency(selectedCurrency === label ? null : label);
    };
    
  

    return (
        <div className="py-[2.105vw] sm:pt-[2.105vw] sm:pb-[23.105vw] sm:px-[9.111vw] px-[4.211vw] space-y-[1.2vw] sm:space-y-0 ">
            {/* Notification для скопійованої адреси */}
            {showNotification && (
                <div className="fixed top-[5vw] right-[5vw] bg-[#4AB094] text-white py-[1vw] px-[2vw] rounded-lg shadow-lg z-50 animate-fade-in-out">
                    <p className="text-[1vw] sm:text-[3vw]">Address copied to clipboard!</p>
                </div>
            )}
            
            {/* QR-код модальне вікно */}
           
            <div className="sm:hidden mb-[3vw]">
                <Header />
            </div>
            <div className=" hidden sm:flex flex-col  justify-between ls:space-x-[1.111vw] py-[5vw]">
                    <span className="text-[7.679vw] font-black  text-[#2e2e2e]">{location.pathname === "/" ? "Overview" : location.pathname === "/payment" ? "Payment" : location.pathname === "/balance" ? "Balance" : location.pathname === "/history" ? "History" : location.pathname === "/transfer" ? "Transfer" : location.pathname === "/support" ? "Support Center" : location.pathname === "/profile" ? "Profile" : location.pathname === "/refferals" ? "Referrals" : ""}</span>
                    <div className="w-[25vw] h-[0.8vw] bg-[#4AB094] mt-[0.5vw]"></div>
             </div>
          

            {user?.blocked && (
                <div className="flex items-center justify-between ls:space-x-[1.111vw] sm:block hidden">
                    <span className="text-[1.179vw] sm:text-[0.7vw] ls:!text-[3.844vw] text-red-500 font-bold uppercase">Your account has been blocked, please contact support</span>
                </div>
            )}
            <div className="mt-[2vw] hidden sm:block rounded-lg bg-white border border-gray-200 shadow-sm !mb-[8vw]">
                            <div className="p-[3vw]">
                                <div className="flex items-center justify-between mb-[2vw]">
                                    <div>
                                        <p className="text-[2.5vw] font-medium text-gray-500">Current Balance</p>
                                        <p className="text-[5.5vw] font-bold text-gray-900 mt-[0.5vw]">
                                            ${balance || '0.00'}
                                        </p>
                                    </div>
                                    <div className="w-[2.5vw] h-[2.5vw] bg-green-100 rounded-full flex items-center justify-center">
                                        <div className="w-[1vw] h-[1vw] bg-green-500 rounded-full"></div>
                                    </div>
                                </div>
                                
                                <div className="flex space-x-[2vw]">
                                    <button 
                                        onClick={() => navigate('/transfer')}
                                        className="flex-1 bg-[#4AB094] text-white py-[2.5vw] rounded-lg font-medium text-[2.8vw] hover:bg-[#3a9a7e] transition-colors"
                                    >
                                        Transfer
                                    </button>
                                    <button 
                                        onClick={() => navigate('/history')}
                                        className="flex-1 bg-gray-100 text-gray-700 py-[2.5vw] rounded-lg font-medium text-[2.8vw] hover:bg-gray-200 transition-colors"
                                    >
                                        History
                                    </button>
                                </div>
                            </div>
                        </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-[40vh]">
                    <div className="animate-spin rounded-full h-[5vw] w-[5vw] border-t-2 border-b-2 border-[#4AB094]"></div>
                </div>
            ) : (
                <div className="flex space-x-[3vw] m-0 sm:flex-col sm:space-x-0 sm:space-y-[5vw]">
                    <div className="w-[70vw] sm:w-full space-y-[1vw] sm:space-y-[5vw]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 space-y-4 sm:space-y-0">            
                            <div className="flex space-x-[1vw] sm:space-x-[2vw]">
                                {['All', ...walletAddresses.map(wallet => wallet.label)].map((tab, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => setActiveTab(index)}
                                        className={`px-[1vw] py-[0.5vw] rounded-full text-[1vw] sm:text-[3vw] font-medium transition-all ${activeTab === index ? 'bg-[#4AB094] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div style={{ maxWidth: '100%', background: 'rgba(55, 109, 71, 0.2)' }} className="rounded-xl p-4 shadow-lg transition-all duration-500 ease-in-out">
                            <div className="space-y-[0.5vw] mb-[1vw]">
                                <p className="text-[2.1vw] m-0 pl-[0.5vw] sm:text-[4vw] font-bold text-black">
                                    Wallet Addresses
                                </p>
                                <p className="text-[1.1vw] m-0 pl-[0.5vw] sm:text-[2.5vw] text-black">
                                    Use these addresses to deposit funds
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4 mt-4">
                                {walletAddresses
                                    .filter(item => activeTab === 0 || item.label === ['All', ...walletAddresses.map(wallet => wallet.label)][activeTab])
                                    .map((item, index) => (
                                    <div 
                                        key={index} 
                                        className={`flex items-center space-x-[1.579vw] p-3 rounded-lg transition-all duration-300 hover:shadow-md ${selectedCurrency === item.label ? 'ring-2 ring-[#4AB094]' : ''}`}
                                        style={{ backgroundColor: item.bg }}
                                        onClick={() => handleCurrencySelect(item.label)}
                                    >
                                        <div style={{ backgroundColor: item.color }} className="w-[3.658vw] h-[3.684vw] sm:w-[7.778vw] sm:h-[7.778vw] rounded-full flex justify-center items-center">
                                            <img src={item.image} alt={`${item.label} logo`} className="w-[1.842vw] sm:w-[4.444vw]" />
                                        </div>
                                        <div className="flex flex-col flex-grow">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[1.247vw] sm:text-[4.111vw] font-bold">
                                                    {item.eurLabel || item.label}
                                                </span>
                                                <div className="flex space-x-[0.5vw]">
                                                    <button 
                                                        className="text-[0.8vw] sm:text-[2.5vw] bg-[#4AB094] text-white px-[0.8vw] py-[0.3vw] rounded-full hover:bg-[#3a9a7e] transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCopyAddress(item.address);
                                                        }}
                                                    >
                                                        {copiedAddress === item.address ? 'Copied!' : 'Copy'}
                                                    </button>
                                                  
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                                                <span className="text-[0.937vw] sm:text-[3.267vw] font-medium text-gray-700">{item.network}</span>
                                                <span className="text-[0.937vw] sm:text-[3.267vw] font-medium text-gray-700 break-words">
                                                    {item.label === 'EUR' ? item.address : `${item.address.substring(0, 10)}...${item.address.substring(item.address.length - 10)}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {selectedCurrency && (
                            <div className="mt-[2vw] p-[2vw] bg-white rounded-xl shadow-lg">
                                <h3 className="text-[1.5vw] sm:text-[4vw] font-bold mb-[1vw]">{selectedCurrency} Payment Instructions</h3>
                                
                                {/* Show EUR description if EUR is selected and has description */}
                                {selectedCurrency === 'EUR' && (() => {
                                    const eurWallet = walletAddresses.find(wallet => wallet.label === 'EUR');
                                    return eurWallet?.description ? (
                                        <div className="mb-[2vw] p-[1.5vw] bg-blue-50 border border-blue-200 rounded-lg">
                                            <h4 className="text-[1.2vw] sm:text-[3.5vw] font-bold text-blue-800 mb-[1vw]">Transfer Instructions:</h4>
                                            <pre className="text-[0.9vw] sm:text-[2.8vw] text-blue-700 whitespace-pre-wrap font-sans leading-relaxed">
                                                {eurWallet.description}
                                            </pre>
                                        </div>
                                    ) : null;
                                })()}

                                {/* Standard crypto instructions */}
                                {selectedCurrency !== 'EUR' && (
                                    <>
                                        <ol className="list-decimal pl-[2vw] space-y-[1vw]">
                                            <li className="text-[1vw] sm:text-[3vw]">Copy the {selectedCurrency} address above</li>
                                            <li className="text-[1vw] sm:text-[3vw]">Open your {selectedCurrency} wallet application</li>
                                            <li className="text-[1vw] sm:text-[3vw]">Initiate a transfer to the copied address</li>
                                            <li className="text-[1vw] sm:text-[3vw]">Enter the amount you wish to deposit</li>
                                            <li className="text-[1vw] sm:text-[3vw]">Confirm the transaction in your wallet</li>
                                            <li className="text-[1vw] sm:text-[3vw]">Wait for the network confirmations</li>
                                            <li className="text-[1vw] sm:text-[3vw]">Your balance will be updated automatically</li>
                                        </ol>
                                        <div className="mt-[2vw] p-[1vw] bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p className="text-[0.9vw] sm:text-[2.5vw] text-yellow-700">
                                                <strong>Important:</strong> Always double-check the address before confirming your transaction. 
                                                Cryptocurrency transactions cannot be reversed once confirmed on the blockchain.
                                            </p>
                                        </div>
                                    </>
                                )}

                                {/* EUR specific instructions */}
                                {selectedCurrency === 'EUR' && (
                                    <>
                                        <ol className="list-decimal pl-[2vw] space-y-[1vw]">
                                            <li className="text-[1vw] sm:text-[3vw]">Copy the bank account details above</li>
                                            <li className="text-[1vw] sm:text-[3vw]">Open your banking application or visit your bank</li>
                                            <li className="text-[1vw] sm:text-[3vw]">Initiate a bank transfer to the provided account</li>
                                            <li className="text-[1vw] sm:text-[3vw]">Enter the amount you wish to deposit</li>
                                            <li className="text-[1vw] sm:text-[3vw]">Include any required reference information</li>
                                            <li className="text-[1vw] sm:text-[3vw]">Confirm the bank transfer</li>
                                            <li className="text-[1vw] sm:text-[3vw]">Your balance will be updated after processing</li>
                                        </ol>
                                        <div className="mt-[2vw] p-[1vw] bg-blue-50 border border-blue-200 rounded-lg">
                                            <p className="text-[0.9vw] sm:text-[2.5vw] text-blue-700">
                                                <strong>Note:</strong> Bank transfers may take 1-3 business days to process. 
                                                Please ensure all account details are correct before confirming the transfer.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                    </div>
                
                    <div className="w-[25vw] sm:w-full sm:mt-8 mt-[3.4vw]">
                        <div style={{ background: 'rgba(74, 176, 148, 0.2)' }} className="rounded-xl p-4 shadow-lg">
                            <div className="space-y-[0.5vw] mb-[2vw]">
                                <p className="text-[1.8vw] sm:text-[4.5vw] font-bold text-black">Transfer Information</p>
                            </div>
                            
                            <div className="space-y-[1.5vw]">
                                {transferLimits.map((item, index) => (
                                    <div key={index} className="flex flex-col space-y-[0.3vw]">
                                        <span className="text-[1.4vw] sm:text-[3.5vw] font-medium">{item.value}</span>
                                        <span className="text-[0.9vw] sm:text-[2.5vw] text-gray-600 font-medium">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-[3vw] space-y-[1vw]">
                                <div className="flex items-center space-x-[1.2vw]">
                                    <img src={Balance} alt="Dollar" className="w-[3.726vw] sm:w-[9.844vw]" />
                                    <img src={Euro} alt="Euro" className="w-[3.226vw] sm:w-[8vw]" />
                                </div>
                                <div>
                                    <span className="text-[1.042vw] sm:text-[2.667vw] font-medium text-gray-700">Only for premium accounts</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Current Balance Card - Desktop */}
                        <div className="mt-[2vw] sm:hidden rounded-lg bg-white border border-gray-200 shadow-sm">
                            <div className="p-[1.5vw]">
                                <div className="flex items-center justify-between mb-[1vw]">
                                    <div>
                                        <p className="text-[0.9vw] font-medium text-gray-500">Current Balance</p>
                                        <p className="text-[2.2vw] font-bold text-gray-900 mt-[0.2vw]">
                                            ${Number(balance || 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="w-[1.2vw] h-[1.2vw] bg-green-100 rounded-full flex items-center justify-center">
                                        <div className="w-[0.5vw] h-[0.5vw] bg-green-500 rounded-full"></div>
                                    </div>
                                </div>
                                
                                <div className="flex space-x-[0.8vw]">
                                    <button 
                                        onClick={() => navigate('/transfer')}
                                        className="flex-1 bg-[#4AB094] text-white py-[0.8vw] rounded-lg font-medium text-[0.9vw] hover:bg-[#3a9a7e] transition-colors"
                                    >
                                        Transfer
                                    </button>
                                    <button 
                                        onClick={() => navigate('/history')}
                                        className="flex-1 bg-gray-100 text-gray-700 py-[0.8vw] rounded-lg font-medium text-[0.9vw] hover:bg-gray-200 transition-colors"
                                    >
                                        History
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Last Transaction */}
                        <div className="mt-[2vw] rounded-xl shadow-lg bg-gradient-to-br from-white to-gray-50 border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-[#4AB094] to-[#376D47] px-[1.5vw] py-[0.8vw] sm:px-[4vw] sm:py-[2vw]">
                                <div className="flex items-center justify-between">
                                    <div className="flex w-[21vw] items-center justify-center">
                                        <h3 className="text-[1.3vw] sm:text-[3.5vw] font-bold text-white">Last Transaction</h3>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-[1.2vw] sm:p-[3vw]">
                                {user?.transactions && user.transactions.length > 0 ? (
                                    (() => {
                                        const transaction = user.transactions[user.transactions.length - 1]; // Get last transaction
                                        const amount = parseFloat(transaction.sum || transaction.amount || '0');
                                        const isDeposit = transaction.type === 'deposit' || (transaction.type !== 'withdrawal' && amount > 0);
                                        const transactionDate = new Date(transaction.createdAt || transaction.date);
                                        const displayAmount = Math.abs(amount);
                                        
                                        return (
                                            <div key={transaction._id} className="bg-white rounded-lg border border-gray-200 p-[1.2vw] sm:p-[3vw] hover:shadow-md transition-all duration-300 hover:border-[#4AB094]/30">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-[1.2vw] sm:space-x-[3vw]">
                                                        <div className={`w-[2.8vw] h-[2.8vw] sm:w-[7vw] sm:h-[7vw] rounded-full flex items-center justify-center shadow-lg`}
                                                            style={{ 
                                                                backgroundColor: (() => {
                                                                    const normalizedPS = (() => {
                                                                        const map: Record<string, string> = {
                                                                            "trc20": "TRC-20",
                                                                            "usdt": "USDT", 
                                                                            "usdt-d": "USDTD",
                                                                            "eth": "ETH",
                                                                            "btc": "BTC",
                                                                            "eur": "EUR",
                                                                            "usd": "USD"
                                                                        };
                                                                        return map[transaction.ps?.toLowerCase()] || transaction.ps?.toUpperCase() || "USD";
                                                                    })();
                                                                    const colors: Record<string, string> = {
                                                                        "TRC-20": "#4AB094",
                                                                        "ETH": "#6489A4", 
                                                                        "USDTD": "#F3BA2F",
                                                                        "BTC": "#F28B49",
                                                                        "EUR": "#3CBEEF",
                                                                        "USD": "#77C46F"
                                                                    };
                                                                    return colors[normalizedPS] || "#4AB094";
                                                                })()
                                                            }}
                                                        >
                                                            {(() => {
                                                                const normalizedPS = (() => {
                                                                    const map: Record<string, string> = {
                                                                        "trc20": "TRC-20",
                                                                        "usdt": "USDT",
                                                                        "usdt-d": "USDTD", 
                                                                        "eth": "ETH",
                                                                        "btc": "BTC",
                                                                        "eur": "EUR",
                                                                        "usd": "USD"
                                                                    };
                                                                    return map[transaction.ps?.toLowerCase()] || transaction.ps?.toUpperCase() || "USD";
                                                                })();
                                                                const imageSources: Record<string, any> = {
                                                                    "TRC-20": USDT,
                                                                    "ETH": ETH,
                                                                    "USDTD": USDTD,
                                                                    "BTC": BTC,
                                                                    "EUR": EUR,
                                                                    "USD": USD
                                                                };
                                                                
                                                                return imageSources[normalizedPS] ? (
                                                                    <img src={imageSources[normalizedPS]} alt={normalizedPS} className="w-[1.5vw] h-[1.5vw] sm:w-[3.5vw] sm:h-[3.5vw]" />
                                                                ) : (
                                                                    <span className="text-[0.8vw] sm:text-[2vw] font-bold text-white">{normalizedPS}</span>
                                                                );
                                                            })()}
                                                        </div>
                                                        <div className="flex-1  min-w-0  ">
                                                            <div className="flex items-center text-center  space-x-[0.8vw] sm:space-x-[2vw] mb-[0.3vw] sm:mb-[0.8vw]">
                                                                <h4 className="text-[1vw]  sm:text-[2.8vw] font-semibold text-gray-800 capitalize">
                                                                    {transaction.type || (isDeposit ? 'Deposit' : 'Withdrawal')}
                                                                </h4>
                                                                {transaction.status && (
                                                                    <div className="flex items-center">
                                                                        {statusIcons[transaction.status] ? (
                                                                            <img 
                                                                                src={statusIcons[transaction.status]} 
                                                                                alt={transaction.status} 
                                                                                className="w-[1.2vw] h-[1.2vw] mb-[0.5vw] sm:w-[3vw] sm:h-[3vw] object-contain" 
                                                                                onError={(e) => {
                                                                                    e.currentTarget.style.display = 'none';
                                                                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                                                    if (fallback) fallback.style.display = 'inline-block';
                                                                                }}
                                                                            />
                                                                        ) : null}
                                                                        <span 
                                                                            className={`px-[0.5vw] py-[0.2vw]  sm:px-[1.2vw] sm:py-[0.4vw] rounded-full text-[0.7vw] sm:text-[1.8vw] font-medium ${statusIcons[transaction.status] ? 'hidden' : ''} ${
                                                                                transaction.status === 'completed' || transaction.status === 'success' ? 'bg-green-100 text-green-700' :
                                                                                transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                                'bg-gray-100 text-gray-700'
                                                                            }`}
                                                                            style={{ display: statusIcons[transaction.status] ? 'none' : 'inline-block' }}
                                                                        >
                                                                            {transaction.status}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <p className="text-[0.8vw] sm:text-[2.2vw] text-gray-500 mb-[0.2vw] sm:mb-[0.5vw]">
                                                                {transactionDate.toLocaleDateString('en-US', { 
                                                                    month: 'short', 
                                                                    day: 'numeric', 
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                            {transaction.ps && (
                                                                <p className="text-[0.7vw] sm:text-[1.8vw] text-gray-400 uppercase font-medium">
                                                                    via {transaction.ps}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <p className={`text-[1.2vw] sm:text-[3.2vw] font-bold mb-[0.2vw] sm:mb-[0.5vw] ${
                                                            isDeposit ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                            {(() => {
                                                                const currencySymbols: Record<string, string> = {
                                                                    'eur': '€',
                                                                    'usd': '$',
                                                                    'btc': '₿',
                                                                    'eth': 'Ξ',
                                                                    'usdt': '$',
                                                                    'trc20': '$',
                                                                    'usdt-d': '$',
                                                                    'dash': 'Đ'
                                                                };
                                                                const ps = transaction.ps?.toLowerCase() || 'usd';
                                                                const symbol = currencySymbols[ps] || '$';
                                                                return `${isDeposit ? '+' : '-'}${symbol}${displayAmount.toLocaleString()}`;
                                                            })()}
                                                        </p>
                                                       
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()
                                ) : (
                                    <div className="text-center py-[3vw] sm:py-[8vw]">
                                        <div className="w-[4vw] h-[4vw] sm:w-[12vw] sm:h-[12vw] mx-auto mb-[1vw] sm:mb-[3vw] bg-gray-100 rounded-full flex items-center justify-center">
                                            <svg className="w-[2vw] h-[2vw] sm:w-[6vw] sm:h-[6vw] text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                            </svg>
                                        </div>
                                        <p className="text-[1.1vw] sm:text-[3.5vw] text-gray-600 font-medium">No transactions yet</p>
                                        <p className="text-[0.9vw] sm:text-[2.8vw] text-gray-400 mt-[0.5vw] sm:mt-[1vw]">Your recent transactions will appear here</p>
                                    </div>
                                )}
                                
                                <div className="mt-[1vw] sm:mt-[2.5vw] pt-[0.8vw] sm:pt-[2vw] border-t border-gray-200">
                                    <button 
                                        onClick={() => navigate('/history')}
                                        className="w-full bg-gradient-to-r from-[#4AB094] to-[#376D47] text-white py-[0.6vw] sm:py-[2vw] px-[1.2vw] sm:px-[3vw] rounded-lg font-medium text-[0.9vw] sm:text-[2.5vw] hover:from-[#3a9a7e] hover:to-[#2d5a39] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-[0.1vw]"
                                    >
                                        <div className="flex items-center justify-center space-x-[0.4vw] sm:space-x-[1.2vw]">
                                            <span>View All Transactions</span>
                                            <svg className="w-[0.8vw] h-[0.8vw] sm:w-[2.5vw] sm:h-[2.5vw]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentComponent;
