import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Keyboard } from './Keyboard';
import { pinyinToShuangpin, verifyShuangpin } from '@/utils/shuangpin';
import type { CharData, InputRecord } from '@/types';
import { Check, X, RotateCcw, Eye, EyeOff, History } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FullPracticeProps {
  charData: CharData[];
  onComplete?: (records: InputRecord[]) => void;
}

export function FullPractice({ charData, onComplete }: FullPracticeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [records, setRecords] = useState<InputRecord[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  useEffect(() => {
    const indices = Array.from({ length: charData.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledIndices(indices);
  }, [charData]);

  const currentChar = shuffledIndices.length > 0 ? charData[shuffledIndices[currentIndex]] : null;
  const expectedShuangpin = currentChar ? pinyinToShuangpin(currentChar.pinyin) : '';
  const expectedFull = currentChar ? (currentChar.xingma ? expectedShuangpin + currentChar.xingma : expectedShuangpin) : '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setInput(value);
    
    if (!currentChar) return;

    // 分阶段验证
    if (value.length <= 2) {
      // 双拼阶段
      setFeedback(null);
    } else if (value.length === 4) {
      // 完整输入
      
      // 验证双拼部分
      const inputShuangpin = value.slice(0, 2);
      const inputXingma = value.slice(2, 4);
      
      const isShuangpinCorrect = verifyShuangpin(currentChar.pinyin, inputShuangpin);
      const isXingmaCorrect = currentChar.xingma ? inputXingma === currentChar.xingma : true;
      
      const isCorrect = isShuangpinCorrect && isXingmaCorrect;
      setFeedback(isCorrect ? 'correct' : 'wrong');
      
      if (isCorrect) {
        const record: InputRecord = {
          char: currentChar.char,
          expectedPinyin: currentChar.pinyin,
          expectedShuangpin: expectedShuangpin,
          expectedXingma: currentChar.xingma,
          userInput: value,
          isCorrect: true,
          timestamp: Date.now(),
        };
        setRecords(prev => [...prev, record]);
        
        setTimeout(() => {
          nextQuestion();
        }, 500);
      }
    } else if (value.length > 4) {
      // 限制最大长度
      setInput(value.slice(0, 4));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (input.length === 4 && currentChar) {
        const inputShuangpin = input.slice(0, 2);
        const inputXingma = input.slice(2, 4);
        
        const isShuangpinCorrect = verifyShuangpin(currentChar.pinyin, inputShuangpin);
        const isXingmaCorrect = currentChar.xingma ? inputXingma === currentChar.xingma : true;
        
        const isCorrect = isShuangpinCorrect && isXingmaCorrect;
        
        if (!isCorrect) {
          const record: InputRecord = {
            char: currentChar.char,
            expectedPinyin: currentChar.pinyin,
            expectedShuangpin: expectedShuangpin,
            expectedXingma: currentChar.xingma,
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
    const indices = Array.from({ length: charData.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledIndices(indices);
  };

  const progress = charData.length > 0 ? ((currentIndex) / charData.length) * 100 : 0;
  const correctCount = records.filter(r => r.isCorrect).length;
  const wrongCount = records.filter(r => !r.isCorrect).length;

  // 获取输入框样式
  const getInputStyle = () => {
    if (feedback === 'correct') return 'border-green-500 bg-green-50';
    if (feedback === 'wrong') return 'border-red-500 bg-red-50';
    if (input.length <= 2) return 'border-blue-300';
    return 'border-purple-300';
  };

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

      {/* 输入历史 */}
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <History className="h-4 w-4 mr-2" />
              输入记录
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>输入记录</DialogTitle>
              <DialogDescription>
                查看你的练习历史
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] mt-4">
              <div className="space-y-2">
                {records.length === 0 ? (
                  <p className="text-center text-muted-foreground">暂无记录</p>
                ) : (
                  records.map((record, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        record.isCorrect ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold">{record.char}</span>
                        <div className="text-sm">
                          <div>拼音: {record.expectedPinyin}</div>
                          <div className="text-muted-foreground">
                            期望: {record.expectedShuangpin}{record.expectedXingma || ''}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-mono font-bold ${record.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {record.userInput}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {record.isCorrect ? '正确' : '错误'}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {/* 主要练习区域 */}
      <Card className="border-2">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-sm text-muted-foreground">完整音型练习（4码）</CardTitle>
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
                <>
                  <Badge variant="outline" className="text-lg px-3 py-1 border-blue-400 text-blue-600">
                    双拼: {expectedShuangpin}
                  </Badge>
                  {currentChar.xingma && (
                    <Badge variant="outline" className="text-lg px-3 py-1 border-purple-400 text-purple-600">
                      字型: {currentChar.xingma}
                    </Badge>
                  )}
                </>
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
                maxLength={4}
                placeholder="输入完整编码（4个字母）"
                className={`text-center text-2xl h-14 uppercase tracking-widest ${getInputStyle()}`}
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
            
            {/* 输入阶段提示 */}
            <div className="flex justify-center gap-4 text-sm">
              <span className={input.length <= 2 ? 'text-blue-600 font-medium' : 'text-muted-foreground'}>
                {input.length < 2 ? '●' : '○'} 双拼 ({input.slice(0, 2) || '__'})
              </span>
              <span className={input.length > 2 ? 'text-purple-600 font-medium' : 'text-muted-foreground'}>
                {input.length >= 2 ? '●' : '○'} 字型 ({input.slice(2, 4) || '__'})
              </span>
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
                <span>错误，正确答案是: {expectedFull}</span>
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

      {/* 说明 */}
      <div className="text-center text-sm text-muted-foreground space-y-1">
        <p>完整编码 = 双拼（2码）+ 字型（2码）</p>
        <p>输入前2码为双拼，后2码为字型</p>
      </div>
    </div>
  );
}

export default FullPractice;
