import { keyboardLayout, keyYunmuHint, keyShengmuHint, keyXingmaHint } from '@/utils/shuangpin';
import { cn } from '@/lib/utils';

interface KeyboardProps {
  highlightedKeys?: string[];
  showHints?: boolean;
  showXingmaHints?: boolean;
  className?: string;
}

export function Keyboard({ highlightedKeys = [], showHints = true, showXingmaHints = false, className }: KeyboardProps) {
  const isHighlighted = (key: string) => highlightedKeys.includes(key.toLowerCase());
  
  return (
    <div className={cn("flex flex-col items-center gap-1.5 p-4 bg-muted/30 rounded-xl", className)}>
      {/* 第一行 */}
      <div className="flex gap-1">
        {keyboardLayout[0].map((key) => (
          <KeyButton
            key={key}
            keyChar={key}
            isHighlighted={isHighlighted(key)}
            showHint={showHints}
            showXingmaHint={showXingmaHints}
          />
        ))}
      </div>
      
      {/* 第二行 */}
      <div className="flex gap-1 ml-4">
        {keyboardLayout[1].map((key) => (
          <KeyButton
            key={key}
            keyChar={key}
            isHighlighted={isHighlighted(key)}
            showHint={showHints}
            showXingmaHint={showXingmaHints}
          />
        ))}
      </div>
      
      {/* 第三行 */}
      <div className="flex gap-1 ml-8">
        {keyboardLayout[2].map((key) => (
          <KeyButton
            key={key}
            keyChar={key}
            isHighlighted={isHighlighted(key)}
            showHint={showHints}
            showXingmaHint={showXingmaHints}
          />
        ))}
      </div>
    </div>
  );
}

interface KeyButtonProps {
  keyChar: string;
  isHighlighted: boolean;
  showHint: boolean;
  showXingmaHint?: boolean;
}

function KeyButton({ keyChar, isHighlighted, showHint, showXingmaHint }: KeyButtonProps) {
  const yunmu = keyYunmuHint[keyChar] || '';
  const shengmu = keyShengmuHint[keyChar] || '';
  const xingma = keyXingmaHint[keyChar] || '';
  
  return (
    <div
      className={cn(
        "relative w-10 h-14 sm:w-12 sm:h-16 rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-all duration-200",
        "border-2 shadow-sm",
        isHighlighted
          ? "bg-primary text-primary-foreground border-primary scale-110 shadow-md"
          : "bg-card text-card-foreground border-border hover:border-primary/50"
      )}
    >
      <span className="text-base sm:text-lg font-bold">{keyChar.toUpperCase()}</span>
      {showHint && !showXingmaHint && (
        <span className="text-[8px] sm:text-[10px] opacity-70 leading-tight text-center px-0.5">
          {shengmu || yunmu}
        </span>
      )}
      {showXingmaHint && (
        <>
          <span className="text-[7px] sm:text-[8px] text-gray-500 leading-tight text-center px-0.5">
            {yunmu}
          </span>
          {xingma && (
            <span className="text-[7px] sm:text-[8px] text-purple-600 font-medium leading-tight text-center px-0.5">
              {xingma}
            </span>
          )}
        </>
      )}
    </div>
  );
}

export default Keyboard;
