import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { CharData, InputRecord } from '@/types';
import { Check, X, RotateCcw, Eye, EyeOff, BookOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface XingmaPracticeProps {
  charData: CharData[];
  onComplete?: (records: InputRecord[]) => void;
}

// 字型学习数据（示例）
const xingmaGuide = [
  {
    category: '小字',
    description: '独体字，按声母定键',
    examples: [
      { char: '日', code: 'r', part: '日' },
      { char: '月', code: 'y', part: '月' },
      { char: '木', code: 'm', part: '木' },
      { char: '山', code: 'u', part: '山' },
      { char: '石', code: 'u', part: '石' },
      { char: '田', code: 't', part: '田' },
      { char: '禾', code: 'h', part: '禾' },
      { char: '白', code: 'b', part: '白' },
    ]
  },
  {
    category: '部件',
    description: '偏旁部首，按发音记忆',
    examples: [
      { char: '氵', code: 's', part: '水' },
      { char: '扌', code: 's', part: '手' },
      { char: '讠', code: 'y', part: '言' },
      { char: '钅', code: 'j', part: '金' },
      { char: '亻', code: 'r', part: '人' },
      { char: '忄', code: 'x', part: '心' },
      { char: '艹', code: 'c', part: '草' },
      { char: '宀', code: 'b', part: '宝' },
    ]
  },
  {
    category: '笔画',
    description: '基本笔画',
    examples: [
      { char: '丨', code: 'l', part: '竖' },
      { char: '丶', code: 'd', part: '点' },
      { char: '丿', code: 'p', part: '撇' },
      { char: '㇏', code: 'n', part: '捺' },
      { char: '一', code: 'h', part: '横' },
    ]
  },
];

export function XingmaPractice({ charData, onComplete }: XingmaPracticeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [records, setRecords] = useState<InputRecord[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

  // 过滤有字型编码的字
  const charsWithXingma = charData.filter(c => c.xingma);

  useEffect(() => {
    if (charsWithXingma.length > 0) {
      const indices = Array.from({ length: charsWithXingma.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setShuffledIndices(indices);
    }
  }, [charsWithXingma.length]);

  const currentChar = shuffledIndices.length > 0 ? charsWithXingma[shuffledIndices[currentIndex]] : null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setInput(value);
    
    if (value.length === 2 && currentChar) {
      const isCorrect = value === currentChar.xingma;
      setFeedback(isCorrect ? 'correct' : 'wrong');
      
      if (isCorrect) {
        const record: InputRecord = {
          char: currentChar.char,
          expectedPinyin: currentChar.pinyin,
          expectedShuangpin: currentChar.shuangpin,
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
    } else {
      setFeedback(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (input.length === 2 && currentChar) {
        const isCorrect = input === currentChar.xingma;
        if (!isCorrect) {
          const record: InputRecord = {
            char: currentChar.char,
            expectedPinyin: currentChar.pinyin,
            expectedShuangpin: currentChar.shuangpin,
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
    
    if (currentIndex < charsWithXingma.length - 1) {
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
    const indices = Array.from({ length: charsWithXingma.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledIndices(indices);
  };

  const progress = charsWithXingma.length > 0 ? ((currentIndex) / charsWithXingma.length) * 100 : 0;
  const correctCount = records.filter(r => r.isCorrect).length;
  const wrongCount = records.filter(r => !r.isCorrect).length;

  if (charsWithXingma.length === 0) {
    return (
      <Card className="border-2">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">暂无字型数据，请先学习字型规则</p>
        </CardContent>
      </Card>
    );
  }

  if (!currentChar) {
    return <div className="text-center p-8">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 进度和统计 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>进度: {currentIndex + 1} / {charsWithXingma.length}</span>
          <span>正确: {correctCount} | 错误: {wrongCount}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* 学习按钮 */}
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <BookOpen className="h-4 w-4 mr-2" />
              学习字型规则
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>小鹤字型学习指南</DialogTitle>
              <DialogDescription>
                字型由首形和末形组成，每个部分取字根声母
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              {xingmaGuide.map((section) => (
                <div key={section.category} className="space-y-2">
                  <h3 className="font-semibold text-lg">{section.category}</h3>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {section.examples.map((ex) => (
                      <div key={ex.char} className="flex flex-col items-center p-2 bg-muted rounded">
                        <span className="text-2xl">{ex.char}</span>
                        <span className="text-xs text-muted-foreground">{ex.part}</span>
                        <span className="text-sm font-mono font-bold">{ex.code}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 主要练习区域 */}
      <Card className="border-2">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-sm text-muted-foreground">字型练习</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 汉字显示 */}
          <div className="text-center">
            <div className="text-8xl font-bold mb-4 text-primary">{currentChar.char}</div>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                拼音: {currentChar.pinyin}
              </Badge>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                双拼: {currentChar.shuangpin}
              </Badge>
              {showAnswer && (
                <Badge variant="outline" className="text-lg px-3 py-1 border-primary text-primary">
                  字型: {currentChar.xingma}
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
                placeholder="输入字型编码（2个字母）"
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
                <span>错误，正确答案是: {currentChar.xingma}</span>
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

      {/* 提示信息 */}
      <div className="text-center text-sm text-muted-foreground">
        <p>字型 = 首形声母 + 末形声母</p>
        <p className="mt-1">例如："小" = 丨(l) + 丶(d) = ld</p>
      </div>
    </div>
  );
}

export default XingmaPractice;
