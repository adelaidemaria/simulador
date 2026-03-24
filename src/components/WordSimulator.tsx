import React, { useState } from 'react';
import { 
  FileText, 
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
  Users,
  MessageSquare,
  Share2,
  List,
  ListOrdered,
  Maximize2
} from 'lucide-react';

interface WordSimulatorProps {
  fileName?: string;
}

export default function WordSimulator({ fileName = 'Documento 1.docx' }: WordSimulatorProps) {
  const [content, setContent] = useState('');
  const [fontSize, setFontSize] = useState('11');
  const [fontFamily, setFontFamily] = useState('Calibri (Corpo)');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'justify'>('left');

  return (
    <div className="flex flex-col h-full bg-[#f3f2f1] font-sans overflow-hidden select-text text-gray-800">
      {/* Word Header (Blue Top) */}
      <div className="bg-[#2b579a] text-white px-4 py-1.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1 rounded hover:bg-white/30 cursor-pointer">
              <Save size={14} />
            </div>
            <div className="bg-white/20 p-1 rounded hover:bg-white/30 cursor-pointer">
              <Undo size={14} />
            </div>
            <div className="bg-white/20 p-1 rounded hover:bg-white/30 cursor-pointer">
              <Redo size={14} />
            </div>
          </div>
          <div className="h-4 w-[1px] bg-white/20"></div>
          <span className="text-[11px] font-medium opacity-90">{fileName} - Word</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-[11px]">
            <Share2 size={12} /> Compartilhar
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="bg-white border-b border-gray-200 flex text-[11px] shrink-0">
        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#2b579a] border-b-2 border-[#2b579a] font-semibold">Arquivo</div>
        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-semibold">Página Inicial</div>
        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Inserir</div>
        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Desenhar</div>
        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Design</div>
        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Layout</div>
        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Referências</div>
        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Exibir</div>
        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-1 opacity-60">
          Pesquisar (Alt+Q) <Search size={10} />
        </div>
      </div>

      {/* Ribbon Toolbar */}
      <div className="bg-white border-b border-gray-200 p-2 flex flex-wrap items-center gap-2 shrink-0">
        {/* Clipboard Group */}
        <div className="flex flex-col items-center px-2 border-r border-gray-200">
          <div className="flex gap-1 mb-1">
            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><FileText size={16} /></button>
          </div>
          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">Área de Tr...</span>
        </div>

        {/* Font Group */}
        <div className="flex flex-col items-center px-2 border-r border-gray-200">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center mb-1">
              <div className="flex items-center gap-1 border border-gray-200 px-2 py-0.5 rounded text-[11px] hover:bg-gray-50 cursor-pointer bg-white">
                {fontFamily} <ChevronDown size={10} />
              </div>
              <div className="flex items-center gap-1 border border-gray-200 px-2 py-0.5 rounded text-[11px] hover:bg-gray-50 cursor-pointer bg-white w-12 justify-between">
                {fontSize} <ChevronDown size={10} />
              </div>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => setIsBold(!isBold)}
                className={`p-1 hover:bg-gray-100 rounded transition-colors ${isBold ? 'bg-gray-200 shadow-inner' : ''}`}
              >
                <Bold size={14} />
              </button>
              <button 
                onClick={() => setIsItalic(!isItalic)}
                className={`p-1 hover:bg-gray-100 rounded transition-colors ${isItalic ? 'bg-gray-200 shadow-inner' : ''}`}
              >
                <Italic size={14} />
              </button>
              <button 
                onClick={() => setIsUnderline(!isUnderline)}
                className={`p-1 hover:bg-gray-100 rounded transition-colors ${isUnderline ? 'bg-gray-200 shadow-inner' : ''}`}
              >
                <Underline size={14} />
              </button>
              <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
              <button className="p-1 hover:bg-gray-100 rounded"><Type size={14} className="text-red-500" /></button>
            </div>
          </div>
          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter mt-1">Fonte</span>
        </div>

        {/* Paragraph Group */}
        <div className="flex flex-col items-center px-2 border-r border-gray-200">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              <button className="p-1 hover:bg-gray-100 rounded"><List size={14} /></button>
              <button className="p-1 hover:bg-gray-100 rounded"><ListOrdered size={14} /></button>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setAlignment('left')} className={`p-1 hover:bg-gray-100 rounded ${alignment === 'left' ? 'bg-gray-200 shadow-inner' : ''}`}><AlignLeft size={14} /></button>
              <button onClick={() => setAlignment('center')} className={`p-1 hover:bg-gray-100 rounded ${alignment === 'center' ? 'bg-gray-200 shadow-inner' : ''}`}><AlignCenter size={14} /></button>
              <button onClick={() => setAlignment('right')} className={`p-1 hover:bg-gray-100 rounded ${alignment === 'right' ? 'bg-gray-200 shadow-inner' : ''}`}><AlignRight size={14} /></button>
              <button onClick={() => setAlignment('justify')} className={`p-1 hover:bg-gray-100 rounded ${alignment === 'justify' ? 'bg-gray-200 shadow-inner' : ''}`}><AlignJustify size={14} /></button>
            </div>
          </div>
          <span className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter mt-1">Parágrafo</span>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-auto bg-[#f3f2f1] flex justify-center p-8">
        <div className="bg-white w-[816px] min-h-[1056px] shadow-lg border border-gray-200 p-24 flex flex-col relative animate-in fade-in zoom-in-95 duration-300 origin-top">
          {/* Ruler Marks (Mock) */}
          <div className="absolute top-0 left-0 w-full h-8 border-b border-gray-100 flex items-center px-12 opacity-30 select-none">
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(i => (
              <span key={i} className="text-[8px] flex-1 text-center">{i}</span>
            ))}
          </div>

          <textarea
            className={`w-full h-full outline-none resize-none overflow-hidden bg-transparent leading-relaxed ${isBold ? 'font-bold' : ''} ${isItalic ? 'italic' : ''} ${isUnderline ? 'underline' : ''}`}
            placeholder="Comece a digitar..."
            style={{ 
              textAlign: alignment,
              fontSize: `${fontSize}pt`,
              fontFamily: fontFamily.includes('Calibri') ? 'Calibri, sans-serif' : fontFamily
            }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-[#f3f2f1] border-t border-gray-200 px-4 py-1 flex items-center justify-between text-[11px] text-gray-600 shrink-0">
        <div className="flex items-center gap-4">
          <span>Página 1 de 1</span>
          <span>{content.trim().length > 0 ? content.trim().split(/\s+/).length : 0} palavras</span>
          <div className="flex items-center gap-1"><Users size={12} /> Português (Brasil)</div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 hover:bg-gray-200 px-2 py-0.5 rounded"><MessageSquare size={12} /> Comentários</button>
          <div className="flex items-center gap-2">
            <span>100%</span>
            <div className="w-24 h-1.5 bg-gray-300 rounded-full overflow-hidden">
               <div className="h-full bg-blue-600 w-1/2"></div>
            </div>
          </div>
          <Maximize2 size={12} className="cursor-pointer hover:text-blue-600" />
        </div>
      </div>
    </div>
  );
}
