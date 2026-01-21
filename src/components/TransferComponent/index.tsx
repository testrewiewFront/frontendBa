import { Header } from "../../components";
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useUserStore from '../../store/userStore';
import api from '../../api';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import USDT from "../../assets/icons/usdt.svg";
import BTC from "../../assets/icons/btc.svg";
import ETH from "../../assets/icons/eth.svg";
import EUR from "../../assets/icons/eur.svg";
import USDTD from "../../assets/icons/usdtd.svg";
import USD from "../../assets/icons/usd.svg";
import { useBalanceStore } from "../../store/balanceStore";

interface TransferFormInputs {
    currency: string;
    fullName: string;
    wallet: string;
    network: string;
    amount: string;
}

interface CurrencyCard {
    title: string;
    color: string;
    image: string;
    label: string;
    bg: string;
    rate: number;
    network: string;
    processingTime: string;
    fee: string;
}

interface TransferStep {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'active' | 'completed';
    estimatedTime: string;
}

// Animation styles
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

  .currency-card {
    transition: all 0.3s ease;
  }

  .currency-card:hover {
    transform: translateY(-5px);
  }

  .currency-card.active {
    box-shadow: 0 0 0 2px #4AB094;
  }
`;

// Currency card data
const currencyCards: CurrencyCard[] = [
    {
        title: "USDT",
        color: "#4AB094",
        image: USDT,
        label: "trc20",
        bg: "rgba(74, 176, 148, 0.2)",
        rate: 1.00,
        network: "TRC20",
        processingTime: "10-30 minutes",
        fee: "1 USDT"
    },
    {
        title: "BTC",
        color: "#F28B49",
        image: BTC,
        label: "btc",
        bg: "rgba(242, 139, 73, 0.2)",
        rate: 65000.00,
        network: "BTC",
        processingTime: "30-60 minutes",
        fee: "0.0001 BTC"
    },
    {
        title: "ETH",
        color: "#6489A4",
        image: ETH,
        label: "eth",
        bg: "rgba(100, 137, 164, 0.2)",
        rate: 3500.00,
        network: "ETH",
        processingTime: "15-45 minutes",
        fee: "0.002 ETH"
    },
    {
        title: "USD",
        color: "#77C46F",
        image: USD,
        label: "usd",
        bg: "rgba(119, 196, 111, 0.2)",
        rate: 1.00,
        network: "SWIFT",
        processingTime: "1-3 business days",
        fee: "25 USD"
    },
    {
        title: "EUR",
        color: "#3CBEEF",
        image: EUR,
        label: "euro",
        bg: "rgba(60, 190, 239, 0.2)",
        rate: 1.08,
        network: "SEPA",
        processingTime: "1-2 business days",
        fee: "20 EUR"
    },
    {
        title: "DASH",
        color: "#F3BA2F",
        image: USDTD,
        label: "dash",
        bg: "rgba(243, 186, 47, 0.2)",
        rate: 32.50,
        network: "DASH",
        processingTime: "5-15 minutes",
        fee: "0.01 DASH"
    },
];

// Transfer limits for the information card
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
        value: "1-3 days",
        label: "Transfer term"
    }
];

// Transfer steps for the progress visualization
const transferSteps: TransferStep[] = [
    {
        id: 1,
        title: "Request Submitted",
        description: "Your transfer request has been submitted and is being processed",
        status: "pending",
        estimatedTime: "1-2 minutes"
    },
    {
        id: 2,
        title: "Verification",
        description: "Verifying transaction details and security checks",
        status: "pending",
        estimatedTime: "5-10 minutes"
    },
    {
        id: 3,
        title: "Processing",
        description: "Transaction is being processed by the network",
        status: "pending",
        estimatedTime: "15-30 minutes"
    },
    {
        id: 4,
        title: "Confirmation",
        description: "Waiting for network confirmations",
        status: "pending",
        estimatedTime: "Varies by network"
    },
    {
        id: 5,
        title: "Completed",
        description: "Transfer has been successfully completed",
        status: "pending",
        estimatedTime: ""
    }
];

// Priority options for transfer speed


const schema = yup.object().shape({
    currency: yup.string().required('Currency is required'),
    fullName: yup.string().required('Full name is required'),
    wallet: yup.string().required('Wallet address is required').min(10, 'Enter a valid wallet address'),
    network: yup.string().required('Network is required'),
    amount: yup.string().required('Amount is required').test('is-positive', 'Amount must be greater than 0', (value) => {
        console.log('🔍 Amount validation test:', { value, type: typeof value, isEmpty: !value });
        if (!value) return false;
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue > 0;
    })
});

const TransferComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    console.log('🔧 TransferComponent initialized');
    // Form handling
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<TransferFormInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            network: 'TRC20',
            currency: '',
            fullName: '',
            wallet: '',
            amount: ''
        }
    });
    
    // Get user from store
    const user = useUserStore((state) => state.user);
    const { balance } = useBalanceStore();
    
    // Component state
    const [loading, setLoading] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
    const [conversionRate, setConversionRate] = useState<number | null>(null);
    const [showTransferProgress, setShowTransferProgress] = useState(false);
    const [currentTransferStep, setCurrentTransferStep] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [transferComplete, setTransferComplete] = useState(false);
    
    // Refs - removed amountInputRef to avoid conflict with react-hook-form
    
    // Watch form values
    const watchAmount = watch('amount');
    
    // Debug form state
    useEffect(() => {
        console.log('📊 Form state debug:', {
            watchAmount,
            errors: errors.amount,
            selectedCurrency,
            formValues: watch()
        });
    }, [watchAmount, errors.amount, selectedCurrency, watch]);
    
    // Add animation styles to document head
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = animationStyles;
        document.head.appendChild(styleElement);
        
        // Simulate API loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        
        // Auto-select USDT by default
        if (!selectedCurrency) {
            handleCurrencySelect('USDT');
        }
        
        return () => {
            document.head.removeChild(styleElement);
            clearTimeout(timer);
        };
    }, []);
    
    // Calculate USD value when amount or currency changes
    useEffect(() => {
        if (selectedCurrency && watchAmount && !isNaN(Number(watchAmount))) {
            const selectedCard = currencyCards.find(card => card.title === selectedCurrency);
            if (selectedCard) {
                setConversionRate(selectedCard.rate);
            }
        } else {
            setConversionRate(null);
        }
    }, [watchAmount, selectedCurrency]);
    

    
    // Handle currency selection
    const handleCurrencySelect = (currency: string) => {
        console.log('💱 Currency selected:', currency);
        setSelectedCurrency(currency);
        setValue('currency', currency, { shouldValidate: true });
        
        // Auto-fill network based on selected currency
        const selectedCard = currencyCards.find(card => card.title === currency);
        if (selectedCard) {
            console.log('🌐 Auto-filling network:', selectedCard.network);
            setValue('network', selectedCard.network, { shouldValidate: true });
        }
        
        // Focus on amount input after selecting currency
        setTimeout(() => {
            const amountInput = document.querySelector('input[name="amount"]') as HTMLInputElement;
            if (amountInput) {
                amountInput.focus();
            }
        }, 100);
    };
    
    // Calculate estimated fee based on priority
      
    
    // Handle priority selection
 
    const onSubmit: SubmitHandler<TransferFormInputs> = async data => {
        console.log('🚀 Form submission started');
        console.log('📝 Form data received:', data);
        console.log('🔍 Form validation errors:', errors);
        console.log('💰 Selected currency:', selectedCurrency);
        console.log('👤 User data:', user);
        
        // Check if form has validation errors
        if (Object.keys(errors).length > 0) {
            console.log('❌ Form has validation errors, stopping submission');
            return;
        }
        
        if (!selectedCurrency) {
            console.log('❌ No currency selected');
            setNotificationType('error');
            setNotificationMessage('Please select a currency');
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
            return;
        }
        
        if (!user) {
            console.log('❌ No user data available');
            setNotificationType('error');
            setNotificationMessage('User data not available');
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
            return;
        }
        
        console.log('✅ Validation passed, starting loading');
        // Start loading but don't show progress yet
        setLoading(true);
        
        // Enhanced message with additional fields
        const message = `
        Currency: ${data.currency}
        Full Name: ${data.fullName}
        Wallet: ${data.wallet}
        Network: ${data.network}
        Amount: ${data.amount}
        Priority: Standard
        USD Value: $${conversionRate && !isNaN(Number(data.amount)) ? (Number(data.amount) * conversionRate).toFixed(2) : '0.00'}
        `;
        
        console.log('📧 Prepared message:', message);
        
        const formData = {
            email: user.email,
            message,
            userId: user.account_id.toString(),
            subject: `Transfer - ${data.currency}`
        };
        
        console.log('📦 Form data for API:', formData);

        try {
            console.log('🔄 Starting transfer process');
            // Now show transfer progress after form data is prepared
            setShowTransferProgress(true);
            setCurrentTransferStep(1);
            console.log('📊 Transfer progress shown, step 1');
            
            // Simulate verification step
            console.log('⏳ Starting verification step');
            await new Promise(resolve => {
                setTimeout(() => {
                    console.log('✅ Verification step completed');
                    setCurrentTransferStep(2);
                    resolve(null);
                }, 2000);
            });
            
            // Simulate processing step
            console.log('⏳ Starting processing step');
            await new Promise(resolve => {
                setTimeout(() => {
                    console.log('✅ Processing step completed');
                    setCurrentTransferStep(3);
                    resolve(null);
                }, 3000);
            });
            
            // Send the actual request
            console.log('📡 Sending API request to /send-mail');
            console.log('🌐 API base URL:', api.defaults.baseURL);
            const response = await api.post('/send-mail', formData, {
                baseURL: 'https://api.international-payments.cc/api',
            });
            console.log('✅ Mail sent successfully:', response.data);
            
            // Simulate confirmation step
            await new Promise(resolve => {
                setTimeout(() => {
                    setCurrentTransferStep(4);
                    resolve(null);
                }, 2000);
            });
            
            // Simulate completion step
            await new Promise(resolve => {
                setTimeout(() => {
                    setCurrentTransferStep(5);
                    setTransferComplete(true);
                    resolve(null);
                }, 1500);
            });
            
            // Show success notification
            setNotificationType('success');
            setNotificationMessage('Transfer request submitted successfully!');
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
            
            // Reset form after a delay to allow the user to see the completion
            setTimeout(() => {
                reset();
                setSelectedCurrency(null);
                setShowTransferProgress(false);
                setCurrentTransferStep(0);
                setTransferComplete(false);
            }, 5000);
            
        } catch (error: any) {
            console.error('❌ Error sending mail:', error);
            console.error('📋 Error details:', {
                message: error?.message || 'Unknown error',
                response: error?.response?.data,
                status: error?.response?.status,
                statusText: error?.response?.statusText,
                stack: error?.stack
            });
            setNotificationType('error');
            setNotificationMessage(`Failed to submit transfer request: ${error?.message || 'Unknown error'}`);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
            setShowTransferProgress(false);
        } finally {
            console.log('🏁 Form submission completed, stopping loading');
            setLoading(false);
        }
    };

    return (
        <div className="py-[2.105vw] sm:pt-[2.105vw] sm:pb-[23.105vw] sm:px-[9.111vw] px-[4.211vw] space-y-[1.2vw] sm:space-y-0 ">
            {/* Notification */}
            {showNotification && (
                <div className={`fixed top-[5vw] right-[5vw] py-[1vw] px-[2vw] rounded-lg shadow-lg z-50 animate-fade-in-out ${notificationType === 'success' ? 'bg-[#4AB094]' : 'bg-[rgba(235,87,87,0.9)]'}`}>
                    <p className="text-[1vw] sm:text-[3vw] text-white">{notificationMessage}</p>
                </div>
            )}
            
            {/* Transfer Status Modal - Minimalistic */}
            {showTransferProgress && (
                <div 
                    className="fixed inset-0  bg-opacity-20 flex items-center justify-center z-50"
                    onClick={() => setShowTransferProgress(false)}
                >
                    <div 
                        className="bg-white/80 backdrop-blur-md rounded-2xl p-[1.5vw] max-w-[35vw] sm:max-w-[85vw] w-full mx-[2vw] shadow-xl border border-white/30"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with Close Button */}
                        <div className="flex items-center justify-between mb-[1.5vw]">
                            <h3 className="text-[1.3vw] sm:text-[3.5vw] font-semibold text-gray-800">Processing Transfer</h3>
                            <button 
                                onClick={() => setShowTransferProgress(false)}
                                className="w-[2vw] h-[2vw] sm:w-[5vw] sm:h-[5vw] rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                                <svg className="w-[1vw] h-[1vw] sm:w-[2.5vw] sm:h-[2.5vw] text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Progress Circle */}
                        <div className="flex justify-center mb-[1.5vw]">
                            <div className="relative w-[8vw] h-[8vw] sm:w-[20vw] sm:h-[20vw]">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                                    <circle 
                                        cx="50" 
                                        cy="50" 
                                        r="45" 
                                        stroke="#4AB094" 
                                        strokeWidth="8" 
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(currentTransferStep / 5) * 283} 283`}
                                        className="transition-all duration-500"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[1.5vw] sm:text-[4vw] font-bold text-[#4AB094]">
                                        {Math.round((currentTransferStep / 5) * 100)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Current Step */}
                        <div className="text-center">
                            {transferSteps.map((step, index) => {
                                if (currentTransferStep === step.id) {
                                    return (
                                        <div key={index}>
                                            <p className="text-[1.1vw] sm:text-[3vw] font-medium text-gray-800 mb-[0.5vw]">
                                                {step.title}
                                            </p>
                                            <div className="flex items-center justify-center space-x-[0.5vw]">
                                                <div className="w-[0.4vw] h-[0.4vw] sm:w-[1vw] sm:h-[1vw] rounded-full bg-[#4AB094] animate-pulse"></div>
                                                <span className="text-[0.9vw] sm:text-[2.5vw] text-gray-600">Processing...</span>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                            
                            {transferComplete && (
                                <div className="flex items-center justify-center space-x-[1vw]">
                                    <div className="w-[2vw] h-[2vw] sm:w-[5vw] sm:h-[5vw] rounded-full bg-green-500 flex items-center justify-center">
                                        <svg className="w-[1vw] h-[1vw] sm:w-[2.5vw] sm:h-[2.5vw] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[1.1vw] sm:text-[3vw] text-green-600 font-semibold">Transfer Completed!</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
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
                                        onClick={() => navigate('/payment')}
                                        className="flex-1 bg-[#4AB094] text-white py-[2.5vw] rounded-lg font-medium text-[2.8vw] hover:bg-[#3a9a7e] transition-colors"
                                    >
                                        Deposit
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
                    <div className="w-[70vw] sm:w-full space-y-[1vw]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 space-y-4 sm:space-y-0">            
                            <div className="flex space-x-[1vw] sm:space-x-[2vw]">
                                {['All', 'USDT', 'BTC', 'ETH', 'DASH', 'EUR'].map((tab, index) => (
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
                                    Select Currency
                                </p>
                                <p className="text-[1.1vw] m-0 pl-[0.5vw] sm:text-[2.5vw] text-black">
                                    Choose a currency to transfer funds
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 mt-4 sm:grid-cols-2">
                                {currencyCards
                                    .filter(card => activeTab === 0 || card.title === ['All', 'USDT', 'BTC', 'ETH', 'DASH', 'EUR'][activeTab])
                                    /**
 * Renders a currency card with details for each currency.
 * 
 * @param {CurrencyCard} card - The currency card data containing title, color, image, label, etc.
 * @param {number} index - The index of the current card in the map iteration.
 * @returns {JSX.Element} A styled div element representing a currency card.
 */
                                    .map((card, index) => (
                                    <div 
                                        key={index} 
                                        className={`currency-card p-3 rounded-lg transition-all duration-300 hover:shadow-md cursor-pointer ${selectedCurrency === card.title ? 'active' : ''}`}
                                        style={{ backgroundColor: card.bg }}
                                        onClick={() => handleCurrencySelect(card.title)}
                                    >
                                        <div className="flex items-center space-x-[1vw]">
                                            <div style={{ backgroundColor: card.color }} className="w-[3.658vw] h-[3.684vw] sm:w-[7.778vw] sm:h-[7.778vw] rounded-full flex justify-center items-center">
                                                <img src={card.image} alt={`${card.title} logo`} className="w-[1.842vw] sm:w-[4.444vw]" />
                                            </div>
                                            <div>
                                                <p className="text-[1.247vw] m-0 sm:text-[4.111vw] font-bold">{card.title}</p>
                                                <p className="text-[0.937vw]  m-0 sm:text-[3.267vw] text-gray-600">{card.label}</p>
                                            </div>
                                        </div>
                                        
                                        
                                    </div>
                                ))}
                            </div>
                        </div>
                  
                        {selectedCurrency && (
                            <div className="mt-[2vw] p-[2vw] bg-white rounded-xl shadow-lg">
                                <h3 className="text-[1.5vw] sm:text-[4vw] font-bold mb-[1vw]">Transfer Details</h3>
                                
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-[1.5vw]">
                                    
                                    <div className="space-y-[0.5vw]">
                                        <label className="text-[1vw] sm:text-[3vw] font-medium flex items-center">
                                            <div className="w-[0.5vw] h-[0.5vw] sm:w-[1.5vw] sm:h-[1.5vw] rounded-full mr-[0.5vw] bg-[#4AB094]"></div>
                                            Full Name
                                        </label>
                                        <input 
                                            type="text" 
                                            {...register('fullName')} 
                                            className="w-full py-[0.8vw] px-[1vw] rounded-lg border border-gray-300 focus:border-[#4AB094] focus:ring-1 focus:ring-[#4AB094] outline-none transition-all" 
                                            placeholder="Enter your full name"
                                        />
                                        {errors.fullName && <p className="text-red-500 text-[0.8vw] sm:text-[2.5vw]">{errors.fullName.message}</p>}
                                    </div>

                                    <div className="space-y-[0.5vw]">
                                        <label className="text-[1vw] sm:text-[3vw] font-medium flex items-center">
                                            <div className="w-[0.5vw] h-[0.5vw] sm:w-[1.5vw] sm:h-[1.5vw] rounded-full mr-[0.5vw] bg-[#4AB094]"></div>
                                            Wallet Address
                                        </label>
                                        <input 
                                            type="text" 
                                            {...register('wallet')} 
                                            className="w-full py-[0.8vw] px-[1vw] rounded-lg border border-gray-300 focus:border-[#4AB094] focus:ring-1 focus:ring-[#4AB094] outline-none transition-all" 
                                            placeholder="Enter wallet address"
                                        />
                                        {errors.wallet && <p className="text-red-500 text-[0.8vw] sm:text-[2.5vw]">{errors.wallet.message}</p>}
                                    </div>

                                    <div className="space-y-[0.5vw]">
                                        <label className="text-[1vw] sm:text-[3vw] font-medium flex items-center">
                                            <div className="w-[0.5vw] h-[0.5vw] sm:w-[1.5vw] sm:h-[1.5vw] rounded-full mr-[0.5vw] bg-[#4AB094]"></div>
                                            Network
                                        </label>
                                        <input 
                                            type="text" 
                                            {...register('network')} 
                                            className="w-full py-[0.8vw] px-[1vw] rounded-lg border border-gray-300 focus:border-[#4AB094] focus:ring-1 focus:ring-[#4AB094] outline-none transition-all" 
                                            placeholder="Network type"
                                        />
                                        {errors.network && <p className="text-red-500 text-[0.8vw] sm:text-[2.5vw]">{errors.network.message}</p>}
                                    </div>

                                    <div className="space-y-[0.5vw]">
                                        <label className="text-[1vw] sm:text-[3vw] font-medium flex items-center">
                                            <div className="w-[0.5vw] h-[0.5vw] sm:w-[1.5vw] sm:h-[1.5vw] rounded-full mr-[0.5vw] bg-[#4AB094]"></div>
                                            Amount
                                        </label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                {...register('amount')} 
                                                className="w-full py-[0.8vw] px-[1vw] pr-[3vw] rounded-lg border border-gray-300 focus:border-[#4AB094] focus:ring-1 focus:ring-[#4AB094] outline-none transition-all" 
                                                placeholder="Enter amount"
                                            />
                                            {selectedCurrency && (
                                                <div className="absolute right-[1vw] top-1/2 transform -translate-y-1/2 text-[0.9vw] sm:text-[2.5vw] text-[#4AB094] font-medium">
                                                    {selectedCurrency}
                                                </div>
                                            )}
                                        </div>
                                        {errors.amount && <p className="text-red-500 text-[0.8vw] sm:text-[2.5vw]">{errors.amount.message}</p>}
                                        {conversionRate && watchAmount && !isNaN(Number(watchAmount)) && (
                                            <p className="text-[0.8vw] sm:text-[2.5vw] text-[#4AB094] font-medium">
                                                ≈ ${(Number(watchAmount) * conversionRate).toFixed(2)} USD
                                            </p>
                                        )}
                                    </div>
                                    <div >
                                        <button 
                                            type="submit" 
                                            className="w-full py-[0.8vw] sm:py-[2.5vw] bg-[#4AB094] text-white rounded-lg font-medium hover:bg-[#3a9a7e] transition-colors"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <div className="flex items-center justify-center space-x-[0.8vw]">
                                                    <div className="animate-spin rounded-full h-[1.2vw] w-[1.2vw] border-2 border-white border-t-transparent"></div>
                                                    <span>Processing...</span>
                                                </div>
                                            ) : 'Submit Transfer'}
                                        </button>
                                    </div>
                                </form>
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
                            
                            
                        </div>
                        
                        {/* Current Balance Card - Desktop */}
                        <div className="mt-[2vw] sm:hidden rounded-lg bg-white border border-gray-200 shadow-sm">
                            <div className="p-[1.5vw]">
                                <div className="flex items-center justify-between mb-[1vw]">
                                    <div>
                                        <p className="text-[0.9vw] font-medium text-gray-500">Current Balance</p>
                                        <p className="text-[2.2vw] font-bold text-gray-900 mt-[0.2vw]">
                                            ${balance || '0.00'}
                                        </p>
                                    </div>
                                    <div className="w-[1.2vw] h-[1.2vw] bg-green-100 rounded-full flex items-center justify-center">
                                        <div className="w-[0.5vw] h-[0.5vw] bg-green-500 rounded-full"></div>
                                    </div>
                                </div>
                                
                                <div className="flex space-x-[0.8vw]">
                                    <button 
                                        onClick={() => navigate('/payment')}
                                        className="flex-1 bg-[#4AB094] text-white py-[0.8vw] rounded-lg font-medium text-[0.9vw] hover:bg-[#3a9a7e] transition-colors"
                                    >
                                        Deposit
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
                        
                        {/* Security Tips */}
                        <div className="mt-[2vw] rounded-xl p-4 shadow-lg bg-white">
                            <div className="space-y-[0.5vw] mb-[1.5vw]">
                                <p className="text-[1.5vw] sm:text-[4vw] font-bold text-black">Security Tips</p>
                            </div>
                            
                            <ul className="space-y-[1vw]">
                                {[
                                    'Always verify recipient details before transfer',
                                    'Never share your account credentials',
                                    'Contact support if you notice suspicious activity'
                                ].map((tip, index) => (
                                    <li key={index} className="flex items-start space-x-[1vw] p-[0.8vw] rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="w-[1.8vw] h-[1.8vw] sm:w-[4vw] sm:h-[4vw] rounded-full bg-[rgba(74,176,148,0.1)] flex-shrink-0 flex items-center justify-center text-[#4AB094]">
                                            <span className="text-[0.9vw] sm:text-[2.5vw] font-bold">{index + 1}</span>
                                        </div>
                                        <span className="text-[0.9vw] sm:text-[2.8vw] text-gray-700">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
    );
}

export default TransferComponent;
