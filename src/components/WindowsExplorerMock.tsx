import React, { useState } from 'react';
import { Folder, ChevronRight, ChevronDown, Monitor, HardDrive, File as FileIcon, Search, ArrowLeft, ArrowRight, ArrowUp, RefreshCw, Usb, FileText, Table } from 'lucide-react';
import WindowsDialog from './WindowsDialog';

interface FileItem {
  id: string;
  name: string;
  date: string;
  type: string;
  drive: 'C:' | 'D:';
  isFolder: boolean;
  size?: string;
  parentId?: string | null;
}

const INITIAL_ITEMS: FileItem[] = [
  { id: '1', name: 'Arquivos de Programas', date: '26/02/2026 18:31', type: 'Pasta de arquivos', drive: 'C:', isFolder: true, parentId: null },
  { id: '2', name: 'Arquivos de Programas (x86)', date: '13/02/2026 21:30', type: 'Pasta de arquivos', drive: 'C:', isFolder: true, parentId: null },
  { id: '3', name: 'Backup', date: '17/02/2026 12:44', type: 'Pasta de arquivos', drive: 'C:', isFolder: true, parentId: null },
  { id: '4', name: 'Cursos', date: '28/01/2026 21:02', type: 'Pasta de arquivos', drive: 'C:', isFolder: true, parentId: null },
  { id: '5', name: 'Ebooks', date: '11/06/2022 12:12', type: 'Pasta de arquivos', drive: 'C:', isFolder: true, parentId: null },
  { id: '6', name: 'Fotos', date: '18/01/2025 14:48', type: 'Pasta de arquivos', drive: 'C:', isFolder: true, parentId: null },
  { id: '7', name: 'inetpub', date: '08/04/2025 20:02', type: 'Pasta de arquivos', drive: 'C:', isFolder: true, parentId: null },
  { id: '8', name: 'MAJESTIC', date: '17/01/2023 22:59', type: 'Pasta de arquivos', drive: 'C:', isFolder: true, parentId: null },
  { id: '9', name: 'tmp', date: '27/02/2026 20:11', type: 'Pasta de arquivos', drive: 'C:', isFolder: true, parentId: null },
  { id: '10', name: 'Usuários', date: '28/10/2024 14:44', type: 'Pasta de arquivos', drive: 'C:', isFolder: true, parentId: null },
  { id: '11', name: 'Windows', date: '27/02/2026 19:25', type: 'Pasta de arquivos', drive: 'C:', isFolder: true, parentId: null },
  { id: '12', name: 'logUploaderSettings', date: '04/08/2025 20:12', type: 'Parâmetros de config...', drive: 'C:', isFolder: false, size: '1 KB', parentId: null },
  { id: '13', name: 'Relatório Financeiro', date: '10/01/2026 10:20', type: 'Documento Excel', drive: 'D:', isFolder: false, size: '24 KB', parentId: null },
  { id: '14', name: 'Fotos Viagem', date: '20/12/2025 15:30', type: 'Pasta de arquivos', drive: 'D:', isFolder: true, parentId: null },
  { id: '15', name: 'Currículo.doc', date: '01/03/2026 09:15', type: 'Documento Word', drive: 'C:', isFolder: false, size: '45 KB', parentId: null },
  { id: '16', name: 'Orçamento 2026.xls', date: '25/02/2026 14:40', type: 'Planilha Excel', drive: 'C:', isFolder: false, size: '32 KB', parentId: null },
];

interface WindowsExplorerMockProps {
  onOpenFile?: (item: any) => void;
}

export default function WindowsExplorerMock({ onOpenFile }: WindowsExplorerMockProps) {
  const [activeDrive, setActiveDrive] = useState<'C:' | 'D:'>('C:');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [items, setItems] = useState<FileItem[]>(INITIAL_ITEMS);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: FileItem | null } | null>(null);
  const [clipboard, setClipboard] = useState<{ item: FileItem; action: 'copy' | 'move' } | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    type: 'confirm' | 'error' | 'info';
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    type: 'info',
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const currentItems = items.filter(i => i.drive === activeDrive && (i.parentId || null) === currentFolderId);

  const getBreadcrumbs = () => {
    const crumbs = [];
    let curr = items.find(i => i.id === currentFolderId);
    while (curr) {
      crumbs.unshift(curr);
      curr = items.find(i => i.id === curr!.parentId);
    }
    return crumbs;
  };

  const handleUpDir = () => {
    if (currentFolderId) {
      const curr = items.find(i => i.id === currentFolderId);
      if (curr) {
        setCurrentFolderId(curr.parentId || null);
      }
    }
  };

  const navigateToDrive = (drive: 'C:' | 'D:') => {
    setActiveDrive(drive);
    setCurrentFolderId(null);
  };

  const handleDoubleClick = (item: FileItem) => {
    if (item.isFolder) {
      setCurrentFolderId(item.id);
    } else if (onOpenFile) {
      let mappedType = 'txt';
      if (item.type.includes('Excel') || item.name.endsWith('.xls') || item.name.endsWith('.xlsx')) mappedType = 'excel';
      if (item.type.includes('Word') || item.name.endsWith('.doc') || item.name.endsWith('.docx')) mappedType = 'word';
      onOpenFile({ ...item, type: mappedType });
    }
  };

  const handleContextMenu = (e: React.MouseEvent, item: FileItem | null) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const closeDialog = () => setIsDialogOpen(false);

  const handleDelete = (item: FileItem) => {
    setDialogConfig({
      type: 'confirm',
      title: 'Excluir Item',
      message: `Deseja realmente excluir "${item.name}"?`,
      onConfirm: () => {
        setItems(items.filter(i => i.id !== item.id));
        closeDialog();
      }
    });
    setIsDialogOpen(true);
    closeContextMenu();
  };

  const handleNewFolder = () => {
    let name = 'Nova Pasta';
    let counter = 2;
    while (items.some(i => i.name === name && i.drive === activeDrive && i.parentId === currentFolderId)) {
      name = `Nova Pasta (${counter})`;
      counter++;
    }

    const newItem: FileItem = {
      id: Math.random().toString(),
      name: name,
      date: new Date().toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      type: 'Pasta de arquivos',
      drive: activeDrive,
      isFolder: true,
      parentId: currentFolderId
    };
    setItems([...items, newItem]);
    setRenamingId(newItem.id);
    closeContextMenu();
  };

  const handleNewTextFile = () => {
    let name = 'Novo Documento de Texto';
    let counter = 2;
    while (items.some(i => i.name === name + '.txt' && i.drive === activeDrive && i.parentId === currentFolderId)) {
      name = `Novo Documento de Texto (${counter})`;
      counter++;
    }

    const newItem: FileItem = {
      id: Math.random().toString(),
      name: name + '.txt',
      date: new Date().toLocaleString('pt-BR'),
      type: 'Documento de Texto',
      drive: activeDrive,
      isFolder: false,
      size: '0 KB',
      parentId: currentFolderId
    };
    setItems([...items, newItem]);
    setRenamingId(newItem.id);
    closeContextMenu();
  };

  const handleNewWordFile = () => {
    let name = 'Novo Documento';
    let counter = 2;
    while (items.some(i => i.name === name + '.docx' && i.drive === activeDrive && i.parentId === currentFolderId)) {
      name = `Novo Documento (${counter})`;
      counter++;
    }

    const newItem: FileItem = {
      id: Math.random().toString(),
      name: name + '.docx',
      date: new Date().toLocaleString('pt-BR'),
      type: 'Documento Word',
      drive: activeDrive,
      isFolder: false,
      size: '0 KB',
      parentId: currentFolderId
    };
    setItems([...items, newItem]);
    setRenamingId(newItem.id);
    closeContextMenu();
  };

  const handleNewExcelFile = () => {
    let name = 'Nova Planilha';
    let counter = 2;
    while (items.some(i => i.name === name + '.xlsx' && i.drive === activeDrive && i.parentId === currentFolderId)) {
      name = `Nova Planilha (${counter})`;
      counter++;
    }

    const newItem: FileItem = {
      id: Math.random().toString(),
      name: name + '.xlsx',
      date: new Date().toLocaleString('pt-BR'),
      type: 'Planilha Excel',
      drive: activeDrive,
      isFolder: false,
      size: '0 KB',
      parentId: currentFolderId
    };
    setItems([...items, newItem]);
    setRenamingId(newItem.id);
    closeContextMenu();
  };

  const handleCopy = (item: FileItem) => {
    setClipboard({ item, action: 'copy' });
    closeContextMenu();
  };

  const handleMove = (item: FileItem) => {
    setClipboard({ item, action: 'move' });
    closeContextMenu();
  };

  const handlePaste = () => {
    if (!clipboard) return;

    if (clipboard.action === 'move') {
      setItems(items.map(i => i.id === clipboard.item.id ? { ...i, drive: activeDrive, parentId: currentFolderId } : i));
      setClipboard(null);
    } else {
      const newItem = { ...clipboard.item, id: Math.random().toString(), drive: activeDrive, parentId: currentFolderId, name: `${clipboard.item.name} - Cópia` };
      setItems([...items, newItem]);
    }
    closeContextMenu();
  };

  const handleRename = (item: FileItem) => {
    setRenamingId(item.id);
    closeContextMenu();
  };

  const driveName = activeDrive === 'C:' ? 'Acer (C:)' : 'Pendrive (D:)';

  return (
    <div 
      className="flex flex-col h-full bg-white text-xs text-gray-800 relative font-sans"
      onClick={() => {
        closeContextMenu();
        if (renamingId) setRenamingId(null);
      }}
      onContextMenu={(e) => {
          if (e.target === e.currentTarget) handleContextMenu(e, null);
      }}
    >
      {/* Top Ribbon */}
      <div className="bg-[#f5f6f7] border-b border-gray-300">
        <div className="flex text-[11px]">
          <div className="px-4 py-1.5 bg-[#4169e1] text-white cursor-pointer hover:bg-blue-600">Arquivo</div>
          <div className="px-4 py-1.5 hover:bg-gray-200 cursor-pointer bg-white border-b-2 border-transparent relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-500 text-blue-600">Início</div>
          <div className="px-4 py-1.5 hover:bg-gray-200 cursor-pointer">Compartilhar</div>
          <div className="px-4 py-1.5 hover:bg-gray-200 cursor-pointer">Exibir</div>
        </div>
        <div className="h-20 bg-[#f5f6f7] flex items-center px-2 py-1 gap-4 border-t border-white">
            <div 
              onClick={(e) => {
                e.stopPropagation();
                handleNewFolder();
              }}
              className="flex flex-col items-center justify-center p-1 hover:bg-blue-100 border border-transparent hover:border-blue-200 rounded cursor-pointer min-w-[50px]"
            >
                <div className="w-8 h-8 flex items-center justify-center text-blue-500 mb-1">
                    <Folder size={28} className="fill-blue-100" />
                </div>
                <span className="text-[10px]">Nova Pasta</span>
            </div>
            <div className="w-[1px] h-14 bg-gray-300"></div>
            <div 
              onClick={(e) => {
                  e.stopPropagation();
                  handlePaste();
              }}
              className={`flex flex-col items-center justify-center p-1 border border-transparent rounded min-w-[50px] ${clipboard ? 'hover:bg-blue-100 hover:border-blue-200 cursor-pointer text-gray-800' : 'opacity-40 cursor-not-allowed'}`}
            >
                <div className="w-8 h-8 flex items-center justify-center text-yellow-600 mb-1">
                    <FileIcon size={24} className="fill-yellow-100" />
                </div>
                <span className="text-[10px]">Colar</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1 hover:bg-blue-100 border border-transparent hover:border-blue-200 rounded cursor-pointer min-w-[50px] opacity-40">
                <FileIcon size={24} className="text-gray-500 mb-1" />
                <span className="text-[10px]">Propriedades</span>
            </div>
        </div>
      </div>

      {/* Address Bar Row */}
      <div className="flex items-center p-2 bg-white border-b border-gray-200 gap-2 shrink-0">
        <div className="flex gap-1">
          <button onClick={handleUpDir} className={`p-1 rounded ${currentFolderId ? 'hover:bg-blue-100 text-gray-800' : 'text-gray-400 opacity-50 cursor-not-allowed'}`}><ArrowLeft size={16} /></button>
          <button className="p-1 hover:bg-blue-100 rounded text-gray-500 opacity-50"><ArrowRight size={16} /></button>
          <button onClick={handleUpDir} className={`p-1 rounded ${currentFolderId ? 'hover:bg-blue-100 text-gray-800' : 'text-gray-400 opacity-50 cursor-not-allowed'}`}><ArrowUp size={16} /></button>
          <button className="p-1 hover:bg-blue-100 rounded text-gray-500"><RefreshCw size={14} /></button>
        </div>
        
        {/* Address Bar */}
        <div className="flex-1 flex items-center border border-gray-300 hover:border-blue-400 px-2 py-1 overflow-hidden">
            <Monitor size={14} className="text-gray-500 mr-2 shrink-0" />
            <span className="text-gray-600 px-1 cursor-pointer hover:bg-gray-100 shrink-0"><ChevronRight size={12}/></span>
            <span className="cursor-pointer hover:bg-blue-50 px-1 shrink-0" onClick={() => setCurrentFolderId(null)}>Este Computador</span>
            <span className="text-gray-600 px-1 cursor-pointer hover:bg-gray-100 shrink-0"><ChevronRight size={12}/></span>
            <span className="cursor-pointer hover:bg-blue-50 px-1 truncate shrink-0" onClick={() => setCurrentFolderId(null)}>{driveName}</span>
            
            {getBreadcrumbs().map(crumb => (
              <React.Fragment key={crumb.id}>
                <span className="text-gray-600 px-1 shrink-0"><ChevronRight size={12}/></span>
                <span 
                  className="cursor-pointer hover:bg-blue-50 px-1 truncate shrink-0" 
                  onClick={() => setCurrentFolderId(crumb.id)}
                >
                  {crumb.name}
                </span>
              </React.Fragment>
            ))}
            
            <div className="flex-1"></div>
            <ChevronDown size={14} className="text-gray-500 cursor-pointer shrink-0" />
        </div>

        {/* Search */}
        <div className="w-64 flex items-center border border-gray-300 hover:border-blue-400 px-2 py-1 bg-white shrink-0">
            <Search size={14} className="text-gray-400 mr-2" />
            <input type="text" placeholder={`Pesquisar em ${driveName}`} className="outline-none flex-1 text-xs" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-56 overflow-y-auto border-r border-gray-200 bg-white py-2 shrink-0">
          <div className="flex items-center py-1 px-4 cursor-pointer hover:bg-blue-50">
            <ChevronRight size={14} className="text-gray-500 mr-1 opacity-0" />
            <Folder size={16} className="text-blue-500 fill-blue-100 mr-2" />
            <span>Acesso rápido</span>
          </div>

          <div className="flex items-center py-1 px-4 cursor-pointer hover:bg-blue-50 ml-4">
             <div className="w-4"></div><Folder size={16} className="text-blue-400 mr-2" /> Área de Trabalho
          </div>
          <div className="flex items-center py-1 px-4 cursor-pointer hover:bg-blue-50 ml-4">
             <div className="w-4"></div><Folder size={16} className="text-blue-400 mr-2" /> Downloads
          </div>
          <div className="flex items-center py-1 px-4 cursor-pointer hover:bg-blue-50 ml-4">
             <div className="w-4"></div><Folder size={16} className="text-blue-400 mr-2" /> Documentos
          </div>

          <div className="my-1 border-t border-gray-100 mx-2"></div>

          <div className="flex items-center py-1 px-4 cursor-pointer hover:bg-blue-50 font-medium bg-blue-50 text-blue-800">
            <ChevronDown size={14} className="text-gray-500 mr-1" />
            <Monitor size={16} className="text-gray-500 mr-2" />
            <span>Este Computador</span>
          </div>
          
          <div 
            onClick={() => navigateToDrive('C:')}
            className={`flex items-center py-1 px-4 cursor-pointer ml-4 font-semibold text-black ${activeDrive === 'C:' ? 'bg-gray-200/50' : 'hover:bg-blue-50'}`}
          >
             <ChevronRight size={14} className={`text-gray-500 mr-1 ${activeDrive === 'C:' ? 'rotate-90' : ''}`} />
             <HardDrive size={16} className="text-gray-400 mr-2 shrink-0" /> <span className="truncate">Acer (C:)</span>
          </div>

          <div 
            onClick={() => navigateToDrive('D:')}
            className={`flex items-center py-1 px-4 cursor-pointer ml-4 font-semibold text-black ${activeDrive === 'D:' ? 'bg-gray-200/50' : 'hover:bg-blue-50'}`}
          >
             <ChevronRight size={14} className={`text-gray-500 mr-1 ${activeDrive === 'D:' ? 'rotate-90' : ''}`} />
             <Usb size={16} className="text-gray-400 mr-2 shrink-0" /> <span className="truncate">Pendrive (D:)</span>
          </div>

        </div>

        {/* Right Content Area */}
        <div 
          className="flex-1 overflow-x-auto bg-white" 
          onContextMenu={(e) => handleContextMenu(e, null)}
        >
             {/* Column Headers */}
             <div className="flex border-b border-gray-200 text-gray-600 bg-white sticky top-0 hover:bg-blue-50/30 min-w-max">
                 <div className="w-[300px] px-2 py-1 flex items-center border-r border-gray-100 hover:bg-blue-100/50 cursor-pointer group">Nome <div className="flex-1"></div> <ChevronDown size={10} className="opacity-0 group-hover:opacity-100 mr-1" /></div>
                 <div className="w-[150px] px-2 py-1 flex items-center border-r border-gray-100 hover:bg-blue-100/50 cursor-pointer group">Data de modificação <div className="flex-1"></div> <ChevronDown size={10} className="opacity-0 group-hover:opacity-100 mr-1" /></div>
                 <div className="w-[150px] px-2 py-1 flex items-center border-r border-gray-100 hover:bg-blue-100/50 cursor-pointer group">Tipo <div className="flex-1"></div> <ChevronDown size={10} className="opacity-0 group-hover:opacity-100 mr-1" /></div>
                 <div className="w-[100px] px-2 py-1 flex items-center border-r border-gray-100 hover:bg-blue-100/50 cursor-pointer group">Tamanho <div className="flex-1"></div> <ChevronDown size={10} className="opacity-0 group-hover:opacity-100 mr-1" /></div>
             </div>

             {/* Folders List */}
             <div className="pb-10 min-w-max h-full" onClick={() => { if (renamingId) setRenamingId(null); }}>
                 {currentItems.map((item) => (
                     <div 
                        key={item.id} 
                        className="flex hover:bg-[#e5f3ff] cursor-pointer group items-center"
                        onDoubleClick={(e) => { e.stopPropagation(); handleDoubleClick(item); }}
                        onContextMenu={(e) => { e.stopPropagation(); handleContextMenu(e, item); }}
                     >
                         <div className="w-[300px] px-2 py-0.5 flex items-center">
                             <input type="checkbox" className="mr-2 opacity-0 group-hover:opacity-100 w-3 h-3" />
                             {item.isFolder ? (
                                <Folder size={18} className="text-yellow-500 fill-yellow-200 mr-2 shrink-0" />
                             ) : item.type.includes('Word') || item.name.endsWith('.doc') || item.name.endsWith('.docx') ? (
                                <FileText size={18} className="text-blue-600 mr-2 shrink-0" />
                             ) : item.type.includes('Excel') || item.name.endsWith('.xls') || item.name.endsWith('.xlsx') ? (
                                <Table size={18} className="text-green-600 mr-2 shrink-0" />
                             ) : (
                                <FileIcon size={18} className="text-gray-400 fill-gray-100 mr-2 shrink-0" />
                             )}
                             
                             {renamingId === item.id ? (
                                <input 
                                  autoFocus
                                  className="border border-blue-400 px-1 py-0 outline-none text-xs w-full bg-white"
                                  defaultValue={item.name}
                                  onClick={e => e.stopPropagation()}
                                  onBlur={(e) => {
                                    setItems(items.map(i => i.id === item.id ? { ...i, name: e.target.value } : i));
                                    setRenamingId(null);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      setItems(items.map(i => i.id === item.id ? { ...i, name: e.currentTarget.value } : i));
                                      setRenamingId(null);
                                    }
                                  }}
                                />
                             ) : (
                                <span className="truncate flex-1">{item.name}</span>
                             )}
                         </div>
                         <div className="w-[150px] px-2 py-0.5 truncate text-gray-500 group-hover:text-gray-800">{item.date}</div>
                         <div className="w-[150px] px-2 py-0.5 truncate text-gray-500 group-hover:text-gray-800">{item.type}</div>
                         <div className="w-[100px] px-2 py-0.5 truncate text-gray-500 group-hover:text-gray-800 text-right pr-4">{item.size || ''}</div>
                     </div>
                 ))}
             </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-white border-t border-gray-200 shrink-0">
         <span>{currentItems.length} itens</span>
         <div className="flex gap-4">
            <span className="cursor-pointer hover:bg-blue-100 p-1 rounded px-2"></span>
         </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="fixed bg-white border border-gray-300 shadow-xl py-1 z-50 text-xs w-48 text-gray-800"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.item ? (
            <>
              <div 
                className="px-6 py-1.5 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleCopy(contextMenu.item!)}
              >
                Copiar
              </div>
              <div 
                className="px-6 py-1.5 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleMove(contextMenu.item!)}
              >
                Mover
              </div>
              <div className="border-t border-gray-200 my-1"></div>
              <div 
                className="px-6 py-1.5 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleRename(contextMenu.item!)}
              >
                Renomear
              </div>
              <div 
                className="px-6 py-1.5 hover:bg-red-50 text-red-600 cursor-pointer font-medium"
                onClick={() => handleDelete(contextMenu.item!)}
              >
                Excluir
              </div>
            </>
          ) : (
            <>
              <div 
                className={`px-6 py-1.5 ${clipboard ? 'hover:bg-blue-100 cursor-pointer text-gray-800 font-medium' : 'opacity-50 cursor-not-allowed'}`}
                onClick={() => { if (clipboard) handlePaste(); }}
              >
                Colar
              </div>
              <div className="border-t border-gray-200 my-1"></div>
              
              <div className="relative group/novo">
                <div className="px-6 py-1.5 hover:bg-blue-100 cursor-pointer flex justify-between items-center pr-2">
                  <span>Novo</span> <ChevronRight size={14} className="text-gray-500" />
                </div>
                {/* Submenu on the left since menu might be near right edge */}
                <div className="absolute top-0 right-full mr-0.5 bg-white border border-gray-300 shadow-xl hidden group-hover/novo:block py-1 min-w-[200px]">
                  <div className="px-5 py-2 hover:bg-blue-100 cursor-pointer text-sm font-medium flex items-center gap-2" onClick={handleNewFolder}>
                    <Folder size={16} className="text-yellow-500 fill-yellow-200" />
                    Pasta
                  </div>
                  <div className="px-5 py-2 hover:bg-blue-100 cursor-pointer text-sm font-medium flex items-center gap-2" onClick={handleNewWordFile}>
                    <FileText size={16} className="text-blue-600 fill-blue-50" />
                    Documento Word
                  </div>
                  <div className="px-5 py-2 hover:bg-blue-100 cursor-pointer text-sm font-medium flex items-center gap-2" onClick={handleNewExcelFile}>
                    <Table size={16} className="text-green-600 fill-green-50" />
                    Planilha Excel
                  </div>
                  <div className="px-5 py-2 hover:bg-blue-100 cursor-pointer text-sm font-medium flex items-center gap-2" onClick={handleNewTextFile}>
                    <FileIcon size={16} className="text-gray-500 fill-gray-50" />
                    Documento de Texto
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Windows Style Dialog */}
      <WindowsDialog
        isOpen={isDialogOpen}
        type={dialogConfig.type}
        title={dialogConfig.title}
        message={dialogConfig.message}
        onConfirm={dialogConfig.onConfirm}
        onCancel={closeDialog}
      />
    </div>
  );
}
