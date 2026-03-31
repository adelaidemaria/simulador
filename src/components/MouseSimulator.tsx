import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MousePointer2, 
  Folder, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Hand,
  Trophy,
  Mouse,
  Move,
  X,
  Maximize2,
  Minimize2,
  Minus,
  Square,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowLeft,
  Copy,
  Trash2,
  Globe,
  Monitor,
  Layout,
  MousePointerClick,
  Brain,
  Clipboard
} from 'lucide-react';

interface StageProps {
  onComplete: () => void;
  onGoToIndex: () => void;
  onRetry?: () => void;
  key?: React.Key;
}

// --- Exercises Data ---

const EXERCISES = [
  { id: -1, title: 'Bem-vindo', desc: 'Início da sua jornada' },
  { id: 0, title: 'Aulas', desc: 'Introdução ao curso' },
  { id: 1, title: '1. Os Botões', desc: 'Diferença entre esquerdo e direito' },
  { id: 2, title: '2. Movimentação', desc: 'Controlando o cursor com leveza' },
  { id: 3, title: '3. Caminhos', desc: 'Controlando o mouse em espaços estreitos' },
  { id: 4, title: '4. Clique Simples', desc: 'Ativando comandos e botões' },
  { id: 5, title: '5. Pontaria', desc: 'Acertando alvos estáticos' },
  { id: 6, title: '6. Alvos Móveis', desc: 'Acertando itens que se movem' },
  { id: 7, title: '7. Abrir Sites', desc: 'Navegando na internet com um clique' },
  { id: 8, title: '8. Ritmo do Clique', desc: 'Praticando a velocidade do clique duplo' },
  { id: 9, title: '9. Abrir Pastas', desc: 'Entrando em pastas com clique duplo' },
  { id: 10, title: '10. Abrir Arquivos', desc: 'Acessando documentos e fotos' },
  { id: 11, title: '11. Fechar Telas', desc: 'Usando o "X" para encerrar tarefas' },
  { id: 12, title: '12. Minimizar', desc: 'Escondendo janelas temporariamente' },
  { id: 13, title: '13. Maximizar', desc: 'Aumentando o espaço de visão' },
  { id: 14, title: '14. Botão Direito', desc: 'Descobrindo o menu de opções' },
  { id: 15, title: '15. Copiar Itens', desc: 'Preparando arquivos para duplicar' },
  { id: 16, title: '16. Colar Itens', desc: 'Colocando a cópia no lugar certo' },
  { id: 17, title: '17. Arrastar e Soltar', desc: 'Movendo objetos pela tela' },
  { id: 18, title: '18. Lixeira', desc: 'Descartando o que não precisa mais' },
  { id: 19, title: '19. Rolar Página', desc: 'Usando a rodinha para ler textos' },
  { id: 20, title: '20. Seleção Múltipla', desc: 'Marcando vários itens de uma vez' },
  { id: 21, title: 'Quiz Master', desc: 'Teste seus conhecimentos' },
  { id: 23, title: 'Jogo da Memória', desc: 'Treine sua mente e o mouse' }
];

const HomeStage = ({ onStart }: { onStart: () => void }) => {
  const tips = [
    { title: 'Relaxamento', desc: 'Segure o mouse com leveza, sem apertar os dedos com força.' },
    { title: 'Clique Firme', desc: 'Pressione o botão esquerdo rapidamente e solte com precisão.' },
    { title: 'Foco no Cursor', desc: 'Mantenha os olhos na tela para guiar o movimento com naturalidade.' },
    { title: 'Paciência', desc: 'Comece devagar; a velocidade virá com o tempo e a prática.' }
  ];

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto custom-scrollbar">
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-16">
          <div className="space-y-6 lg:space-y-10">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter leading-none uppercase">
                SUA JORNADA <br/> <span className="text-blue-600">COM O MOUSE</span>
              </h1>
              <p className="text-lg text-gray-500 font-medium max-w-lg">
                Aprenda a dominar o mouse começando pela ferramenta mais importante.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-50 p-4 rounded-3xl border-2 border-gray-100 space-y-1 hover:border-blue-100 hover:bg-blue-50/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                     <div className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-[10px] shadow-lg group-hover:scale-110 transition-transform">
                        {idx + 1}
                     </div>
                     <h4 className="font-black text-gray-900 uppercase tracking-tight text-sm">{tip.title}</h4>
                  </div>
                  <p className="text-xs text-gray-500 font-medium leading-tight">{tip.desc}</p>
                </motion.div>
              ))}
            </div>

            <button 
              onClick={onStart}
              className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-[2rem] font-black text-xl shadow-2xl flex items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 border-b-8 border-blue-900 active:border-b-0 group"
            >
              INICIAR APRENDIZADO <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative hidden lg:flex justify-center"
          >
            <div className="absolute inset-0 bg-blue-600/5 rounded-full blur-[100px] -z-10 animate-pulse" />
            <img 
              src="/ia_images/mouse_common.png" 
              alt="Mouse Padrao" 
              className="max-w-[300px] xl:max-w-[400px] w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.1)] hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};


// --- Custom Components ---

const SuccessOverlay = ({ title, desc, buttonText, onComplete, onRetry }: { title: string, desc: string, buttonText: string, onComplete: () => void, onRetry?: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-md z-[100] p-8"
  >
    <motion.div 
      initial={{ scale: 0.8, y: 20 }} 
      animate={{ scale: 1, y: 0 }} 
      className="text-center space-y-8 max-w-md"
    >
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner border-2 border-green-200">
          <CheckCircle2 size={50} />
        </div>
        <div className="space-y-4">
          <h4 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">{title}</h4>
          <p className="text-xl text-gray-600 font-medium leading-relaxed">{desc}</p>
        </div>
        <div className="flex w-full gap-4 mt-8">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 bg-white hover:bg-gray-50 text-blue-600 border-4 border-blue-600 px-6 py-5 rounded-2xl font-black text-xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              REFAZER
            </button>
          )}
          <button
            onClick={onComplete}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 rounded-2xl font-black text-xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            {buttonText} <ArrowRight size={24} />
          </button>
        </div>
    </motion.div>
  </motion.div>
);

// --- Stages ---

const IndexStage = ({ onComplete, onSelect, highlightFirst = false }: { onComplete: () => void, onSelect: (id: number) => void, highlightFirst?: boolean }) => (
  <div className="h-full flex flex-col bg-gray-50 overflow-y-auto custom-scrollbar">
    <div className="p-12 text-center space-y-6">
      <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-xl mb-4 rotate-3">
        <Layout size={40} />
      </div>
      <h2 className="text-5xl font-black text-gray-900 tracking-tighter">SUA JORNADA COM O MOUSE</h2>
      <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
        Preparamos 20 exercícios passo a passo para você dominar o mouse. Escolha um por onde começar ou siga a sequência!
      </p>
    </div>


    <div className="px-12 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {EXERCISES.slice(2, 22).map((ex, i) => (
        <button 
          key={ex.id}
          onClick={() => onSelect(ex.id)}
          className={`group text-left bg-white p-6 rounded-[2rem] border-2 shadow-sm transition-all duration-300 flex items-start gap-5 active:scale-95 ${
            i === 0 && highlightFirst 
              ? 'border-blue-500 shadow-xl ring-4 ring-blue-500/30 animate-[pulse_2s_ease-in-out_infinite]' 
              : 'border-gray-100 hover:border-blue-500 hover:shadow-xl'
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-colors ${
            i === 0 && highlightFirst 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-400 group-hover:bg-blue-600 group-hover:text-white'
          }`}>
            {i + 1}
          </div>
          <div className="flex-1">
            <h4 className={`font-black transition-colors uppercase tracking-tight ${
              i === 0 && highlightFirst
                ? 'text-blue-600'
                : 'text-gray-900 group-hover:text-blue-600'
            }`}>{ex.title}</h4>
            <p className="text-sm text-gray-500 font-medium leading-tight mt-1">{ex.desc}</p>
          </div>
        </button>
      ))}
    </div>

  </div>
);

const ButtonsStage = ({ onComplete, onRetry }: StageProps) => {
  const [clicked, setClicked] = useState({ left: false, right: false });

  return (
    <div className="h-full bg-blue-50 flex flex-col items-center justify-center p-6 md:p-10 text-center space-y-6 md:space-y-10 overflow-y-auto">
      <div className="max-w-2xl space-y-4">
        <h3 className="text-3xl md:text-4xl font-black text-blue-900 uppercase">1. Conhecendo os Botões</h3>
        <p className="text-xl md:text-2xl text-blue-900 bg-blue-100 p-4 md:p-6 rounded-2xl font-black border-4 border-blue-300 shadow-sm">
          Clique nos botões desenhados abaixo: pressione seu botão <b>ESQUERDO</b> e depois o <b>DIREITO</b> para prosseguir.
        </p>
      </div>

      <div className="relative w-64 md:w-72 h-[320px] md:h-[400px] bg-white rounded-[4rem] md:rounded-[5rem] border-8 border-gray-200 shadow-2xl flex flex-col items-center overflow-hidden flex-shrink-0">
        <div className="w-full h-1/2 flex border-b-4 border-gray-100">
          <button 
            onMouseDown={(e) => e.button === 0 && setClicked(c => ({...c, left: true}))}
            className={`flex-1 border-r-2 border-gray-100 transition-all flex flex-col items-center justify-center gap-2 md:gap-4 ${clicked.left ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 text-gray-400'}`}
          >
            <div className="font-black text-sm md:text-lg uppercase tracking-tighter">ESQUERDO</div>
            <MousePointerClick size={28} />
          </button>
          <button 
            onMouseDown={(e) => e.button === 2 && setClicked(c => ({...c, right: true}))}
            onContextMenu={(e) => e.preventDefault()}
            className={`flex-1 transition-all flex flex-col items-center justify-center gap-2 md:gap-4 ${clicked.right ? 'bg-red-600 text-white' : 'hover:bg-red-50 text-gray-400'}`}
          >
            <div className="font-black text-sm md:text-lg uppercase tracking-tighter">DIREITO</div>
            <Layout size={28} />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 text-gray-300">
           <div className="w-4 h-8 md:h-12 bg-gray-100 rounded-full mb-2 md:mb-4 shadow-inner" />
           <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]">Mão aqui</span>
        </div>
      </div>

      {clicked.left && clicked.right && (
        <SuccessOverlay 
          title="Muito Bem!" 
          desc="Você identificou os botões. Lembre-se: usaremos o botão ESQUERDO para quase tudo!" 
          buttonText="VAMOS EM FRENTE" 
          onComplete={onComplete} onRetry={onRetry} />
      )}
    </div>
  );
};

const MovementStage = ({ onComplete, onRetry }: StageProps) => {
  const [points, setPoints] = useState([
    { id: 1, x: 20, y: 20, hit: false },
    { id: 2, x: 80, y: 20, hit: false },
    { id: 3, x: 50, y: 50, hit: false },
    { id: 4, x: 20, y: 80, hit: false },
    { id: 5, x: 80, y: 80, hit: false },
  ]);

  const hitCount = points.filter(p => p.hit).length;

  return (
    <div className="h-full bg-yellow-50 flex flex-col p-6 md:p-10 relative overflow-hidden">
      <div className="text-center space-y-4 mb-8 md:mb-16">
        <h3 className="text-3xl md:text-4xl font-black text-yellow-900 uppercase">2. Movimento Suave</h3>
        <p className="text-xl md:text-2xl text-yellow-900 bg-yellow-100 p-4 md:p-6 rounded-2xl font-black border-4 border-yellow-300 shadow-sm max-w-2xl mx-auto">
          Mova a seta do mouse e passe por cima de cada círculo branco.
        </p>
      </div>

      <div className="flex-1 relative border-8 border-dashed border-yellow-200 rounded-[3rem] md:rounded-[4rem]">
        {points.map(p => (
          <motion.div
            key={p.id}
            onMouseEnter={() => setPoints(pts => pts.map(pt => pt.id === p.id ? {...pt, hit: true} : pt))}
            className={`absolute w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 scale-110 ${p.hit ? 'bg-green-500 text-white' : 'bg-white text-yellow-500'}`}
            style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {p.hit ? <CheckCircle2 size={32} /> : <div className="w-5 h-5 rounded-full border-4 border-yellow-100" />}
          </motion.div>
        ))}
      </div>

      {hitCount === points.length && (
        <SuccessOverlay 
          title="Excelente Controle!" 
          desc="Sua mão está firme e precisa. Agora vamos aprender a clicar." 
          buttonText="CONTINUAR" 
          onComplete={onComplete} onRetry={onRetry} />
      )}
    </div>
  );
};

const LightStage = ({ onComplete, onRetry }: StageProps) => {
  const [isOn, setIsOn] = useState(false);

  return (
    <div className="h-full bg-gray-900 flex flex-col items-center justify-center p-6 md:p-10 text-center space-y-6 md:space-y-10 overflow-y-auto">
      <div className="space-y-4">
        <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">3. Clique Simples</h3>
        <p className="text-xl md:text-2xl text-gray-800 bg-gray-200 p-4 md:p-6 rounded-2xl font-black border-4 border-gray-400 shadow-sm">
          Dê um clique no interruptor com o botão <b>ESQUERDO</b> para ligar a luz.
        </p>
      </div>

      <div className="relative flex flex-col items-center py-4">
        <motion.div 
          animate={{ opacity: isOn ? 1 : 0.2 }}
          className="text-yellow-400 mb-10 md:mb-16 relative"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 bg-yellow-400/20 rounded-full blur-3xl absolute -top-5 md:-top-10 -left-5 md:-left-10" />
          <Globe size={100} md:size={140} />
        </motion.div>

        <div className="relative">
          {!isOn && (
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute right-full mr-4 md:mr-8 top-1/2 -translate-y-1/2 flex items-center gap-2 md:gap-4 w-56 md:w-72 justify-end"
            >
              <span className="font-black text-xl md:text-3xl text-yellow-400 uppercase text-right leading-tight drop-shadow-lg">
                Clique aqui<br/>para ligar<br/>a luz
              </span>
              <ArrowRight size={32} md:size={48} className="text-yellow-400 drop-shadow-md" />
            </motion.div>
          )}
          <button 
            onClick={() => setIsOn(true)}
            className={`w-28 md:w-32 h-40 md:h-48 bg-white rounded-2xl border-b-[10px] md:border-b-[12px] border-gray-300 p-4 transition-all active:border-b-0 active:translate-y-2 flex flex-col justify-between items-center ${isOn ? 'bg-green-50' : 'bg-white'}`}
          >
             <div className={`w-14 md:w-16 h-1 bg-gray-200 rounded-full mt-2 md:mt-4 ${isOn ? 'bg-green-500' : ''}`} />
             <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-gray-100 flex items-center justify-center">
                <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${isOn ? 'bg-green-500 shadow-[0_0_15px_green]' : 'bg-gray-100'}`} />
             </div>
             <div className="font-black text-[10px] md:text-xs text-gray-400 mb-2 uppercase">Ligar</div>
          </button>
        </div>
      </div>

      {isOn && (
        <SuccessOverlay 
          title="Luz Ligada!" 
          desc="Um clique curto e rápido é tudo o que você precisa." 
          buttonText="PRÓXIMA LIÇÃO" 
          onComplete={onComplete} onRetry={onRetry} />
      )}
    </div>
  );
};

const BalloonStage = ({ onComplete, onRetry }: StageProps) => {
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState({ id: 1, x: 50, y: 50 });
  const total = 8;

  const next = () => {
    if (score + 1 < total) {
      setCurrent({ id: Date.now(), x: 15 + Math.random() * 70, y: 15 + Math.random() * 70 });
    }
    setScore(s => s + 1);
  };

  return (
    <div className="h-full bg-cyan-50 flex flex-col p-6 md:p-10 relative overflow-hidden">
      <div className="text-center space-y-4">
        <h3 className="text-3xl md:text-4xl font-black text-cyan-900 uppercase">4. Treino de Pontaria</h3>
        <p className="text-xl md:text-2xl text-cyan-900 bg-cyan-100 p-4 md:p-6 rounded-2xl font-black border-4 border-cyan-300 shadow-sm max-w-2xl mx-auto">
          Acerte os balões azuis! Eles vão ajudar você a clicar exatamente onde quer. {score}/{total}
        </p>
      </div>

      <div className="flex-1 relative mt-6 md:mt-10">
        {score < total && (
           <motion.div
             key={current.id}
             initial={{ scale: 0, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 2, opacity: 0 }}
             onClick={next}
             className="absolute w-20 h-20 md:w-24 md:h-24 bg-blue-500 rounded-full border-8 border-blue-700 shadow-2xl cursor-pointer flex items-center justify-center group"
             style={{ left: `${current.x}%`, top: `${current.y}%`, transform: 'translate(-50%, -50%)' }}
           >
              <div className="w-5 h-5 md:w-6 md:h-6 bg-white/40 rounded-full absolute top-4 md:top-6 left-4 md:left-6" />
           </motion.div>
        )}
      </div>

      {score >= total && (
        <SuccessOverlay 
          title="Grande Pontaria!" 
          desc="Você agora tem total controle sobre onde clica." 
          buttonText="CONTINUAR" 
          onComplete={onComplete} onRetry={onRetry} />
      )}
    </div>
  );
};

const OpenSiteStage = ({ onComplete, onRetry }: StageProps) => {
  const [isDone, setIsDone] = useState(false);

  return (
    <div className="h-full bg-indigo-50 flex flex-col items-center justify-center p-12 space-y-12">
       <div className="text-center space-y-4">
        <h3 className="text-4xl font-black text-indigo-900 uppercase">5. Navegando</h3>
        <p className="text-xl text-indigo-900 bg-indigo-100 p-6 rounded-2xl font-black border-4 border-indigo-300 shadow-sm">
          Para ver notícias ou vídeos, clique no botão azul escrito <b>"ABRIR GOOGLE"</b>.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-white p-2 overflow-hidden flex flex-col">
         <div className="bg-gray-100 p-4 border-b flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <div className="flex-1 bg-white rounded-full mx-4 h-6 animate-pulse" />
         </div>
         <div className="h-64 flex flex-col items-center justify-center p-10 gap-8">
            <span className="text-4xl font-black italic text-gray-300 uppercase tracking-tighter">Portal da Web</span>
            <button 
              onClick={() => setIsDone(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-black text-2xl shadow-xl hover:scale-105 transition-all"
            >
              ABRIR GOOGLE
            </button>
         </div>
      </div>

      {isDone && (
        <SuccessOverlay 
          title="Acesso Permitido!" 
          desc="Na internet, a maioria das coisas funciona com apenas um clique." 
          buttonText="PRÓXIMO" 
          onComplete={onComplete} onRetry={onRetry} />
      )}
    </div>
  );
};

const DoubleClickConceptStage = ({ onComplete, onRetry }: StageProps) => {
  const [isDone, setIsDone] = useState(false);
  const [lastClick, setLastClick] = useState(0);
  const [feedback, setFeedback] = useState('Experimente clicar');

  const handleManualClick = () => {
    const now = Date.now();
    if (now - lastClick < 400) {
      setIsDone(true);
      setFeedback('PERFEITO!');
    } else {
      setFeedback('Mais rápido!');
    }
    setLastClick(now);
  };

  return (
    <div className="h-full bg-rose-50 flex flex-col items-center justify-center p-12 space-y-12">
       <div className="text-center space-y-4">
        <h3 className="text-4xl font-black text-rose-900 uppercase tracking-tighter">6. O Clique Duplo</h3>
        <p className="text-2xl text-rose-900 bg-rose-100 p-4 rounded-2xl font-black border-4 border-rose-300 shadow-sm">
          Clique <b>DUAS VEZES</b> seguidas, bem rápido, no botão abaixo.
        </p>
      </div>

      <button 
        onClick={handleManualClick}
        className="w-64 h-64 bg-white rounded-full border-[12px] border-rose-200 shadow-2xl flex flex-col items-center justify-center gap-4 hover:border-rose-300 transition-all active:scale-95"
      >
         <MousePointerClick size={80} className="text-rose-500" />
         <span className="font-black text-rose-600 uppercase tracking-widest">{feedback}</span>
      </button>

      {isDone && (
        <SuccessOverlay 
          title="Ritmo Perfeito!" 
          desc="Esse é o 'tap-tap' que usamos para abrir pastas e arquivos." 
          buttonText="TESTAR NA PRÁTICA" 
          onComplete={onComplete} onRetry={onRetry} />
      )}
    </div>
  );
};

const OpenFolderStage = ({ onComplete, onRetry }: StageProps) => {
  const [isDone, setIsDone] = useState(false);

  return (
    <div className="h-full bg-amber-50 flex flex-col items-center justify-center p-12 space-y-12">
       <div className="text-center space-y-4">
        <h3 className="text-4xl font-black text-amber-900 uppercase">7. Abrindo Pastas</h3>
        <p className="text-2xl text-amber-900 bg-amber-100 p-6 rounded-2xl font-black border-4 border-amber-300 shadow-sm">
          Dê um <b>CLIQUE DUPLO</b> rápido na pasta abaixo para ver o que tem dentro.
        </p>
      </div>

      <div 
        onDoubleClick={() => setIsDone(true)}
        className="group cursor-pointer flex flex-col items-center gap-6 p-10 hover:bg-white rounded-[3rem] transition-all"
      >
         <Folder size={160} className="text-amber-500 fill-amber-200 group-hover:scale-110 transition-transform" />
         <span className="text-3xl font-black text-amber-900 uppercase tracking-tighter">Minhas Fotos</span>
      </div>

      {isDone && (
        <SuccessOverlay 
          title="Pasta Aberta!" 
          desc="Você agora sabe como entrar em pastas no computador." 
          buttonText="PRÓXIMO" 
          onComplete={onComplete} onRetry={onRetry} />
      )}
    </div>
  );
};

const OpenDocumentStage = ({ onComplete, onRetry }: StageProps) => {
  const [isDone, setIsDone] = useState(false);

  return (
    <div className="h-full bg-blue-50 flex flex-col items-center justify-center p-12 space-y-12">
       <div className="text-center space-y-4">
        <h3 className="text-4xl font-black text-blue-900 uppercase">8. Acessando Documentos</h3>
        <p className="text-2xl text-blue-900 bg-blue-100 p-6 rounded-2xl font-black border-4 border-blue-300 shadow-sm">
          O <b>CLIQUE DUPLO</b> também serve para abrir seus textos. Abra o arquivo abaixo.
        </p>
      </div>

      <div 
        onDoubleClick={() => setIsDone(true)}
        className="group cursor-pointer flex flex-col items-center gap-6 p-10 hover:bg-white rounded-[3rem] transition-all"
      >
         <FileText size={160} className="text-blue-600 group-hover:scale-110 transition-transform" />
         <span className="text-3xl font-black text-blue-900 uppercase tracking-tighter">CARTA.DOC</span>
      </div>

      {isDone && (
        <SuccessOverlay 
          title="Arquivo Aberto!" 
          desc="Tudo o que tem um nome na tela pode ser aberto assim." 
          buttonText="CONTINUAR" 
          onComplete={onComplete} onRetry={onRetry} />
      )}
    </div>
  );
};

const RightMenuStage = ({ onComplete, onRetry }: StageProps) => {
  const [show, setShow] = useState<{x: number, y: number} | null>(null);
  const [isDone, setIsDone] = useState(false);

  return (
     <div className="h-full bg-purple-50 flex flex-col p-12 items-center justify-center relative overflow-hidden" onClick={() => setShow(null)}>
        <div className="text-center space-y-4 z-10">
          <h3 className="text-4xl font-black text-purple-900 uppercase">9. Menu de Opções</h3>
          <p className="text-2xl text-purple-900 bg-purple-100 p-6 rounded-2xl font-black border-4 border-purple-300 shadow-sm">
            Clique com o botão <b>DIREITO</b> no desenho abaixo e escolha a primeira opção.
          </p>
        </div>

        <div 
          onContextMenu={(e) => { e.preventDefault(); setShow({x: e.clientX, y: e.clientY}) }}
          className="mt-12 bg-white p-16 rounded-[4rem] shadow-xl border-4 border-purple-200 cursor-help flex flex-col items-center gap-6"
        >
           <Monitor size={120} className="text-purple-600" />
           <span className="font-black text-purple-900 uppercase italic">Clique Direito Aqui</span>
        </div>

        <AnimatePresence>
          {show && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="fixed bg-white shadow-2xl rounded-2xl border border-gray-100 py-4 w-64 z-[999]"
              style={{ top: show.y, left: show.x }}
            >
               <div onClick={() => setIsDone(true)} className="px-6 py-4 hover:bg-purple-600 hover:text-white cursor-pointer font-black border-b border-gray-50 flex items-center gap-4">
                  <CheckCircle2 size={24} /> FAZER TAREFA
               </div>
               <div className="px-6 py-3 text-gray-300 cursor-not-allowed">Outra Opção</div>
               <div className="px-6 py-3 text-gray-300 cursor-not-allowed">Configurações</div>
            </motion.div>
          )}
        </AnimatePresence>

        {isDone && (
          <SuccessOverlay 
            title="Boa!" 
            desc="O botão direito abre uma lista de coisas que você pode fazer com aquele item." 
            buttonText="PRÓXIMO" 
            onComplete={onComplete} onRetry={onRetry} />
        )}
     </div>
  );
};

const CopyStage = ({ onComplete, onRetry }: StageProps) => {
  const [show, setShow] = useState<{x: number, y: number} | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  return (
     <div className="h-full bg-slate-50 flex flex-col p-12 items-center justify-center relative overflow-hidden" onClick={() => setShow(null)}>
        <div className="text-center space-y-4 z-10">
          <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">10. Copiar</h3>
          <p className="text-2xl text-slate-900 bg-slate-100 p-6 rounded-2xl font-black border-4 border-slate-300 shadow-sm">
            Clique com o botão <b>DIREITO</b> no texto e escolha <b>"COPIAR"</b>.
          </p>
        </div>

        <div 
          onContextMenu={(e) => { e.preventDefault(); setShow({x: e.clientX, y: e.clientY}) }}
          className="mt-12 bg-white px-12 py-8 rounded-3xl shadow-lg border-2 border-slate-200 cursor-copy flex flex-col items-center gap-4"
        >
           <FileText size={48} className="text-blue-500" />
           <span className="text-2xl font-black text-slate-800">MEU TEXTO</span>
        </div>

        <AnimatePresence>
          {show && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="fixed bg-white shadow-2xl rounded-2xl border border-gray-100 py-3 w-56 z-[999]"
              style={{ top: show.y, left: show.x }}
            >
               <div onClick={() => setIsCopied(true)} className="px-6 py-4 hover:bg-blue-600 hover:text-white cursor-pointer font-black flex items-center gap-4">
                  <Copy size={20} /> COPIAR
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isCopied && (
          <SuccessOverlay 
            title="Copiado!" 
            desc="Agora o computador guardou uma cópia deste item na memória dele." 
            buttonText="VOLTAR AO ÍNDICE" 
            onComplete={onComplete} onRetry={onRetry} />
        )}
     </div>
  );
};

const TrashStage = ({ onComplete, onRetry }: StageProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const trashRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full bg-red-50 flex flex-col items-center justify-center p-12 space-y-12 overflow-hidden">
      <div className="text-center space-y-4">
        <h3 className="text-4xl font-black text-red-900 uppercase">11. Descartando</h3>
        <p className="text-2xl text-red-900 bg-red-100 p-6 rounded-2xl font-black border-4 border-red-300 shadow-sm">
          Arraste o lixo até a <b>LIXEIRA</b> para limpar sua mesa.
        </p>
      </div>

      <div className="flex-1 w-full flex items-center justify-around">
        <motion.div 
          drag
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(_, info) => {
             setIsDragging(false);
             if (trashRef.current) {
                const rect = trashRef.current.getBoundingClientRect();
                if (info.point.x >= rect.left && info.point.x <= rect.right && info.point.y >= rect.top && info.point.y <= rect.bottom) {
                   setIsDone(true);
                }
             }
          }}
          className={`p-8 bg-white border-4 border-gray-100 rounded-3xl shadow-xl flex flex-col items-center gap-4 cursor-grab active:cursor-grabbing z-50 ${isDragging ? 'rotate-6 scale-110' : ''}`}
        >
           <FileText size={64} className="text-gray-400" />
           <span className="font-bold text-gray-500 uppercase tracking-tighter">Papel Velho</span>
        </motion.div>

        <div 
          ref={trashRef}
          className={`p-16 rounded-[4rem] border-8 border-dashed transition-all ${isDragging ? 'border-red-400 bg-red-100/50 scale-110' : 'border-gray-200 bg-gray-50 opacity-40'}`}
        >
           <Trash2 size={120} className={`${isDragging ? 'text-red-600 fill-red-200 animate-pulse' : 'text-gray-300'}`} />
        </div>
      </div>

      {isDone && (
        <SuccessOverlay 
          title="Tudo Limpo!" 
          desc="Arrastar e soltar na lixeira é a forma mais segura de apagar arquivos." 
          buttonText="CONTINUAR" 
          onComplete={onComplete} onRetry={onRetry} />
      )}
    </div>
  );
};

const OrganizeStage = ({ onComplete, onRetry }: StageProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full bg-orange-50 flex flex-col items-center justify-center p-12 space-y-12 overflow-hidden">
      <div className="text-center space-y-4">
        <h3 className="text-4xl font-black text-orange-900 uppercase">12. Organizando</h3>
        <p className="text-2xl text-orange-900 bg-orange-100 p-6 rounded-2xl font-black border-4 border-orange-300 shadow-sm">
           Coloque o contrato dentro da pasta <b>"DOCUMENTOS"</b>.
        </p>
      </div>

      <div className="flex-1 w-full flex items-center justify-around">
        <motion.div 
          drag
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(_, info) => {
             setIsDragging(false);
             if (targetRef.current) {
                const rect = targetRef.current.getBoundingClientRect();
                if (info.point.x >= rect.left && info.point.x <= rect.right && info.point.y >= rect.top && info.point.y <= rect.bottom) {
                   setIsDone(true);
                }
             }
          }}
          className={`p-8 bg-white border-4 border-blue-100 rounded-3xl shadow-xl flex flex-col items-center gap-4 cursor-grab active:cursor-grabbing z-50 ${isDragging ? 'scale-110' : ''}`}
        >
           <FileText size={64} className="text-blue-500" />
           <span className="font-black text-gray-800 uppercase tracking-tighter">Contrato</span>
        </motion.div>

        <div 
          ref={targetRef}
          className={`p-16 rounded-[4rem] border-8 border-dashed transition-all ${isDragging ? 'border-orange-500 bg-orange-100 scale-110' : 'border-gray-200 bg-gray-50 opacity-40'}`}
        >
           <Folder size={120} className={`${isDragging ? 'text-orange-500 fill-orange-200 animate-pulse' : 'text-gray-300'}`} />
           <span className="font-black text-orange-900 mt-4 block">DOCUMENTOS</span>
        </div>
      </div>

      {isDone && (
        <SuccessOverlay 
          title="Organizado!" 
          desc="Agora você sabe mover qualquer coisa na tela do computador." 
          buttonText="VAMOS PRO ROLO" 
          onComplete={onComplete} onRetry={onRetry} />
      )}
    </div>
  );
};

const ScrollDownStage = ({ onComplete, onRetry }: StageProps) => {
  const [reachedBottom, setReachedBottom] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const checkScroll = (e: React.UIEvent) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setReachedBottom(true);
    }
  };

  return (
    <div className="h-full bg-emerald-50 flex flex-col p-12 space-y-8 overflow-hidden">
      <div className="text-center space-y-2">
        <h3 className="text-4xl font-black text-emerald-900 uppercase">13. Rodinha do Mouse</h3>
        <p className="text-2xl text-emerald-900 bg-emerald-100 p-6 rounded-2xl font-black border-4 border-emerald-300 shadow-sm">
           Use a rodinha (meio do mouse) para <b>DESCER</b> esta página até o fim.
        </p>
      </div>

      <div 
        onScroll={checkScroll}
        className="flex-1 bg-white rounded-[3rem] border-4 border-emerald-100 overflow-y-auto p-12 space-y-20 custom-scrollbar shadow-inner"
      >
          <div className="h-64 bg-gray-50 rounded-3xl flex items-center justify-center text-4xl font-black text-gray-200">INÍCIO DA PÁGINA</div>
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-40 bg-gray-50 rounded-3xl flex items-center p-8 gap-8">
               <div className="w-20 h-2 bg-gray-200 rounded-full" />
               <div className="flex-1 space-y-4">
                  <div className="w-1/2 h-4 bg-gray-100 rounded-full" />
                  <div className="w-full h-2 bg-gray-100 rounded-full" />
               </div>
            </div>
          ))}
          <div className="h-64 bg-emerald-100 rounded-3xl flex items-center justify-center text-4xl font-black text-emerald-600">CHEGOU AO FIM!</div>
      </div>

       {reachedBottom && (
        <SuccessOverlay 
          title="Grande Viagem!" 
          desc="A rodinha ajuda a ler textos longos sem precisar clicar em nada." 
          buttonText="SUBIR DE VOLTA" 
          onComplete={onComplete} onRetry={onRetry} />
      )}
    </div>
  );
};

const ScrollUpStage = ({ onComplete, onRetry }: StageProps) => {
  const [reachedTop, setReachedTop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const checkScroll = (e: React.UIEvent) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop <= 10) {
      setReachedTop(true);
    }
  };

  return (
    <div className="h-full bg-emerald-50 flex flex-col p-12 space-y-8 overflow-hidden">
      <div className="text-center space-y-2">
        <h3 className="text-4xl font-black text-emerald-900 uppercase">14. Voltando ao Topo</h3>
        <p className="text-2xl text-emerald-900 bg-emerald-100 p-6 rounded-2xl font-black border-4 border-emerald-300 shadow-sm">
           Agora use a rodinha para <b>SUBIR</b> até o começo da página.
        </p>
      </div>

      <div 
        onScroll={checkScroll}
        className="flex-1 bg-white rounded-[3rem] border-4 border-emerald-100 overflow-y-auto p-12 space-y-20 custom-scrollbar shadow-inner"
      >
          <div className="h-64 bg-emerald-100 rounded-3xl flex items-center justify-center text-4xl font-black text-emerald-600">VOLTAR DAQUI!</div>
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-40 bg-gray-50 rounded-3xl flex items-center p-8 gap-8">
               <div className="w-20 h-2 bg-gray-200 rounded-full" />
               <div className="flex-1 space-y-4">
                  <div className="w-1/2 h-4 bg-gray-200 rounded-full" />
                  <div className="w-full h-2 bg-gray-200 rounded-full" />
               </div>
            </div>
          ))}
          <div className="h-64 bg-gray-50 rounded-3xl flex items-center justify-center text-4xl font-black text-gray-200">ESTAMOS NO TOPO!</div>
      </div>

       {reachedTop && (
        <SuccessOverlay 
          title="Missão Cumprida!" 
          desc="Você domina a navegação por páginas inteiras agora." 
          buttonText="PRÓXIMO" 
          onComplete={onComplete} onRetry={onRetry} />
      )}
    </div>
  );
};

const MinimizeStage = ({ onComplete, onRetry }: StageProps) => {
  const [isDone, setIsDone] = useState(false);

  return (
    <div className="h-full bg-stone-100 flex flex-col items-center justify-center p-12 space-y-12">
      <div className="text-center space-y-4">
        <h3 className="text-4xl font-black text-stone-900 uppercase">15. Escondendo Janelas</h3>
        <p className="text-2xl text-stone-900 bg-stone-100 p-6 rounded-2xl font-black border-4 border-stone-300 shadow-sm">
           Clique no tracinho <b>"–" (Minimizar)</b> no canto superior direito da janela abaixo para escondê-la.
        </p>
      </div>

      <motion.div 
        animate={{ scale: isDone ? 0 : 1, opacity: isDone ? 0 : 1 }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-stone-200 overflow-hidden flex flex-col"
      >
         <div className="bg-stone-800 p-4 flex items-center justify-between">
            <span className="text-white font-black text-xs uppercase tracking-widest px-4">Sua Janela</span>
            <div className="flex gap-2 pr-2">
               <button onClick={() => setIsDone(true)} className="w-10 h-10 hover:bg-white/10 rounded flex items-center justify-center text-white transition-colors">
                  <Minus size={24} />
               </button>
               <div className="w-10 h-10 opacity-30 flex items-center justify-center text-white"><Square size={16} /></div>
               <div className="w-10 h-10 opacity-30 flex items-center justify-center text-white font-black">X</div>
            </div>
         </div>
         <div className="h-48 p-12 space-y-4">
            <div className="w-3/4 h-2 bg-stone-100 rounded-full" />
            <div className="w-full h-2 bg-stone-100 rounded-full" />
            <div className="w-1/2 h-2 bg-stone-100 rounded-full" />
         </div>
      </motion.div>

      {isDone && (
        <SuccessOverlay 
          title="Escondido!" 
          desc="Isso serve para deixar a tela limpa sem fechar o seu trabalho." 
          buttonText="AUMENTAR JANELA" 
          onComplete={onComplete} onRetry={onRetry} />
      )}
    </div>
  );
};

const MaximizeStage = ({ onComplete, onRetry }: StageProps) => {
  const [isDone, setIsDone] = useState(false);

  return (
    <div className="h-full bg-stone-100 flex flex-col items-center justify-center p-12 space-y-12">
      <div className="text-center space-y-4">
        <h3 className="text-4xl font-black text-stone-900 uppercase">16. Tela Cheia</h3>
        <p className="text-2xl text-stone-900 bg-stone-100 p-6 rounded-2xl font-black border-4 border-stone-300 shadow-sm">
           Clique no quadradinho <b>"▢" (Maximizar)</b> (o símbolo de quadrado no canto direito) para que a janela ocupe todo o espaço.
        </p>
      </div>

      <motion.div 
        animate={{ width: isDone ? '100%' : '50%', height: isDone ? '100%' : '200px' }}
        className="bg-white rounded-3xl shadow-2xl border-2 border-stone-200 overflow-hidden flex flex-col transition-all duration-700"
      >
         <div className="bg-stone-800 p-4 flex items-center justify-between">
            <span className="text-white font-black text-xs uppercase tracking-widest px-4">Janela Pequena</span>
            <div className="flex gap-2 pr-2">
               <div className="w-10 h-10 opacity-30 flex items-center justify-center text-white"><Minus size={24} /></div>
               <button onClick={() => setIsDone(true)} className="w-10 h-10 hover:bg-white/10 rounded flex items-center justify-center text-white transition-colors">
                  <Square size={20} />
               </button>
               <div className="w-10 h-10 opacity-30 flex items-center justify-center text-white font-black">X</div>
            </div>
         </div>
         <div className="p-12 space-y-4">
            <div className="w-3/4 h-2 bg-stone-100 rounded-full" />
         </div>
      </motion.div>

      {isDone && (
        <SuccessOverlay 
          title="Visão Ampla!" 
          desc="Maximizar facilita a leitura e o uso dos programas." 
          buttonText="FECHAR TUDO" 
          onComplete={onComplete} onRetry={onRetry} />
      )}
    </div>
  );
};

const CloseStage = ({ onComplete, onRetry }: StageProps) => {
  const [isDone, setIsDone] = useState(false);

  return (
    <div className="h-full bg-red-900 flex flex-col items-center justify-center p-12 space-y-12">
      <div className="text-center space-y-4">
        <h3 className="text-4xl font-black text-white uppercase">17. Encerrar</h3>
        <p className="text-2xl text-white bg-red-800 p-6 rounded-2xl font-black border-4 border-red-500 shadow-sm">
           O botão <b>"X"</b> no canto de cima fecha o programa definitivamente. Clique nele.
        </p>
      </div>

      <motion.div 
        animate={{ opacity: isDone ? 0 : 1, scale: isDone ? 0.8 : 1 }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
      >
         <div className="bg-gray-100 p-4 flex items-center justify-between">
            <span className="text-gray-400 font-black text-xs uppercase tracking-widest px-4">Terminar Tarefa</span>
            <div className="flex gap-2 pr-2">
               <div className="w-10 h-10 opacity-30 flex items-center justify-center text-gray-400"><Minus size={24} /></div>
               <div className="w-10 h-10 opacity-30 flex items-center justify-center text-gray-400"><Square size={16} /></div>
               <button onClick={() => setIsDone(true)} className="w-12 h-10 bg-red-100 hover:bg-red-600 group rounded flex items-center justify-center text-red-600 transition-all">
                  <X size={24} className="group-hover:text-white" />
               </button>
            </div>
         </div>
         <div className="h-48 p-12 flex items-center justify-center text-gray-200">
            <Monitor size={100} />
         </div>
      </motion.div>

      {isDone && (
        <SuccessOverlay 
          title="Finalizado!" 
          desc="Sempre que terminar de usar algo, clique no X para economizar energia." 
          buttonText="LIÇÕES FINAIS" 
          onComplete={onComplete} onRetry={onRetry} />
      )}
    </div>
  );
};

const SelectionStage = ({ onComplete, onRetry }: StageProps) => {
  const [isDone, setIsDone] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [rect, setRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const start = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return;
    setIsSelecting(true);
    setRect({ x: e.clientX - box.left, y: e.clientY - box.top, w: 0, h: 0 });
  };

  const move = (e: React.MouseEvent) => {
    if (!isSelecting || !containerRef.current) return;
    const box = containerRef.current.getBoundingClientRect();
    setRect(r => ({ ...r, w: e.clientX - box.left - r.x, h: e.clientY - box.top - r.y }));
  };

  const end = () => {
    if (Math.abs(rect.w) > 100 && Math.abs(rect.h) > 80) {
      setIsDone(true);
    }
    setIsSelecting(false);
  };

  return (
    <div className="h-full bg-slate-100 flex flex-col p-12 space-y-12">
      <div className="text-center space-y-4">
        <h3 className="text-4xl font-black text-slate-900 uppercase">18. Seleção em Bloco</h3>
        <p className="text-2xl text-slate-900 bg-slate-100 p-6 rounded-2xl font-black border-4 border-slate-300 shadow-sm">
           Pressione o botão <b>ESQUERDO</b> do mouse (e segure) no espaço em branco, depois <b>ARRASTE</b> a seta para desenhar um quadrado azul e selecionar os itens.
        </p>
      </div>

      <div 
        ref={containerRef}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        className="flex-1 bg-white rounded-[4rem] relative cursor-crosshair overflow-hidden border-8 border-white shadow-2xl grid grid-cols-4 gap-12 p-20"
      >
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="flex flex-col items-center gap-4 select-none drop-shadow-sm touch-none">
               <Folder size={80} className="text-yellow-500 fill-yellow-200 pointer-events-none" />
               <span className="bg-gray-100 px-4 py-1.5 rounded-full font-black text-gray-700 pointer-events-none">Item {i}</span>
            </div>
          ))}

          {isSelecting && (
            <div 
              className="absolute bg-blue-600/20 border-2 border-blue-600 transition-none pointer-events-none"
              style={{ 
                left: rect.w >= 0 ? rect.x : rect.x + rect.w,
                top: rect.h >= 0 ? rect.y : rect.y + rect.h,
                width: Math.abs(rect.w),
                height: Math.abs(rect.h)
              }}
            />
          )}
      </div>

      {isDone && (
        <SuccessOverlay 
          title="Ótimo Trabalho!" 
          desc="Isso ajuda a selecionar vários arquivos de uma vez só." 
          buttonText="CONTINUAR" 
          onComplete={onComplete} onRetry={onRetry} />
      )}
    </div>
  );
};

const BackButtonStage = ({ onComplete, onRetry }: StageProps) => {
  const [isDone, setIsDone] = useState(false);

  return (
    <div className="h-full bg-gray-50 flex flex-col items-center justify-center p-12 space-y-12">
      <div className="text-center space-y-4">
        <h3 className="text-4xl font-black text-gray-900 uppercase">19. Voltando no Tempo</h3>
        <p className="text-2xl text-gray-900 bg-gray-200 p-6 rounded-2xl font-black border-4 border-gray-400 shadow-sm">
           No navegador, clique na <b>SETA PARA A ESQUERDA</b> (voltar) para retornar à página anterior.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-white flex flex-col overflow-hidden">
         <div className="p-4 bg-gray-100 border-b flex items-center gap-6">
            <button 
              onClick={() => setIsDone(true)}
              className="p-3 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-all shadow-md active:scale-95"
            >
               <ArrowLeft size={32} />
            </button>
            <div className="flex-1 bg-white rounded-xl h-10 flex items-center px-4 text-gray-300 font-medium">www.google.com.br/fotos</div>
         </div>
         <div className="h-64 p-12 bg-white flex flex-col items-center justify-center gap-6 opacity-30">
            <Globe size={80} />
            <span className="font-bold">PÁGINA DE FOTOS</span>
         </div>
      </div>

      {isDone && (
        <SuccessOverlay 
          title="Você Voltou!" 
          desc="Esse é um dos botões mais importantes da internet. Nunca tenha medo de errar!" 
          buttonText="DESAFIO FINAL" 
          onComplete={onComplete} onRetry={onRetry} />
      )}
    </div>
  );
};

const QuizStage = ({ onComplete, onRetry }: StageProps) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [finished, setFinished] = useState(false);

  const questions = [
    {
      q: "Qual botão do mouse usamos para clicar na maioria das coisas?",
      options: ["Botão Esquerdo", "Botão Direito", "Rodinha (Scroll)"],
      correct: 0,
      icon: <MousePointerClick size={80} className="text-blue-600" />,
      explanation: "O botão esquerdo é o 'clique principal' para selecionar e abrir tudo."
    },
    {
      q: "Para que serve a rodinha (scroll) no meio do mouse?",
      options: ["Aumentar o volume", "Subir e descer páginas", "Desligar o computador"],
      correct: 1,
      icon: <div className="relative"><Mouse size={80} className="text-gray-400" /><div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-6 bg-blue-500 rounded-full animate-bounce" /></div>,
      explanation: "A rodinha facilita a leitura de textos longos e sites."
    },
    {
      q: "O que o 'Clique Duplo' (dois cliques rápidos) geralmente faz?",
      options: ["Apaga um arquivo", "Abre pastas e programas", "Muda a cor da tela"],
      correct: 1,
      icon: <Folder size={80} className="text-amber-500 fill-amber-200" />,
      explanation: "Dois cliques rápidos 'entram' em pastas ou iniciam aplicativos."
    },
    {
      q: "Qual botão abre um menu de opções extras (como Copiar ou Excluir)?",
      options: ["Botão Esquerdo", "Botão Meio", "Botão Direito"],
      correct: 2,
      icon: <Layout size={80} className="text-purple-600" />,
      explanation: "O botão direito é como um 'atalho' para ver o que podemos fazer com um item."
    },
    {
      q: "Como chamamos a ação de segurar um item e movê-lo para outro lugar?",
      options: ["Teletransporte", "Arrastar e Soltar", "Copia e Cola"],
      correct: 1,
      icon: <Move size={80} className="text-orange-500" />,
      explanation: "Você clica, segura e solta onde quiser. É a base da organização."
    },
    {
      q: "Onde fica o botão para fechar uma janela (o X)?",
      options: ["Canto inferior esquerdo", "No meio da tela", "Canto superior direito"],
      correct: 2,
      icon: <div className="bg-red-500 p-4 rounded-xl text-white"><X size={60} /></div>,
      explanation: "O X vermelho no canto é o padrão para encerrar programas."
    },
    {
      q: "O que acontece ao clicar no botão de 'Minimizar' (o tracinho)?",
      options: ["A janela some para a barra de tarefas", "O computador desliga", "A janela fica gigante"],
      correct: 0,
      icon: <Minus size={80} className="text-gray-600" />,
      explanation: "Minimizar esconde a janela sem fechá-la, permitindo abri-la depois."
    },
    {
      q: "Quando a seta do mouse vira uma 'mãozinha', o que isso significa?",
      options: ["O mouse está quebrado", "Dá para clicar ali (é um link ou botão)", "O computador está cansado"],
      correct: 1,
      icon: <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity }}><Hand size={80} className="text-blue-500" /></motion.div>,
      explanation: "A mãozinha indica interatividade em sites e aplicativos."
    },
    {
      q: "Para selecionar vários arquivos de uma vez, fazemos uma seleção em:",
      options: ["Círculo", "Bloco (ou Quadrado)", "Triângulo"],
      correct: 1,
      icon: <div className="border-4 border-dashed border-blue-400 p-6 rounded-xl"><div className="grid grid-cols-2 gap-2"><div className="w-8 h-8 bg-gray-200 rounded" /><div className="w-8 h-8 bg-gray-200 rounded" /></div></div>,
      explanation: "Clicar no vazio e arrastar cria um quadro de seleção múltipla."
    },
    {
      q: "Qual a melhor forma de segurar o mouse?",
      options: ["Apertando com muita força", "Com a mão leve e relaxada", "Usando as duas mãos"],
      correct: 1,
      icon: <img src="/ia_images/quiz_hand_correct.png" className="w-full h-full object-contain p-4" />,
      explanation: "Mãos relaxadas evitam cansaço e dão mais precisão."
    },
    {
      q: "O que o cursor do mouse faz quando o computador está 'pensando'?",
      options: ["Fica piscando", "Vira uma ampulheta ou círculo girando", "Fica gigante"],
      correct: 1,
      icon: <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" />,
      explanation: "O ícone de espera avisa que o computador está processando uma tarefa."
    },
    {
      q: "Para 'Copiar' algo guardando na memória, usamos qual menu?",
      options: ["Menu do botão esquerdo", "Menu do botão direito", "Menu da rodinha"],
      correct: 1,
      icon: <Copy size={80} className="text-indigo-600" />,
      explanation: "Clicar com o direito abre o menu onde encontramos o 'Copiar'."
    },
    {
      q: "Onde os arquivos apagados vão parar antes de sumirem de vez?",
      options: ["Pasta de Fotos", "Lixeira", "Disco Rígido"],
      correct: 1,
      icon: <Trash2 size={80} className="text-red-500" />,
      explanation: "A lixeira é um lugar temporário para arquivos que não queremos mais."
    },
    {
      q: "Em um site, se você clicar em uma imagem e nada acontecer, você deve:",
      options: ["Tentar clique duplo", "Desistir do site", "Reiniciar o computador"],
      correct: 0,
      icon: <MousePointer2 size={80} className="text-gray-400" />,
      explanation: "Às vezes, um clique duplo ou um clique mais firme resolve o problema."
    },
    {
        q: "Como chamamos a setinha que movemos na tela com o mouse?",
        options: ["Seta Mágica", "Cursor", "Ponteiro de Laser"],
        correct: 1,
        icon: <img src="/ia_images/quiz_cursors_bg.png" className="w-full h-full object-contain p-4" />,
        explanation: "Cursor ou Ponteiro são os nomes técnicos da seta do mouse."
    },
    {
        q: "Para que serve o botão de 'Maximizar' (o quadradinho)?",
        options: ["Limpar a tela", "Fazer a janela ocupar a tela toda", "Trocar a foto de fundo"],
        correct: 1,
        icon: <Square size={80} className="text-blue-600" />,
        explanation: "Maximizar ajuda a enxergar melhor o conteúdo de um programa."
    },
    {
        q: "Se o cursor travar e não mover, qual o primeiro teste a fazer?",
        options: ["Comprar um computador novo", "Verificar se o fio está conectado ou se tem pilha", "Limpar o monitor"],
        correct: 1,
        icon: <div className="flex flex-col items-center gap-2"><Mouse size={60} /><div className="w-1 h-10 bg-gray-300 rounded-full" /></div>,
        explanation: "Muitos problemas de mouse são apenas mau contato ou falta de energia."
    },
    {
        q: "Ao navegar na internet, o que a seta para a esquerda faz?",
        options: ["Apaga o texto", "Volta para a página anterior", "Fecha o navegador"],
        correct: 1,
        icon: <ArrowLeft size={80} className="text-blue-600" />,
        explanation: "O botão 'Voltar' é essencial para navegar entre os sites visitados."
    },
    {
        q: "O clique com o botão direito em um espaço vazio da área de trabalho serve para:",
        options: ["Desligar tudo", "Personalizar ou organizar a tela", "Criar um desenho"],
        correct: 1,
        icon: <Monitor size={80} className="text-teal-600" />,
        explanation: "Mesmo no vazio, o botão direito oferece opções de organização."
    },
    {
        q: "Qual dessas tarefas NÃO é feita pelo mouse?",
        options: ["Mover pastas", "Clicar em botões", "Digitar textos longos"],
        correct: 2,
        icon: <div className="p-4 bg-gray-100 rounded-2xl"><div className="w-20 h-10 border-b-4 border-gray-400" /></div>,
        explanation: "Para digitar textos longos, usamos o Teclado. O mouse guia e aponta."
    }
  ];

  const handleAnswer = (idx: number) => {
    if (showFeedback !== 'none') return;
    
    if (idx === questions[currentQ].correct) {
      setScore(s => s + 1);
      setShowFeedback('correct');
    } else {
      setShowFeedback('wrong');
    }

    setTimeout(() => {
      setShowFeedback('none');
      if (currentQ < questions.length - 1) {
        setCurrentQ(c => c + 1);
      } else {
        setFinished(true);
      }
    }, 2500);
  };

  if (finished) {
    return (
      <div className="h-full bg-blue-900 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"><img src="/ia_images/quiz_bg.png" className="w-full h-full object-cover" /></div>
        <div className="z-10 text-center space-y-8">
           <Trophy size={120} className="text-yellow-400 mx-auto animate-bounce" />
           <div className="space-y-4">
              <h2 className="text-6xl font-black italic tracking-tighter uppercase">Quiz Concluído!</h2>
              <p className="text-3xl font-medium text-blue-200">Você acertou <span className="text-yellow-400 text-5xl font-black">{score}</span> de {questions.length} perguntas.</p>
           </div>
           
           <div className="flex gap-6 justify-center">
              <button 
                onClick={() => { setFinished(false); setCurrentQ(0); setScore(0); }}
                className="bg-white/10 hover:bg-white/20 px-8 py-5 rounded-2xl font-black text-xl transition-all"
              >
                TENTAR NOVAMENTE
              </button>
              <button 
                onClick={onComplete}
                className="bg-blue-600 hover:bg-blue-700 px-12 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all"
              >
                FINALIZAR CURSO <ArrowRight size={24} className="inline ml-2" />
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
           className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
         />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row h-full">
         <div className="lg:w-1/2 flex flex-col p-8 lg:p-16 justify-center space-y-10 bg-gray-50/50">
            <div className="space-y-4">
               <span className="text-blue-600 font-bold tracking-widest text-sm uppercase">Pergunta {currentQ + 1} de {questions.length}</span>
               <h3 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                  {questions[currentQ].q}
               </h3>
            </div>

            <div className="bg-white p-12 rounded-[3rem] shadow-xl border-4 border-white flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-40 transition-opacity" />
               <div className="relative z-10 transition-transform group-hover:scale-110 duration-500">
                {questions[currentQ].icon}
               </div>
            </div>
         </div>

         <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center space-y-4 bg-white relative">
            {questions[currentQ].options.map((opt, idx) => (
              <button 
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-6 rounded-3xl font-black text-lg md:text-xl transition-all flex items-center justify-between group h-24 border-2 ${
                  showFeedback === 'none' 
                    ? 'border-gray-100 hover:border-blue-500 hover:bg-blue-50/30 active:scale-95' 
                    : idx === questions[currentQ].correct
                      ? 'border-green-500 bg-green-50 text-green-700 scale-105 shadow-lg'
                      : showFeedback === 'wrong' && questions[currentQ].correct !== idx
                        ? 'border-red-200 bg-red-50 text-red-300 opacity-60'
                        : 'border-gray-100 opacity-50'
                }`}
              >
                 <div className="flex items-center gap-6">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-colors ${
                      showFeedback === 'none' 
                        ? 'bg-gray-100 text-gray-400 group-hover:bg-blue-500 group-hover:text-white'
                        : idx === questions[currentQ].correct
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-300'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                 </div>
                 {showFeedback !== 'none' && idx === questions[currentQ].correct && <CheckCircle2 className="text-green-500" />}
              </button>
            ))}

            <AnimatePresence>
              {showFeedback !== 'none' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mt-10 p-6 rounded-2xl border-2 flex items-center gap-5 ${showFeedback === 'correct' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${showFeedback === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {showFeedback === 'correct' ? <CheckCircle2 size={24} /> : <X size={24} />}
                  </div>
                  <div className="space-y-1">
                     <p className="font-black text-lg">{showFeedback === 'correct' ? 'Resposta Correta!' : 'Quase lá...'}</p>
                     <p className="text-sm font-medium opacity-80">{questions[currentQ].explanation}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
};


const MemoryGameStage = ({ onComplete }: StageProps) => {
  const ICON_SET = [
    { type: 'FOLDER', icon: <Folder size={40} className="text-yellow-500" />, label: 'Criar Pasta' },
    { type: 'TRASH', icon: <Trash2 size={40} className="text-red-500" />, label: 'Apagar' },
    { type: 'CLOSE', icon: <X size={40} className="text-red-600" />, label: 'Fechar' },
    { type: 'MAXIMIZE', icon: <Square size={40} className="text-blue-500" />, label: 'Maximizar' },
    { type: 'MINIMIZE', icon: <Minus size={40} className="text-gray-500" />, label: 'Minimizar' },
    { type: 'COPY', icon: <Copy size={40} className="text-indigo-500" />, label: 'Copiar' },
    { type: 'PASTE', icon: <Clipboard size={40} className="text-green-500" />, label: 'Colar' },
    { type: 'MOUSE', icon: <Mouse size={40} className="text-blue-600" />, label: 'Mouse' },
    { type: 'CLICK', icon: <MousePointerClick size={40} className="text-blue-400" />, label: 'Clicar' },
    { type: 'MENU', icon: <Monitor size={40} className="text-teal-500" />, label: 'Menu de Opções' },
  ];

  const [cards, setCards] = useState(() => {
    const pairs = [...ICON_SET, ...ICON_SET].map((item, idx) => ({
      id: idx,
      ...item,
      isFlipped: false,
      isMatched: false
    }));
    return pairs.sort(() => Math.random() - 0.5);
  });

  const [flipped, setFlipped] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const flipCard = (id: number) => {
    if (flipped.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);
    setFlipped([...flipped, id]);

    if (flipped.length === 1) {
      setAttempts(a => a + 1);
      const first = cards[flipped[0]];
      const second = cards[id];

      if (first.type === second.type) {
        setMatches(m => m + 1);
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[flipped[0]].isMatched = true;
          matchedCards[id].isMatched = true;
          setCards(matchedCards);
          setFlipped([]);
        }, 600);
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[flipped[0]].isFlipped = false;
          resetCards[id].isFlipped = false;
          setCards(resetCards);
          setFlipped([]);
        }, 3200);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 p-6 overscroll-none overflow-hidden">
      <div className="flex items-center justify-between mb-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
         <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-800">MEMÓRIA MESTRE</h3>
            <p className="text-sm font-medium text-slate-500">Encontre os pares para dominar os ícones do computador.</p>
         </div>
         <div className="flex gap-4">
            <div className="bg-blue-50 px-6 py-2 rounded-2xl border border-blue-100 flex flex-col items-center">
               <span className="text-[10px] font-black text-blue-400 uppercase">Pares</span>
               <span className="text-xl font-black text-blue-600">{matches}/10</span>
            </div>
            <div className="bg-slate-50 px-6 py-2 rounded-2xl border border-slate-100 flex flex-col items-center">
               <span className="text-[10px] font-black text-slate-400 uppercase">Tentativas</span>
               <span className="text-xl font-black text-slate-600">{attempts}</span>
            </div>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-4 md:grid-cols-5 gap-3 h-full pb-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => flipCard(idx)}
            className="relative cursor-pointer h-full min-h-[80px]"
          >
            <AnimatePresence mode="wait">
              {card.isFlipped || card.isMatched ? (
                <motion.div
                  key="front"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  className={`absolute inset-0 bg-white rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg border-2 ${card.isMatched ? 'border-green-500 bg-green-50/30' : 'border-blue-200 shadow-blue-100'}`}
                >
                  <div className={card.isMatched ? 'scale-110' : ''}>{card.icon}</div>
                  <span className={`text-[9px] font-black uppercase text-center px-1 ${card.isMatched ? 'text-green-600' : 'text-slate-400'}`}>
                    {card.label}
                  </span>
                  {card.isMatched && <CheckCircle2 size={16} className="text-green-500 absolute top-2 right-2" />}
                </motion.div>
              ) : (
                <motion.div
                  key="back"
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 90, opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white/20"
                >
                  <Brain size={32} className="text-white/20" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {matches === 10 && (
        <SuccessOverlay 
          title="Incrível Memória!" 
          desc="Você agora reconhece todos os principais comandos do Windows." 
          buttonText="CONTINUAR" 
          onComplete={onComplete} />
      )}
    </div>
  );
};



// --- Main Container ---

export default function MouseSimulator({ onClose, initialStage = -1 }: { onClose: () => void, initialStage?: number }) {
  const [stage, setStage] = useState(initialStage);
  const [retryKey, setRetryKey] = useState(0);
  const handleRetry = () => setRetryKey(k => k + 1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('mouse_training_best_time');
    return saved ? parseInt(saved) : null;
  });
  const [highlightFirst, setHighlightFirst] = useState(false);

  useEffect(() => {
    if (stage === 1 && !startTime) setStartTime(Date.now());
    if (stage === 21 && startTime && !endTime) {
       const finished = Date.now();
       setEndTime(finished);
       const duration = finished - startTime;
       if (!bestTime || duration < bestTime) {
          setBestTime(duration);
          localStorage.setItem('mouse_training_best_time', duration.toString());
       }
    }
  }, [stage]);

  const resetAll = () => {
    setStage(0);
    setStartTime(null);
    setEndTime(null);
    setHighlightFirst(true);
    handleRetry();
  };
  const [visited, setVisited] = useState<number[]>([]);

  useEffect(() => {
    if (!visited.includes(stage)) {
       setVisited([...visited, stage]);
    }
  }, [stage]);

  const handleNext = () => {
    if (stage === 20) {
      setStage(0); // Go back to menu after lesson 20
    } else if (stage < 20) {
      setStage(stage + 1);
    } else {
      onClose();
    }
  };

  const handleSelect = (id: number) => {
    setHighlightFirst(false);
    setStage(id);
  };

  const renderStage = () => {
    switch (stage) {
      case -1: return <HomeStage onStart={() => setStage(0)} />;
      case 0: return <IndexStage onComplete={handleNext} onSelect={handleSelect} highlightFirst={highlightFirst} />;
      case 1: return <ButtonsStage key={retryKey} onComplete={handleNext} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 2: return <MovementStage key={retryKey} onComplete={handleNext} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 3: return <LightStage key={retryKey} onComplete={handleNext} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 4: return <BalloonStage key={retryKey} onComplete={handleNext} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 5: return <OpenSiteStage key={retryKey} onComplete={handleNext} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 6: return <DoubleClickConceptStage key={retryKey} onComplete={handleNext} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 7: return <OpenFolderStage key={retryKey} onComplete={handleNext} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 8: return <OpenDocumentStage key={retryKey} onComplete={handleNext} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 9: return <RightMenuStage key={retryKey} onComplete={handleNext} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 10: return <CopyStage key={retryKey} onComplete={handleNext} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 11: return <CloseStage key={retryKey} onComplete={handleNext} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 12: return <MinimizeStage key={retryKey} onComplete={handleNext} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 13: return <MaximizeStage key={retryKey} onComplete={handleNext} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 14: return <RightMenuStage key={retryKey} onComplete={handleNext} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 15: return <CopyStage key={retryKey} onComplete={handleNext} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 16: return <CopyStage key={retryKey} onComplete={handleNext} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 17: return <OrganizeStage key={retryKey} onComplete={handleNext} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 18: return <TrashStage key={retryKey} onComplete={handleNext} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 19: return <ScrollDownStage key={retryKey} onComplete={handleNext} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 20: return <SelectionStage key={retryKey} onComplete={() => setStage(21)} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 21: return <QuizStage key={retryKey} onComplete={onClose} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;
      case 23: return <MemoryGameStage key={retryKey} onComplete={() => setStage(0)} onGoToIndex={() => setStage(0)} />;
      default: return <IndexStage onComplete={handleNext} onSelect={setStage} />;
    }
  };

  return (
    <div 
      className="h-full flex flex-col bg-white overflow-hidden select-none"
      onContextMenu={(e) => {
        // Blocks general simulator context menu and ONLY allows the ones built into stages
        e.preventDefault();
      }}
    >
      {/* Header */}
      <div className="bg-gray-900 p-6 flex items-center justify-between shadow-xl z-50">
        <div className="flex items-center gap-6">
           <button 
            onClick={() => {
              if (stage >= 21) {
                handleRetry();
              } else {
                setStage(-1);
              }
            }}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all active:scale-95 flex items-center gap-2"
           >
              <Layout size={20} />
              <span className="font-bold text-sm hidden md:inline">{stage >= 21 ? 'INICIAR' : 'TODAS AULAS'}</span>
           </button>
           <div className="w-[2px] h-8 bg-white/10 hidden md:block" />
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Treinamento Básico</span>
              <h2 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none mt-1">
                {EXERCISES.find(ex => ex.id === stage)?.title || 'Informática'}
              </h2>
           </div>
        </div>

        {/* Global Progress */}
        <div className="hidden lg:flex gap-1.5 bg-black/30 p-2 rounded-2xl">
           {EXERCISES.slice(2, -1).map((ex) => (
              <div 
                key={ex.id}
                title={ex.title}
                className={`h-2 rounded-full transition-all duration-500 ${stage === ex.id ? 'w-8 bg-blue-500' : visited.includes(ex.id) ? 'w-2 bg-green-500' : 'w-2 bg-gray-700'}`}
              />
           ))}
        </div>

      </div>

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${stage}-${retryKey}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-full"
          >
            {renderStage()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Instructions for 50+ */}
      <div className="bg-white border-t border-gray-200 p-4 flex items-center justify-between px-10">
         <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-black text-xs shadow-sm">1</div>
               <span className="text-gray-500 text-sm font-bold uppercase tracking-tight">Leia com calma</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-black text-xs shadow-sm">2</div>
               <span className="text-gray-500 text-sm font-bold uppercase tracking-tight">Mova o mouse</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-black text-xs shadow-sm">3</div>
               <span className="text-gray-500 text-sm font-bold uppercase tracking-tight">Dê o clique</span>
            </div>
         </div>
         <div className="flex items-center gap-3 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">
            <Hand size={14} /> Paciência é a chave do aprendizado
         </div>
      </div>
    </div>
  );
}
