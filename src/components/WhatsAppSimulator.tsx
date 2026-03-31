import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Mic, 
  CheckCheck, 
  ArrowLeft,
  Image as ImageIcon,
  FileText,
  User,
  Camera,
  MessageSquare,
  Phone,
  Video,
  X,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  status: 'sent' | 'delivered' | 'read';
  attachment?: {
    type: 'image' | 'file';
    name: string;
    size?: string;
  };
}

interface Contact {
  id: string;
  name: string;
  status: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
  isOnline?: boolean;
}

const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'Suporte Técnico', status: 'Online', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop', lastMessage: 'Como posso ajudar com o simulador?', lastMessageTime: '10:45', isOnline: true },
  { id: '2', name: 'Dr. Roberto Santos', status: 'Visto por último hoje às 08:30', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop', lastMessage: 'O relatório médico está pronto.', lastMessageTime: '09:12' },
  { id: '3', name: ' RH - Empresa', status: 'Trabalhando no RH', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop', lastMessage: 'Recebemos seu currículo, obrigado.', lastMessageTime: 'Ontem', unreadCount: 2 },
  { id: '4', name: 'Amanda (Vendas)', status: 'Online', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', lastMessage: 'O orçamento foi aprovado?', lastMessageTime: '11:20', isOnline: true },
  { id: '5', name: 'Paulo Engenheiro', status: 'Ocupado', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', lastMessage: 'Enviei os arquivos da planta do prédio.', lastMessageTime: 'Ontem' },
  { id: '6', name: 'Dra. Maria Clara', status: 'Atendimento clínico', avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?w=100&h=100&fit=crop', lastMessage: 'Confirmado para segunda-feira.', lastMessageTime: '15:30' },
  { id: '7', name: 'Fernando Transportes', status: 'Na estrada', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', lastMessage: 'A carga chega amanhã de manhã.', lastMessageTime: '08:15' },
  { id: '8', name: 'Grupo de Projeto', status: '7 membros', avatar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop', lastMessage: 'Precisamos fechar a ata da reunião.', lastMessageTime: '12:00' },
  { id: '9', name: 'Contabilidade', status: 'Disponível', avatar: 'https://images.unsplash.com/photo-1454165833767-027ff33027ef?w=100&h=100&fit=crop', lastMessage: 'Os impostos foram pagos.', lastMessageTime: 'Segunda' },
  { id: '10', name: 'Carla Nutricionista', status: 'Atendendo', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', lastMessage: 'Sua dieta personalizada ficou pronta.', lastMessageTime: '14:20' },
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 'm1', senderId: '1', text: 'Bom dia! Sou do suporte técnico.', timestamp: '10:40', isMe: false, status: 'read' },
    { id: 'm2', senderId: 'me', text: 'Olá, preciso de ajuda com um arquivo que não abre.', timestamp: '10:42', isMe: true, status: 'read' },
    { id: 'm3', senderId: '1', text: 'Qual seria o formato do arquivo? Como posso ajudar?', timestamp: '10:45', isMe: false, status: 'read' },
  ],
  '2': [
    { id: 'm1', senderId: '2', text: 'Olá, bom dia! Dr. Roberto aqui.', timestamp: '08:10', isMe: false, status: 'read' },
    { id: 'm2', senderId: '2', text: 'O relatório médico solicitado já está disponível na recepção.', timestamp: '08:12', isMe: false, status: 'read' },
    { id: 'm3', senderId: 'me', text: 'Perfeito, vou pedir para buscarem.', timestamp: '08:30', isMe: true, status: 'read' },
    { id: 'm4', senderId: '2', text: 'O relatório médico está pronto.', timestamp: '09:12', isMe: false, status: 'read' },
  ],
  '3': [
    { id: 'm1', senderId: 'me', text: 'Boa tarde, gostaria de saber sobre o processo seletivo.', timestamp: 'Segunda', isMe: true, status: 'read' },
    { id: 'm2', senderId: '3', text: 'Olá! Recebemos seu currículo, obrigado.', timestamp: 'Ontem', isMe: false, status: 'read' },
    { id: 'm3', senderId: '3', text: 'Estamos analisando e entraremos em contato.', timestamp: 'Ontem', isMe: false, status: 'read' },
  ],
  '4': [
    { id: 'm1', senderId: '4', text: 'Bom dia!', timestamp: '11:15', isMe: false, status: 'read' },
    { id: 'm2', senderId: '4', text: 'O orçamento foi aprovado?', timestamp: '11:20', isMe: false, status: 'read' },
  ],
  '5': [
    { id: 'm1', senderId: '5', text: 'Bom dia, equipe. Segue os documentos do projeto.', timestamp: 'Ontem', isMe: false, status: 'read' },
    { id: 'm2', senderId: '5', text: '', timestamp: 'Ontem', isMe: false, status: 'read', attachment: { type: 'file', name: 'Planta_Baixa_Final.pdf', size: '2.4 MB' } },
  ],
  '6': [
    { id: 'm1', senderId: '6', text: 'Sua consulta foi agendada.', timestamp: '15:20', isMe: false, status: 'read' },
    { id: 'm2', senderId: '6', text: 'Confirmado para segunda-feira.', timestamp: '15:30', isMe: false, status: 'read' },
  ],
  '7': [
    { id: 'm1', senderId: '7', text: 'A carga chega amanhã de manhã.', timestamp: '08:15', isMe: false, status: 'read' },
  ],
  '8': [
    { id: 'm1', senderId: '8', text: 'Precisamos fechar a ata da reunião de hoje.', timestamp: '12:00', isMe: false, status: 'read' },
  ],
  '9': [
    { id: 'm1', senderId: '9', text: 'Os impostos foram pagos e os comprovantes enviados por e-mail.', timestamp: 'Segunda', isMe: false, status: 'read' },
  ],
  '10': [
    { id: 'm1', senderId: '10', text: 'Sua dieta personalizada ficou pronta.', timestamp: '14:20', isMe: false, status: 'read' },
  ]
};

export default function WhatsAppSimulator() {
  const [selectedContactId, setSelectedContactId] = useState<string | null>('1');
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSelectContact = (id: string) => {
    setSelectedContactId(id);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
  };

  const EMOJIS = ['😀', '😂', '😍', '👍', '🙏', '❤️', '✅', '🤔', '📁', '📄', '🤝', '🌞'];
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const addEmoji = (emoji: string) => {
    setInputValue(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedContactId, messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedContactId) return;

    const newMessage: Message = {
      id: Math.random().toString(),
      senderId: 'me',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] || []), newMessage]
    }));
    setInputValue('');

    // Mock response for technical support
    if (selectedContactId === '1') {
      setTimeout(() => {
        const response: Message = {
          id: Math.random().toString(),
          senderId: '1',
          text: 'Recebemos sua mensagem. Um técnico será atribuído para te ajudar em breve.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          status: 'read'
        };
        setMessages(prev => ({
          ...prev,
          [selectedContactId]: [...(prev[selectedContactId] || []), response]
        }));
      }, 2000);
    }
  };

  const handleAttachFile = (type: 'image' | 'file') => {
    if (!selectedContactId) return;

    const fileName = type === 'image' ? 'Foto_Profissional.jpg' : 'Documento_Importante.pdf';
    const newMessage: Message = {
      id: Math.random().toString(),
      senderId: 'me',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: 'sent',
      attachment: {
        type,
        name: fileName,
        size: type === 'image' ? '1.2 MB' : '850 KB'
      }
    };

    setMessages(prev => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] || []), newMessage]
    }));
    setShowAttachMenu(false);
  };

    const filteredContacts = (contacts || INITIAL_CONTACTS).filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeContact = (contacts || INITIAL_CONTACTS).find(c => c.id === selectedContactId);

  return (
    <div className="flex bg-[#f0f2f5] h-full overflow-hidden text-[#41525d] font-sans antialiased">
      {/* Sidebar */}
      <div className="w-[30%] min-w-[300px] max-w-[420px] border-r border-[#d1d7db] flex flex-col bg-white">
        {/* Sidebar Header */}
        <div className="bg-[#f0f2f5] px-4 py-3 flex items-center justify-between shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-6 text-[#54656f]">
             <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer"><MessageSquare size={20} /></motion.div>
             <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer"><MoreVertical size={20} /></motion.div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-2 border-b border-[#f0f2f5] shrink-0">
          <div className="bg-[#f0f2f5] h-9 rounded-lg flex items-center px-4 gap-4">
             <Search size={18} className="text-[#54656f]" />
             <input 
               className="bg-transparent text-sm w-full outline-none placeholder:text-[#54656f]" 
               placeholder="Pesquisar ou começar uma nova conversa"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredContacts.map(contact => (
            <div 
              key={contact.id}
              onClick={() => handleSelectContact(contact.id)}
              className={`flex items-center px-4 py-4 hover:bg-[#f5f6f6] cursor-pointer transition-colors border-b border-[#f0f2f5] ${selectedContactId === contact.id ? 'bg-[#f0f2f5]' : ''}`}
            >
              <div className="relative shrink-0">
                <img src={contact.avatar} className="w-14 h-14 rounded-full object-cover" />
                {contact.isOnline && <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-[#1fa855] rounded-full border-2 border-white"></div>}
              </div>
              <div className="ml-4 flex-1 min-w-0 pr-2">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-[#111b21] text-base truncate">{contact.name}</h4>
                  <span className={`text-[11px] ${contact.unreadCount ? 'text-[#1fa855] font-black' : 'text-[#667781]'}`}>{contact.lastMessageTime}</span>
                </div>
                <div className="flex justify-between items-center">
                   <p className="text-xs text-[#667781] truncate pr-4">{contact.lastMessage}</p>
                   {contact.unreadCount && (
                     <span className="bg-[#1fa855] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0">{contact.unreadCount}</span>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedContactId ? (
        <div className="flex-1 flex flex-col items-stretch relative bg-[#efeae2]">
          {/* Wallpaper Layer */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://w0.peakpx.com/wallpaper/580/650/HD-wallpaper-whatsapp-background-whatsapp-pattern.jpg')]"></div>
          
          <div className="bg-[#f0f2f5] px-4 py-4 border-b border-[#d1d7db] flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-3">
              <img src={activeContact?.avatar} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h4 className="font-bold text-[#111b21] text-lg leading-tight">{activeContact?.name}</h4>
                <p className="text-xs text-[#667781]">{activeContact?.status}</p>
              </div>
            </div>
            <div className="flex gap-6 text-[#54656f]">
               <Search size={18} className="cursor-pointer" />
               <MoreVertical size={18} className="cursor-pointer" />
            </div>
          </div>

          {/* Messages Window */}
          <div className="flex-1 overflow-y-auto px-4 md:px-12 py-6 flex flex-col gap-1.5 z-10 custom-scrollbar scroll-smooth">
            {messages[selectedContactId]?.map((msg, i) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} mb-1`}
              >
                <div className={`max-w-[65%] px-3 py-1.5 rounded-lg shadow-sm relative group ${msg.isMe ? 'bg-[#d9fdd3] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                  {/* Tail for bubbles (simplified) */}
                  <div className={`absolute top-0 w-2 h-3.5 ${msg.isMe ? 'bg-[#d9fdd3] -right-1.5 clip-path-msg-me' : 'bg-white -left-1.5 clip-path-msg-other'}`}></div>
                  
                  {msg.attachment ? (
                    <div className="mb-2">
                       {msg.attachment.type === 'image' ? (
                         <div className="flex flex-col gap-2">
                           <div className="rounded overflow-hidden bg-gray-100 min-w-[200px] min-h-[150px] flex items-center justify-center">
                              <ImageIcon size={48} className="text-gray-300" />
                           </div>
                           <p className="text-xs text-[#111b21] font-medium">{msg.attachment.name}</p>
                         </div>
                       ) : (
                         <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded border border-gray-100">
                            <div className="bg-[#5c68ff] p-2 rounded-lg text-white">
                               <FileText size={24} />
                            </div>
                            <div className="flex-1 truncate">
                               <h5 className="text-sm font-bold text-[#111b21] truncate">{msg.attachment.name}</h5>
                               <p className="text-[10px] text-gray-500">{msg.attachment.size}</p>
                            </div>
                         </div>
                       )}
                    </div>
                  ) : null}

                  {msg.text && <p className="text-base text-[#111b21] leading-relaxed pr-10 whitespace-pre-wrap">{msg.text}</p>}
                  
                  <div className="flex items-center gap-1 absolute bottom-1.5 right-2">
                    <span className="text-[10px] text-[#667781]">{msg.timestamp}</span>
                    {msg.isMe && (
                      <CheckCheck size={14} className={msg.status === 'read' ? 'text-[#53bdeb]' : 'text-[#667781]'} />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Attachment Menu */}
          <AnimatePresence>
            {showAttachMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                className="absolute bottom-20 left-10 bg-white shadow-2xl rounded-[2rem] p-4 flex flex-col gap-4 z-20 border border-gray-100"
              >
                 <button onClick={() => handleAttachFile('image')} className="flex items-center gap-4 hover:bg-gray-50 p-3 rounded-2xl transition-all group">
                    <div className="bg-[#bf59cf] p-3 rounded-full text-white shadow-lg shadow-purple-100"><ImageIcon size={20} /></div>
                    <span className="text-sm font-bold opacity-0 group-hover:opacity-100">Fotos e Vídeos</span>
                 </button>
                 <button onClick={() => handleAttachFile('file')} className="flex items-center gap-4 hover:bg-gray-50 p-3 rounded-2xl transition-all group">
                    <div className="bg-[#7f66ff] p-3 rounded-full text-white shadow-lg shadow-blue-100"><FileText size={20} /></div>
                    <span className="text-sm font-bold opacity-0 group-hover:opacity-100">Documento</span>
                 </button>
                 <button className="flex items-center gap-4 hover:bg-gray-50 p-3 rounded-2xl transition-all group opacity-30">
                    <div className="bg-[#ff2e74] p-3 rounded-full text-white"><Camera size={20} /></div>
                    <span className="text-sm font-bold opacity-0 group-hover:opacity-100">Câmera</span>
                 </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <div className="bg-[#f0f2f5] px-4 pt-2 pb-6 flex items-center gap-3 z-10 shrink-0 border-t border-[#d1d7db]/40 relative">
            <div className="flex gap-4 items-center text-[#54656f]">
               <div className="relative">
                 <Smile 
                   size={24} 
                   className={`cursor-pointer hover:text-blue-500 transition-colors ${showEmojiPicker ? 'text-blue-500' : ''}`} 
                   onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                 />
                 <AnimatePresence>
                   {showEmojiPicker && (
                     <motion.div 
                       initial={{ opacity: 0, y: 10, scale: 0.8 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: 10, scale: 0.8 }}
                       className="absolute bottom-12 left-0 bg-white shadow-2xl rounded-2xl p-3 grid grid-cols-4 gap-2 z-50 border border-gray-100 min-w-[150px]"
                     >
                       {EMOJIS.map(emoji => (
                         <button 
                           key={emoji} 
                           onClick={() => addEmoji(emoji)}
                           className="text-2xl hover:bg-gray-100 p-1 rounded-lg transition-all active:scale-90"
                         >
                           {emoji}
                         </button>
                       ))}
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
               <motion.div 
                 whileTap={{ scale: 0.9 }}
                 onClick={() => setShowAttachMenu(!showAttachMenu)}
               >
                 <Paperclip size={24} className={`cursor-pointer hover:text-blue-500 transition-colors ${showAttachMenu ? 'text-blue-500 rotate-45' : ''}`} />
               </motion.div>
            </div>
            <div className="flex-1 relative">
               <input 
                 className="w-full bg-white rounded-lg px-4 py-2 text-sm outline-none placeholder:text-[#667781]" 
                 placeholder="Digite uma mensagem"
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
               />
            </div>
            <div className="text-[#54656f]">
               {inputValue.trim() ? (
                 <motion.button 
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.9 }}
                   onClick={handleSendMessage}
                   className="bg-[#00a884] text-white p-2 rounded-full shadow-lg"
                 >
                   <Send size={20} />
                 </motion.button>
               ) : (
                 <Mic size={24} className="cursor-pointer hover:text-blue-500 transition-colors" />
               )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-[#f8f9fa] flex flex-col items-center justify-center p-20 text-center border-b-[6px] border-[#43c453]">
           <div className="mb-10 text-[#667781] opacity-60">
              <MessageSquare size={120} strokeWidth={0.5} />
           </div>
           <h2 className="text-[32px] font-black text-[#41525d] mb-4">WhatsApp Web Profissional</h2>
           <p className="text-sm text-[#667781] max-w-md leading-relaxed font-medium">
             Envie e receba mensagens, envie documentos e organize suas conversas comerciais com total segurança nesta simulação para treinamento.
           </p>
           <div className="mt-20 flex items-center gap-2 text-xs text-[#8696a0]">
              <Phone size={14} /> End-to-end encrypted
           </div>
        </div>
      )}
      
      <style>{`
        .clip-path-msg-me {
          clip-path: polygon(0 0, 0 100%, 100% 0);
        }
        .clip-path-msg-other {
          clip-path: polygon(100% 0, 100% 100%, 0 0);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
