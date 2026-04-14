import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Keyboard } from './Keyboard';
import { pinyinToShuangpin, verifyShuangpin } from '@/utils/shuangpin';
import type { CharData, InputRecord } from '@/types';
import { Check, X, RotateCcw, Eye, EyeOff } from 'lucide-react';

interface ShuangpinPracticeProps {
  charData: CharData[];
  onComplete?: (records: InputRecord[]) => void;
}

export function ShuangpinPractice({ charData, onComplete }: ShuangpinPracticeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [records, setRecords] = useState<InputRecord[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

  // 初始化随机顺序
  useEffect(() => {
    const indices = Array.from({ length: charData.length }, (_, i) => i);
    // Fisher-Yates 洗牌算法
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledIndices(indices);
  }, [charData]);

  const currentChar = shuffledIndices.length > 0 ? charData[shuffledIndices[currentIndex]] : null;
  const expectedShuangpin = currentChar ? pinyinToShuangpin(currentChar.pinyin) : '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setInput(value);
    
    // 自动检查（输入2个字符时）
    if (value.length === 2 && currentChar) {
      const isCorrect = verifyShuangpin(currentChar.pinyin, value);
      setFeedback(isCorrect ? 'correct' : 'wrong');
      
      if (isCorrect) {
        // 记录正确输入
        const record: InputRecord = {
          char: currentChar.char,
          expectedPinyin: currentChar.pinyin,
          expectedShuangpin: expectedShuangpin,
          userInput: value,
          isCorrect: true,
          timestamp: Date.now(),
        };
        setRecords(prev => [...prev, record]);
        
        // 延迟进入下一题
        setTimeout(() => {
          nextQuestion();
        }, 500);
      }
    } else {
      setFeedback(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (input.length === 2 && currentChar) {
        const isCorrect = verifyShuangpin(currentChar.pinyin, input);
        if (!isCorrect) {
          // 记录错误输入
          const record: InputRecord = {
            char: currentChar.char,
            expectedPinyin: currentChar.pinyin,
            expectedShuangpin: expectedShuangpin,
            userInput: input,
            isCorrect: false,
            timestamp: Date.now(),
          };
          setRecords(prev => [...prev, record]);
        }
        setFeedback(isCorrect ? 'correct' : 'wrong');
      }
    }
  };

  const nextQuestion = () => {
    setInput('');
    setFeedback(null);
    setShowAnswer(false);
    
    if (currentIndex < charData.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // 练习完成
      if (onComplete) {
        onComplete(records);
      }
    }
  };

  const resetPractice = () => {
    setCurrentIndex(0);
    setInput('');
    setRecords([]);
    setFeedback(null);
    setShowAnswer(false);
    // 重新洗牌
    const indices = Array.from({ length: charData.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledIndices(indices);
  };

  // 计算进度
  const progress = charData.length > 0 ? ((currentIndex) / charData.length) * 100 : 0;
  const correctCount = records.filter(r => r.isCorrect).length;
  const wrongCount = records.filter(r => !r.isCorrect).length;

  if (!currentChar) {
    return <div className="text-center p-8">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 进度和统计 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>进度: {currentIndex + 1} / {charData.length}</span>
          <span>正确: {correctCount} | 错误: {wrongCount}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* 主要练习区域 */}
      <Card className="border-2">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-sm text-muted-foreground">双拼练习</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 汉字显示 */}
          <div className="text-center">
            <div className="text-8xl font-bold mb-4 text-primary">{currentChar.char}</div>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {currentChar.pinyinTone}
              </Badge>
              <Badge variant="outline" className={`text-sm px-2 py-1 ${
                currentChar.tone === '1' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                currentChar.tone === '2' ? 'bg-green-50 text-green-700 border-green-200' :
                currentChar.tone === '3' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                currentChar.tone === '4' ? 'bg-red-50 text-red-700 border-red-200' :
                'bg-gray-50 text-gray-700 border-gray-200'
              }`}>
                {currentChar.tone === '0' ? '轻声' : `第${currentChar.tone}声`}
              </Badge>
              {showAnswer && (
                <Badge variant="outline" className="text-lg px-3 py-1 border-primary text-primary">
                  双拼: {expectedShuangpin}
                </Badge>
              )}
            </div>
          </div>

          {/* 输入区域 */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                maxLength={2}
                placeholder="输入双拼（2个字母）"
                className={`text-center text-2xl h-14 uppercase ${
                  feedback === 'correct' ? 'border-green-500 bg-green-50' :
                  feedback === 'wrong' ? 'border-red-500 bg-red-50' : ''
                }`}
                autoFocus
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowAnswer(!showAnswer)}
                className="h-14 w-14"
              >
                {showAnswer ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
            
            {/* 反馈显示 */}
            {feedback === 'correct' && (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Check className="h-5 w-5" />
                <span>正确！</span>
              </div>
            )}
            {feedback === 'wrong' && (
              <div className="flex items-center justify-center gap-2 text-red-600">
                <X className="h-5 w-5" />
                <span>错误，正确答案是: {expectedShuangpin}</span>
              </div>
            )}
          </div>

          {/* 控制按钮 */}
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={nextQuestion}>
              跳过
            </Button>
            <Button variant="outline" onClick={resetPractice}>
              <RotateCcw className="h-4 w-4 mr-2" />
              重新开始
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 键盘可视化 */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">键盘参考</h3>
          <Button variant="ghost" size="sm" onClick={() => setShowHints(!showHints)}>
            {showHints ? '隐藏提示' : '显示提示'}
          </Button>
        </div>
        <Keyboard 
          highlightedKeys={input.split('')} 
          showHints={showHints}
        />
      </div>
    </div>
  );
}

export default ShuangpinPractice;
