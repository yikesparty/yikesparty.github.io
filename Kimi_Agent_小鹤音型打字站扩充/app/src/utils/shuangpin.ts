// 小鹤双拼键位映射表
export const shengmuMap: Record<string, string> = {
  'zh': 'v',
  'ch': 'i',
  'sh': 'u',
  'b': 'b',
  'p': 'p',
  'm': 'm',
  'f': 'f',
  'd': 'd',
  't': 't',
  'n': 'n',
  'l': 'l',
  'g': 'g',
  'k': 'k',
  'h': 'h',
  'j': 'j',
  'q': 'q',
  'x': 'x',
  'r': 'r',
  'z': 'z',
  'c': 'c',
  's': 's',
  'y': 'y',
  'w': 'w',
};

// 韵母映射 (小鹤双拼)
export const yunmuMap: Record<string, string> = {
  'a': 'a',
  'o': 'o',
  'e': 'e',
  'i': 'i',
  'u': 'u',
  'v': 'v',
  'ai': 'd',
  'ei': 'w',
  'ui': 'v',
  'ao': 'c',
  'ou': 'z',
  'iu': 'q',
  'ie': 'p',
  've': 't',
  'ue': 't',
  'an': 'j',
  'en': 'f',
  'in': 'b',
  'un': 'y',
  'vn': 'y',
  'ang': 'h',
  'eng': 'g',
  'ing': 'k',
  'ong': 's',
  'ia': 'x',
  'iao': 'n',
  'ian': 'm',
  'iang': 'l',
  'uang': 'l',
  'iong': 's',
  'ua': 'x',
  'uo': 'o',
  'uai': 'k',
  'uan': 'r',
  'van': 'r',
  'uen': 'y',
  'er': 'r',
};

// 零声母韵母特殊处理
export const zeroShengmuMap: Record<string, string> = {
  'a': 'aa',
  'o': 'oo',
  'e': 'ee',
  'ai': 'ai',
  'ei': 'ei',
  'ou': 'ou',
  'an': 'an',
  'en': 'en',
  'ang': 'ah',
  'eng': 'eg',
  'er': 'er',
  'ao': 'ac',
};

// 将拼音转换为小鹤双拼
export function pinyinToShuangpin(pinyin: string): string {
  const py = pinyin.toLowerCase().trim();
  
  // 处理零声母情况
  if ('aoe'.includes(py[0])) {
    // 先检查特殊零声母映射
    if (py in zeroShengmuMap) {
      return zeroShengmuMap[py];
    }
    // 三字母韵母，零声母+韵母所在键
    if (py in yunmuMap) {
      return py[0] + yunmuMap[py];
    }
    // 默认处理
    return py[0] + (py.length > 1 ? py.slice(1) : py[0]);
  }
  
  // 处理有声母的情况
  let sm = '';
  let ym = '';
  
  // 先尝试匹配两个字母的声母 (zh, ch, sh)
  if (py.length >= 2 && py.slice(0, 2) in shengmuMap) {
    sm = shengmuMap[py.slice(0, 2)];
    ym = py.slice(2);
  } else {
    sm = shengmuMap[py[0]] || py[0];
    ym = py.slice(1);
  }
  
  // 获取韵母编码
  const ymCode = yunmuMap[ym] || ym;
  
  return sm + ymCode;
}

// 验证双拼输入是否正确
export function verifyShuangpin(pinyin: string, input: string): boolean {
  const expected = pinyinToShuangpin(pinyin);
  return input.toLowerCase() === expected;
}

// 获取键盘布局 (小鹤双拼)
export const keyboardLayout = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

// 获取键位对应的韵母提示
export const keyYunmuHint: Record<string, string> = {
  'q': 'iu',
  'w': 'ei',
  'e': 'e',
  'r': 'uan',
  't': 've/ue',
  'y': 'un/vn',
  'u': 'sh',
  'i': 'ch',
  'o': 'o/uo',
  'p': 'ie',
  'a': 'a',
  's': 'ong/iong',
  'd': 'ai',
  'f': 'en',
  'g': 'eng',
  'h': 'ang',
  'j': 'an',
  'k': 'ing/uai',
  'l': 'iang/uang',
  'z': 'ou',
  'x': 'ia/ua',
  'c': 'ao',
  'v': 'zh/ui',
  'b': 'in',
  'n': 'iao',
  'm': 'ian',
};

// 获取键位对应的声母提示
export const keyShengmuHint: Record<string, string> = {
  'u': 'sh',
  'i': 'ch',
  'v': 'zh',
};

// 获取键位对应的字型字根提示（小鹤双形）
// 字型：首形 + 末形，每个部分取字根声母
export const keyXingmaHint: Record<string, string> = {
  'q': '犬千',
  'w': '文王',
  'e': '耳目',
  'r': '人日',
  't': '土田',
  'y': '言羊',
  'u': '山尸',
  'i': '水食',
  'o': '日月',
  'p': '片皮',
  'a': '鳌鱼',
  's': '三石',
  'd': '大丶',
  'f': '火方',
  'g': '革骨',
  'h': '禾户',
  'j': '金斤',
  'k': '口匚',
  'l': '立龙',
  'z': '足走',
  'x': '小心',
  'c': '艹虫',
  'v': '马豸',
  'b': '疒卜',
  'n': '女鸟',
  'm': '木皿',
};
