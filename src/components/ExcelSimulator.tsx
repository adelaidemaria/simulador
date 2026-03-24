import React, { useState } from 'react';
import { 
  Table, 
  Save, 
  Printer, 
  Undo, 
  Redo, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Type,
  ChevronDown,
  Search,
  MessageSquare,
  Share2,
  Maximize2,
  DollarSign,
  Percent,
  Calculator,
  Grid,
  Filter,
  ArrowRight
} from 'lucide-react';

interface ExcelSimulatorProps {
  fileName?: string;
}

export default function ExcelSimulator({ fileName = 'Planilha 1.xlsx' }: ExcelSimulatorProps) {
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
  const [cellValues, setCellValues] = useState<Record<string, string>>({});
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');

  const rows = 30;
  const cols = 20;
  const getColLabel = (index: number) => String.fromCharCode(65 + index);

  const handleCellChange = (r: number, c: number, value: string) => {
    setCellValues(prev => ({ ...prev, [`${r}-${c}`]: value }));
  };

  const getCellValue = (r: number, c: number) => cellValues[`${r}-${c}`] || '';

  return (
    <div className="flex flex-col h-full bg-[#f3f2f1] font-sans overflow-hidden select-text text-gray-800">
      {/* Excel Header (Green Top) */}
      <div className="bg-[#217346] text-white px-4 py-1.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1 hover:bg-[#1a5a37] rounded cursor-pointer"><Save size={14} /></div>
            <div className="p-1 hover:bg-[#1a5a37] rounded cursor-pointer"><Undo size={14} /></div>
            <div className="p-1 hover:bg-[#1a5a37] rounded cursor-pointer"><Redo size={14} /></div>
          </div>
          <div className="h-4 w-[1px] bg-white/20"></div>
          <span className="text-[11px] font-medium opacity-90">{fileName} - Excel</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-[11px]">
            <Share2 size={12} /> Compartilhar
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="bg-white border-b border-gray-200 flex text-[11px] shrink-0 font-medium overflow-x-auto no-scrollbar">
        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#217346] border-b-2 border-[#217346]">Arquivo</div>
        <div className="px-4 py-2 bg-[#f3f2f1] text-[#217346] font-semibold border-t border-x border-gray-200 rounded-t-sm shadow-sm">Página Inicial</div>
        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Inserir</div>
        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Desenhar</div>
        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Layout da Página</div>
        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Fórmulas</div>
        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Dados</div>
        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Revisão</div>
        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Exibir</div>
      </div>

      {/* Ribbon Toolbar */}
      <div className="bg-white border-b border-gray-200 p-2 flex flex-wrap items-center gap-3 shrink-0">
        {/* Font Group */}
        <div className="flex flex-col items-center px-2 border-r border-gray-200">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center mb-1">
              <div className="flex items-center gap-1 border border-gray-200 px-2 py-0.5 rounded text-[11px] hover:bg-gray-50 cursor-pointer bg-white">
                Calibri <ChevronDown size={10} />
              </div>
              <div className="flex items-center gap-1 border border-gray-200 px-2 py-0.5 rounded text-[11px] hover:bg-gray-50 cursor-pointer bg-white w-12 justify-between">
                11 <ChevronDown size={10} />
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setIsBold(!isBold)} className={`p-1 hover:bg-gray-100 rounded transition-colors ${isBold ? 'bg-gray-200 shadow-inner' : ''}`}><Bold size={14} /></button>
              <button onClick={() => setIsItalic(!isItalic)} className={`p-1 hover:bg-gray-100 rounded transition-colors ${isItalic ? 'bg-gray-200 shadow-inner' : ''}`}><Italic size={14} /></button>
              <button onClick={() => setIsUnderline(!isUnderline)} className={`p-1 hover:bg-gray-100 rounded transition-colors ${isUnderline ? 'bg-gray-200 shadow-inner' : ''}`}><Underline size={14} /></button>
              <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
              <button className="p-1 hover:bg-gray-100 rounded border border-gray-100 shadow-sm"><Grid size={14} className="text-gray-400" /></button>
            </div>
          </div>
          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter mt-1">Fonte</span>
        </div>

        {/* Alignment Group */}
        <div className="flex flex-col items-center px-2 border-r border-gray-200">
          <div className="flex flex-col items-center gap-1 mb-1">
              <button className="p-1 hover:bg-gray-100 rounded"><AlignJustify size={14} /></button>
              <div className="flex gap-1">
                <button onClick={() => setAlignment('left')} className={`p-1 hover:bg-gray-100 rounded ${alignment === 'left' ? 'bg-gray-200 shadow-inner' : ''}`}><AlignLeft size={14} /></button>
                <button onClick={() => setAlignment('center')} className={`p-1 hover:bg-gray-100 rounded ${alignment === 'center' ? 'bg-gray-200 shadow-inner' : ''}`}><AlignCenter size={14} /></button>
                <button onClick={() => setAlignment('right')} className={`p-1 hover:bg-gray-100 rounded ${alignment === 'right' ? 'bg-gray-200 shadow-inner' : ''}`}><AlignRight size={14} /></button>
              </div>
          </div>
          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Alinhamento</span>
        </div>

        {/* Number Group */}
        <div className="flex flex-col items-center px-2 border-r border-gray-200">
           <div className="flex flex-col gap-1 mb-1">
             <div className="flex items-center gap-1 border border-gray-200 px-2 py-0.5 rounded text-[11px] hover:bg-gray-50 cursor-pointer bg-white">
                Geral <ChevronDown size={10} />
              </div>
              <div className="flex gap-2 justify-center">
                <button className="p-1 hover:bg-gray-100 rounded"><DollarSign size={14} className="text-gray-500" /></button>
                <button className="p-1 hover:bg-gray-100 rounded"><Percent size={14} className="text-gray-500" /></button>
                <button className="p-1 hover:bg-gray-100 rounded"><Calculator size={14} className="text-gray-500" /></button>
              </div>
           </div>
           <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Número</span>
        </div>

        {/* Editing Group */}
        <div className="flex flex-col items-center px-2">
           <div className="flex gap-4">
              <div className="flex flex-col items-center justify-center p-1 hover:bg-gray-100 rounded cursor-pointer opacity-50">
                <Filter size={18} className="text-[#217346]" />
                <span className="text-[10px]">Filtrar</span>
              </div>
              <div className="flex flex-col items-center justify-center p-1 hover:bg-gray-100 rounded cursor-pointer opacity-50">
                <Search size={18} className="text-[#217346]" />
                <span className="text-[10px]">Localizar</span>
              </div>
           </div>
        </div>
      </div>

      {/* Formula Bar */}
      <div className="bg-white border-b border-gray-200 p-1 flex items-center gap-2 text-xs shrink-0">
         <div className="w-16 border border-gray-200 px-2 py-1 text-center font-semibold bg-gray-50 rounded-sm">
            {getColLabel(selectedCell.c)}{selectedCell.r + 1}
         </div>
         <div className="text-gray-300 mx-1">|</div>
         <span className="italic font-serif font-black text-[#217346] text-sm px-2">fx</span>
         <div className="flex-1 border border-gray-200 px-2 py-1 bg-white hover:border-gray-300">
           <input 
              className="w-full outline-none" 
              value={getCellValue(selectedCell.r, selectedCell.c)}
              onChange={(e) => handleCellChange(selectedCell.r, selectedCell.c, e.target.value)}
           />
         </div>
      </div>

      {/* Grid Area */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="inline-block min-w-full">
          {/* Header Row */}
          <div className="flex">
            <div className="w-10 h-6 shrink-0 bg-[#f3f2f1] border-r border-b border-gray-300 flex items-center justify-center sticky top-0 left-0 z-20">
               <ArrowRight size={10} className="text-gray-400 rotate-45" />
            </div>
            {Array.from({ length: cols }).map((_, c) => (
              <div 
                key={c} 
                className={`w-28 h-6 shrink-0 bg-[#f3f2f1] border-r border-b border-gray-300 flex items-center justify-center text-[11px] font-medium text-gray-500 sticky top-0 z-10 hover:bg-gray-200 cursor-pointer ${selectedCell.c === c ? 'bg-gray-300 text-[#217346]' : ''}`}
              >
                {getColLabel(c)}
              </div>
            ))}
          </div>

          {/* Table Body */}
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="flex h-6">
              <div className={`w-10 shrink-0 bg-[#f3f2f1] border-r border-b border-gray-300 flex items-center justify-center text-[10px] text-gray-500 sticky left-0 z-10 hover:bg-gray-200 cursor-pointer ${selectedCell.r === r ? 'bg-gray-300 text-[#217346]' : ''}`}>
                {r + 1}
              </div>
              {Array.from({ length: cols }).map((_, c) => {
                const isSelected = selectedCell.r === r && selectedCell.c === c;
                return (
                  <div 
                    key={c}
                    onClick={() => setSelectedCell({ r, c })}
                    className={`w-28 h-6 shrink-0 border-r border-b border-gray-100 flex items-center relative group ${isSelected ? 'outline outline-2 outline-[#217346] z-10 shadow-lg' : 'hover:bg-gray-50'}`}
                  >
                    <input
                      className={`w-full h-full bg-transparent px-2 outline-none text-[11px] cursor-text ${isSelected ? 'font-medium' : ''} ${isBold ? 'font-bold' : ''} ${isItalic ? 'italic' : ''} ${isUnderline ? 'underline' : ''}`}
                      style={{ textAlign: alignment }}
                      value={getCellValue(r, c)}
                      onChange={(e) => handleCellChange(r, c, e.target.value)}
                    />
                    {isSelected && (
                      <div className="absolute bottom-[-2px] right-[-2px] w-2 h-2 bg-[#217346] cursor-crosshair z-20 border border-white" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Sheet Tabs & Bottom Bar */}
      <div className="bg-[#f3f2f1] border-t border-gray-300 flex items-center justify-between px-3 h-8 text-[11px] text-gray-600 shrink-0 select-none">
        <div className="flex items-center gap-1 h-full">
          <div className="flex items-center gap-4 px-4 bg-white border-t-2 border-[#217346] h-full shadow-sm text-[#217346] font-bold cursor-pointer">Planilha1</div>
          <button className="p-1 hover:bg-gray-200 rounded text-gray-400 font-black">+</button>
        </div>
        <div className="flex items-center gap-4">
           <span>{Object.keys(cellValues).length > 0 ? 'PRONTO' : 'DIGITE'}</span>
           <div className="w-[1px] h-4 bg-gray-300"></div>
           <div className="flex items-center gap-2">
            <span>100%</span>
            <div className="w-24 h-1.5 bg-gray-300 rounded-full overflow-hidden">
               <div className="h-full bg-[#217346] w-1/2"></div>
            </div>
          </div>
          <Maximize2 size={12} className="cursor-pointer hover:text-[#217346]" />
        </div>
      </div>
    </div>
  );
}
