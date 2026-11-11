import React, { useState, useEffect, useMemo, useRef, useCallback, Component } from 'react';
import {
  Plus,
  Wallet,
  Trash2,
  Edit3,
  Download,
  Upload,
  Sparkles,
  Check,
  X,
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Briefcase,
  Gift,
  Coffee,
  MoreHorizontal,
  Palette,
  Settings,
  Heart,
  Zap,
  Wrench,
  BookOpen,
  Gamepad2,
  CreditCard,
  Award,
  DollarSign,
  RotateCcw,
  Sun,
  Moon,
  Droplets,
  TrendingUp,
  RefreshCw,
  ShieldCheck,
  HardDrive,
  FileJson,
  Copy,
  KeyRound,
  Wifi,
  WifiOff,
  Share2,
  AlertCircle
} from 'lucide-react';

// --- ERROR BOUNDARY ---
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07111e] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center mb-4 text-rose-400">
            <X className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">တစ်ခုခု မှားယွင်းသွားပါသည်</h2>
          <p className="text-xs opacity-75 max-w-md mb-6">
            {this.state.error?.toString() || 'အချက်အလက်များ တင်ဆောင်ရာတွင် အမှားအယွင်းရှိခဲ့ပါသည်။'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm shadow-lg"
          >
            ပြန်လည်စတင်မည် (Reload App)
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- PAYMENT METHODS ---
const PAYMENT_METHODS = [
  { id: 'cash', name: 'ငွေသား', color: '#10b981' },
  { id: 'kpay', name: 'KPay', color: '#3b82f6' },
  { id: 'other', name: 'အခြား', color: '#a855f7' }
];

// --- DEFAULT CATEGORIES ---
const DEFAULT_CATEGORIES = {
  income: [
    { id: 'sales', name: 'ရောင်းရငွေ (Sales)', icon: 'ShoppingBag', color: '#10b981' },
    { id: 'salary', name: 'လစာ (Salary)', icon: 'Briefcase', color: '#3b82f6' },
    { id: 'profit', name: 'အမြတ်ငွေ (Profit)', icon: 'TrendingUp', color: '#8b5cf6' },
    { id: 'bonus', name: 'လက်ဆောင်/ဆုကြေး', icon: 'Gift', color: '#ec4899' },
    { id: 'other_in', name: 'အခြားဝင်ငွေ (Other)', icon: 'Sparkles', color: '#f59e0b' },
  ],
  expense: [
    { id: 'ingredients', name: 'ကုန်ကြမ်း/ပစ္စည်းဖိုး', icon: 'ShoppingBag', color: '#ef4444' },
    { id: 'food', name: 'အစားအသောက် (Food)', icon: 'Utensils', color: '#f97316' },
    { id: 'transport', name: 'သွားလာစရိတ် (Transport)', icon: 'Car', color: '#0ea5e9' },
    { id: 'bills', name: 'မီးဖိုး/ဖုန်းဘေလ်/အိမ်လခ', icon: 'Home', color: '#a855f7' },
    { id: 'general', name: 'အထွေထွေစရိတ် (General)', icon: 'Coffee', color: '#f43f5e' },
    { id: 'other_out', name: 'အခြားထွက်ငွေ (Other)', icon: 'MoreHorizontal', color: '#64748b' },
  ]
};

const ICON_MAP = {
  ShoppingBag, Briefcase, TrendingUp, Gift, Sparkles,
  Utensils, Car, Home, Coffee, MoreHorizontal, Wallet,
  Heart, Zap, Wrench, BookOpen, Gamepad2, CreditCard, Award, DollarSign
};

const AVAILABLE_ICONS = Object.keys(ICON_MAP);
const AVAILABLE_COLORS = [
  '#10b981', '#059669', '#3b82f6', '#0ea5e9', '#6366f1',
  '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e', '#ef4444',
  '#f97316', '#f59e0b', '#84cc16', '#14b8a6', '#64748b'
];

// --- iOS LIQUID GLASS THEMES ---
const THEMES = [
  {
    id: 'ios_droplet',
    name: 'iPhone Water Droplet',
    darkBg: 'bg-[#07111e]',
    lightBg: 'bg-[#dff0fb]',
    blob1: 'bg-sky-400/45',
    blob2: 'bg-indigo-500/35',
    blob3: 'bg-cyan-300/40',
    accent: 'from-sky-400 via-cyan-400 to-blue-600'
  },
  {
    id: 'crystal_pearl',
    name: 'Crystal Pearl',
    darkBg: 'bg-[#0d0f17]',
    lightBg: 'bg-[#eaf1f8]',
    blob1: 'bg-violet-400/35',
    blob2: 'bg-sky-300/35',
    blob3: 'bg-pink-300/35',
    accent: 'from-indigo-400 via-purple-400 to-pink-500'
  },
  {
    id: 'aurora',
    name: 'Midnight Aurora',
    darkBg: 'bg-[#090d16]',
    lightBg: 'bg-[#e5edff]',
    blob1: 'bg-indigo-600/40',
    blob2: 'bg-emerald-500/30',
    blob3: 'bg-fuchsia-600/30',
    accent: 'from-cyan-400 to-indigo-500'
  }
];

const BURMESE_MONTHS = [
  'ဇန်နဝါရီ', 'ဖေဖော်ဝါရီ', 'မတ်', 'ဧပြီ', 'မေ', 'ဇွန်',
  'ဇူလိုင်', 'ဩဂုတ်', 'စက်တင်ဘာ', 'အောက်တိုဘာ', 'နိုဝင်ဘာ', 'ဒီဇင်ဘာ'
];

const getTodayStr = () => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '2026-11-11';
  }
};

// --- REALTIME MULTI-DEVICE CLOUD SYNC ENGINE (FIREBASE REALTIME DB REST) ---
// High-availability, zero-block CORS Realtime Cloud Endpoint
const REALTIME_ENDPOINT = 'https://liquid-glass-tracker-default-rtdb.firebaseio.com';

const cleanSyncKey = (rawKey) => {
  if (!rawKey) return '';
  return rawKey.trim().replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
};

async function apiPushData(cleanKey, payload) {
  if (!cleanKey) return false;
  try {
    const url = `${REALTIME_ENDPOINT}/rooms/${cleanKey}.json`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function apiPullData(cleanKey) {
  if (!cleanKey) return null;
  try {
    const url = `${REALTIME_ENDPOINT}/rooms/${cleanKey}.json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainTrackerApp />
    </ErrorBoundary>
  );
}

function MainTrackerApp() {
  // --- PERSISTENT DATA (INITIALIZED WITH EMPTY ARRAY / 0 MMK) ---
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('mm_liquid_glass_cats_v7');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.income?.length && parsed?.expense?.length) return parsed;
      }
    } catch {}
    return DEFAULT_CATEGORIES;
  });

  // Default transactions is strictly EMPTY [] (0 MMK)
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('mm_liquid_glass_tx_v7');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return [];
  });

  const [themeId, setThemeId] = useState(() => localStorage.getItem('mm_liquid_theme_id') || 'ios_droplet');
  const [colorMode, setColorMode] = useState(() => localStorage.getItem('mm_liquid_color_mode') || 'dark');
  const isLight = colorMode === 'light';

  // --- ONLINE / OFFLINE & REALTIME MULTI-DEVICE SYNC STATES ---
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [pendingSync, setPendingSync] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(() => localStorage.getItem('mm_liquid_last_synced') || null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync Room Key
  const [cloudSyncKey, setCloudSyncKey] = useState(() => localStorage.getItem('mm_liquid_cloud_key') || '');
  const [cloudKeyInput, setCloudKeyInput] = useState('');
  const [autoCloudSync, setAutoCloudSync] = useState(() => localStorage.getItem('mm_liquid_auto_cloud') !== 'false');
  const [importMode, setImportMode] = useState('merge'); // 'merge' or 'replace'

  const fileInputRef = useRef(null);
  const isInitialMount = useRef(true);
  const lastLocalUpdateTs = useRef(Date.now());

  const currentTheme = useMemo(() => {
    return THEMES.find((t) => t.id === themeId) || THEMES[0];
  }, [themeId]);

  const [viewMode, setViewMode] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [selectedMonth, setSelectedMonth] = useState(() => getTodayStr().slice(0, 7));
  const [selectedYear, setSelectedYear] = useState(() => getTodayStr().slice(0, 4));

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [txType, setTxType] = useState('income');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('sales');
  const [note, setNote] = useState('');
  const [txDate, setTxDate] = useState(getTodayStr());

  // UI Modals
  const [showMobileAddModal, setShowMobileAddModal] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [catTab, setCatTab] = useState('income');
  const [editingCatId, setEditingCatId] = useState(null);
  const [catNameInput, setCatNameInput] = useState('');
  const [catIconInput, setCatIconInput] = useState('ShoppingBag');
  const [catColorInput, setCatColorInput] = useState('#10b981');
  const [deleteCatConfirmId, setDeleteCatConfirmId] = useState(null);
  const [confirmResetCats, setConfirmResetCats] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  }, []);

  // Request Persistent Storage
  useEffect(() => {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => {});
    }
  }, []);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      const txJson = JSON.stringify(transactions);
      localStorage.setItem('mm_liquid_glass_tx_v7', txJson);
    } catch {}
  }, [transactions]);

  useEffect(() => {
    try {
      const catJson = JSON.stringify(categories);
      localStorage.setItem('mm_liquid_glass_cats_v7', catJson);
    } catch {}
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('mm_liquid_theme_id', themeId);
    localStorage.setItem('mm_liquid_color_mode', colorMode);
  }, [themeId, colorMode]);

  // Payload Builder
  const buildBackupPayload = useCallback(() => {
    return {
      app: 'ThintMhatTan_LiquidGlass',
      version: '7.0',
      updatedAt: Date.now(),
      transactions,
      categories,
      themeId,
      colorMode
    };
  }, [transactions, categories, themeId, colorMode]);

  // Push Local State to Cloud
  const pushToCloud = useCallback(async (silent = false, customKey = null) => {
    const key = cleanSyncKey(customKey || cloudSyncKey);
    if (!key) return;

    if (!navigator.onLine) {
      setPendingSync(true);
      if (!silent) showToast('အင်တာနက်မရှိသေးပါ။ ဖုန်းထဲတွင် ယာယီသိမ်းထားပါသည် 📦');
      return;
    }

    setIsSyncing(true);
    const payload = buildBackupPayload();
    lastLocalUpdateTs.current = payload.updatedAt;
    const ok = await apiPushData(key, payload);
    setIsSyncing(false);

    if (ok) {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncedAt(nowStr);
      localStorage.setItem('mm_liquid_last_synced', nowStr);
      setPendingSync(false);
      if (!silent) showToast('Cloud ပေါ်သို့ အောင်မြင်စွာ ပို့ဆောင်ပြီးပါပြီ ☁️✅');
    } else {
      setPendingSync(true);
      if (!silent) showToast('Cloud ပို့ဆောင်မှု နှောင့်နှေးနေပါသည်။ လိုင်းမိသည်နှင့် Auto ပို့ပါမည်');
    }
  }, [cloudSyncKey, buildBackupPayload, showToast]);

  // Apply Imported Cloud Data (Live Merge)
  const applyImportedData = useCallback((data, mode = 'merge') => {
    if (!data || !Array.isArray(data.transactions)) return false;

    if (mode === 'replace') {
      setTransactions(data.transactions);
      if (data.categories?.income && data.categories?.expense) {
        setCategories(data.categories);
      }
    } else {
      setTransactions((prev) => {
        const existingMap = new Map(prev.map((t) => [t.id, t]));
        data.transactions.forEach((incoming) => {
          if (!existingMap.has(incoming.id)) {
            existingMap.set(incoming.id, incoming);
          } else {
            // Pick most recently updated
            const curr = existingMap.get(incoming.id);
            if ((incoming.updatedAt || incoming.createdAt || 0) > (curr.updatedAt || curr.createdAt || 0)) {
              existingMap.set(incoming.id, incoming);
            }
          }
        });
        return Array.from(existingMap.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      });

      if (data.categories?.income && data.categories?.expense) {
        setCategories((prev) => {
          const mergeCatList = (oldList, incomingList) => {
            const ids = new Set(oldList.map((c) => c.id));
            const added = incomingList.filter((c) => !ids.has(c.id));
            return [...oldList, ...added];
          };
          return {
            income: mergeCatList(prev.income || [], data.categories.income),
            expense: mergeCatList(prev.expense || [], data.categories.expense)
          };
        });
      }
    }
    return true;
  }, []);

  // Pull Remote Cloud Data
  const pullFromCloud = useCallback(async (keyToPull, silent = false) => {
    const key = cleanSyncKey(keyToPull || cloudSyncKey);
    if (!key || !navigator.onLine) return;

    setIsSyncing(true);
    const remoteData = await apiPullData(key);
    setIsSyncing(false);

    if (remoteData && Array.isArray(remoteData.transactions)) {
      // If remote has newer data than our local state, merge it!
      const remoteTs = remoteData.updatedAt || 0;
      if (remoteTs > lastLocalUpdateTs.current || transactions.length === 0) {
        applyImportedData(remoteData, 'merge');
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSyncedAt(nowStr);
        localStorage.setItem('mm_liquid_last_synced', nowStr);
        if (!silent) showToast('ဖုန်း/Tablet အချင်းချင်း ဒေတာများ တိုက်ရိုက်ချိတ်ဆက်ပြီးပါပြီ 🎉');
      }
    } else if (remoteData === null) {
      // Remote room is empty, push our local state to initialize it!
      await pushToCloud(true, key);
    }
  }, [cloudSyncKey, transactions.length, applyImportedData, pushToCloud, showToast]);

  // Periodic Realtime Background Polling (Every 6 seconds sync between Phone & Tablet)
  useEffect(() => {
    if (!cloudSyncKey || !autoCloudSync || !isOnline) return;

    // Immediately pull on mount or key change
    pullFromCloud(cloudSyncKey, true);

    const interval = setInterval(() => {
      pullFromCloud(cloudSyncKey, true);
    }, 6000);

    return () => clearInterval(interval);
  }, [cloudSyncKey, autoCloudSync, isOnline, pullFromCloud]);

  // Auto-push on local changes with debounce
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!autoCloudSync || !cloudSyncKey) return;

    lastLocalUpdateTs.current = Date.now();
    const timer = setTimeout(() => {
      pushToCloud(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [transactions, categories, autoCloudSync, cloudSyncKey, pushToCloud]);

  // Online / Offline Listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('အင်တာနက် ပြန်ချိတ်မိပါပြီ 🌐');
      if (cloudSyncKey) {
        pushToCloud(true);
        pullFromCloud(cloudSyncKey, true);
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('Offline ဖြစ်သွားပါပြီ။ စာရင်းများကို ဖုန်းထဲတွင် သိမ်းပေးထားပါမည် 💾');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [cloudSyncKey, pushToCloud, pullFromCloud, showToast]);

  // 1-Click Generate Sync ID
  const handleGenerateOneClickKey = async () => {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newRoomCode = `OSAKA-${randomSuffix}`;
    setCloudSyncKey(newRoomCode);
    localStorage.setItem('mm_liquid_cloud_key', newRoomCode);
    await pushToCloud(false, newRoomCode);
    showToast(`Sync ID (${newRoomCode}) ရရှိပါပြီ! အခြားဖုန်း/Tablet တွင် ဤကုဒ်ရိုက်ထည့်ပါ ☁️🔑`);
  };

  // Connect Existing Room Key
  const handleConnectSyncKey = async (inputKey) => {
    const target = cleanSyncKey(inputKey || cloudKeyInput);
    if (!target) {
      showToast('Sync ID ရိုက်ထည့်ပေးပါ');
      return;
    }
    setCloudSyncKey(target.toUpperCase());
    localStorage.setItem('mm_liquid_cloud_key', target.toUpperCase());
    setCloudKeyInput('');
    await pullFromCloud(target, false);
    showToast(`Sync ID (${target.toUpperCase()}) နှင့် ချိတ်ဆက်ပြီးပါပြီ ✅`);
  };

  // --- ROBUST FILE EXPORT (NO PERMISSION BLOCKING) ---
  const handleExportBackupFile = () => {
    try {
      const payload = buildBackupPayload();
      const jsonStr = JSON.stringify(payload, null, 2);
      const fileName = `ThintMhatTan_Backup_${getTodayStr()}.json`;
      const blob = new Blob([jsonStr], { type: 'application/json' });

      // Method 1: Mobile Web Share API (Direct save to Files / Google Drive / Telegram / etc.)
      if (navigator.canShare && navigator.canShare({ files: [new File([blob], fileName, { type: 'application/json' })] })) {
        const fileObj = new File([blob], fileName, { type: 'application/json' });
        navigator.share({
          files: [fileObj],
          title: 'သင့်မှတ်တမ်း Backup ဖိုင်',
          text: 'သင့်မှတ်တမ်း ငွေစာရင်း Backup ဖိုင်ဖြစ်ပါသည်။'
        }).catch(() => {
          // fallback to direct download
          triggerDirectDownload(blob, fileName);
        });
        return;
      }

      // Method 2: Universal Blob URL download
      triggerDirectDownload(blob, fileName);
      showToast('Backup ဖိုင် (.json) ဒေါင်းလုဒ်ဆွဲပြီးပါပြီ 📥');
    } catch {
      showToast('ဖိုင်ထုတ်ရာတွင် အမှားအယွင်းရှိပါသည်');
    }
  };

  const triggerDirectDownload = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 2000);
  };

  // Import Backup File
  const handleImportBackupFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const ok = applyImportedData(parsed, importMode);
        if (ok) {
          showToast(
            importMode === 'merge'
              ? 'Backup စာရင်းများကို လက်ရှိစာရင်းနှင့် ပေါင်းထည့်ပြီးပါပြီ ✅'
              : 'Backup စာရင်းအားလုံး ပြန်လည်ထည့်သွင်းပြီးပါပြီ ✅'
          );
          if (cloudSyncKey) pushToCloud(true);
          setShowBackupModal(false);
        } else {
          showToast('Backup ဖိုင်ပုံစံ မှားယွင်းနေပါသည်');
        }
      } catch {
        showToast('ဖိုင်ဖတ်မရပါ။ .json ဖိုင်အစစ်ဖြစ်ကြောင်း စစ်ဆေးပါ');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const formatMMK = (num) => {
    const val = Number(num) || 0;
    return val.toLocaleString('en-US') + ' ကျပ်';
  };

  const getCategoryMeta = (type, catId) => {
    const list = categories[type] || [];
    return list.find((c) => c.id === catId) || { id: catId, name: 'အထွေထွေ', icon: 'Sparkles', color: '#64748b' };
  };

  const getPaymentMeta = (pmId) => {
    return PAYMENT_METHODS.find((p) => p.id === (pmId || 'cash')) || PAYMENT_METHODS[0];
  };

  const calculatePaymentBreakdown = (txList) => {
    const stats = {
      cash: { income: 0, expense: 0, balance: 0 },
      kpay: { income: 0, expense: 0, balance: 0 },
      other: { income: 0, expense: 0, balance: 0 }
    };
    txList.forEach((t) => {
      const pm = stats[t.paymentMethod] ? t.paymentMethod : 'cash';
      if (t.type === 'income') stats[pm].income += t.amount;
      else stats[pm].expense += t.amount;
      stats[pm].balance = stats[pm].income - stats[pm].expense;
    });
    return stats;
  };

  // CRUD Handlers
  const handleSaveTransaction = (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      showToast('ငွေပမာဏ မှန်ကန်စွာ ထည့်ပါ');
      return;
    }

    const now = Date.now();
    if (editingId) {
      setTransactions((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, type: txType, paymentMethod, amount: numericAmount, category, note: note.trim(), date: txDate, updatedAt: now }
            : item
        )
      );
      showToast('စာရင်း ပြင်ဆင်ပြီးပါပြီ ✨');
      setEditingId(null);
    } else {
      const newTx = {
        id: 'tx-' + now + '-' + Math.random().toString(36).slice(2, 6),
        type: txType,
        paymentMethod,
        amount: numericAmount,
        category,
        note: note.trim(),
        date: txDate,
        createdAt: now,
        updatedAt: now
      };
      setTransactions((prev) => [newTx, ...prev]);
      showToast(isOnline ? 'စာရင်းအသစ် သိမ်းဆည်းပြီးပါပြီ ✨' : 'Offline သိမ်းပြီးပါပြီ (လိုင်းမိလျှင် Auto Sync လုပ်ပါမည်) 💾');
    }

    setAmount('');
    setNote('');
    setShowMobileAddModal(false);
  };

  const handleEditClick = (tx) => {
    setEditingId(tx.id);
    setTxType(tx.type);
    setPaymentMethod(tx.paymentMethod || 'cash');
    setAmount(String(tx.amount));
    setCategory(tx.category);
    setNote(tx.note || '');
    setTxDate(tx.date);
    setShowMobileAddModal(true);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
    setDeleteConfirmId(null);
    showToast('စာရင်း ဖျက်ပြီးပါပြီ');
  };

  // Category Handlers
  const openCategorySettings = (initialTab = txType) => {
    setCatTab(initialTab);
    setEditingCatId(null);
    setCatNameInput('');
    setCatIconInput('ShoppingBag');
    setCatColorInput(initialTab === 'income' ? '#10b981' : '#ef4444');
    setDeleteCatConfirmId(null);
    setConfirmResetCats(false);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    const trimmed = catNameInput.trim();
    if (!trimmed) return;

    if (editingCatId) {
      setCategories((prev) => ({
        ...prev,
        [catTab]: prev[catTab].map((c) =>
          c.id === editingCatId ? { ...c, name: trimmed, icon: catIconInput, color: catColorInput } : c
        )
      }));
      showToast('အမျိုးအစား ပြင်ဆင်ပြီးပါပြီ ✨');
      setEditingCatId(null);
    } else {
      const newCat = {
        id: 'cat-' + Date.now(),
        name: trimmed,
        icon: catIconInput,
        color: catColorInput
      };
      setCategories((prev) => ({
        ...prev,
        [catTab]: [...prev[catTab], newCat]
      }));
      showToast('အမျိုးအစားအသစ် ထည့်ပြီးပါပြီ 💧');
    }
    setCatNameInput('');
  };

  const handleEditCategoryClick = (cat) => {
    setEditingCatId(cat.id);
    setCatNameInput(cat.name);
    setCatIconInput(cat.icon || 'Sparkles');
    setCatColorInput(cat.color || '#10b981');
    setDeleteCatConfirmId(null);
  };

  const handleDeleteCategory = (id) => {
    const currentList = categories[catTab] || [];
    if (currentList.length <= 1) {
      showToast('အနည်းဆုံး အမျိုးအစား (၁) ခု ချန်ထားရပါမည်');
      setDeleteCatConfirmId(null);
      return;
    }
    const updatedList = currentList.filter((c) => c.id !== id);
    setCategories((prev) => ({
      ...prev,
      [catTab]: updatedList
    }));
    if (category === id && updatedList.length > 0) {
      setCategory(updatedList[0].id);
    }
    if (editingCatId === id) {
      setEditingCatId(null);
      setCatNameInput('');
    }
    setDeleteCatConfirmId(null);
    showToast('အမျိုးအစား ဖျက်ပြီးပါပြီ 🗑️');
  };

  const handleResetDefaultCategories = () => {
    setCategories(DEFAULT_CATEGORIES);
    setConfirmResetCats(false);
    setEditingCatId(null);
    setCatNameInput('');
    showToast('မူလအမျိုးအစားများအတိုင်း ပြန်ထားပြီးပါပြီ');
  };

  // Data calculations
  const dailyData = useMemo(() => {
    const list = transactions
      .filter((t) => t.date === selectedDate)
      .filter((t) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const catName = getCategoryMeta(t.type, t.category).name.toLowerCase();
        return (t.note && t.note.toLowerCase().includes(q)) || catName.includes(q) || String(t.amount).includes(q);
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    let income = 0;
    let expense = 0;
    list.forEach((t) => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });

    return { list, income, expense, balance: income - expense, paymentBreakdown: calculatePaymentBreakdown(list) };
  }, [transactions, selectedDate, searchQuery, categories]);

  const monthlyData = useMemo(() => {
    const list = transactions.filter((t) => t.date.startsWith(selectedMonth));
    let income = 0;
    let expense = 0;
    const dayMap = {};
    const categoryMap = { income: {}, expense: {} };

    list.forEach((t) => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;

      if (!dayMap[t.date]) {
        dayMap[t.date] = { date: t.date, income: 0, expense: 0, count: 0 };
      }
      if (t.type === 'income') dayMap[t.date].income += t.amount;
      else dayMap[t.date].expense += t.amount;
      dayMap[t.date].count += 1;

      categoryMap[t.type][t.category] = (categoryMap[t.type][t.category] || 0) + t.amount;
    });

    return {
      list,
      income,
      expense,
      balance: income - expense,
      dailyBreakdown: Object.values(dayMap).sort((a, b) => b.date.localeCompare(a.date)),
      categoryMap,
      paymentBreakdown: calculatePaymentBreakdown(list)
    };
  }, [transactions, selectedMonth]);

  const yearlyData = useMemo(() => {
    const list = transactions.filter((t) => t.date.startsWith(selectedYear));
    let income = 0;
    let expense = 0;

    const monthsBreakdown = Array.from({ length: 12 }, (_, idx) => {
      const mNum = String(idx + 1).padStart(2, '0');
      return {
        monthKey: `${selectedYear}-${mNum}`,
        monthName: BURMESE_MONTHS[idx],
        income: 0,
        expense: 0,
        count: 0
      };
    });

    list.forEach((t) => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;

      const mIdx = parseInt(t.date.slice(5, 7), 10) - 1;
      if (mIdx >= 0 && mIdx < 12) {
        if (t.type === 'income') monthsBreakdown[mIdx].income += t.amount;
        else monthsBreakdown[mIdx].expense += t.amount;
        monthsBreakdown[mIdx].count += 1;
      }
    });

    return { list, income, expense, balance: income - expense, monthsBreakdown, paymentBreakdown: calculatePaymentBreakdown(list) };
  }, [transactions, selectedYear]);

  const activeSummary = useMemo(() => {
    if (viewMode === 'daily') {
      return { title: `နေ့ချုပ်စာရင်း (${selectedDate})`, ...dailyData };
    }
    if (viewMode === 'monthly') {
      const [y, m] = selectedMonth.split('-');
      const mName = BURMESE_MONTHS[parseInt(m, 10) - 1] || m;
      return { title: `လချုပ်စာရင်း (${y} - ${mName})`, ...monthlyData };
    }
    return { title: `နှစ်ချုပ်စာရင်း (${selectedYear} ခုနှစ်)`, ...yearlyData };
  }, [viewMode, selectedDate, selectedMonth, selectedYear, dailyData, monthlyData, yearlyData]);

  // Form Renderer
  const renderEntryForm = () => (
    <form onSubmit={handleSaveTransaction} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <Droplets className="w-4 h-4 text-sky-500" />
          {editingId ? 'စာရင်း ပြင်ဆင်ရန်' : 'ဝင်ငွေ/ထွက်ငွေ အသစ်ထည့်ရန်'}
        </h2>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setAmount('');
              setNote('');
              setShowMobileAddModal(false);
            }}
            className="water-drop-btn text-xs px-3 py-1 rounded-full font-medium"
          >
            မပြင်တော့ပါ
          </button>
        )}
      </div>

      {/* Income / Expense Switcher */}
      <div className="grid grid-cols-2 p-1.5 rounded-full water-drop-well">
        <button
          type="button"
          onClick={() => {
            setTxType('income');
            const firstCat = categories.income?.[0]?.id;
            if (firstCat) setCategory(firstCat);
          }}
          className={`py-2 rounded-full text-xs font-bold transition-all ${
            txType === 'income' ? 'water-drop-emerald text-white shadow-md' : 'opacity-70 hover:opacity-100'
          }`}
        >
          + ဝင်ငွေ (Income)
        </button>
        <button
          type="button"
          onClick={() => {
            setTxType('expense');
            const firstCat = categories.expense?.[0]?.id;
            if (firstCat) setCategory(firstCat);
          }}
          className={`py-2 rounded-full text-xs font-bold transition-all ${
            txType === 'expense' ? 'water-drop-rose text-white shadow-md' : 'opacity-70 hover:opacity-100'
          }`}
        >
          - ထွက်ငွေ (Expense)
        </button>
      </div>

      {/* Payment Method Selector */}
      <div>
        <label className="block text-xs opacity-75 font-medium mb-1 ml-1">ငွေပေးချေမှုပုံစံ</label>
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-full water-drop-well">
          {PAYMENT_METHODS.map((pm) => (
            <button
              key={pm.id}
              type="button"
              onClick={() => setPaymentMethod(pm.id)}
              className={`py-2 rounded-full text-xs font-bold transition ${
                paymentMethod === pm.id ? 'water-drop-active scale-[1.02]' : 'opacity-70 hover:opacity-100'
              }`}
            >
              {pm.name}
            </button>
          ))}
        </div>
      </div>

      {/* Amount & Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs opacity-75 font-medium mb-1 ml-1">ငွေပမာဏ (ကျပ်) *</label>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              required
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl water-drop-input text-base font-bold focus:outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-60">MMK</span>
          </div>
        </div>
        <div>
          <label className="block text-xs opacity-75 font-medium mb-1 ml-1">ရက်စွဲ</label>
          <input
            type="date"
            required
            value={txDate}
            onChange={(e) => setTxDate(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-2xl water-drop-input text-xs font-medium focus:outline-none ${
              isLight ? '[color-scheme:light]' : '[color-scheme:dark]'
            }`}
          />
        </div>
      </div>

      {/* Quick Amounts */}
      <div className="flex flex-wrap gap-1.5">
        {[1000, 5000, 10000, 50000, 100000].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setAmount((prev) => String((Number(prev) || 0) + preset))}
            className="water-drop-btn text-xs px-3 py-1.5 rounded-full font-bold"
          >
            +{preset.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-1.5 ml-1">
          <label className="text-xs opacity-75 font-medium">အမျိုးအစား</label>
          <button
            type="button"
            onClick={() => openCategorySettings(txType)}
            className="water-drop-btn px-2.5 py-1 rounded-full text-[11px] text-sky-500 font-bold flex items-center gap-1"
          >
            <Settings className="w-3 h-3" /> ပြင်ဆင်ရန် / ဖျက်ရန်
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto p-1">
          {(categories[txType] || []).map((cat) => {
            const IconComp = ICON_MAP[cat.icon] || Sparkles;
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-semibold text-left transition ${
                  isSelected ? 'water-drop-active scale-[1.02]' : 'water-drop-btn opacity-85 hover:opacity-100'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${cat.color}28`, color: cat.color }}
                >
                  <IconComp className="w-3 h-3" />
                </span>
                <span className="truncate">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="block text-xs opacity-75 font-medium mb-1 ml-1">မှတ်ချက်</label>
        <input
          type="text"
          placeholder="ဥပမာ - မနက်စာ၊ ဆိုင်ကယ်ဆီဖိုး..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-4 py-2.5 rounded-2xl water-drop-input text-xs focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className={`w-full py-3 rounded-full font-bold text-xs text-white flex items-center justify-center gap-2 ${
          txType === 'income' ? 'water-drop-emerald' : 'water-drop-rose'
        }`}
      >
        <Check className="w-4 h-4" />
        {editingId ? 'ပြင်ဆင်မှု သိမ်းမည်' : 'စာရင်း သိမ်းဆည်းမည်'}
      </button>
    </form>
  );

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 ${
        isLight ? `${currentTheme.lightBg} text-slate-800 light-glass-mode` : `${currentTheme.darkBg} text-white dark-glass-mode`
      } relative overflow-x-hidden font-sans pb-32 md:pb-12`}
    >
      {/* CSS STYLING FOR 3D WATER DROPLET & SAFE AREA */}
      <style>{`
        .dark-glass-mode { text-shadow: 0 1px 2px rgba(0,0,0,0.6); }
        .dark-glass-mode .liquid-glass-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 12px 35px -10px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.3);
        }
        .dark-glass-mode .water-drop-btn {
          position: relative;
          background: linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.25);
          box-shadow: 0 4px 15px rgba(0,0,0,0.4), inset 0 1.5px 2px rgba(255,255,255,0.45);
        }
        .dark-glass-mode .water-drop-active {
          position: relative;
          background: linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(56,189,248,0.12) 100%);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255,255,255,0.55);
          box-shadow: 0 6px 20px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,255,255,0.7);
        }
        .dark-glass-mode .water-drop-well {
          background: rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.12);
        }
        .dark-glass-mode .water-drop-input {
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.22);
          color: white;
        }

        .light-glass-mode .liquid-glass-card {
          position: relative;
          background: radial-gradient(120% 120% at 30% 15%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.35) 55%, rgba(186,230,253,0.32) 100%);
          backdrop-filter: blur(28px) saturate(190%);
          -webkit-backdrop-filter: blur(28px) saturate(190%);
          border: 1.5px solid rgba(255,255,255,0.95);
          box-shadow:
            0 16px 36px -8px rgba(14, 116, 144, 0.16),
            inset 0 4px 8px rgba(255, 255, 255, 1),
            inset 0 -6px 14px rgba(56, 189, 248, 0.22);
        }

        .light-glass-mode .water-drop-btn {
          position: relative;
          overflow: hidden;
          background: radial-gradient(95% 115% at 50% 12%, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.42) 48%, rgba(186, 230, 253, 0.35) 85%, rgba(125, 211, 252, 0.45) 100%);
          backdrop-filter: blur(18px) saturate(180%);
          -webkit-backdrop-filter: blur(18px) saturate(180%);
          border: 1.5px solid rgba(255, 255, 255, 0.92);
          box-shadow:
            0 8px 18px -4px rgba(14, 116, 144, 0.2),
            inset 0 3px 5px rgba(255, 255, 255, 1),
            inset 0 -4px 8px rgba(14, 165, 233, 0.28);
        }

        .light-glass-mode .water-drop-active {
          position: relative;
          overflow: hidden;
          background: radial-gradient(90% 120% at 50% 10%, #ffffff 0%, rgba(224, 242, 254, 0.8) 52%, rgba(125, 211, 252, 0.6) 100%);
          backdrop-filter: blur(22px) saturate(200%);
          -webkit-backdrop-filter: blur(22px) saturate(200%);
          border: 1.5px solid #ffffff;
          box-shadow:
            0 10px 22px -4px rgba(2, 132, 199, 0.32),
            inset 0 4px 6px #ffffff,
            inset 0 -5px 10px rgba(2, 132, 199, 0.38);
          color: #0369a1;
        }

        .light-glass-mode .water-drop-well {
          background: linear-gradient(180deg, rgba(14, 116, 144, 0.1) 0%, rgba(255, 255, 255, 0.5) 100%);
          border: 1.5px solid rgba(255, 255, 255, 0.85);
        }

        .light-glass-mode .water-drop-input {
          background: radial-gradient(100% 130% at 50% 0%, rgba(255, 255, 255, 0.95) 0%, rgba(240, 249, 255, 0.72) 100%);
          border: 1.5px solid rgba(255, 255, 255, 0.95);
          color: #0f172a;
        }

        .water-drop-emerald {
          position: relative;
          overflow: hidden;
          background: radial-gradient(95% 120% at 50% 12%, #6ee7b7 0%, #10b981 52%, #047857 100%);
          border: 1.5px solid rgba(255, 255, 255, 0.75);
          box-shadow: 0 8px 20px -4px rgba(16, 185, 129, 0.5), inset 0 3px 6px rgba(255, 255, 255, 0.9);
        }
        .water-drop-rose {
          position: relative;
          overflow: hidden;
          background: radial-gradient(95% 120% at 50% 12%, #fda4af 0%, #f43f5e 52%, #be123c 100%);
          border: 1.5px solid rgba(255, 255, 255, 0.75);
          box-shadow: 0 8px 20px -4px rgba(244, 63, 94, 0.5), inset 0 3px 6px rgba(255, 255, 255, 0.9);
        }
      `}</style>

      {/* BACKGROUND MESH GRADIENT */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full ${currentTheme.blob1} blur-[100px]`} />
        <div className={`absolute top-1/3 -right-32 w-96 h-96 rounded-full ${currentTheme.blob2} blur-[120px]`} />
        <div className={`absolute -bottom-32 left-1/3 w-96 h-96 rounded-full ${currentTheme.blob3} blur-[110px]`} />
      </div>

      {/* TOAST MESSAGE */}
      {toastMsg && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full liquid-glass-card text-xs font-bold shadow-2xl flex items-center gap-2 max-w-[92vw] text-center border-2 border-white/60">
          <Droplets className="w-4 h-4 text-sky-500 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* =========================================================================
          HEADER NAVBAR WITH iOS NOTI BAR SAFE-AREA FIX
         ========================================================================= */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 ios-safe-top pb-2">
        <header className="rounded-3xl liquid-glass-card px-4 py-3 flex items-center justify-between gap-2 shadow-xl">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${currentTheme.accent} flex items-center justify-center shadow-lg border-2 border-white/80 shrink-0`}>
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold truncate">သင့်မှတ်တမ်း</h1>
                {/* ONLINE / SYNC BADGE */}
                <span
                  onClick={() => setShowBackupModal(true)}
                  className={`cursor-pointer text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border ${
                    isOnline
                      ? cloudSyncKey
                        ? 'bg-sky-500/20 text-sky-400 border-sky-400/40'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-400/40'
                      : 'bg-rose-500/20 text-rose-400 border-rose-400/40'
                  }`}
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Syncing
                    </>
                  ) : isOnline ? (
                    cloudSyncKey ? (
                      <>
                        <Wifi className="w-2.5 h-2.5" /> Room: {cloudSyncKey}
                      </>
                    ) : (
                      <>
                        <Wifi className="w-2.5 h-2.5" /> Online (Local)
                      </>
                    )
                  ) : (
                    <>
                      <WifiOff className="w-2.5 h-2.5" /> Offline
                    </>
                  )}
                </span>
              </div>
              <p className="text-[10px] opacity-70 truncate">
                {cloudSyncKey ? `Realtime Sync: ${cloudSyncKey} (ချိတ်ထားပြီး)` : 'ဝင်ငွေ • ထွက်ငွေ စာရင်းချုပ်'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* BACKUP & REALTIME SYNC BUTTON */}
            <button
              onClick={() => setShowBackupModal(true)}
              className={`px-3 py-2 rounded-full flex items-center gap-1.5 text-xs font-bold ${
                cloudSyncKey ? 'water-drop-active' : 'water-drop-btn'
              }`}
              title="Backup & Realtime Sync"
            >
              <HardDrive className="w-3.5 h-3.5 text-sky-500" />
              <span className="hidden sm:inline">Sync / Backup</span>
            </button>

            <button
              onClick={() => setColorMode(isLight ? 'dark' : 'light')}
              className="water-drop-btn px-3 py-2 rounded-full flex items-center gap-1.5 text-xs font-bold"
            >
              {isLight ? <Moon className="w-3.5 h-3.5 text-indigo-600" /> : <Sun className="w-3.5 h-3.5 text-amber-300" />}
              <span className="hidden md:inline">{isLight ? 'Dark' : 'White'}</span>
            </button>

            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="water-drop-btn px-3 py-2 rounded-full flex items-center gap-1.5 text-xs font-semibold"
            >
              <Palette className="w-3.5 h-3.5 text-sky-500" />
              <span className="hidden md:inline">Theme</span>
            </button>

            {showThemePicker && (
              <div className="absolute right-4 top-20 w-52 rounded-2xl liquid-glass-card p-2 z-50 space-y-1.5 shadow-2xl">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setThemeId(t.id);
                      setShowThemePicker(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold text-left flex items-center justify-between ${
                      themeId === t.id ? 'water-drop-active' : 'water-drop-btn opacity-80 hover:opacity-100'
                    }`}
                  >
                    <span>{t.name}</span>
                    {themeId === t.id && <Check className="w-3.5 h-3.5 text-sky-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          
          {/* LEFT COLUMN: Summary + Form */}
          <div className="md:col-span-5 space-y-4 md:sticky md:top-4">
            
            {/* SUMMARY CARD (STARTS STRICTLY AT 0 MMK) */}
            <div className="rounded-3xl liquid-glass-card p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold opacity-85">
                <span>{activeSummary.title}</span>
                <span className="text-[10px] px-3 py-1 rounded-full water-drop-btn font-bold">စုစုပေါင်း အသားတင်</span>
              </div>

              <div className={`text-2xl font-black ${activeSummary.balance >= 0 ? '' : 'text-rose-500'}`}>
                {activeSummary.balance >= 0 ? '+' : ''}{formatMMK(activeSummary.balance)}
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className={`rounded-2xl p-3 border ${isLight ? 'bg-emerald-400/20 border-white/90 shadow-inner' : 'bg-emerald-500/15 border-emerald-400/30'}`}>
                  <div className={`text-[10px] font-bold mb-0.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>ဝင်ငွေ စုစုပေါင်း</div>
                  <div className="text-xs sm:text-sm font-extrabold">{formatMMK(activeSummary.income)}</div>
                </div>
                <div className={`rounded-2xl p-3 border ${isLight ? 'bg-rose-400/20 border-white/90 shadow-inner' : 'bg-rose-500/15 border-rose-400/30'}`}>
                  <div className={`text-[10px] font-bold mb-0.5 ${isLight ? 'text-rose-700' : 'text-rose-400'}`}>ထွက်ငွေ စုစုပေါင်း</div>
                  <div className="text-xs sm:text-sm font-extrabold">{formatMMK(activeSummary.expense)}</div>
                </div>
              </div>

              {/* Payment Methods breakdown */}
              <div className="pt-2 border-t border-white/20 space-y-2">
                <div className="text-[10px] opacity-75 font-bold">ငွေသား • KPay • အခြား</div>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map((pm) => {
                    const stats = activeSummary.paymentBreakdown?.[pm.id] || { balance: 0 };
                    return (
                      <div key={pm.id} className="rounded-2xl water-drop-btn p-2.5 text-center">
                        <div className="text-[10px] opacity-75 font-semibold">{pm.name}</div>
                        <div className="text-xs font-extrabold mt-0.5">{stats.balance.toLocaleString()}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* DESKTOP FORM */}
            <div className="hidden md:block rounded-3xl liquid-glass-card p-4">
              {renderEntryForm()}
            </div>

          </div>

          {/* RIGHT COLUMN: Period Toggles & Lists */}
          <div className="md:col-span-7 space-y-4">
            
            {/* PERIOD TABS */}
            <div className="rounded-3xl liquid-glass-card p-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="grid grid-cols-3 w-full sm:w-auto p-1.5 rounded-full water-drop-well gap-1.5">
                <button
                  onClick={() => setViewMode('daily')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                    viewMode === 'daily' ? 'water-drop-active' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  နေ့ချုပ်
                </button>
                <button
                  onClick={() => setViewMode('monthly')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                    viewMode === 'monthly' ? 'water-drop-active' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  လချုပ်
                </button>
                <button
                  onClick={() => setViewMode('yearly')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                    viewMode === 'yearly' ? 'water-drop-active' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  နှစ်ချုပ်
                </button>
              </div>

              {/* Date pickers */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {viewMode === 'daily' && (
                  <>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className={`px-3.5 py-1.5 rounded-full water-drop-btn text-xs font-bold ${isLight ? '[color-scheme:light]' : '[color-scheme:dark]'}`}
                    />
                    {selectedDate !== getTodayStr() && (
                      <button
                        onClick={() => setSelectedDate(getTodayStr())}
                        className="water-drop-active text-[10px] px-3 py-1.5 rounded-full font-bold"
                      >
                        ယနေ့
                      </button>
                    )}
                  </>
                )}
                {viewMode === 'monthly' && (
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className={`px-3.5 py-1.5 rounded-full water-drop-btn text-xs font-bold ${isLight ? '[color-scheme:light]' : '[color-scheme:dark]'}`}
                  />
                )}
                {viewMode === 'yearly' && (
                  <span className="px-4 py-1.5 rounded-full water-drop-btn text-xs font-extrabold">{selectedYear} ခုနှစ်</span>
                )}
              </div>
            </div>

            {/* VIEW CONTENTS */}
            {viewMode === 'daily' && (
              <div className="rounded-3xl liquid-glass-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold">စာရင်းများ ({dailyData.list.length})</h3>
                  <input
                    type="text"
                    placeholder="ရှာဖွေရန်..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-3.5 py-1.5 rounded-full water-drop-input text-xs w-40 focus:outline-none"
                  />
                </div>

                {dailyData.list.length === 0 ? (
                  <div className="py-12 text-center opacity-60 text-xs space-y-1">
                    <p className="font-bold">ဤရက်စွဲအတွက် စာရင်းမရှိသေးပါ</p>
                    <p className="text-[10px]">စာရင်းအသစ်ထည့်ရန် အောက်ခြေရှိ '+' ခလုတ်ကို နှိပ်ပါ</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {dailyData.list.map((tx) => {
                      const catMeta = getCategoryMeta(tx.type, tx.category);
                      const pmMeta = getPaymentMeta(tx.paymentMethod);
                      const IconComp = ICON_MAP[catMeta.icon] || Sparkles;
                      return (
                        <div key={tx.id} className="rounded-2xl water-drop-btn p-3 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-white/60 shadow-sm"
                              style={{ backgroundColor: `${catMeta.color}28`, color: catMeta.color }}
                            >
                              <IconComp className="w-4 h-4" />
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold truncate">{catMeta.name}</span>
                                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold border border-white/40" style={{ backgroundColor: `${pmMeta.color}25`, color: pmMeta.color }}>
                                  {pmMeta.name}
                                </span>
                              </div>
                              <p className="text-[10px] opacity-70 truncate">{tx.note || 'မှတ်ချက်မရှိပါ'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <div className={`text-xs font-black mr-1 ${tx.type === 'income' ? (isLight ? 'text-emerald-600' : 'text-emerald-400') : (isLight ? 'text-rose-600' : 'text-rose-400')}`}>
                              {tx.type === 'income' ? '+' : '-'}{formatMMK(tx.amount)}
                            </div>
                            <button onClick={() => handleEditClick(tx)} className="p-2 rounded-full water-drop-btn" title="ပြင်ဆင်ရန်">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {deleteConfirmId === tx.id ? (
                              <button onClick={() => handleDeleteTransaction(tx.id)} className="px-2.5 py-1 rounded-full water-drop-rose text-white text-[10px] font-bold">
                                ဖျက်မည်
                              </button>
                            ) : (
                              <button onClick={() => setDeleteConfirmId(tx.id)} className="p-2 rounded-full water-drop-btn text-rose-500" title="ဖျက်ရန်">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {viewMode === 'monthly' && (
              <div className="rounded-3xl liquid-glass-card p-4 space-y-3">
                <h3 className="text-xs font-bold">ရက်အလိုက် စာရင်းချုပ် ({selectedMonth})</h3>
                {monthlyData.dailyBreakdown.length === 0 ? (
                  <div className="py-10 text-center opacity-60 text-xs">ဤလအတွက် စာရင်းမရှိသေးပါ</div>
                ) : (
                  <div className="space-y-2.5">
                    {monthlyData.dailyBreakdown.map((day) => (
                      <div
                        key={day.date}
                        onClick={() => {
                          setSelectedDate(day.date);
                          setViewMode('daily');
                        }}
                        className="cursor-pointer rounded-2xl water-drop-btn p-3.5 flex items-center justify-between"
                      >
                        <div className="text-xs font-bold">{day.date}</div>
                        <div className="flex items-center gap-3 text-xs font-bold">
                          <span className={isLight ? 'text-emerald-600' : 'text-emerald-400'}>+{day.income.toLocaleString()}</span>
                          <span className={isLight ? 'text-rose-600' : 'text-rose-400'}>-{day.expense.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {viewMode === 'yearly' && (
              <div className="rounded-3xl liquid-glass-card p-4 space-y-3">
                <h3 className="text-xs font-bold">{selectedYear} ခုနှစ် လအလိုက် နှစ်ချုပ်</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {yearlyData.monthsBreakdown.map((m) => (
                    <div
                      key={m.monthKey}
                      onClick={() => {
                        setSelectedMonth(m.monthKey);
                        setViewMode('monthly');
                      }}
                      className="cursor-pointer rounded-2xl water-drop-btn p-3.5 space-y-1"
                    >
                      <div className="text-xs font-bold">{m.monthName}</div>
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className={isLight ? 'text-emerald-600' : 'text-emerald-400'}>ဝင်: +{m.income.toLocaleString()}</span>
                        <span className={isLight ? 'text-rose-600' : 'text-rose-400'}>ထွက်: -{m.expense.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* MOBILE FLOATING DOCK */}
      <div className="md:hidden fixed bottom-4 inset-x-3 z-40 ios-safe-bottom">
        <div className="rounded-full liquid-glass-card px-2.5 py-2 flex items-center justify-between shadow-2xl border-2 border-white/40">
          <button onClick={() => setViewMode('daily')} className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${viewMode === 'daily' ? 'water-drop-active' : 'water-drop-btn opacity-80'}`}>
            နေ့ချုပ်
          </button>
          <button onClick={() => setViewMode('monthly')} className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${viewMode === 'monthly' ? 'water-drop-active' : 'water-drop-btn opacity-80'}`}>
            လချုပ်
          </button>
          <button
            onClick={() => {
              setEditingId(null);
              setTxDate(selectedDate);
              setShowMobileAddModal(true);
            }}
            className="water-drop-active -mt-7 w-13 h-13 rounded-full flex items-center justify-center shadow-2xl border-2 border-white scale-105"
          >
            <Plus className="w-7 h-7" />
          </button>
          <button onClick={() => setViewMode('yearly')} className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${viewMode === 'yearly' ? 'water-drop-active' : 'water-drop-btn opacity-80'}`}>
            နှစ်ချုပ်
          </button>
          <button onClick={() => setShowBackupModal(true)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${cloudSyncKey ? 'water-drop-active' : 'water-drop-btn opacity-85'}`}>
            Sync
          </button>
        </div>
      </div>

      {/* MOBILE ADD MODAL */}
      {showMobileAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className={`w-full max-w-lg rounded-t-3xl sm:rounded-3xl liquid-glass-card p-5 shadow-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-end mb-1">
              <button onClick={() => setShowMobileAddModal(false)} className="p-2 rounded-full water-drop-btn">
                <X className="w-4 h-4" />
              </button>
            </div>
            {renderEntryForm()}
          </div>
        </div>
      )}

      {/* =========================================================================
          REALTIME MULTI-DEVICE SYNC & RELIABLE BACKUP MODAL
         ========================================================================= */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl liquid-glass-card p-5 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-sky-500" />
                ဖုန်းနှင့် Tablet တိုက်ရိုက်ချိတ်ဆက်ခြင်း (v7)
              </h3>
              <button onClick={() => setShowBackupModal(false)} className="p-2 rounded-full water-drop-btn">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* STATUS BANNER */}
            <div className="p-3 rounded-2xl water-drop-well flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold">
                    စုစုပေါင်း စာရင်း ({transactions.length}) ခု
                  </div>
                  <div className="text-[10px] opacity-75">
                    {cloudSyncKey
                      ? `🟢 Sync Room [${cloudSyncKey}] ချိတ်ဆက်ထားပြီး ဖုန်းနှင့် Tablet အလိုအလျောက် တူညီနေပါမည်`
                      : '⚪ Sync Room မချိတ်ရသေးပါ (ဖုန်းထဲတွင်သာ သီးသန့်ရှိနေသည်)'}
                  </div>
                </div>
              </div>
            </div>

            {/* 1. REALTIME MULTI-DEVICE SYNC (PHONE & TABLET) */}
            <div className="p-4 rounded-3xl water-drop-well space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  ၁။ ဖုန်းနှင့် Tablet ချိတ်ဆက်မည့် Sync ID
                </span>
                <label className="flex items-center gap-1 text-[10px] font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoCloudSync}
                    onChange={(e) => {
                      setAutoCloudSync(e.target.checked);
                      localStorage.setItem('mm_liquid_auto_cloud', String(e.target.checked));
                    }}
                    className="rounded"
                  />
                  Auto-Sync
                </label>
              </div>

              <p className="text-[11px] opacity-75">
                စက်တစ်လုံးတွင် 'Sync ID အသစ်ထုတ်မည်' ကို နှိပ်ပြီး ထွက်လာသော ကုဒ်ကို နောက်စက်တစ်လုံးတွင် ရိုက်ထည့်ကာ 'ချိတ်မည်' နှိပ်လိုက်ပါက စာရင်းသွင်းသမျှ အလိုအလျောက် အတူတူ ပေါ်လာပါမည်။
              </p>

              {cloudSyncKey ? (
                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl water-drop-input flex items-center justify-between gap-2 border border-sky-400/40">
                    <div className="truncate">
                      <span className="text-[10px] opacity-70 block">ချိတ်ဆက်ထားသော Sync ID -</span>
                      <span className="text-sm font-black tracking-wider text-sky-400 select-all">{cloudSyncKey}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(cloudSyncKey);
                          showToast('Sync ID ကူးယူပြီးပါပြီ 📋');
                        }}
                        className="px-3 py-1.5 rounded-full water-drop-btn text-[11px] font-bold flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCloudSyncKey('');
                          localStorage.removeItem('mm_liquid_cloud_key');
                          showToast('Sync ID ဖြုတ်လိုက်ပါပြီ');
                        }}
                        className="p-1.5 rounded-full water-drop-btn text-rose-400"
                        title="Disconnect"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={isSyncing}
                      onClick={() => pushToCloud(false)}
                      className="py-2.5 rounded-2xl water-drop-emerald text-white text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      ယခု စာရင်းပို့မည် (Push)
                    </button>
                    <button
                      type="button"
                      disabled={isSyncing}
                      onClick={() => pullFromCloud(cloudSyncKey, false)}
                      className="py-2.5 rounded-2xl water-drop-active text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      တခြားစက်မှ ဆွဲယူမည် (Pull)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <button
                    type="button"
                    disabled={isSyncing}
                    onClick={handleGenerateOneClickKey}
                    className="w-full py-3 rounded-2xl water-drop-emerald text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isSyncing ? 'ချိတ်ဆက်နေပါသည်...' : 'Sync ID အသစ်ထုတ်မည် (One-Click)'}
                  </button>

                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="ရှိပြီးသား Sync ID ရိုက်ထည့်ရန် (ဥပမာ OSAKA-1234)..."
                      value={cloudKeyInput}
                      onChange={(e) => setCloudKeyInput(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-2xl water-drop-input text-xs font-bold focus:outline-none uppercase"
                    />
                    <button
                      type="button"
                      disabled={isSyncing}
                      onClick={() => handleConnectSyncKey(cloudKeyInput)}
                      className="px-4 py-2.5 rounded-2xl water-drop-active text-xs font-bold shrink-0"
                    >
                      ချိတ်မည်
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. FILE EXPORT & IMPORT (PERMISSION-FREE DIRECT SAVE) */}
            <div className="p-4 rounded-3xl water-drop-well space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold flex items-center gap-1.5">
                  <FileJson className="w-4 h-4 text-sky-400" />
                  ၂။ Offline Backup ဖိုင်ထုတ်ရန် / ပြန်သွင်းရန်
                </span>
              </div>

              <p className="text-[11px] opacity-75">
                Permission တောင်းစရာမလိုဘဲ ဖုန်းထဲသို့ ဒေါင်းလုဒ်တိုက်ရိုက်ဆွဲခြင်း သို့မဟုတ် Share menu မှတစ်ဆင့် Google Drive/Telegram/Files ထဲသို့ တိုက်ရိုက်သိမ်းဆည်းနိုင်ပါသည်။
              </p>

              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-full water-drop-well text-[11px]">
                <button
                  type="button"
                  onClick={() => setImportMode('merge')}
                  className={`py-1.5 rounded-full font-bold ${importMode === 'merge' ? 'water-drop-active' : 'opacity-70'}`}
                >
                  လက်ရှိနှင့် ပေါင်းမည် (Merge)
                </button>
                <button
                  type="button"
                  onClick={() => setImportMode('replace')}
                  className={`py-1.5 rounded-full font-bold ${importMode === 'replace' ? 'water-drop-active' : 'opacity-70'}`}
                >
                  အသစ်အစားထိုးမည် (Replace)
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleExportBackupFile}
                  className="py-2.5 px-3 rounded-2xl water-drop-emerald text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Backup သိမ်းဆည်းမည် (.json)
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2.5 px-3 rounded-2xl water-drop-active text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Backup ပြန်သွင်းမည် (Import)
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportBackupFile}
                  className="hidden"
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl liquid-glass-card p-5 shadow-2xl max-h-[92vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-500" />
                အမျိုးအစားများ စိတ်ကြိုက်ပြင်ဆင်ရန်
              </h3>
              <button onClick={() => setShowCategoryModal(false)} className="p-2 rounded-full water-drop-btn">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 p-1.5 rounded-full water-drop-well gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setCatTab('income');
                  setEditingCatId(null);
                  setCatNameInput('');
                  setCatColorInput('#10b981');
                }}
                className={`py-2 rounded-full text-xs font-bold transition ${catTab === 'income' ? 'water-drop-emerald text-white' : 'water-drop-btn opacity-75'}`}
              >
                ဝင်ငွေ အမျိုးအစား
              </button>
              <button
                type="button"
                onClick={() => {
                  setCatTab('expense');
                  setEditingCatId(null);
                  setCatNameInput('');
                  setCatColorInput('#ef4444');
                }}
                className={`py-2 rounded-full text-xs font-bold transition ${catTab === 'expense' ? 'water-drop-rose text-white' : 'water-drop-btn opacity-75'}`}
              >
                ထွက်ငွေ အမျိုးအစား
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3 p-3.5 rounded-3xl water-drop-well">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold opacity-80">
                  {editingCatId ? '✏️ အမျိုးအစား ပြင်ဆင်နေသည်' : '➕ အမျိုးအစားအသစ် ထည့်ရန်'}
                </span>
                {editingCatId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCatId(null);
                      setCatNameInput('');
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-full water-drop-btn font-bold"
                  >
                    မပြင်တော့ပါ
                  </button>
                )}
              </div>

              <input
                type="text"
                required
                placeholder="အမျိုးအစား အမည် ရိုက်ထည့်ပါ..."
                value={catNameInput}
                onChange={(e) => setCatNameInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl water-drop-input text-xs font-bold focus:outline-none"
              />

              {/* Icon Picker */}
              <div>
                <label className="block text-[10px] opacity-75 font-bold mb-1">Icon ရွေးချယ်ရန်</label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                  {AVAILABLE_ICONS.map((iconKey) => {
                    const IconC = ICON_MAP[iconKey] || Sparkles;
                    const active = catIconInput === iconKey;
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setCatIconInput(iconKey)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                          active ? 'water-drop-active scale-110' : 'water-drop-btn opacity-75'
                        }`}
                      >
                        <IconC className="w-3.5 h-3.5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-[10px] opacity-75 font-bold mb-1">အရောင် ရွေးချယ်ရန်</label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setCatColorInput(col)}
                      className={`w-6 h-6 rounded-full border-2 transition ${
                        catColorInput === col ? 'scale-125 border-white shadow-md' : 'border-white/40 opacity-80'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-full text-white text-xs font-bold flex items-center justify-center gap-1.5 ${
                  catTab === 'income' ? 'water-drop-emerald' : 'water-drop-rose'
                }`}
              >
                <Check className="w-4 h-4" />
                {editingCatId ? 'ပြင်ဆင်မှု သိမ်းမည်' : 'အမျိုးအစား ထည့်မည်'}
              </button>
            </form>

            {/* Category List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold opacity-80">
                  လက်ရှိ အမျိုးအစားများ ({(categories[catTab] || []).length})
                </span>
                {confirmResetCats ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleResetDefaultCategories}
                      className="px-2.5 py-1 rounded-full water-drop-rose text-white text-[10px] font-bold"
                    >
                      မူလအတိုင်းပြန်ထားမည်
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmResetCats(false)}
                      className="px-2 py-1 rounded-full water-drop-btn text-[10px]"
                    >
                      မလုပ်တော့ပါ
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmResetCats(true)}
                    className="text-[10px] opacity-75 hover:opacity-100 flex items-center gap-1 water-drop-btn px-2.5 py-1 rounded-full font-semibold"
                  >
                    <RotateCcw className="w-3 h-3" /> မူလအတိုင်းပြန်ထားရန်
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {(categories[catTab] || []).map((cat) => {
                  const IconComp = ICON_MAP[cat.icon] || Sparkles;
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-2.5 rounded-2xl water-drop-btn text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/60"
                          style={{ backgroundColor: `${cat.color}28`, color: cat.color }}
                        >
                          <IconComp className="w-4 h-4" />
                        </span>
                        <span className="font-bold truncate">{cat.name}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEditCategoryClick(cat)}
                          className="p-2 rounded-full water-drop-btn"
                          title="ပြင်ဆင်ရန်"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {deleteCatConfirmId === cat.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="px-2.5 py-1 rounded-full water-drop-rose text-white text-[10px] font-bold"
                            >
                              ဖျက်မည်
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteCatConfirmId(null)}
                              className="p-1.5 rounded-full water-drop-btn text-[10px]"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteCatConfirmId(cat.id)}
                            className="p-2 rounded-full water-drop-btn text-rose-500"
                            title="ဖျက်ရန်"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
