const fs = require('fs');

const file = 'src/components/MouseSimulator.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Icons
content = content.replace(
  'Minimize2,',
  'Minimize2,\n  Minus,\n  Square,'
);

// 2. ButtonsStage text update
content = content.replace(
  'O mouse tem dois botões. O <b>Esquerdo</b> serve para escolher coisas, e o <b>Direito</b> mostra opções extras.',
  'Clique nos botões desenhados abaixo: pressione seu botão <b>ESQUERDO</b> e depois o <b>DIREITO</b> para prosseguir.'
);

// 3. MinimizeStage (Aula 15) icons update
// In MinimizeStage, replace Minimize2 with Minus in two places (the text and the icon).
content = content.replace(
    'Clique no tracinho <b>"–" (Minimizar)</b> no canto da janela para escondê-la.',
    'Clique no tracinho <b>"–" (Minimizar)</b> no canto superior direito da janela abaixo para escondê-la.'
);
content = content.replace(
  /<Minimize2 size=\{24\} \/>/g,
  '<Minus size={24} />'
);

// 4. MaximizeStage (Aula 16) icons update
content = content.replace(
   '<b>"▢" (Maximizar)</b> para que a janela ocupe',
   '<b>"▢" (Maximizar)</b> (o símbolo de quadrado no canto direito) para que a janela ocupe'
);
content = content.replace(
  /<Maximize2 size=\{24\} \/>/g,
  '<Square size={20} />'
);
content = content.replace(
  /<Maximize2 size=\{20\} \/>/g,
  '<Square size={16} />'
);

// 5. SelectionStage (Aula 18) update
content = content.replace(
    'Clique fora da pasta, <b>SEGURE E ARRASTE</b> a seta para desenhar um quadrado por cima de tudo.',
    'Pressione o botão <b>ESQUERDO</b> do mouse (e segure) no espaço em branco, depois <b>ARRASTE</b> a seta para desenhar um quadrado azul e selecionar os itens.'
);

// Prevent dragging behavior globally if onMouseDown handles it
// SelectionStage start method is:
/*
  const start = (e: React.MouseEvent) => {
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return;
    setIsSelecting(true);
    setRect({ x: e.clientX - box.left, y: e.clientY - box.top, w: 0, h: 0 });
  };
*/
content = content.replace(
  'const start = (e: React.MouseEvent) => {',
  'const start = (e: React.MouseEvent) => {\n    if (e.button !== 0) return;\n    e.preventDefault();'
);

// Modify App.tsx and MouseSimulator to handle the timer
// Wait, we need to pass performance from MouseSimulator to GraduationStage.
// Let's modify StageProps for GraduationStage specifically, or just use shared state in MouseSimulator.

// In MouseSimulator:
/*
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('mouse_training_best_time');
    return saved ? parseInt(saved) : null;
  });

  useEffect(() => {
    if (stage === 1 && !startTime) setStartTime(Date.now());
    if (stage === 20 && startTime && !endTime) {
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
    handleRetry();
  };
*/
content = content.replace(
  'const handleRetry = () => setRetryKey(k => k + 1);',
  `const handleRetry = () => setRetryKey(k => k + 1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('mouse_training_best_time');
    return saved ? parseInt(saved) : null;
  });

  useEffect(() => {
    if (stage === 1 && !startTime) setStartTime(Date.now());
    if (stage === 20 && startTime && !endTime) {
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
    handleRetry();
  };`
);


// Modify GraduationStage signature. Since GraduationStage relies on MouseSimulator state, we pass them as props.
content = content.replace(
  'const GraduationStage = ({ onComplete, onRetry }: StageProps) => {',
  `const GraduationStage = ({ onComplete, onRetry, timeMs, bestTimeMs }: StageProps & { timeMs?: number | null, bestTimeMs?: number | null }) => {
    const formatTime = (ms: number) => {
       const seconds = Math.floor(ms / 1000);
       const m = Math.floor(seconds / 60);
       const s = seconds % 60;
       if (m > 0) return \`\${m} minuto\${m > 1 ? 's' : ''} e \${s} segundo\${s > 1 ? 's' : ''}\`;
       return \`\${s} segundos\`;
    };
    
    const isNewBest = timeMs && bestTimeMs && timeMs <= bestTimeMs;
  `
);

content = content.replace(
   /Você acaba de concluir todas as 20 lições[^<]*/,
   `Você acaba de concluir todas as 20 lições!
            {timeMs ? (
              <div className="mt-8 bg-black/20 p-6 rounded-3xl border border-white/20">
                 <p className="text-xl">Seu tempo: <b className="text-3xl text-yellow-300">{formatTime(timeMs)}</b></p>
                 {bestTimeMs && !isNewBest && <p className="text-lg text-blue-200 mt-2">Seu recorde anterior: {formatTime(bestTimeMs)}</p>}
                 {isNewBest && <p className="text-lg text-green-300 font-bold mt-2">🎉 Novo Recorde!</p>}
              </div>
            ) : null}
          `
);

// We need to add "REFAZER TUDO" button in GraduationStage next to FINALIZAR E SAIR
content = content.replace(
  /<button\s+onClick=\{onComplete\}\s+className="bg-white text-blue-600 px-20 py-8 rounded-\[3rem\] font-black text-3xl shadow-2xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95"\s*>\s*FINALIZAR E SAIR\s*<\/button>/,
  `<div className="flex gap-6 w-full max-w-4xl px-12">
           <button 
             onClick={onRetry}
             className="flex-1 bg-blue-700 border-4 border-white text-white px-8 py-8 rounded-[3rem] font-black text-2xl shadow-xl hover:bg-blue-800 transition-all hover:scale-105 active:scale-95"
           >
              REFAZER TUDO
           </button>
           <button 
             onClick={onComplete}
             className="flex-1 bg-white text-blue-600 px-8 py-8 rounded-[3rem] font-black text-2xl shadow-2xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95"
           >
              FINALIZAR E SAIR
           </button>
        </div>`
);

// Pass the props to GraduationStage in renderStage
content = content.replace(
  /case 20: return <GraduationStage key=\{retryKey\} onComplete=\{onClose\} onGoToIndex=\{\(\) => setStage\(0\)\} onRetry=\{handleRetry\} \/>;/,
  'case 20: return <GraduationStage key={retryKey} onComplete={onClose} onGoToIndex={() => setStage(0)} onRetry={resetAll} timeMs={endTime ? endTime - (startTime || endTime) : null} bestTimeMs={bestTime} />;'
);

fs.writeFileSync(file, content);
console.log('Update 3 finished.');
