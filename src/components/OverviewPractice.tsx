import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Keyboard } from './Keyboard';
import { pinyinToShuangpin } from '@/utils/shuangpin';
import type { CharData } from '@/types';
import { RotateCcw, Eye, EyeOff, Download, Keyboard as KeyboardIcon } from 'lucide-react';

interface OverviewPracticeProps {
  charData: CharData[];
}

export function OverviewPractice({ charData }: OverviewPracticeProps) {
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 处理输入变化 - 支持完整4码输入
  const handleInputChange = (index: number, value: string) => {
    // 只保留字母，最多4个字符
    const cleanedValue = value.toLowerCase().replace(/[^a-z]/g, '').slice(0, 4);
    setInputs(prev => ({
      ...prev,
      [index]: cleanedValue
    }));
  };

  // 处理键盘导航
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const nextIndex = index + 1;
      if (nextIndex < charData.length) {
        inputRefs.current[nextIndex]?.focus();
        setFocusedIndex(nextIndex);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.min(index + 10, charData.length - 1);
      inputRefs.current[nextIndex]?.focus();
      setFocusedIndex(nextIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = Math.max(index - 10, 0);
      inputRefs.current[prevIndex]?.focus();
      setFocusedIndex(prevIndex);
    }
  };

  // 重置所有输入
  const resetAll = () => {
    setInputs({});
    setFocusedIndex(null);
    inputRefs.current[0]?.focus();
  };

  // 导出输入记录
  const exportInputs = () => {
    const records = charData.map((char, index) => {
      const input = inputs[index] || '';
      const shuangpin = pinyinToShuangpin(char.pinyin);
      const xingma = input.slice(2, 4);
      return {
        char: char.char,
        pinyin: char.pinyin,
        pinyinTone: char.pinyinTone,
        tone: char.tone,
        shuangpin: shuangpin,
        userInput: input,
        userShuangpin: input.slice(0, 2),
        userXingma: xingma,
        isShuangpinCorrect: input.slice(0, 2) === shuangpin,
        fullCode: shuangpin + (char.xingma || '')
      };
    }).filter(r => r.userInput);

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typing-record-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 获取输入框样式
  const getInputStyle = (index: number) => {
    const input = inputs[index] || '';
    const char = charData[index];
    const expectedShuangpin = pinyinToShuangpin(char.pinyin);
    const inputShuangpin = input.slice(0, 2);
    const inputXingma = input.slice(2, 4);
    
    if (!input) return 'border-gray-200 bg-white';
    
    // 检查双拼是否正确
    const isShuangpinCorrect = inputShuangpin === expectedShuangpin;
    
    // 如果有字型数据，检查字型
    if (char.xingma && input.length >= 4) {
      const isXingmaCorrect = inputXingma === char.xingma;
      if (isShuangpinCorrect && isXingmaCorrect) return 'border-green-400 bg-green-50';
      if (!isShuangpinCorrect || !isXingmaCorrect) return 'border-red-300 bg-red-50';
    }
    
    // 只有双拼
    if (input.length <= 2) {
      return isShuangpinCorrect ? 'border-green-400 bg-green-50' : 'border-red-300 bg-red-50';
    }
    
    return 'border-blue-300 bg-blue-50';
  };

  // 获取输入状态显示
  const getInputStatus = (index: number) => {
    const input = inputs[index] || '';
    if (!input) return null;
    
    const char = charData[index];
    const expectedShuangpin = pinyinToShuangpin(char.pinyin);
    const inputShuangpin = input.slice(0, 2);
    const inputXingma = input.slice(2, 4);
    
    const isShuangpinCorrect = inputShuangpin === expectedShuangpin;
    
    if (input.length <= 2) {
      return isShuangpinCorrect ? '✓' : '✗';
    }
    
    if (char.xingma) {
      const isXingmaCorrect = inputXingma === char.xingma;
      if (isShuangpinCorrect && isXingmaCorrect) return '✓✓';
      if (isShuangpinCorrect && !isXingmaCorrect) return '✓✗';
      if (!isShuangpinCorrect && isXingmaCorrect) return '✗✓';
      return '✗✗';
    }
    
    return isShuangpinCorrect ? '✓' : '✗';
  };

  // 获取声调样式
  const getToneBadgeStyle = (tone: string) => {
    switch (tone) {
      case '1': return 'bg-blue-100 text-blue-700 border-blue-200';
      case '2': return 'bg-green-100 text-green-700 border-green-200';
      case '3': return 'bg-orange-100 text-orange-700 border-orange-200';
      case '4': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // 统计
  const stats = {
    total: charData.length,
    inputted: Object.keys(inputs).length,
    correct: Object.entries(inputs).filter(([idx, val]) => {
      const char = charData[Number(idx)];
      return val.slice(0, 2) === pinyinToShuangpin(char.pinyin);
    }).length
  };

  return (
    <div className="space-y-4">
      {/* 控制栏 */}
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnswers(!showAnswers)}
          >
            {showAnswers ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showAnswers ? '隐藏答案' : '显示答案'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetAll}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            重置
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowKeyboard(!showKeyboard)}
          >
            <KeyboardIcon className="h-4 w-4 mr-2" />
            {showKeyboard ? '隐藏键盘' : '显示键盘'}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={exportInputs}
          >
            <Download className="h-4 w-4 mr-2" />
            导出记录
          </Button>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>总字数: {stats.total}</span>
        <span>已输入: {stats.inputted}</span>
        <span>双拼正确: {stats.correct}</span>
      </div>

      {/* 键盘参考 */}
      {showKeyboard && (
        <Card className="p-4">
          <Keyboard showHints={true} showXingmaHints={true} />
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>双拼：声母(白字) + 韵母(灰字) | 字型：首形 + 末形</p>
        </div>
        </Card>
      )}

      {/* 字库网格 */}
      <ScrollArea className="h-[600px] border rounded-lg">
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {charData.map((char, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border transition-all ${
                focusedIndex === index ? 'ring-2 ring-primary border-primary' : ''
              }`}
            >
              {/* 汉字 */}
              <div className="text-center mb-2">
                <span className="text-3xl font-bold">{char.char}</span>
              </div>
              
              {/* 拼音和声调 */}
              <div className="flex justify-center gap-1 mb-2">
                <Badge variant="outline" className="text-xs">
                  {char.pinyinTone}
                </Badge>
                <Badge variant="outline" className={`text-xs ${getToneBadgeStyle(char.tone)}`}>
                  {char.tone === '0' ? '轻' : `${char.tone}`}
                </Badge>
              </div>

              {/* 答案显示 */}
              {showAnswers && (
                <div className="text-center mb-2 text-xs">
                  <span className="font-mono text-blue-600 font-bold">
                    {pinyinToShuangpin(char.pinyin)}
                  </span>
                  {char.xingma && (
                    <span className="font-mono text-purple-600 font-bold">
                      {char.xingma}
                    </span>
                  )}
                </div>
              )}

              {/* 输入框 */}
              <div className="relative">
                <Input
                  ref={(el: HTMLInputElement | null) => { inputRefs.current[index] = el; }}
                  type="text"
                  value={inputs[index] || ''}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={() => setFocusedIndex(index)}
                  maxLength={4}
                  placeholder="输入编码"
                  className={`text-center text-sm uppercase h-10 tracking-wider ${getInputStyle(index)}`}
                />
                {inputs[index] && (
                  <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs">
                    {getInputStatus(index)}
                  </span>
                )}
              </div>
              
              {/* 输入分解显示 */}
              {inputs[index] && inputs[index].length > 0 && (
                <div className="mt-1 text-center text-xs text-muted-foreground">
                  <span className={inputs[index].slice(0, 2) === pinyinToShuangpin(char.pinyin) ? 'text-green-600' : 'text-red-500'}>
                    {inputs[index].slice(0, 2) || '__'}
                  </span>
                  {inputs[index].length > 2 && (
                    <span className={char.xingma && inputs[index].slice(2, 4) === char.xingma ? 'text-green-600' : 'text-red-500'}>
                      {inputs[index].slice(2, 4)}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* 说明 */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p>• 输入完整编码：前2码双拼 + 后2码字型（如：小→xnld）</p>
        <p>• 按 Enter 或 Tab 跳到下一字，方向键 ↑ ↓ 快速移动</p>
        <p>• 绿色 = 正确，红色 = 错误</p>
      </div>
    </div>
  );
}

export default OverviewPractice;
