// 汉字数据类型
export interface CharData {
  char: string;
  pinyin: string;
  pinyinTone: string;
  tone: string;
  shuangpin: string;
  xingma: string;
  fullcode: string;
}

// 练习模式
export type PracticeMode = 'shuangpin' | 'xingma' | 'full';

// 练习状态
export interface PracticeState {
  currentIndex: number;
  correctCount: number;
  wrongCount: number;
  inputHistory: InputRecord[];
}

// 输入记录
export interface InputRecord {
  char: string;
  expectedPinyin: string;
  expectedShuangpin: string;
  expectedXingma?: string;
  userInput: string;
  isCorrect: boolean;
  timestamp: number;
}

// 双拼键位映射
export interface ShuangpinSchema {
  shengmu: Record<string, string>;
  yunmu: Record<string, string>;
}
