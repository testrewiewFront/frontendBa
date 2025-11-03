import { useState, useEffect } from "react";
import { Header } from "../../components";
import USDT from "../../assets/icons/usdt.svg";
import BTC from "../../assets/icons/btc.svg";
import ETH from "../../assets/icons/eth.svg";
import EUR from "../../assets/icons/eur.svg";
import USDTD from "../../assets/icons/usdtd.svg";
import USD from "../../assets/icons/usd.svg";
import useUserStore from "../../store/userStore";
import { useNavigate } from "react-router-dom";
import { useBalanceStore } from "../../store/balanceStore";

const animationStyles = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-10px); }
  }
  .transaction-row {
    transition: all 0.3s ease;
  }
  
  .transaction-row:hover {
    transform: translateY(-2px);
  }
  
  @keyframes pulse-glow {
    0% { box-shadow: 0 0 0 0 rgba(74, 176, 148, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(74, 176, 148, 0); }
    100% { box-shadow: 0 0 0 0 rgba(74, 176, 148, 0); }
  }
  
  .pulse-animation {
    animation: pulse-glow 2s infinite;
  }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
  
  .float-animation {
    animation: float 3s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  .shimmer-effect {
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
`;

interface Transaction {
    _id: string;
    date: string;
    sum: number;
    country?: string;
    ps: string;
    transaction_id: string;
    status: "success" | "pending" | "error";
    type?: "deposit" | "withdrawal";
}

interface StatusIcon {
    id: string;
    name: string;
    value: string;
    label: string;
    img: string;
}

const colors: Record<string, string> = {
    "TRC-20": "#4AB094",
    "ETH": "#6489A4",
    "USDTD": "#F3BA2F",
    "BTC": "#F28B49",
    "EUR": "#3CBEEF",
    "USD": "#77C46F"
};

const imageSources: Record<string, string> = {
    "TRC-20": USDT,
    "ETH": ETH,
    "USDTD": USDTD,
    "BTC": BTC,
    "EUR": EUR,
    "USD": USD
};


const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const normalizePaymentSystem = (ps: string): string => {
    const map: Record<string, string> = {
        "trc20": "TRC-20",
        "usdt": "USDT",
        "usdt-d": "USDTD",
        "eth": "ETH",
        "btc": "BTC",
        "eur": "EUR",
        "usd": "USD"
    };
    return map[ps.toLowerCase()] || ps.toUpperCase();
};

const HistoryComponent = () => {
    const user = useUserStore((state) => state.user);
    const transactions: Transaction[] = user?.transactions || [];
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [statusIcons, setStatusIcons] = useState<Record<string, string>>({});
    const navigate = useNavigate();
    const { balance } = useBalanceStore();
    
    // Fetch status icons from backend
    useEffect(() => {
        const fetchStatusIcons = async () => {
            try {
                const response = await fetch('/api/status/public');
                if (response.ok) {
                    const statuses: StatusIcon[] = await response.json();
                    const iconsMap: Record<string, string> = {};
                    console.log(statuses);
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
                    console.log('Status icons loaded:', iconsMap);
                } else {
                    console.error('Failed to fetch status icons:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Failed to fetch status icons:', error);
            }
        };
        
        fetchStatusIcons();
    }, []);

    // Apply animation styles
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = animationStyles;
        document.head.appendChild(styleElement);
        
    
        
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === transactions.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(transactions.map((item) => item._id)));
        }
    };

    const deleteSelected = () => {
        console.log("Deleting transactions:", Array.from(selectedIds));
        setSelectedIds(new Set());
    };


    return (
        <div className="py-[2.105vw] sm:pt-[2.105vw] sm:pb-[23.105vw] sm:px-[9.111vw] px-[4.211vw] space-y-[1.2vw] sm:space-y-0">          
            <div className="sm:hidden mb-[3vw]">
                <Header />
            </div>
            
            {user?.blocked && (
                <div className="flex items-center justify-between ls:space-x-[1.111vw] sm:block hidden">
                    <span className="text-[1.179vw] sm:text-[0.7vw] ls:!text-[3.844vw] text-red-500 font-bold uppercase">Your account has been blocked, please contact support</span>
                </div>
            )}
            
            <div className="hidden sm:flex flex-col justify-between ls:space-x-[1.111vw] py-[5vw]">
                <span className="text-[7.679vw] font-black text-[#2e2e2e]">History</span>
                <div className="w-[25vw] h-[0.8vw] bg-[#4AB094] mt-[0.5vw]"></div>
            </div>

            <div className="mt-[2vw] hidden sm:block rounded-lg bg-white border border-gray-200 shadow-sm !mb-[8vw]">
                <div className="p-[3vw]">
                    <div className="flex items-center justify-between mb-[2vw]">
                        <div>
                            <p className="text-[2.5vw] font-medium text-gray-500">Current Balance</p>
                            <p className="text-[5.5vw] font-bold text-gray-900 mt-[0.5vw]">
                              
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
                            onClick={() => navigate('/payment')}
                            className="flex-1 bg-gray-100 text-gray-700 py-[2.5vw] rounded-lg font-medium text-[2.8vw] hover:bg-gray-200 transition-colors"
                        >
                            Deposit
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-[2vw] sm:flex-col space-y-[2vw] ">
                <div style={{ maxWidth: '100%', background: 'rgba(74, 176, 148, 0.1)' }} className="rounded-xl p-4 shadow-lg transition-all duration-500 ease-in-out">
                    <div className="flex justify-between items-center mb-[2vw]">
                        <p className="text-[1.5vw] sm:text-[3.5vw] font-bold text-[#2e2e2e]">Transaction Details</p>
                        <div className="flex space-x-[1vw]">
                            <button 
                                onClick={toggleSelectAll}
                                className="px-[1vw] py-[0.5vw] rounded-full text-[0.8vw] sm:text-[2.5vw] font-medium transition-all duration-300 bg-[#4AB094] text-white hover:bg-[#3a9a7e]"
                            >
                                {selectedIds.size === transactions.length && transactions.length > 0 ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                    </div>

                    {/* Original Table Layout */}
                    <div className="w-full mx-auto px-[1vw] sm:hidden">
                        <div className="grid grid-cols-[1.083vw_repeat(6,_7fr)_6vw] sm:grid-cols-[repeat(7,_1fr)] bg-white text-gray-700 font-semibold py-[1vw] px-[1.5vw] rounded-t-lg shadow-sm">
                            <div className="text-[2.5vw] sm:text-[0.9vw] font-bold flex items-center justify-center text-[#2e2e2e]">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.size === transactions.length && transactions.length > 0}
                                    onChange={toggleSelectAll}
                                    className="w-[1vw] h-[1vw] sm:w-[0.8vw] sm:h-[0.8vw] accent-[#4AB094]"
                                />
                            </div>
                            <div className="text-[1.1vw] sm:text-[1vw] font-bold flex items-center justify-center text-[#2e2e2e]">Date</div>
                            <div className="text-[1.1vw] sm:text-[1vw] font-bold flex items-center justify-center text-[#2e2e2e]">Type</div>
                            <div className="text-[1.1vw] sm:text-[1vw] font-bold flex items-center justify-center text-[#2e2e2e]">Sum</div>
                            <div className="text-[1.1vw] sm:text-[1vw] font-bold flex items-center justify-center text-[#2e2e2e]">Country</div>
                            <div className="text-[1.1vw] sm:text-[1vw] font-bold flex items-center justify-center text-[#2e2e2e]">PS</div>
                            <div className="text-[1.1vw] sm:text-[1vw] font-bold flex items-center justify-center text-[#2e2e2e]">ID</div>
                            <div className="text-[1.1vw] sm:text-[1vw] font-bold flex items-center justify-center text-[#2e2e2e]">STATUS</div>
                        </div>
                        <div className="flex flex-col bg-white rounded-b-lg min-h-[20vw] shadow-md overflow-hidden">
                            {!user ? (
                                <div className="flex justify-center h-full items-center">
                                    <div className="animate-spin rounded-full h-[5vw] w-[5vw] border-t-2 border-b-2 border-[#4AB094]"></div>
                                </div>
                            ) : (
                                <>
                                    {transactions.length > 0 ? (
                                        transactions.map((item) => {
                                            const normalizedPS = normalizePaymentSystem(item.ps);
                                            const amount = parseFloat(item.sum.toString());
                                            const isDeposit = item.type === 'deposit' || (item.type !== 'withdrawal' && amount > 0);
                                            const displayAmount = Math.abs(amount);
                                            
                                            return (
                                                <div
                                                    key={item._id}
                                                    className={`grid grid-cols-[1.083vw_repeat(6,_7fr)_6vw] sm:grid-cols-[repeat(7,_1fr)] py-[1vw] sm:py-[2vw] px-[1.5vw] items-center cursor-pointer transition-all duration-200 hover:bg-gray-50 border-b transaction-row ${selectedIds.has(item._id) ? "bg-[rgba(74,176,148,0.1)]" : ""}`}
                                                    onClick={() => {
                                                        if (window.innerWidth < 640) toggleSelection(item._id);
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.has(item._id)}
                                                        onChange={() => {
                                                            if (window.innerWidth >= 640) toggleSelection(item._id);
                                                        }}
                                                        className="w-[1vw] h-[1vw] sm:w-[0.8vw] sm:h-[0.8vw] accent-[#4AB094]"
                                                    />
                                                    <div className="sm:text-[2.5vw] text-[1vw] flex items-center justify-center font-medium">{formatDate(item.date)}</div>
                                                    <div className="sm:text-[2.5vw] text-[1vw] flex items-center justify-center">
                                                        <div className={`flex items-center space-x-[0.3vw] sm:space-x-[1vw] px-[0.5vw] py-[0.2vw] sm:px-[1.5vw] sm:py-[0.8vw] rounded-full ${
                                                            isDeposit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                        }`}>
                                                            <span className="text-[0.8vw] sm:text-[2.5vw] font-medium capitalize">
                                                                {item.type || (isDeposit ? 'deposit' : 'withdrawal')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={`sm:text-[2.5vw] text-[1vw] flex items-center justify-center font-bold ${
                                                        isDeposit ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                        {isDeposit ? '+' : '-'}${displayAmount.toLocaleString()}
                                                    </div>
                                                    <div className="sm:text-[2.5vw] text-[1vw] flex items-center justify-center">{item.country || "-"}</div>
                                                    <div className="sm:text-[2.5vw] flex items-center justify-center">
                                                        <div
                                                            className="flex items-center justify-center rounded-full sm:w-[6vw] sm:h-[6vw] w-[2.5vw] h-[2.5vw] transition-transform hover:scale-110"
                                                            style={{ backgroundColor: colors[normalizedPS] || "#ccc" }}
                                                        >
                                                            {imageSources[normalizedPS] ? (
                                                                <img src={imageSources[normalizedPS]} alt={normalizedPS} className="w-[1.5vw] sm:w-[3vw]" />
                                                            ) : (
                                                                <span>{normalizedPS}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="sm:text-[2.5vw] flex items-center justify-center text-[0.8vw] font-medium text-gray-600">{item.transaction_id}</div>
                                                    <div className="sm:text-[2.5vw] flex items-center justify-center text-[1vw]">
                                                        {statusIcons[item.status] ? (
                                                            <img 
                                                                src={statusIcons[item.status].startsWith('http') ? statusIcons[item.status] : statusIcons[item.status]} 
                                                                alt={item.status} 
                                                                className="w-[2.7vw] sm:w-[6vw] object-contain" 
                                                                onError={(e) => {
                                                                    console.error(`Failed to load status icon for ${item.status}:`, statusIcons[item.status]);
                                                                    e.currentTarget.style.display = 'none';
                                                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                                    if (fallback) fallback.style.display = 'inline-block';
                                                                }}
                                                            />
                                                        ) : null}
                                                        <span 
                                                            className={`px-[0.8vw] py-[0.3vw] sm:px-[2vw] sm:py-[1vw] rounded-full text-white text-[0.8vw] sm:text-[2.5vw] font-medium ${statusIcons[item.status] ? 'hidden' : ''} ${
                                                                item.status === "success" ? "bg-[#4AB094]" : 
                                                                item.status === "pending" ? "bg-[#F3BA2F]" : "bg-[#F28B49]"
                                                            }`}
                                                            style={{ display: statusIcons[item.status] ? 'none' : 'inline-block' }}
                                                        >
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="flex flex-col justify-center items-center py-[5vw] space-y-[1vw]">
                                            <div className="w-[5vw] h-[5vw] sm:w-[15vw] sm:h-[15vw] rounded-full bg-[rgba(74,176,148,0.1)] flex items-center justify-center">
                                                <svg className="w-[2.5vw] h-[2.5vw] sm:w-[7.5vw] sm:h-[7.5vw] text-[#4AB094]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                            </div>
                                            <p className="text-[1.2vw] sm:text-[4vw] text-gray-600">You don't have any transactions</p>
                                            <p className="text-[0.9vw] sm:text-[3vw] text-gray-500">Your transaction history will appear here</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="w-full mx-auto hidden sm:block">
                        {!user ? (
                            <div className="flex justify-center items-center py-[10vw]">
                                <div className="animate-spin rounded-full h-[10vw] w-[10vw] border-t-2 border-b-2 border-[#4AB094]"></div>
                            </div>
                        ) : (
                            <>
                                {transactions.length > 0 ? (
                                    <div className="space-y-[3vw]">
                                        {transactions.map((item) => {
                                            const normalizedPS = normalizePaymentSystem(item.ps);
                                            const amount = parseFloat(item.sum.toString());
                                            const isDeposit = item.type === 'deposit' || (item.type !== 'withdrawal' && amount > 0);
                                            const displayAmount = Math.abs(amount);
                                            
                                            return (
                                                <div
                                                    key={item._id}
                                                    className={`bg-white rounded-xl p-[4vw] shadow-md border transition-all duration-300 hover:shadow-lg ${
                                                        selectedIds.has(item._id) ? "border-[#4AB094] bg-[rgba(74,176,148,0.05)]" : "border-gray-200"
                                                    }`}
                                                    onClick={() => toggleSelection(item._id)}
                                                >
                                                    {/* Header with checkbox and status */}
                                                    <div className="flex items-center justify-between mb-[3vw]">
                                                        <div className="flex items-center space-x-[2vw]">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedIds.has(item._id)}
                                                                onChange={() => toggleSelection(item._id)}
                                                                className="w-[4vw] h-[4vw] accent-[#4AB094]"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                            <span className="text-[3vw] font-medium text-gray-600">
                                                                {formatDate(item.date)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            {statusIcons[item.status] ? (
                                                                <img 
                                                                    src={statusIcons[item.status]} 
                                                                    alt={item.status} 
                                                                    className="w-[6vw] object-contain" 
                                                                    onError={(e) => {
                                                                        e.currentTarget.style.display = 'none';
                                                                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                                        if (fallback) fallback.style.display = 'inline-block';
                                                                    }}
                                                                />
                                                            ) : null}
                                                            <span 
                                                                className={`px-[2vw] py-[1vw] rounded-full text-white text-[2.5vw] font-medium ${statusIcons[item.status] ? 'hidden' : ''} ${
                                                                    item.status === "success" ? "bg-[#4AB094]" : 
                                                                    item.status === "pending" ? "bg-[#F3BA2F]" : "bg-[#F28B49]"
                                                                }`}
                                                                style={{ display: statusIcons[item.status] ? 'none' : 'inline-block' }}
                                                            >
                                                                {item.status}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Main content */}
                                                    <div className="flex items-center justify-between mb-[3vw]">
                                                        <div className="flex items-center space-x-[3vw]">
                                                            <div
                                                                className="flex items-center justify-center rounded-full w-[10vw] h-[10vw]"
                                                                style={{ backgroundColor: colors[normalizedPS] || "#ccc" }}
                                                            >
                                                                {imageSources[normalizedPS] ? (
                                                                    <img src={imageSources[normalizedPS]} alt={normalizedPS} className="w-[6vw]" />
                                                                ) : (
                                                                    <span className="text-[2vw] text-white font-bold">{normalizedPS}</span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <div className={`flex items-center space-x-[1vw] px-[2vw] py-[1vw] rounded-full mb-[1vw] ${
                                                                    isDeposit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                                }`}>
                                                                    <span className="text-[3vw] font-medium capitalize">
                                                                        {item.type || (isDeposit ? 'deposit' : 'withdrawal')}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[2.5vw] text-gray-500">{normalizedPS}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className={`text-[5vw] font-bold ${
                                                                isDeposit ? 'text-green-600' : 'text-red-600'
                                                            }`}>
                                                                {isDeposit ? '+' : '-'}${displayAmount.toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Details */}
                                                    <div className="border-t border-gray-100 pt-[3vw] space-y-[2vw]">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[3vw] text-gray-500">Transaction ID:</span>
                                                            <span className="text-[3vw] font-medium text-gray-800">{item.transaction_id}</span>
                                                        </div>
                                                        {item.country && (
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[3vw] text-gray-500">Country:</span>
                                                                <span className="text-[3vw] font-medium text-gray-800">{item.country}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col justify-center items-center py-[15vw] space-y-[3vw]">
                                        <div className="w-[15vw] h-[15vw] rounded-full bg-[rgba(74,176,148,0.1)] flex items-center justify-center">
                                            <svg className="w-[7.5vw] h-[7.5vw] text-[#4AB094]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                            </svg>
                                        </div>
                                        <p className="text-[4vw] text-gray-600">You don't have any transactions</p>
                                        <p className="text-[3vw] text-gray-500">Your transaction history will appear here</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex justify-center items-center mt-[2vw] sm:hidden">
                        <button
                            onClick={deleteSelected}
                            disabled={selectedIds.size === 0}
                            className="px-[3.737vw] py-[0.8vw] bg-[#4AB094] font-medium text-[0.937vw] text-white rounded-full transition-all duration-300 hover:bg-[#3a9a7e] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-md"
                        >
                            {selectedIds.size > 0 ? `Delete Selected (${selectedIds.size})` : 'Delete'}
                        </button>
                    </div>
                </div>
                <div className="hidden sm:flex justify-center items-center mt-[4vw]">
                    <button
                        onClick={deleteSelected}
                        disabled={selectedIds.size === 0}
                        className="px-[15.737vw] py-[2vw] bg-[#4AB094] text-[4vw] text-white rounded-full transition-all duration-300 hover:bg-[#3a9a7e] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed shadow-md"
                    >
                        {selectedIds.size > 0 ? `Delete Selected (${selectedIds.size})` : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HistoryComponent;
