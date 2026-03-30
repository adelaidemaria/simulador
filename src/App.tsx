/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder, 
  Trash2, 
  FileText, 
  Table, 
  Image as ImageIcon, 
  X, 
  Plus, 
  Trash,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Monitor as MonitorIcon,
  Search,
  Settings,
  Power,
  User,
  LayoutGrid,
  Edit2,
  Globe,
  Mail,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Wallpaper as WallpaperIcon,
  Type,
  Keyboard as KeyboardIcon,
  Trophy,
  MonitorPlay,
  LogOut,
  Chrome,
  Star,
  Copy,
  Clipboard,
  ArrowRight,
  Mouse
} from 'lucide-react';

import WindowsExplorerMock from './components/WindowsExplorerMock';
import WordSimulator from './components/WordSimulator';
import ExcelSimulator from './components/ExcelSimulator';
import MouseSimulator from './components/MouseSimulator';


// --- Types ---

type ItemType = 'folder' | 'word' | 'excel' | 'photo' | 'virus' | 'lessons' | 'explorer_shortcut' | 'txt' | 'png' | 'jpg' | 'chrome' | 'gmail' | 'mouse_training';
type AppType = 'explorer' | 'chrome' | 'gmail' | 'trash' | 'settings' | 'virus_warning' | 'typing' | 'windows_explorer' | 'photo_viewer' | 'word_simulator' | 'excel_simulator' | 'mouse_simulator';

interface DesktopItem {
  id: string;
  name: string;
  type: ItemType;
  x: number;
  y: number;
  parentId: string | null;
  isInfected?: boolean;
  url?: string;
}

interface WindowState {
  id: string;
  type: AppType;
  title: string;
  isOpen: boolean;
  isMaximized: boolean;
  zIndex: number;
  folderId?: string | null; // For explorer
}

interface Email {
  id: string;
  sender: string;
  subject: string;
  body: string;
  date: string;
  folder: 'inbox' | 'sent' | 'trash';
  isSpecial?: boolean;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  level: 'Fácil' | 'Médio' | 'Difícil';
  goal: string;
}

const LESSONS: Lesson[] = [
  { 
    id: 1, 
    title: 'Limpeza Básica', 
    description: 'Arraste o arquivo "Boleto_Urgente.exe" para a lixeira. Clique com o botão ESQUERDO, segure e leve até o ícone da lixeira no canto inferior direito.', 
    level: 'Fácil', 
    goal: 'delete_item' 
  },
  { 
    id: 2, 
    title: 'Organização', 
    description: 'Clique com o botão DIREITO no fundo da tela, escolha "Novo Item" -> "Pasta". Depois, clique no nome para escrever um novo nome.', 
    level: 'Fácil', 
    goal: 'create_rename' 
  },
  {
    id: 3,
    title: 'Identificando Phishing',
    description: 'Abra o Gmail e clique no e-mail suspeito do Banco Falso para identificá-lo.',
    level: 'Médio',
    goal: 'identify_phishing'
  },
  {
    id: 4,
    title: 'Criando Documentos',
    description: 'Crie um novo arquivo de Word na área de trabalho clicando com o botão direito -> Novo Item -> Word.',
    level: 'Fácil',
    goal: 'create_word'
  },
  {
      id: 5,
      title: 'Digitando Texto',
      description: 'Abra o Word e digite o texto solicitado.',
      level: 'Médio',
      goal: 'typing_test'
  },
  {
      id: 6,
      title: 'Organizando Arquivos',
      description: 'Crie uma pasta chamada "Estudos" e mova os arquivos de Word e Excel para dentro dela.',
      level: 'Difícil',
      goal: 'move_items'
  },
  {
    id: 7, 
    title: 'Evitando Vírus', 
    description: 'Cuidado! Há um vírus na tela. Em vez de abrir, arraste-o direto para a lixeira para proteger seu computador.', 
    level: 'Difícil', 
    goal: 'avoid_virus' 
  }
];

const DEFAULT_ITEMS: DesktopItem[] = [
  { id: '1', name: 'Meus Documentos', type: 'folder', x: 50, y: 50, parentId: null },
  { id: '2', name: 'Fotos de Família', type: 'folder', x: 50, y: 160, parentId: null },
  { id: '3', name: 'Boleto_Urgente.exe', type: 'virus', x: 160, y: 50, parentId: null, isInfected: true },
  { id: '5', name: 'LIÇÕES', type: 'lessons', x: 50, y: 270, parentId: null },
  { id: '6', name: 'Windows Explorer', type: 'explorer_shortcut', x: 160, y: 270, parentId: null },
  { id: 'chrome-desktop', name: 'Google Chrome', type: 'chrome', x: 160, y: 160, parentId: null },
  { id: 'gmail-desktop', name: 'Gmail', type: 'gmail', x: 270, y: 50, parentId: null },
  { id: 'mouse-training', name: 'Treino de Mouse', type: 'mouse_training', x: 270, y: 160, parentId: null },

  // Meus Documentos contents
  { id: 'md1', name: 'Relatório.doc', type: 'word', x: 0, y: 0, parentId: '1' },
  { id: 'md2', name: 'Orçamento.doc', type: 'word', x: 0, y: 0, parentId: '1' },
  { id: 'md3', name: 'Carta.doc', type: 'word', x: 0, y: 0, parentId: '1' },
  { id: 'md4', name: 'Controle.xls', type: 'excel', x: 0, y: 0, parentId: '1' },
  { id: 'md5', name: 'Folha.xls', type: 'excel', x: 0, y: 0, parentId: '1' },
  { id: 'md6', name: 'Vendas.xls', type: 'excel', x: 0, y: 0, parentId: '1' },
  { id: 'md7', name: 'Anotacoes.txt', type: 'txt', x: 0, y: 0, parentId: '1' },
  { id: 'md8', name: 'Lembretes.txt', type: 'txt', x: 0, y: 0, parentId: '1' },
  { id: 'md9', name: 'Logo.png', type: 'png', x: 0, y: 0, parentId: '1' },
  { id: 'md10', name: 'Banner.png', type: 'png', x: 0, y: 0, parentId: '1' },
  { id: 'md11', name: 'Perfil.jpg', type: 'jpg', x: 0, y: 0, parentId: '1' },
  { id: 'md12', name: 'Fundo.jpg', type: 'jpg', x: 0, y: 0, parentId: '1' },

  // Fotos de Família contents
  { id: 'ff1', name: 'Sorrisos.png', type: 'png', x: 0, y: 0, parentId: '2', url: '/ia_images/familia_1_1774372537107.png' },
  { id: 'ff2', name: 'No Parque.png', type: 'png', x: 0, y: 0, parentId: '2', url: '/ia_images/familia_2_1774372552407.png' },
  { id: 'ff3', name: 'Jantar.png', type: 'png', x: 0, y: 0, parentId: '2', url: '/ia_images/familia_3_1774372570179.png' },
  { id: 'ff4', name: 'Viagem.png', type: 'png', x: 0, y: 0, parentId: '2', url: '/ia_images/familia_4_1774372587332.png' },
  { id: 'ff5', name: 'Abraçados.png', type: 'png', x: 0, y: 0, parentId: '2', url: '/ia_images/familia_5_1774372603701.png' },
];

const WALLPAPERS = [
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80',
  '#0078D7', // Classic Blue
];

// --- Main Component ---

export default function App() {
  // Persistence Helpers
  const SAVE_KEY = 'simulador_informatica_v1';

  // State initialization with Persistence
  const [items, setItems] = useState<DesktopItem[]>(() => {
    const saved = localStorage.getItem(`${SAVE_KEY}_items`);
    return saved ? JSON.parse(saved) : DEFAULT_ITEMS;
  });

  const [deletedItems, setDeletedItems] = useState<DesktopItem[]>(() => {
    const saved = localStorage.getItem(`${SAVE_KEY}_deleted`);
    return saved ? JSON.parse(saved) : [];
  });

  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [wallpaper, setWallpaper] = useState(WALLPAPERS[0]);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showLessonMenu, setShowLessonMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ 
    visible: boolean; 
    x: number; 
    y: number; 
    targetId: string | null; 
    type: 'desktop' | 'folder' | 'item'; 
    folderId?: string | null 
  } | null>(null);
  const [clipboardItem, setClipboardItem] = useState<DesktopItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [isVirusActive, setIsVirusActive] = useState(false);
  const [isSimulatorActive, setIsSimulatorActive] = useState(false);
  const [fontSize, setFontSize] = useState(1);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [lessonSuccess, setLessonSuccess] = useState(false);
  
  const [totalScore, setTotalScore] = useState<number>(() => {
    const saved = localStorage.getItem(`${SAVE_KEY}_score`);
    return saved ? parseInt(saved) : 0;
  });

  const [lastPoints, setLastPoints] = useState(0);
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [settingsTab, setSettingsTab] = useState<'personalization' | 'accessibility'>('personalization');
  
  // New System States
  const [systemStatus, setSystemStatus] = useState<'desktop' | 'login' | 'restarting' | 'starting'>('desktop');
  
  const [userName, setUserName] = useState<string>(() => {
    const saved = localStorage.getItem(`${SAVE_KEY}_user`);
    return saved || 'usuário';
  });

  const [showPowerOptions, setShowPowerOptions] = useState(false);
  
  // Gmail State
  const [emails, setEmails] = useState<Email[]>(() => {
    const saved = localStorage.getItem(`${SAVE_KEY}_emails`);
    return saved ? JSON.parse(saved) : [
      { id: '1', sender: 'Google', subject: 'Bem-vindo ao seu novo Gmail', body: 'Olá! Estamos felizes por você ter escolhido o Gmail para as suas comunicações.', date: '14:20', folder: 'inbox' },
      { id: '2', sender: 'Suporte Técnico', subject: 'Dicas de Segurança', body: 'Nunca compartilhe sua senha com ninguém por e-mail. Fique atento a links suspeitos.', date: 'Ontem', folder: 'inbox' },
      { id: '3', sender: 'Banco Falso', subject: 'URGENTE: Boleto em atraso', body: 'Clique aqui para baixar seu boleto e evitar multas por atraso no pagamento.', date: '10 Mar', folder: 'inbox', isSpecial: true },
    ];
  });

  const [gmailActiveFolder, setGmailActiveFolder] = useState<'inbox' | 'sent' | 'trash'>('inbox');
  const [isComposingEmail, setIsComposingEmail] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [readingEmail, setReadingEmail] = useState<Email | null>(null);
  
  // Chrome Search State
  const [chromeSearchQuery, setChromeSearchQuery] = useState('');
  const [isShowingChromeResults, setIsShowingChromeResults] = useState(false);
  const [isChromeLoading, setIsChromeLoading] = useState(false);

  const desktopRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(`${SAVE_KEY}_items`, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(`${SAVE_KEY}_deleted`, JSON.stringify(deletedItems));
  }, [deletedItems]);

  useEffect(() => {
    localStorage.setItem(`${SAVE_KEY}_emails`, JSON.stringify(emails));
  }, [emails]);

  useEffect(() => {
    localStorage.setItem(`${SAVE_KEY}_score`, totalScore.toString());
  }, [totalScore]);

  useEffect(() => {
    localStorage.setItem(`${SAVE_KEY}_user`, userName);
  }, [userName]);

  // --- Helpers ---

  const startSimulator = () => {
    setIsSimulatorActive(true);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const abortSimulator = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setIsSimulatorActive(false);
    setSystemStatus('desktop');
    resetToDefault();
  };

  const restartSystem = () => {
    setShowStartMenu(false);
    setShowPowerOptions(false);
    setSystemStatus('restarting');
    
    // Increased time to 8 seconds (3s original + 5s requested) to allow reading the warning message
    setTimeout(() => {
      setSystemStatus('starting');
      setTimeout(() => {
        setSystemStatus('login');
      }, 3000);
    }, 8000);
  };

  const openWindow = (type: AppType, title: string, folderId: string | null = null) => {
    const existing = windows.find(w => w.type === type && w.folderId === folderId);
    if (existing) {
      setActiveWindowId(existing.id);
      return;
    }

    const newWindow: WindowState = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title,
      isOpen: true,
      isMaximized: type === 'mouse_simulator',
      zIndex: maxZIndex + 1,
      folderId
    };
    setWindows([...windows, newWindow]);
    setActiveWindowId(newWindow.id);
    setMaxZIndex(maxZIndex + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows(windows.map(w => w.id === id ? { ...w, zIndex: maxZIndex + 1 } : w));
    setMaxZIndex(maxZIndex + 1);
  };

  const handleDragEnd = (id: string, info: any) => {
    if (!desktopRef.current) return;
    const desktopRect = desktopRef.current.getBoundingClientRect();
    const { x, y } = info.point;

    // Check for trash
    if (trashRef.current) {
      const trashRect = trashRef.current.getBoundingClientRect();
      if (x >= trashRect.left && x <= trashRect.right && y >= trashRect.top && y <= trashRect.bottom) {
        setItems(prev => {
          const item = prev.find(i => i.id === id);
          if (item) {
            setDeletedItems(d => [...d, item]);
            if (currentLesson?.goal === 'delete_item' || (currentLesson?.goal === 'avoid_virus' && item.type === 'virus')) {
              const points = 100;
              setLastPoints(points);
              setTotalScore(s => s + points);
              setLessonSuccess(true);
            }
            return prev.filter(i => i.id !== id);
          }
          return prev;
        });
        return;
      }
    }

    // Check for dropping into folders
    setItems(prev => {
      const droppedOnFolder = prev.find(i => 
        i.id !== id && 
        i.type === 'folder' && 
        i.parentId === null &&
        x >= i.x + desktopRect.left - 20 && x <= i.x + desktopRect.left + 120 &&
        y >= i.y + desktopRect.top - 20 && y <= i.y + desktopRect.top + 120
      );

      if (droppedOnFolder) {
        return prev.map(item => 
          item.id === id ? { ...item, parentId: droppedOnFolder.id, x: 0, y: 0 } : item
        );
      }

      // Update position
      return prev.map(item => 
        item.id === id ? { ...item, x: x - desktopRect.left - 48, y: y - desktopRect.top - 48 } : item
      );
    });
  };

  const arrangeIcons = (side: 'left' | 'right' | 'grid') => {
    const desktopWidth = desktopRef.current?.clientWidth || 1000;
    const padding = 20;
    const iconHeight = 125;
    const iconWidth = 100;

    setItems(prev => {
      // Sort by current Y then X to keep visual order
      const desktopItems = prev
        .filter(i => i.parentId === null)
        .sort((a, b) => a.y - b.y || a.x - b.x);

      return prev.map(item => {
        if (item.parentId !== null) return item;
        
        const index = desktopItems.findIndex(di => di.id === item.id);
        let newX = item.x;
        let newY = item.y;

        if (side === 'left') {
          newX = padding;
          newY = padding + index * iconHeight;
        } else if (side === 'right') {
          newX = desktopWidth - iconWidth - padding;
          newY = padding + index * iconHeight;
        } else if (side === 'grid') {
          const cols = Math.floor((desktopWidth - padding * 2) / iconWidth);
          newX = padding + (index % cols) * iconWidth;
          newY = padding + Math.floor(index / cols) * iconHeight;
        }

        return { ...item, x: newX, y: newY };
      });
    });
    setContextMenu(null);
  };

  const createItem = (type: ItemType, parentId: string | null = null) => {
    const names = { folder: 'Nova Pasta', word: 'Novo Texto', excel: 'Nova Planilha', photo: 'Nova Foto', virus: 'Arquivo' };
    const desktopRect = desktopRef.current?.getBoundingClientRect();
    
    setItems(prev => {
      const newItem: DesktopItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: `${names[type]} ${prev.length + 1}`,
        type,
        x: parentId ? 0 : (contextMenu?.x && desktopRect ? contextMenu.x - desktopRect.left - 48 : 100),
        y: parentId ? 0 : (contextMenu?.y && desktopRect ? contextMenu.y - desktopRect.top - 48 : 100),
        parentId
      };
      
      setTimeout(() => {
        if (currentLesson?.goal === 'create_rename') {
          setEditingId(newItem.id);
        }
      }, 100);

      return [...prev, newItem];
    });

    setContextMenu(null);
    if (currentLesson?.goal === 'create_inside_folder' && parentId !== null) {
      const points = 150;
      setLastPoints(points);
      setTotalScore(prev => prev + points);
      setLessonSuccess(true);
    }
  };

  const deleteItem = (id: string) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item) {
        setDeletedItems(d => [...d, { ...item, x: item.x + 20, y: item.y + 20 }]);
        return prev.filter(i => i.id !== id);
      }
      return prev;
    });
    setContextMenu(null);
  };

  const copyItem = (item: DesktopItem) => {
    setClipboardItem({ ...item });
    setContextMenu(null);
  };

  const pasteItem = (parentId: string | null, x?: number, y?: number) => {
    if (!clipboardItem) return;
    
    setItems(prev => {
      const newItem: DesktopItem = {
        ...clipboardItem,
        id: Math.random().toString(36).substr(2, 9),
        name: `${clipboardItem.name} - Cópia`,
        parentId: parentId,
        x: x !== undefined ? x : 20,
        y: y !== undefined ? y : 20
      };
      return [...prev, newItem];
    });
    setContextMenu(null);
  };

  const restoreItem = (id: string) => {
    const item = deletedItems.find(i => i.id === id);
    if (item) {
      setItems([...items, item]);
      setDeletedItems(deletedItems.filter(i => i.id !== id));
    }
  };

  const handleItemClick = (item: DesktopItem) => {
    if (item.type === 'virus') {
      setIsVirusActive(true);
      openWindow('virus_warning', 'ALERTA DE SEGURANÇA');
    } else if (item.type === 'folder') {
      openWindow('explorer', item.name, item.id);
    } else if (item.type === 'lessons') {
      setShowLessonMenu(true);
    } else if (item.type === 'explorer_shortcut') {
      openWindow('windows_explorer', 'Este Computador');
    } else if (item.type === 'png' || item.type === 'jpg' || item.type === 'photo') {
      openWindow('photo_viewer', item.name, item.id);
    } else if (item.type === 'word') {
      openWindow('word_simulator', item.name, item.id);
    } else if (item.type === 'excel') {
      openWindow('excel_simulator', item.name, item.id);
    } else if (item.type === 'chrome') {
      openWindow('chrome', 'Google Chrome');
    } else if (item.type === 'gmail') {
      openWindow('gmail', 'Gmail');
    } else if (item.type === 'mouse_training') {
      openWindow('mouse_simulator', 'Treinamento de Mouse');
    }
  };

  const resetToDefault = () => {
    setItems(DEFAULT_ITEMS);
    setDeletedItems([]);
    setWindows([]);
    setWallpaper(WALLPAPERS[0]);
    setIsVirusActive(false);
    setShowLessonMenu(true);
    setFontSize(1);
    setIsHighContrast(false);
    setSettingsTab('personalization');
  };

  // Accessibility Effect
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize * 16}px`;
  }, [fontSize]);

  // --- Renderers ---

  const renderIcon = (type: ItemType, size = 48, item?: DesktopItem) => {
    if (item?.url && (type === 'png' || type === 'jpg' || type === 'photo')) {
      return (
        <div 
          className="rounded shadow-inner border border-black/10 flex items-center justify-center bg-gray-100 overflow-hidden" 
          style={{ width: size, height: size }}
        >
          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
        </div>
      );
    }

    switch (type) {
      case 'folder': return <Folder size={size} className="text-yellow-500 fill-yellow-500/20" />;
      case 'word': return <FileText size={size} className="text-blue-600" />;
      case 'excel': return <Table size={size} className="text-green-600" />;
      case 'photo': return <ImageIcon size={size} className="text-purple-500" />;
      case 'png': return <ImageIcon size={size} className="text-blue-500" />;
      case 'jpg': return <ImageIcon size={size} className="text-orange-500" />;
      case 'txt': return <FileText size={size} className="text-gray-500" />;
      case 'virus': return <ShieldAlert size={size} className="text-red-600" />;
      case 'lessons': return <Trophy size={size} className="text-yellow-500" />;
      case 'explorer_shortcut': return <Folder size={size} className="text-yellow-400 fill-yellow-200" />;
      case 'chrome': return (
        <div className="p-2 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center">
          <Chrome size={size - 16} className="text-blue-500" />
        </div>
      );
      case 'gmail': return (
        <div className="p-2 bg-white rounded-xl shadow-lg border border-red-100 flex items-center justify-center">
          <Mail size={size - 16} className="text-red-500" />
        </div>
      );
      case 'mouse_training': return (
        <div className="p-2 bg-blue-600 rounded-xl shadow-lg border border-blue-400 flex items-center justify-center">
          <Mouse size={size - 16} className="text-white" />
        </div>
      );
    }
  };

  if (!isSimulatorActive) {
    return (
      <div className="flex flex-col h-screen w-screen bg-blue-600 text-white items-center justify-center p-4 md:p-8 font-sans">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white text-gray-900 rounded-[3rem] p-8 md:p-12 max-w-2xl w-full text-center shadow-2xl border-8 border-white/20"
        >
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border-4 border-blue-100">
            <MonitorPlay size={48} />
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Informática Sem Segredo</h2>
          <p className="text-lg md:text-xl text-gray-500 mb-8 font-medium">
            Aprenda a usar o computador com calma e segurança. O simulador será aberto em <span className="text-blue-600 font-bold">Tela Cheia</span> para evitar distrações.
          </p>
          <button 
            onClick={startSimulator}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-6 rounded-2xl font-black text-xl md:text-2xl transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 border-b-8 border-red-900 active:border-b-0 group"
          >
            <MonitorPlay size={40} className="group-hover:scale-110 transition-transform" />
            ATIVAR SIMULADOR
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className={`h-screen w-screen overflow-hidden flex flex-col font-sans select-none relative transition-all duration-300 ${isHighContrast ? 'high-contrast' : ''}`}
      style={{ 
        backgroundColor: wallpaper.startsWith('#') ? wallpaper : 'transparent',
        backgroundImage: wallpaper.startsWith('http') ? `url(${wallpaper})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({ visible: true, x: e.clientX, y: e.clientY, targetId: null, type: 'desktop' });
      }}
      onClick={() => {
        setContextMenu(null);
        setShowStartMenu(false);
      }}
    >
      {/* Virus Overlay */}
      <AnimatePresence>
        {isVirusActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-red-600/20 backdrop-blur-[2px] z-[9999] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Desktop Area */}
      <div ref={desktopRef} className="flex-1 relative p-4">
        {items.filter(i => i.parentId === null).map((item) => (
          <motion.div
            key={item.id}
            drag
            dragMomentum={false}
            dragConstraints={desktopRef}
            dragElastic={0}
            onDragEnd={(_, info) => handleDragEnd(item.id, info)}
            onDoubleClick={() => handleItemClick(item)}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setContextMenu({ visible: true, x: e.clientX, y: e.clientY, targetId: item.id, type: 'item' });
            }}
            className="absolute flex flex-col items-center w-24 cursor-pointer group"
            animate={{ x: item.x, y: item.y }}
            transition={{ duration: 0 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className={`p-2 rounded-lg group-hover:bg-white/10 transition-colors ${contextMenu?.targetId === item.id ? 'bg-white/20' : ''}`}>
              {renderIcon(item.type, 64, item)}
            </div>
            {editingId === item.id ? (
              <input 
                autoFocus
                className="text-xs text-center bg-white text-black w-full outline-none"
                defaultValue={item.name}
                onBlur={(e) => {
                  const newName = e.target.value;
                  setItems(items.map(i => i.id === item.id ? { ...i, name: newName } : i));
                  setEditingId(null);
                  if (currentLesson?.goal === 'create_rename' && newName !== item.name) {
                    const points = 100;
                    setLastPoints(points);
                    setTotalScore(prev => prev + points);
                    setLessonSuccess(true);
                  }
                }}
                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              />
            ) : (
              <span className="text-white text-xs font-medium text-center mt-1 px-1 rounded bg-black/20 break-words w-full shadow-sm">
                {item.name}
              </span>
            )}
          </motion.div>
        ))}

        {/* Trash Icon */}
        <div 
          ref={trashRef}
          onDoubleClick={() => openWindow('trash', 'Lixeira')}
          className="absolute bottom-20 right-8 flex flex-col items-center group cursor-pointer"
        >
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/20 transition-all">
            <Trash2 size={80} className={deletedItems.length > 0 ? "text-blue-200" : "text-white/80"} />
          </div>
          <span className="text-white text-xs font-bold mt-2 bg-black/20 px-3 py-1 rounded">Lixeira</span>
        </div>
      </div>

      {windows.map((win) => (
        <motion.div
          key={win.id}
          drag={win.type !== 'typing' && win.type !== 'mouse_simulator' && !win.isMaximized}
          dragMomentum={false}
          dragElastic={0}
          dragListener={win.type !== 'mouse_simulator' && !win.isMaximized}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0 }}
          style={{ zIndex: win.zIndex }}
          onClick={() => focusWindow(win.id)}
          onContextMenu={(e) => { e.stopPropagation(); setContextMenu(null); }}
          className={`fixed bg-white rounded-lg shadow-2xl border border-gray-300 flex flex-col overflow-hidden ${
            win.isMaximized || win.type === 'typing' 
              ? 'inset-0 sm:inset-4 md:inset-8 !translate-x-0 !translate-y-0' 
              : 'w-[800px] h-[500px] top-20 left-40'
          }`}
        >
          {/* Window Header */}
          <div className={`window-header bg-gray-100 p-3 flex items-center justify-between border-b border-gray-200 ${win.type === 'typing' ? 'cursor-default' : 'cursor-move'}`}>
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              {win.type === 'chrome' && <Chrome size={18} className="text-blue-500" />}
              {win.type === 'gmail' && <Mail size={18} className="text-red-500" />}
              {win.type === 'explorer' && <Folder size={18} className="text-yellow-500" />}
              {win.type === 'windows_explorer' && <Folder size={18} className="text-yellow-500" />}
              {win.type === 'trash' && <Trash2 size={18} className="text-gray-500" />}
              {win.type === 'settings' && <Settings size={18} className="text-gray-600" />}
              {win.type === 'virus_warning' && <ShieldAlert size={18} className="text-red-600" />}
              {win.type === 'word_simulator' && <FileText size={18} className="text-blue-600" />}
              {win.type === 'excel_simulator' && <Table size={18} className="text-green-600" />}
              {win.type === 'mouse_simulator' && <Mouse size={18} className="text-blue-600" />}
              <span>{win.title}</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-gray-200 rounded text-gray-500"><Minimize2 size={16} /></button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setWindows(windows.map(w => w.id === win.id ? { ...w, isMaximized: !w.isMaximized } : w));
                }}
                className="p-2 hover:bg-gray-200 rounded text-gray-500"
              >
                <Maximize2 size={16} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
                className="p-2 hover:bg-red-500 hover:text-white rounded text-gray-500"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Window Content */}
          <div className="flex-1 overflow-auto bg-white flex flex-col">
            {win.type === 'chrome' && (
              <div className="flex flex-col h-full bg-white relative">
                <div className="flex items-center gap-4 p-2 border-b bg-gray-50/50">
                  <div className="flex gap-2 text-gray-500">
                    <button 
                       onClick={() => { 
                         setIsShowingChromeResults(false); 
                         setChromeSearchQuery(''); 
                         setIsChromeLoading(false); 
                       }} 
                       className={`hover:bg-gray-200 p-1.5 rounded-full transition-colors ${isShowingChromeResults ? 'text-gray-900' : 'text-gray-300 pointer-events-none'}`}
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button className="text-gray-300 p-1.5"><RotateCcw size={16} /></button>
                  </div>
                  <div className="flex-1 bg-white border rounded-full px-5 py-2 text-sm flex items-center gap-3 shadow-sm border-gray-200 hover:border-blue-400 transition-colors group">
                    <Globe size={14} className="text-gray-400 group-hover:text-blue-500" />
                    <input 
                      value={isShowingChromeResults ? `www.google.com.br/search?q=${chromeSearchQuery.replace(/\s/g, '+')}` : "www.google.com.br"} 
                      readOnly 
                      className="w-full outline-none bg-transparent text-gray-600 font-medium"
                    />
                    <Star size={14} className="text-gray-300 hover:text-yellow-400 cursor-pointer" />
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto w-full bg-white">
                  {isChromeLoading ? (
                    <div className="h-full flex flex-col items-center justify-center p-20 animate-in fade-in duration-500">
                       <div className="w-16 h-16 border-[6px] border-gray-100 border-t-blue-500 rounded-full animate-spin mb-6"></div>
                       <p className="text-xl font-black text-gray-400 uppercase tracking-widest animate-pulse">Buscando na Web...</p>
                    </div>
                  ) : isShowingChromeResults ? (
                    /* Google Search Results Page */
                    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-700">
                      {/* Search Results Header */}
                      <div className="p-8 border-b sticky top-0 bg-white z-20 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-10 w-full max-w-5xl">
                          <h1 
                            onClick={() => { setIsShowingChromeResults(false); setChromeSearchQuery(''); }} 
                            className="text-3xl font-black cursor-pointer tracking-tighter select-none active:scale-95 transition-transform"
                          >
                            <span className="text-blue-500">G</span>
                            <span className="text-red-500">o</span>
                            <span className="text-yellow-500">o</span>
                            <span className="text-blue-500">g</span>
                            <span className="text-green-500">l</span>
                            <span className="text-red-500">e</span>
                          </h1>
                          <div className="flex-1 relative group">
                            <input 
                              className="w-full border border-gray-200 rounded-full py-3.5 px-14 shadow-lg outline-none group-hover:shadow-blue-100 transition-all text-gray-800 text-lg font-medium" 
                              value={chromeSearchQuery}
                              onChange={(e) => setChromeSearchQuery(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && chromeSearchQuery.trim()) {
                                  setIsChromeLoading(true);
                                  setTimeout(() => setIsChromeLoading(false), 900);
                                }
                              }}
                            />
                            <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {/* Filter Bar */}
                      <div className="px-44 py-3 border-b flex gap-10 text-sm text-gray-500 font-bold overflow-hidden select-none">
                        <div className="text-blue-600 border-b-4 border-blue-600 pb-3 px-2">Todas</div>
                        <div className="hover:text-blue-600 cursor-pointer pb-3 px-2 border-b-4 border-transparent transition-all">Notícias</div>
                        <div className="hover:text-blue-600 cursor-pointer pb-3 px-2 border-b-4 border-transparent transition-all">Imagens</div>
                        <div className="hover:text-blue-600 cursor-pointer pb-3 px-2 border-b-4 border-transparent transition-all">Vídeos</div>
                        <div className="hover:text-blue-600 cursor-pointer pb-3 px-2 border-b-4 border-transparent transition-all">Shopping</div>
                      </div>

                      {/* Result Items */}
                      <div className="px-44 py-12 flex-1 max-w-6xl">
                        <div className="text-gray-400 text-sm mb-12 font-medium">Aproximadamente 4.520.000 resultados para <span className="text-gray-900">"{chromeSearchQuery}"</span> (0,28 segundos)</div>
                        
                        <div className="space-y-16">
                          {[
                            { title: `${chromeSearchQuery} - Guia Completo e Definitivo`, url: `www.portal${chromeSearchQuery.replace(/\s/g, '')}.com.br › guia`, desc: `Aprenda tudo sobre ${chromeSearchQuery} com nossos especialistas. Dicas exclusivas, tutoriais detalhados e as melhores práticas para o seu dia a dia.` },
                            { title: `Curso Online de ${chromeSearchQuery} para Iniciantes`, url: `educacao.simulador.com › cursos › ${chromeSearchQuery.replace(/\s/g, '-')}`, desc: `Comece sua jornada em ${chromeSearchQuery} agora mesmo. Curso 100% gratuito com material de apoio e suporte da comunidade.` },
                            { title: `As Últimas Notícias sobre ${chromeSearchQuery}`, url: `noticias.google.com.br › topicos › ${chromeSearchQuery.replace(/\s/g, '_')}`, desc: `Fique por dentro de todos os acontecimentos recentes envolvendo ${chromeSearchQuery}. Cobertura completa 24 horas por dia.` },
                            { title: `${chromeSearchQuery}: O que é, Exemplos e Como usar`, url: `blog.digital.com › tecnologia › guias`, desc: `Você tem dúvidas sobre ${chromeSearchQuery}? Explicamos de forma simples e direta o que você precisa saber para não ficar para trás.` },
                            { title: `${chromeSearchQuery} na Wikipédia`, url: `pt.wikipedia.org › wiki › ${chromeSearchQuery.replace(/\s/g, '_')}`, desc: `${chromeSearchQuery} é um termo que se refere a uma série de conceitos fundamentais na educação de adultos e tecnologia assistiva...` },
                          ].map((res, i) => (
                            <div key={i} className="group cursor-pointer max-w-3xl">
                              <div className="text-sm text-gray-500 mb-2 items-center gap-1 group-hover:text-gray-800 transition-colors flex">
                                <span>{res.url}</span>
                                <ChevronDown size={14} className="opacity-50" />
                              </div>
                              <h3 className="text-blue-800 text-2xl font-medium hover:underline mb-2 group-hover:text-blue-900 leading-tight transition-colors">{res.title}</h3>
                              <p className="text-gray-600 text-[15px] leading-relaxed group-hover:text-gray-800 transition-colors">{res.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Google Home Page */
                    <div className="h-full flex flex-col items-center justify-center p-4 bg-white">
                      <div className="mb-12 flex flex-col items-center w-full max-w-3xl px-4">
                        <span className="text-8xl md:text-[120px] font-black font-sans tracking-tight mb-14 select-none drop-shadow-sm">
                          <span className="text-blue-500">G</span>
                          <span className="text-red-500">o</span>
                          <span className="text-yellow-500">o</span>
                          <span className="text-blue-500">g</span>
                          <span className="text-green-500">l</span>
                          <span className="text-red-500">e</span>
                        </span>
                        
                        <div className="relative group w-full scale-110 md:scale-125">
                          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                             <Search size={22} />
                          </div>
                          <input 
                            autoFocus
                            className="w-full border-2 border-gray-100 rounded-full py-5 px-16 text-xl shadow-md group-hover:shadow-xl transition-all duration-300 outline-none focus:border-blue-200 focus:bg-white" 
                            placeholder="Tente pesquisar por 'Receita de Bolo' ou 'Informática'"
                            value={chromeSearchQuery}
                            onChange={(e) => setChromeSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && chromeSearchQuery.trim()) {
                                setIsChromeLoading(true);
                                setTimeout(() => {
                                  setIsChromeLoading(false);
                                  setIsShowingChromeResults(true);
                                }, 1500);
                              }
                            }}
                          />
                        </div>

                        <div className="flex gap-6 mt-16 scale-110">
                           <button 
                             onClick={() => { 
                               if(chromeSearchQuery.trim()) { 
                                 setIsChromeLoading(true); 
                                 setTimeout(() => { setIsChromeLoading(false); setIsShowingChromeResults(true); }, 1200); 
                               }
                             }} 
                             className="bg-gray-50 px-10 py-4 rounded-xl text-sm hover:border-gray-300 border-2 border-transparent font-bold text-gray-600 hover:shadow-lg transition-all active:scale-95"
                           >
                             Pesquisa Google
                           </button>
                           <button className="bg-gray-50 px-10 py-4 rounded-xl text-sm hover:border-gray-300 border-2 border-transparent font-bold text-gray-600 hover:shadow-lg transition-all active:scale-95">Estou com Sorte</button>
                        </div>
                      </div>

                      <div className="mt-auto py-12 text-sm text-gray-400 font-medium border-t w-full flex justify-center gap-12 bg-gray-50/30">
                        <span className="hover:text-blue-600 cursor-pointer transition-colors">Brasil</span>
                        <span className="hover:text-blue-600 cursor-pointer transition-colors">Sobre</span>
                        <span className="hover:text-blue-600 cursor-pointer transition-colors">Publicidade</span>
                        <span className="hover:text-blue-600 cursor-pointer transition-colors">Negócios</span>
                        <span className="hover:text-blue-600 cursor-pointer transition-colors">Privacidade</span>
                        <span className="hover:text-blue-600 cursor-pointer transition-colors">Termos</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {win.type === 'gmail' && (
              <div className="flex h-full bg-white select-text">
                {/* Sidebar */}
                <div className="w-64 bg-gray-50/50 border-r p-6 flex flex-col gap-3">
                  <button 
                    onClick={() => setIsComposingEmail(true)}
                    className="bg-white border-2 border-gray-100 text-gray-700 py-4 rounded-3xl font-black mb-10 shadow-xl flex items-center justify-center gap-4 hover:shadow-red-50 hover:border-red-100 transition-all hover:scale-105 active:scale-95 group"
                  >
                    <Edit2 size={24} className="text-red-500 group-hover:rotate-12 transition-transform" /> 
                    <span className="tracking-tight text-lg">Escrever</span>
                  </button>
                  <div 
                    onClick={() => { setGmailActiveFolder('inbox'); setReadingEmail(null); }}
                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${gmailActiveFolder === 'inbox' ? 'text-red-600 font-black bg-red-50 shadow-sm' : 'text-gray-500 hover:bg-white hover:shadow-sm font-medium'}`}
                  >
                    <Mail size={22} /> <span className="flex-1 text-sm font-bold uppercase tracking-wider">Principal</span>
                    {emails.filter(e => e.folder === 'inbox').length > 0 && <span className="text-xs font-black bg-gray-200 px-2 py-1 rounded-full">{emails.filter(e => e.folder === 'inbox').length}</span>}
                  </div>
                  <div 
                    onClick={() => { setGmailActiveFolder('sent'); setReadingEmail(null); }}
                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${gmailActiveFolder === 'sent' ? 'text-red-600 font-black bg-red-50 shadow-sm' : 'text-gray-500 hover:bg-white hover:shadow-sm font-medium'}`}
                  >
                    <CheckCircle2 size={22} /> <span className="flex-1 text-sm font-bold uppercase tracking-wider">Enviados</span>
                    {emails.filter(e => e.folder === 'sent').length > 0 && <span className="text-xs font-black bg-gray-200 px-2 py-1 rounded-full">{emails.filter(e => e.folder === 'sent').length}</span>}
                  </div>
                  <div 
                    onClick={() => { setGmailActiveFolder('trash'); setReadingEmail(null); }}
                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${gmailActiveFolder === 'trash' ? 'text-red-600 font-black bg-red-50 shadow-sm' : 'text-gray-500 hover:bg-white hover:shadow-sm font-medium'}`}
                  >
                    <Trash2 size={22} /> <span className="flex-1 text-sm font-bold uppercase tracking-wider">Lixeira</span>
                    {emails.filter(e => e.folder === 'trash').length > 0 && <span className="text-xs font-black bg-gray-200 px-2 py-1 rounded-full">{emails.filter(e => e.folder === 'trash').length}</span>}
                  </div>
                </div>

                {/* Main Pane */}
                <div className="flex-1 flex flex-col relative">
                  {readingEmail ? (
                    /* Reading View */
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-10 duration-500 bg-white">
                      <div className="p-6 border-b flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                         <div className="flex items-center gap-8">
                            <button onClick={() => setReadingEmail(null)} className="p-3 hover:bg-gray-100 rounded-full transition-all active:scale-95" title="Voltar"><ArrowLeft size={24} /></button>
                            <div className="flex items-center gap-4">
                               <button 
                                 onClick={() => {
                                   setEmails(emails.map(e => e.id === readingEmail.id ? { ...e, folder: 'trash' } : e));
                                   setReadingEmail(null);
                                 }}
                                 className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-black text-sm uppercase tracking-wider"
                               >
                                  <Trash2 size={18} /> Excluir
                               </button>
                               <button className="flex items-center gap-2 px-6 py-2.5 hover:bg-gray-100 rounded-xl transition-all font-bold text-sm text-gray-500"><RotateCcw size={18} /> Responder</button>
                            </div>
                         </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-16 max-w-5xl mx-auto w-full">
                         <h2 className="text-4xl font-light mb-12 text-gray-900 tracking-tight leading-tight">{readingEmail.subject}</h2>
                         <div className="flex items-center gap-5 mb-12 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-2xl uppercase shadow-lg select-none">
                               {readingEmail.sender.charAt(0)}
                            </div>
                            <div className="flex-1">
                               <div className="flex items-center justify-between mb-1">
                                  <span className="font-black text-xl text-gray-800">{readingEmail.sender}</span>
                                  <span className="text-sm font-medium text-gray-400">{readingEmail.date}</span>
                               </div>
                               <div className="text-sm text-gray-400 flex items-center gap-1 group cursor-pointer hover:text-gray-600">
                                 para mim <ChevronDown size={14} />
                               </div>
                            </div>
                         </div>
                         <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[19px] font-medium selection:bg-blue-100">
                            {readingEmail.body}
                         </div>
                      </div>
                    </div>
                  ) : (
                    /* List View */
                    <>
                      <div className="p-6 border-b flex items-center justify-between bg-white text-gray-400 font-bold text-sm tracking-wide">
                        <div className="flex items-center gap-6">
                          <input type="checkbox" className="w-5 h-5 rounded-md border-gray-200 cursor-pointer accent-red-500" />
                          <RotateCcw size={20} className="cursor-pointer hover:text-gray-800 transition-colors" title="Atualizar" />
                          <Trash size={20} className="cursor-pointer hover:text-gray-800 transition-colors" title="Excluir selecionados" />
                        </div>
                        <div className="flex items-center gap-2 font-black">
                          <span className="text-gray-800">1-{emails.filter(e => e.folder === gmailActiveFolder).length}</span>
                          <span className="opacity-40">de</span>
                          <span>{emails.filter(e => e.folder === gmailActiveFolder).length}</span>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto w-full bg-white">
                        {emails.filter(e => e.folder === gmailActiveFolder).map((email, idx) => (
                          <motion.div 
                            key={email.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => {
                              setReadingEmail(email);
                              if (email.isSpecial && currentLesson?.goal === 'identify_phishing') {
                                const points = 200;
                                setLastPoints(points);
                                setTotalScore(prev => prev + points);
                                setLessonSuccess(true);
                              }
                            }}
                            className={`p-5 flex items-center gap-6 hover:bg-blue-50/50 cursor-pointer border-b group relative border-l-8 transition-all ${email.isSpecial ? 'bg-red-50/20 border-l-red-500 shadow-sm' : 'border-l-transparent'} hover:border-l-blue-400 active:bg-blue-100`}
                          >
                            <input type="checkbox" onClick={(e) => e.stopPropagation()} className="w-5 h-5 rounded-md border-gray-200 shrink-0 cursor-pointer accent-red-500" />
                            <div className="w-8 shrink-0 flex items-center justify-center text-gray-300 hover:text-yellow-400 transition-colors">
                              <Star size={20} />
                            </div>
                            <div className={`w-48 truncate shrink-0 text-lg ${email.isSpecial ? 'text-red-700 font-black tracking-tight' : 'text-gray-800 font-bold'}`}>{email.sender}</div>
                            <div className="flex-1 truncate pr-16 select-none">
                              <span className="font-black text-gray-900 mr-2 text-lg">{email.subject}</span>
                              <span className="text-gray-500 font-medium">— {email.body}</span>
                            </div>
                            <div className="text-sm text-gray-400 group-hover:invisible shrink-0 font-black uppercase tracking-tighter">{email.date}</div>
                            
                            <div className="absolute right-6 opacity-0 group-hover:opacity-100 flex gap-4 shrink-0 transition-all">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (email.folder === 'trash') {
                                    setEmails(emails.filter(em => em.id !== email.id));
                                  } else {
                                    setEmails(emails.map(em => em.id === email.id ? { ...em, folder: 'trash' } : em));
                                  }
                                }}
                                className="p-3 bg-white text-gray-400 hover:text-red-600 rounded-full shadow-lg border border-gray-100 hover:border-red-100 transition-all hover:scale-110 active:scale-95"
                                title="Mover para Lixeira"
                              >
                                <Trash2 size={18} />
                              </button>
                              {email.folder === 'trash' && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEmails(emails.map(em => em.id === email.id ? { ...em, folder: 'inbox' } : em));
                                  }}
                                  className="p-3 bg-white text-gray-400 hover:text-blue-600 rounded-full shadow-lg border border-gray-100 hover:border-blue-100 transition-all hover:scale-110 active:scale-95"
                                  title="Restaurar para Entrada"
                                >
                                  <RotateCcw size={18} />
                                </button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                        
                        {emails.filter(e => e.folder === gmailActiveFolder).length === 0 && (
                          <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-300 p-20 animate-in zoom-in-95 duration-700">
                             <div className="relative mb-12">
                                <Mail size={120} className="text-gray-100" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                   <X size={44} className="text-gray-200/50" />
                                </div>
                             </div>
                             <p className="text-3xl font-black italic tracking-tighter opacity-100 text-gray-200 select-none uppercase">Nada por aqui no momento</p>
                             <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs">Pasta: {gmailActiveFolder === 'inbox' ? 'Caixa de Entrada' : gmailActiveFolder === 'sent' ? 'Enviados' : 'Lixeira'}</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Compose Overlay */}
                  <AnimatePresence>
                    {isComposingEmail && (
                      <motion.div 
                        initial={{ y: 500, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 500, opacity: 0 }}
                        className="absolute bottom-0 right-10 w-[600px] bg-white rounded-t-3xl shadow-[0_-20px_60px_rgba(0,0,0,0.25)] border-x border-t border-gray-200 z-[100] flex flex-col overflow-hidden"
                      >
                         <div className="bg-[#2B2B2B] text-white p-5 flex items-center justify-between font-black uppercase tracking-widest text-xs select-none">
                            <span className="flex items-center gap-3">
                               <Edit2 size={16} className="text-blue-400" /> Nova Mensagem
                            </span>
                            <div className="flex gap-4 items-center">
                               <button onClick={() => setIsComposingEmail(false)} className="hover:bg-red-500 p-1.5 rounded-lg transition-colors"><X size={16} /></button>
                            </div>
                         </div>
                         <div className="p-8 space-y-6">
                            <div className="flex items-center gap-4 border-b border-gray-100 pb-3 group">
                               <span className="text-gray-400 font-bold w-12 text-sm uppercase">Para:</span>
                               <input 
                                 className="flex-1 outline-none text-lg font-medium text-gray-800 placeholder:text-gray-200"
                                 placeholder="exemplo@email.com"
                                 autoFocus
                                 value={emailTo}
                                 onChange={(e) => setEmailTo(e.target.value)}
                               />
                            </div>
                            <div className="flex items-center gap-4 border-b border-gray-100 pb-3 group">
                               <span className="text-gray-400 font-bold w-12 text-sm uppercase">Ass.:</span>
                               <input 
                                 className="flex-1 outline-none text-lg font-black text-gray-900 placeholder:text-gray-200"
                                 placeholder="Título do seu e-mail"
                                 value={emailSubject}
                                 onChange={(e) => setEmailSubject(e.target.value)}
                               />
                            </div>
                            <textarea 
                              className="w-full h-56 resize-none outline-none text-[17px] leading-relaxed text-gray-700 placeholder:text-gray-200 font-medium mt-4 custom-scrollbar"
                              placeholder="Escreva sua mensagem aqui de forma clara..."
                              value={emailBody}
                              onChange={(e) => setEmailBody(e.target.value)}
                            />
                         </div>
                         <div className="p-8 border-t bg-gray-50/50 flex items-center justify-between">
                            <button 
                              onClick={() => {
                                if (!emailTo || !emailSubject) return;
                                const newEmail: Email = {
                                  id: Math.random().toString(),
                                  sender: 'Você (Enviado)',
                                  subject: emailSubject,
                                  body: emailBody,
                                  date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                  folder: 'sent'
                                };
                                setEmails([...emails, newEmail]);
                                setIsComposingEmail(false);
                                setEmailTo('');
                                setEmailSubject('');
                                setEmailBody('');
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-tighter"
                            >
                               Enviar Agora <ArrowRight size={20} />
                            </button>
                            <div className="flex gap-6 items-center">
                               <button 
                                 onClick={() => setIsComposingEmail(false)}
                                 className="text-gray-300 hover:text-red-500 transition-colors"
                                 title="Descartar rascunho"
                               >
                                 <Trash2 size={24} />
                               </button>
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {win.type === 'explorer' && (
              <div className="flex flex-col h-full">
                <div className="p-2 bg-gray-50 border-b flex gap-4 text-xs text-gray-600 px-6 items-center">
                  <button 
                    onClick={() => {
                      const currentFolder = items.find(i => i.id === win.folderId);
                      setWindows(windows.map(w => w.id === win.id ? { ...w, folderId: currentFolder?.parentId || null, title: currentFolder?.parentId ? items.find(i => i.id === currentFolder.parentId)?.name || 'Este Computador' : 'Este Computador' } : w));
                    }}
                    className="p-1 hover:bg-gray-200 rounded flex items-center gap-1 disabled:opacity-30"
                    disabled={win.folderId === null}
                  >
                    <ArrowLeft size={14} /> Voltar
                  </button>
                  <div className="h-4 w-[1px] bg-gray-300"></div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => createItem('folder', win.folderId || null)} className="flex items-center gap-1 cursor-pointer hover:text-blue-600"><Plus size={14} /> Nova Pasta</button>
                    <button onClick={() => createItem('word', win.folderId || null)} className="flex items-center gap-1 cursor-pointer hover:text-blue-600"><FileText size={14} /> Documento Word</button>
                    <button onClick={() => createItem('excel', win.folderId || null)} className="flex items-center gap-1 cursor-pointer hover:text-blue-600"><Table size={14} /> Planilha Excel</button>
                  </div>
                  <div className="flex-1"></div>
                  <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600"><LayoutGrid size={14} /> Visualizar</div>
                </div>
                <div 
                  className="flex-1 p-8 grid grid-cols-6 gap-8 content-start"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    setContextMenu({ 
                      visible: true, 
                      x: e.clientX, 
                      y: e.clientY, 
                      targetId: null, 
                      type: 'folder', 
                      folderId: win.folderId || null 
                    });
                  }}
                >
                  {items.filter(i => i.parentId === win.folderId).map(item => (
                    <div 
                      key={item.id} 
                      onDoubleClick={() => handleItemClick(item)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setContextMenu({ visible: true, x: e.clientX, y: e.clientY, targetId: item.id, type: 'item' });
                      }}
                      className={`flex flex-col items-center gap-2 group cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors ${contextMenu?.targetId === item.id ? 'bg-blue-100' : ''}`}
                    >
                      {renderIcon(item.type, 48, item)}
                      <span className="text-xs text-center text-gray-700 break-words w-full">{item.name}</span>
                    </div>
                  ))}
                  {items.filter(i => i.parentId === win.folderId).length === 0 && (
                    <div className="col-span-6 py-20 flex flex-col items-center opacity-20 italic">
                      <MonitorIcon size={64} />
                      <p>Esta pasta está vazia.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {win.type === 'trash' && (
              <div className="flex flex-col h-full">
                <div className="p-3 bg-red-50 border-b flex justify-between items-center px-6">
                  <span className="text-xs text-red-800 font-bold">Arquivos Excluídos</span>
                  <button 
                    onClick={() => setDeletedItems([])}
                    className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Esvaziar Lixeira
                  </button>
                </div>
                <div className="flex-1 p-8 grid grid-cols-6 gap-8 content-start">
                  {deletedItems.map(item => (
                    <div key={item.id} className="flex flex-col items-center gap-2 group relative">
                      {renderIcon(item.type, 48)}
                      <span className="text-xs text-center text-gray-700">{item.name}</span>
                      <button 
                        onClick={() => restoreItem(item.id)}
                        className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-lg hover:scale-110 transition-transform"
                        title="Restaurar"
                      >
                        <RotateCcw size={12} />
                      </button>
                    </div>
                  ))}
                  {deletedItems.length === 0 && (
                    <div className="col-span-6 py-20 flex flex-col items-center opacity-20 italic">
                      <Trash2 size={64} />
                      <p>A lixeira está vazia.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {win.type === 'settings' && (
              <div className="flex h-full">
                <div className="w-56 bg-gray-50 border-r p-6 flex flex-col gap-2">
                  <button 
                    onClick={() => setSettingsTab('personalization')}
                    className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-all ${settingsTab === 'personalization' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    <WallpaperIcon size={18} /> Personalização
                  </button>
                  <button 
                    onClick={() => setSettingsTab('accessibility')}
                    className={`w-full text-left px-4 py-3 rounded-xl font-bold flex items-center gap-3 transition-all ${settingsTab === 'accessibility' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    <MonitorIcon size={18} /> Acessibilidade
                  </button>
                  <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest px-4 mb-2">Sistema</div>
                    <div className="text-gray-600 px-4 py-2 flex items-center gap-3 text-sm opacity-50"><User size={16} /> Contas</div>
                  </div>
                </div>
                <div className="flex-1 p-8 overflow-y-auto">
                  {settingsTab === 'personalization' ? (
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <h2 className="text-3xl font-black mb-8 flex items-center gap-3 text-gray-900">
                        <WallpaperIcon size={32} className="text-blue-600" /> Fundo de Tela
                      </h2>
                      <div className="grid grid-cols-2 gap-6">
                        {WALLPAPERS.map((wp, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              setWallpaper(wp);
                              if (currentLesson?.goal === 'change_wallpaper') {
                                const points = 100;
                                setLastPoints(points);
                                setTotalScore(prev => prev + points);
                                setLessonSuccess(true);
                              }
                            }}
                            className={`aspect-video rounded-[2rem] border-8 cursor-pointer overflow-hidden transition-all shadow-lg ${wallpaper === wp ? 'border-blue-500 scale-105 shadow-blue-200' : 'border-white hover:border-gray-200'}`}
                          >
                            {wp.startsWith('#') ? (
                              <div className="w-full h-full" style={{ backgroundColor: wp }} />
                            ) : (
                              <img src={wp} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  ) : (
                    <section className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <h2 className="text-3xl font-black mb-8 flex items-center gap-3 text-gray-900">
                        <Type size={32} className="text-blue-600" /> Acessibilidade (Visão)
                      </h2>
                      
                      <div className="mb-12 p-8 bg-white rounded-[2.5rem] border-4 border-gray-100 shadow-sm">
                        <p className="text-xl font-black mb-6 text-gray-800">Tamanho da Letra:</p>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { label: 'Normal', val: 1, desc: 'Padrão do sistema' },
                            { label: 'Grande', val: 1.25, desc: 'Melhor leitura' },
                            { label: 'Muito Grande', val: 1.5, desc: 'Máxima visibilidade' }
                          ].map(sizeOpt => (
                            <button 
                              key={sizeOpt.val}
                              onClick={() => setFontSize(sizeOpt.val)}
                              className={`p-6 rounded-3xl flex flex-col items-center gap-2 transition-all border-4 ${fontSize === sizeOpt.val ? 'bg-blue-600 text-white border-blue-400 shadow-xl scale-105' : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100'}`}
                            >
                              <span className="text-2xl font-black">{sizeOpt.label}</span>
                              <span className={`text-xs font-bold ${fontSize === sizeOpt.val ? 'text-blue-200' : 'text-gray-400'}`}>{sizeOpt.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-8 bg-white rounded-[2.5rem] border-4 border-gray-100 shadow-sm mb-8">
                        <div>
                          <p className="text-xl font-black text-gray-800 mb-1">Modo de Alto Contraste</p>
                          <p className="text-gray-500 font-medium">Cores mais fortes e bordas definidas para facilitar a visão.</p>
                        </div>
                        <button 
                          onClick={() => setIsHighContrast(!isHighContrast)}
                          className={`w-24 h-12 rounded-full transition-all relative p-1 ${isHighContrast ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                          <div className={`w-10 h-10 bg-white rounded-full shadow-lg transition-all ${isHighContrast ? 'translate-x-12' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      <div className="p-8 bg-yellow-50 rounded-[2.5rem] border-4 border-yellow-200 border-dashed">
                        <p className="text-yellow-800 font-bold flex items-center gap-2 mb-2">
                          <AlertTriangle size={20} /> Dica de Acessibilidade
                        </p>
                        <p className="text-yellow-700 text-sm leading-relaxed">
                          Se você tiver dificuldade para ler os textos ou ícones, use o tamanho <strong>Muito Grande</strong>. 
                          O modo de <strong>Alto Contraste</strong> ajuda a distinguir melhor onde termina uma janela e começa outra.
                        </p>
                      </div>
                    </section>
                  )}

                  <div className="mt-12 pt-8 border-t border-gray-100">
                    <button 
                      onClick={resetToDefault}
                      className="flex items-center gap-3 text-red-600 font-black hover:bg-red-50 px-8 py-4 rounded-2xl border-2 border-red-100 transition-all active:scale-95"
                    >
                      <RotateCcw size={20} /> Restaurar Padrões do Sistema
                    </button>
                  </div>
                </div>
              </div>
            )}

            {win.type === 'virus_warning' && (
              <div className="flex-1 bg-red-600 text-white p-12 flex flex-col items-center justify-center text-center">
                <ShieldAlert size={120} className="mb-8 animate-bounce" />
                <h2 className="text-4xl font-black mb-4 uppercase italic">Vírus Detectado!</h2>
                <p className="text-xl max-w-md mb-8">
                  Você clicou em um arquivo infectado. O sistema foi bloqueado para sua segurança.
                </p>
                <div className="bg-white text-red-600 p-6 rounded-2xl shadow-2xl max-w-md">
                  <p className="font-bold mb-2">O que aconteceu?</p>
                  <p className="text-sm leading-relaxed">
                    Arquivos com final <strong>.exe</strong> vindos de fontes desconhecidas podem danificar seu computador. 
                    Nunca abra anexos de e-mails suspeitos como "Boleto Urgente" ou "Prêmio".
                  </p>
                </div>
                <button 
                  onClick={() => { setIsVirusActive(false); closeWindow(win.id); }}
                  className="mt-12 bg-white text-red-600 px-12 py-4 rounded-full font-black text-xl hover:bg-gray-100 shadow-xl"
                >
                  REMOVER VÍRUS E VOLTAR
                </button>
              </div>
            )}

            {win.type === 'photo_viewer' && (
              <div className="flex flex-col h-full bg-gray-900 p-4 items-center justify-center overflow-auto relative">
                {(() => {
                  const item = items.find(i => i.id === win.folderId);
                  if (item?.url) {
                    return <img src={item.url} alt={win.title} className="max-h-full drop-shadow-2xl object-cover rounded-xl" />;
                  } else {
                    return (
                      <div className="flex flex-col items-center">
                        <ImageIcon size={100} className="text-gray-700 mb-4" />
                        <span className="text-gray-500 text-lg">Visualizando: {win.title}</span>
                      </div>
                    );
                  }
                })()}
              </div>
            )}

            {win.type === 'windows_explorer' && (
              <WindowsExplorerMock onOpenFile={handleItemClick} />
            )}

            {win.type === 'word_simulator' && (
              <WordSimulator fileName={win.title} />
            )}

            {win.type === 'excel_simulator' && (
              <ExcelSimulator fileName={win.title} />
            )}

            {win.type === 'mouse_simulator' && (
              <MouseSimulator onClose={() => closeWindow(win.id)} />
            )}
          </div>
        </motion.div>
      ))}

      {/* Taskbar */}
      <div className="h-12 bg-black/80 backdrop-blur-md border-t border-white/10 flex items-center px-2 gap-1 z-[999]">
        <div 
          onClick={(e) => { e.stopPropagation(); setShowStartMenu(!showStartMenu); }}
          className={`w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded transition-colors cursor-pointer ${showStartMenu ? 'text-blue-400 bg-white/10' : 'text-white'}`}
        >
          <MonitorIcon size={24} />
        </div>
        <div className="h-8 w-[1px] bg-white/20 mx-1"></div>
        
        {/* Score Display */}
        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/5 mr-2">
          <Trophy size={14} className="text-yellow-400" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">{totalScore}</span>
        </div>

        {/* Open Apps in Taskbar */}
        {windows.map(win => (
          <div 
            key={win.id}
            onClick={() => focusWindow(win.id)}
            className={`h-10 px-4 flex items-center gap-2 transition-all cursor-pointer rounded-t ${activeWindowId === win.id ? 'bg-white/20 border-b-2 border-blue-500 text-white' : 'text-white/60 hover:bg-white/10'}`}
          >
            {win.type === 'chrome' && <Chrome size={16} className="text-blue-400" />}
            {win.type === 'gmail' && <Mail size={16} className="text-red-400" />}
            {win.type === 'explorer' && <Folder size={16} className="text-yellow-400" />}
            {win.type === 'windows_explorer' && <Folder size={16} className="text-yellow-400" />}
            {win.type === 'trash' && <Trash2 size={16} className="text-gray-400" />}
            {win.type === 'photo_viewer' && <ImageIcon size={16} className="text-blue-500" />}
            <span className="text-xs font-medium max-w-[100px] truncate">{win.title}</span>
          </div>
        ))}

        <div className="flex-1"></div>
        
        {/* Exit Simulator Button */}
        <button 
          onClick={abortSimulator}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs transition-all shadow-lg active:scale-95 mr-2"
          title="Encerrar Simulador (Esc)"
        >
          <LogOut size={14} />
          SAIR DO SIMULADOR
        </button>

        <div className="px-4 text-white text-xs font-medium">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Start Menu */}
      <AnimatePresence>
        {showStartMenu && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-12 left-0 w-[450px] h-[550px] bg-[#1F1F1F]/95 backdrop-blur-xl border-t border-r border-white/10 z-[998] flex shadow-2xl overflow-hidden rounded-tr-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 flex flex-col items-center py-6 gap-8 text-white/40 border-r border-white/5">
              <User size={24} className="hover:text-white cursor-pointer" />
              <div className="flex-1"></div>
              <Settings size={24} className="hover:text-white cursor-pointer" onClick={() => { openWindow('settings', 'Configurações'); setShowStartMenu(false); }} />
              <div className="relative">
                {showPowerOptions && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute bottom-0 left-12 bg-[#2B2B2B] border border-white/10 rounded-lg shadow-2xl py-2 min-w-[150px] z-[1000]"
                  >
                    <div 
                      onClick={restartSystem}
                      className="px-4 py-2 hover:bg-white/10 cursor-pointer flex items-center gap-3 text-sm"
                    >
                      <RotateCcw size={14} className="text-blue-400" /> Reiniciar
                    </div>
                    <div 
                      onClick={() => { setShowPowerOptions(false); resetToDefault(); }}
                      className="px-4 py-2 hover:bg-white/10 cursor-pointer flex items-center gap-3 text-sm"
                    >
                      <Power size={14} className="text-red-400" /> Desligar
                    </div>
                  </motion.div>
                )}
                <Power 
                  size={24} 
                  className={`hover:text-red-500 cursor-pointer transition-colors ${showPowerOptions ? 'text-red-500' : ''}`} 
                  onClick={() => setShowPowerOptions(!showPowerOptions)} 
                />
              </div>
            </div>
            <div className="flex-1 p-8 text-white flex flex-col">
              <div className="relative mb-8">
                <input className="w-full bg-white/10 border border-white/10 rounded-full py-2 px-10 text-sm outline-none focus:bg-white/20" placeholder="Pesquisar aplicativos..." />
                <Search className="absolute left-3 top-2.5 text-white/40" size={16} />
              </div>
              <h3 className="text-[10px] font-black mb-6 text-white/30 uppercase tracking-[0.2em]">Aplicativos Recomendados</h3>
              <div className="grid grid-cols-3 gap-6">
                <div onClick={() => { openWindow('chrome', 'Google Chrome'); setShowStartMenu(false); }} className="flex flex-col items-center gap-3 p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-all hover:scale-105">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg"><Chrome size={32} className="text-blue-500" /></div>
                  <span className="text-xs font-medium text-center">Google<br/>Chrome</span>
                </div>
                <div onClick={() => { openWindow('gmail', 'Gmail'); setShowStartMenu(false); }} className="flex flex-col items-center gap-3 p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-all hover:scale-105">
                  <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg"><Mail size={32} /></div>
                  <span className="text-xs font-medium">Gmail</span>
                </div>
                <div onClick={() => { openWindow('explorer', 'Este Computador'); setShowStartMenu(false); }} className="flex flex-col items-center gap-3 p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-all hover:scale-105">
                  <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg"><Folder size={32} /></div>
                  <span className="text-xs font-medium">Arquivos</span>
                </div>
                <div onClick={() => { openWindow('mouse_simulator', 'Treinamento de Mouse'); setShowStartMenu(false); }} className="flex flex-col items-center gap-3 p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-all hover:scale-105">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg"><Mouse size={32} /></div>
                  <span className="text-xs font-medium text-center">Treino de<br/>Mouse</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lesson Success Modal */}
      {lessonSuccess && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <div className="bg-white rounded-[2rem] p-10 max-w-md w-full text-center shadow-2xl border-8 border-green-500">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={64} />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Muito bem!</h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed font-medium">
              Você concluiu esta lição com sucesso! <br/>
              <strong>Parabéns!</strong> Você está ficando cada vez melhor no computador.
            </p>
            <button 
              onClick={() => {
                setLessonSuccess(false);
                setCurrentLesson(null);
              }}
              className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-2xl hover:bg-green-700 transition-all shadow-lg active:scale-95"
            >
              Continuar Aprendendo
            </button>
          </div>
        </motion.div>
      )}

      {/* Lesson Menu Overlay */}
      <AnimatePresence>
        {showLessonMenu && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[2000] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              className="bg-white w-full max-w-5xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row h-[700px] border border-white/20"
            >
              {/* Sidebar */}
              <div className="md:w-80 bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-white flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                
                <div className="relative z-10 flex-1">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center mb-10 shadow-xl">
                    <MonitorIcon size={40} />
                  </div>
                  <h2 className="text-5xl font-black mb-6 leading-[0.9] tracking-tighter">Informática Sem Segredo</h2>
                  <p className="text-blue-100 text-xl font-medium leading-relaxed opacity-80">
                    Aprenda a usar o computador com calma e segurança. Escolha um desafio ao lado.
                  </p>
                </div>
                
                <div className="relative z-10">
                  <button 
                    onClick={() => setShowLessonMenu(false)} 
                    className="group flex items-center gap-4 bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-6 py-4 rounded-2xl transition-all font-black text-sm shadow-xl active:scale-95 border-b-4 border-yellow-600 active:border-b-0"
                  >
                    PULAR PARA O DESKTOP 
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-12 overflow-y-auto bg-gray-50/50">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em]">Lições Disponíveis</h3>
                  <div className="px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase">7 Desafios</div>
                </div>

                <div className="grid gap-4">
                  {LESSONS.map((lesson) => (
                    <motion.div 
                      key={lesson.id}
                      whileHover={{ x: 10 }}
                      onClick={() => { setCurrentLesson(lesson); setShowLessonMenu(false); }}
                      className="group bg-white p-8 rounded-[2rem] border-2 border-transparent hover:border-blue-500 cursor-pointer shadow-sm hover:shadow-2xl transition-all flex items-center gap-8"
                    >
                      <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center text-white font-black text-3xl shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3 ${
                        lesson.level === 'Fácil' ? 'bg-green-500 shadow-green-100' : lesson.level === 'Médio' ? 'bg-yellow-500 shadow-yellow-100' : 'bg-red-500 shadow-red-100'
                      }`}>
                        {lesson.id}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                            lesson.level === 'Fácil' ? 'bg-green-100 text-green-700' : lesson.level === 'Médio' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>{lesson.level}</span>
                          <h4 className="text-2xl font-black text-gray-900 tracking-tight">{lesson.title}</h4>
                        </div>
                        <p className="text-gray-500 text-lg font-medium leading-snug">{lesson.description.substring(0, 80)}...</p>
                      </div>
                      
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ChevronRight size={24} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu?.visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`fixed bg-white border border-gray-300 shadow-2xl rounded-sm py-1 min-w-[200px] z-[3000] text-xs text-gray-800 font-sans flex flex-col`}
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Context: Item (Right click on file/shortcut) */}
            {contextMenu.type === 'item' && (
              <>
                <div onClick={() => { 
                    const item = items.find(i => i.id === contextMenu.targetId);
                    if (item) handleItemClick(item);
                    setContextMenu(null);
                  }} className="px-3 py-1.5 hover:bg-blue-600 hover:text-white cursor-pointer flex items-center justify-between group">
                  <span className="font-bold">Abrir</span>
                  <ExternalLink size={12} className="opacity-40 group-hover:opacity-100" />
                </div>
                <div className="border-t border-gray-100 my-1"></div>
                <div onClick={() => {
                    const item = items.find(i => i.id === contextMenu.targetId);
                    if (item) copyItem(item);
                  }} className="px-3 py-1.5 hover:bg-blue-600 hover:text-white cursor-pointer flex items-center gap-3">
                  <Copy size={12} /> Copiar
                </div>
                <div onClick={() => {
                  if (contextMenu.targetId) deleteItem(contextMenu.targetId);
                }} className="px-3 py-1.5 hover:bg-blue-600 hover:text-white cursor-pointer flex items-center gap-3 text-red-600 group">
                  <Trash size={12} className="group-hover:text-white" /> Excluir
                </div>
                <div className="border-t border-gray-100 my-1"></div>
                <div onClick={() => {
                    if (contextMenu.targetId) setEditingId(contextMenu.targetId);
                    setContextMenu(null);
                  }} className="px-3 py-1.5 hover:bg-blue-600 hover:text-white cursor-pointer flex items-center gap-3">
                  <Edit2 size={12} /> Renomear
                </div>
              </>
            )}

            {/* Context: Desktop background */}
            {contextMenu.type === 'desktop' && (
              <>
                <div className="px-3 py-1.5 text-[9px] text-gray-400 font-black uppercase tracking-widest bg-gray-50/50">Área de Trabalho</div>
                <div onClick={() => arrangeIcons('grid')} className="px-3 py-1.5 hover:bg-blue-600 hover:text-white cursor-pointer flex items-center gap-3">
                  <LayoutGrid size={12} /> Exibir em Grade
                </div>
                <div className="border-t border-gray-100 my-1"></div>
                <div onClick={() => {
                  const x = contextMenu.x - (desktopRef.current?.getBoundingClientRect().left || 0) - 48;
                  const y = contextMenu.y - (desktopRef.current?.getBoundingClientRect().top || 0) - 48;
                  pasteItem(null, x, y);
                }} className={`px-3 py-1.5 hover:bg-blue-600 hover:text-white cursor-pointer flex items-center gap-3 ${!clipboardItem ? 'opacity-30 pointer-events-none' : ''}`}>
                  <Clipboard size={12} /> Colar
                </div>
                <div className="border-t border-gray-100 my-1"></div>
                <div onClick={() => createItem('folder')} className="px-3 py-1.5 hover:bg-blue-600 hover:text-white cursor-pointer flex items-center gap-3">
                  <Folder size={12} className="text-yellow-500" /> Nova Pasta
                </div>
                <div className="border-t border-gray-100 my-1"></div>
                <div onClick={() => { openWindow('settings', 'Configurações'); setContextMenu(null); }} className="px-3 py-1.5 hover:bg-blue-600 hover:text-white cursor-pointer flex items-center gap-3 font-semibold">
                  <WallpaperIcon size={12} className="text-blue-500" /> Personalizar
                </div>
              </>
            )}

            {/* Context: Inside a folder background */}
            {contextMenu.type === 'folder' && (
              <>
                <div className="px-3 py-1.5 text-[9px] text-gray-400 font-black uppercase tracking-widest bg-gray-50/50">Pasta</div>
                <div onClick={() => {
                  const x = 20; 
                  const y = items.filter(i => i.parentId === contextMenu.folderId).length * 100;
                  pasteItem(contextMenu.folderId || null, x, y % 400);
                }} className={`px-3 py-1.5 hover:bg-blue-600 hover:text-white cursor-pointer flex items-center gap-3 ${!clipboardItem ? 'opacity-30 pointer-events-none' : ''}`}>
                  <Clipboard size={12} /> Colar
                </div>
                <div className="border-t border-gray-100 my-1"></div>
                <div onClick={() => createItem('folder', contextMenu.folderId || null)} className="px-3 py-1.5 hover:bg-blue-600 hover:text-white cursor-pointer flex items-center gap-3">
                  <Folder size={12} className="text-yellow-500" /> Nova Pasta
                </div>
                <div onClick={() => createItem('word', contextMenu.folderId || null)} className="px-3 py-1.5 hover:bg-blue-600 hover:text-white cursor-pointer flex items-center gap-3">
                  <FileText size={12} className="text-blue-500" /> Documento Word
                </div>
                <div onClick={() => createItem('excel', contextMenu.folderId || null)} className="px-3 py-1.5 hover:bg-blue-600 hover:text-white cursor-pointer flex items-center gap-3">
                  <Table size={12} className="text-green-600" /> Planilha Excel
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lesson Success Modal */}
      <AnimatePresence>
        {lessonSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-blue-900/40 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              className="bg-white rounded-[3rem] p-12 max-w-lg w-full text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-8 border-green-500 relative overflow-hidden"
            >
              {/* Confetti-like background elements */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-blue-400" />
              
              <div className="w-32 h-32 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner animate-bounce">
                <CheckCircle2 size={80} />
              </div>
              
              <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">Incrível!</h2>
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-yellow-100 text-yellow-700 rounded-full font-black text-sm mb-6 shadow-sm border border-yellow-200">
                <Trophy size={16} />
                +{lastPoints} PONTOS
              </div>
              <p className="text-2xl text-gray-600 mb-10 leading-relaxed font-medium">
                Você completou o desafio <span className="text-blue-600 font-black">"{currentLesson?.title}"</span> com perfeição.
                <br/>
                <span className="text-green-600 font-black">Parabéns!</span> Você está dominando o computador.
              </p>
              
              <button 
                onClick={() => {
                  setLessonSuccess(false);
                  setCurrentLesson(null);
                  setShowLessonMenu(true);
                }}
                className="w-full bg-green-600 text-white py-6 rounded-2xl font-black text-2xl hover:bg-green-700 transition-all shadow-xl active:scale-95 hover:shadow-green-200"
              >
                Próximo Desafio
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lesson Instruction Card */}
      <AnimatePresence>
        {currentLesson && (
          <motion.div 
            initial={{ y: -100, x: '-50%', opacity: 0 }}
            animate={{ y: 0, x: '-50%', opacity: 1 }}
            exit={{ y: -100, x: '-50%', opacity: 0 }}
            className="fixed top-6 left-1/2 bg-white/95 backdrop-blur-md border-4 border-blue-500 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-[1500] w-[90vw] max-w-4xl overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* Left: Status/ID */}
              <div className="bg-blue-600 p-6 flex flex-col items-center justify-center text-white md:w-40 shrink-0">
                <div className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Lição</div>
                <div className="text-5xl font-black">{currentLesson.id}</div>
              </div>
              
              {/* Middle: Content */}
              <div className="flex-1 p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Objetivo: {currentLesson.title}</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 leading-tight">
                  {currentLesson.description}
                </p>
              </div>

              {/* Right: Actions */}
              <div className="p-6 bg-gray-50 border-l border-gray-100 flex flex-col justify-center gap-3 md:w-48">
                <button 
                  onClick={() => setShowLessonMenu(true)}
                  className="w-full bg-white border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-500 font-black py-3 rounded-2xl transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 text-sm"
                >
                  <RotateCcw size={16} />
                  Trocar
                </button>
                <button 
                  onClick={() => setCurrentLesson(null)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-600 font-black py-3 rounded-2xl transition-all active:scale-95 text-sm"
                >
                  Ocultar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Overlay Screens (Restart & Login) --- */}
      <AnimatePresence>
        {systemStatus === 'restarting' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-[#0078D7] flex flex-col items-center justify-center text-white"
          >
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-6" />
            <h2 className="text-3xl font-light mb-8">Reiniciando</h2>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-sm text-center"
            >
               <p className="text-lg font-medium leading-relaxed">
                 Fique tranquilo! Esta é apenas uma <span className="text-yellow-300 font-bold italic">Simulação de Aula</span>. 
                 Seu computador verdadeiro NÃO será reiniciado.
               </p>
            </motion.div>
          </motion.div>
        )}

        {systemStatus === 'starting' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center text-white"
          >
             {/* Windows Logo Simulation */}
             <div className="w-24 h-24 grid grid-cols-2 gap-1 mb-8">
                <div className="bg-[#F25022]"></div>
                <div className="bg-[#7FBA00]"></div>
                <div className="bg-[#00A4EF]"></div>
                <div className="bg-[#FFB900]"></div>
             </div>
             <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </motion.div>
        )}

        {systemStatus === 'login' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center h-screen w-screen"
            style={{ 
              backgroundImage: `url(${WALLPAPERS[0]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
            
            <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
                <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/30 shadow-2xl overflow-hidden">
                   <User size={64} className="text-white opacity-80" />
                </div>
                
                <h1 className="text-white text-3xl font-light mb-8 drop-shadow-lg">Bem-vindo</h1>
                
                <div className="w-full space-y-4">
                   <div className="relative group">
                     <input 
                       autoFocus
                       className="w-full bg-black/20 border border-white/30 rounded-md py-2 px-4 text-white text-lg placeholder:text-white/40 outline-none focus:bg-black/30 transition-all border-b-2 focus:border-b-blue-400"
                       placeholder="Nome de usuário"
                       onKeyDown={(e) => {
                         if (e.key === 'Enter') setSystemStatus('desktop');
                       }}
                       onChange={(e) => setUserName(e.target.value)}
                     />
                     <div className="absolute right-3 top-2.5 text-white/50 group-hover:text-white cursor-pointer" onClick={() => setSystemStatus('desktop')}>
                        <ArrowRight size={20} />
                     </div>
                   </div>
                   
                   <p className="text-white/60 text-xs text-center font-medium">Digite qualquer nome para entrar.</p>
                </div>
                
                <div className="mt-16 text-white/40 text-sm font-medium">Informática Sem Segredo</div>
            </div>

            <div className="absolute bottom-8 right-8 flex gap-6 text-white/80">
               <RotateCcw size={24} className="hover:text-white cursor-pointer" onClick={restartSystem} />
               <Power size={24} className="hover:text-white cursor-pointer" onClick={resetToDefault} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
