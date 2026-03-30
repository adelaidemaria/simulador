const fs = require('fs');

const file = 'src/components/MouseSimulator.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'interface StageProps {\n  onComplete: () => void;\n  onGoToIndex: () => void;\n}',
  'interface StageProps {\n  onComplete: () => void;\n  onGoToIndex: () => void;\n  onRetry?: () => void;\n}'
);

content = content.replace(
  'const SuccessOverlay = ({ title, desc, buttonText, onComplete }: { title: string, desc: string, buttonText: string, onComplete: () => void }) => (',
  'const SuccessOverlay = ({ title, desc, buttonText, onComplete, onRetry }: { title: string, desc: string, buttonText: string, onComplete: () => void, onRetry?: () => void }) => ('
);

content = content.replace(
  /<button\s+onClick=\{onComplete\}[\s\S]*?\{buttonText\} <ArrowRight size=\{24\} \/>\s*<\/button>/m,
  `<div className="flex w-full gap-4 mt-8">
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
        </div>`
);


content = content.replace(/onComplete=\{onComplete\} \/>/g, 'onComplete={onComplete} onRetry={onRetry} />');

content = content.replace(/const (\w+Stage) = \(\{ onComplete \}: StageProps\) => \{/g, 'const $1 = ({ onComplete, onRetry }: StageProps) => {');

// Increase instructions contrast
content = content.replace(/className="text-xl text-blue-700 font-medium"/g, 'className="text-2xl text-blue-900 bg-blue-100 p-6 rounded-2xl font-black border-4 border-blue-300 shadow-sm"');
content = content.replace(/className="text-xl text-yellow-700 font-medium"/g, 'className="text-2xl text-yellow-900 bg-yellow-100 p-6 rounded-2xl font-black border-4 border-yellow-300 shadow-sm"');
content = content.replace(/className="text-xl text-cyan-700 font-medium"/g, 'className="text-2xl text-cyan-900 bg-cyan-100 p-6 rounded-2xl font-black border-4 border-cyan-300 shadow-sm"');
content = content.replace(/className="text-xl text-indigo-700 font-medium"/g, 'className="text-xl text-indigo-900 bg-indigo-100 p-6 rounded-2xl font-black border-4 border-indigo-300 shadow-sm"');
content = content.replace(/className="text-2xl text-rose-700 font-medium"/g, 'className="text-2xl text-rose-900 bg-rose-100 p-4 rounded-2xl font-black border-4 border-rose-300 shadow-sm"');
content = content.replace(/className="text-xl text-amber-700 font-medium"/g, 'className="text-2xl text-amber-900 bg-amber-100 p-6 rounded-2xl font-black border-4 border-amber-300 shadow-sm"');
content = content.replace(/className="text-xl text-purple-700 font-medium"/g, 'className="text-2xl text-purple-900 bg-purple-100 p-6 rounded-2xl font-black border-4 border-purple-300 shadow-sm"');
content = content.replace(/className="text-xl text-slate-700 font-medium"/g, 'className="text-2xl text-slate-900 bg-slate-100 p-6 rounded-2xl font-black border-4 border-slate-300 shadow-sm"');
content = content.replace(/className="text-xl text-red-700 font-medium"/g, 'className="text-2xl text-red-900 bg-red-100 p-6 rounded-2xl font-black border-4 border-red-300 shadow-sm"');
content = content.replace(/className="text-xl text-orange-700 font-medium"/g, 'className="text-2xl text-orange-900 bg-orange-100 p-6 rounded-2xl font-black border-4 border-orange-300 shadow-sm"');
content = content.replace(/className="text-xl text-emerald-700 font-medium"/g, 'className="text-2xl text-emerald-900 bg-emerald-100 p-6 rounded-2xl font-black border-4 border-emerald-300 shadow-sm"');
content = content.replace(/className="text-xl text-stone-700 font-medium"/g, 'className="text-2xl text-stone-900 bg-stone-100 p-6 rounded-2xl font-black border-4 border-stone-300 shadow-sm"');
content = content.replace(/className="text-xl text-red-200 font-medium"/g, 'className="text-2xl text-white bg-red-800 p-6 rounded-2xl font-black border-4 border-red-500 shadow-sm"');
content = content.replace(/className="text-xl text-gray-400 font-medium"/g, 'className="text-2xl text-gray-800 bg-gray-200 p-6 rounded-2xl font-black border-4 border-gray-400 shadow-sm"'); // Right click stage
content = content.replace(/className="text-xl text-gray-600 font-medium"/g, 'className="text-2xl text-gray-900 bg-gray-200 p-6 rounded-2xl font-black border-4 border-gray-400 shadow-sm"'); 

// Simulator
content = content.replace(
  'const [stage, setStage] = useState(0);',
  'const [stage, setStage] = useState(0);\n  const [retryKey, setRetryKey] = useState(0);\n  const handleRetry = () => setRetryKey(k => k + 1);'
);

content = content.replace('key={stage}', 'key={`${stage}-${retryKey}`}');

content = content.replace(
  /case (\d+): return <([^ ]+) onComplete=\{handleNext\} onGoToIndex=\{[^\}]+\} \/>;/g,
  'case $1: return <$2 key={retryKey} onComplete={handleNext} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;'
);

content = content.replace(
  /case 20: return <GraduationStage onComplete=\{onClose\} onGoToIndex=\{[^\}]+\} \/>;/,
  'case 20: return <GraduationStage key={retryKey} onComplete={onClose} onGoToIndex={() => setStage(0)} onRetry={handleRetry} />;'
);

fs.writeFileSync(file, content);
console.log('Update finished using Node.');
