import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShuangpinPractice } from '@/components/ShuangpinPractice';
import { XingmaPractice } from '@/components/XingmaPractice';
import { FullPractice } from '@/components/FullPractice';
import { OverviewPractice } from '@/components/OverviewPractice';
import { Keyboard } from '@/components/Keyboard';
import type { CharData, InputRecord, PracticeMode } from '@/types';
import { BookOpen, Keyboard as KeyboardIcon, Layers, GraduationCap, Info, Grid3X3 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import './App.css';

function App() {
  const [charData, setCharData] = useState<CharData[]>([]);
  const [loading, setLoading] = useState(true);
  const [practiceRecords, setPracticeRecords] = useState<Record<PracticeMode, InputRecord[]>>({
    shuangpin: [],
    xingma: [],
    full: [],
  });

  // 加载字库数据
  useEffect(() => {
    fetch('/data/char_database.json')
      .then(res => res.json())
      .then((data: CharData[]) => {
        setCharData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load char database:', err);
        setLoading(false);
      });
  }, []);

  const handlePracticeComplete = (mode: PracticeMode, records: InputRecord[]) => {
    setPracticeRecords(prev => ({
      ...prev,
      [mode]: [...prev[mode], ...records],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* 头部 */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">鹤</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">小鹤音型打字练习</h1>
                <p className="text-xs text-muted-foreground">双拼 + 字型 = 四码输入</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>关于小鹤音型</DialogTitle>
                    <DialogDescription>
                      小鹤音型是一种高效的汉字输入方案
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <section>
                      <h3 className="font-semibold mb-2">什么是小鹤音型？</h3>
                      <p className="text-sm text-muted-foreground">
                        小鹤音型是单字以双拼（小鹤双拼）+ 双形（鹤形）组合的标准四码音形类输入方案。
                        双拼是声母、韵母各用一个字母表示，一个汉字的音用两个字母表达；
                        双形是根据拆分规则把一个汉字按字根拆分出两个部分，以区分同音字。
                      </p>
                    </section>
                    <section>
                      <h3 className="font-semibold mb-2">编码规则</h3>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>单字全码四码：前两码双拼，后两码双形</li>
                        <li>双拼：声母 + 韵母（各1键）</li>
                        <li>字型：首形 + 末形（各1键）</li>
                        <li>例如："小" = xn（双拼）+ ld（字型）= xnld</li>
                      </ul>
                    </section>
                    <section>
                      <h3 className="font-semibold mb-2">双拼键位</h3>
                      <div className="bg-muted rounded-lg p-4">
                        <Keyboard showHints={true} />
                      </div>
                    </section>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="shuangpin" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="shuangpin" className="flex items-center gap-2">
              <KeyboardIcon className="h-4 w-4" />
              <span className="hidden sm:inline">双拼练习</span>
              <span className="sm:hidden">双拼</span>
            </TabsTrigger>
            <TabsTrigger value="xingma" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">字型练习</span>
              <span className="sm:hidden">字型</span>
            </TabsTrigger>
            <TabsTrigger value="full" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">完整练习</span>
              <span className="sm:hidden">完整</span>
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:inline">总览练习</span>
              <span className="sm:hidden">总览</span>
            </TabsTrigger>
            <TabsTrigger value="guide" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">学习指南</span>
              <span className="sm:hidden">指南</span>
            </TabsTrigger>
          </TabsList>

          {/* 双拼练习 */}
          <TabsContent value="shuangpin">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ShuangpinPractice 
                  charData={charData} 
                  onComplete={(records) => handlePracticeComplete('shuangpin', records)}
                />
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">练习统计</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">总练习字数</span>
                        <Badge variant="secondary">{practiceRecords.shuangpin.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">正确率</span>
                        <Badge variant="default">
                          {practiceRecords.shuangpin.length > 0
                            ? Math.round(
                                (practiceRecords.shuangpin.filter(r => r.isCorrect).length /
                                  practiceRecords.shuangpin.length) *
                                  100
                              )
                            : 0}
                          %
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">双拼规则</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>• 声母 + 韵母 = 2键</p>
                    <p>• zh→v, ch→i, sh→u</p>
                    <p>• 零声母：a→aa, o→oo</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 字型练习 */}
          <TabsContent value="xingma">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <XingmaPractice 
                  charData={charData}
                  onComplete={(records) => handlePracticeComplete('xingma', records)}
                />
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">练习统计</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">总练习字数</span>
                        <Badge variant="secondary">{practiceRecords.xingma.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">正确率</span>
                        <Badge variant="default">
                          {practiceRecords.xingma.length > 0
                            ? Math.round(
                                (practiceRecords.xingma.filter(r => r.isCorrect).length /
                                  practiceRecords.xingma.length) *
                                  100
                              )
                            : 0}
                          %
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">字型规则</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>• 首形 + 末形 = 2键</p>
                    <p>• 按字根声母取码</p>
                    <p>• 小字、部件、笔画</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 完整练习 */}
          <TabsContent value="full">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FullPractice 
                  charData={charData}
                  onComplete={(records) => handlePracticeComplete('full', records)}
                />
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">练习统计</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">总练习字数</span>
                        <Badge variant="secondary">{practiceRecords.full.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">正确率</span>
                        <Badge variant="default">
                          {practiceRecords.full.length > 0
                            ? Math.round(
                                (practiceRecords.full.filter(r => r.isCorrect).length /
                                  practiceRecords.full.length) *
                                  100
                              )
                            : 0}
                          %
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">完整编码</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>• 双拼（2码）+ 字型（2码）</p>
                    <p>• 共4码定位一个汉字</p>
                    <p>• 四码上屏，精准输入</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 总览版练习 */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>总览版自由练习</CardTitle>
                <CardDescription>
                  所有汉字一次性展示，自由输入练习，不强制检查对错
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OverviewPractice charData={charData} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 学习指南 */}
          <TabsContent value="guide">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>小鹤双拼键位表</CardTitle>
                  <CardDescription>
                    熟练掌握键位是双拼输入的基础
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center py-4">
                    <Keyboard showHints={true} />
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>声母对照表</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>zh</span>
                        <span className="font-bold text-primary">v</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>ch</span>
                        <span className="font-bold text-primary">i</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>sh</span>
                        <span className="font-bold text-primary">u</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>b</span>
                        <span className="font-bold">b</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>p</span>
                        <span className="font-bold">p</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>m</span>
                        <span className="font-bold">m</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>f</span>
                        <span className="font-bold">f</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>d</span>
                        <span className="font-bold">d</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>t</span>
                        <span className="font-bold">t</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>n</span>
                        <span className="font-bold">n</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>l</span>
                        <span className="font-bold">l</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>g</span>
                        <span className="font-bold">g</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>k</span>
                        <span className="font-bold">k</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>h</span>
                        <span className="font-bold">h</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>j</span>
                        <span className="font-bold">j</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>q</span>
                        <span className="font-bold">q</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>x</span>
                        <span className="font-bold">x</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>r</span>
                        <span className="font-bold">r</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>z</span>
                        <span className="font-bold">z</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>c</span>
                        <span className="font-bold">c</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>s</span>
                        <span className="font-bold">s</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>y</span>
                        <span className="font-bold">y</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>w</span>
                        <span className="font-bold">w</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>韵母对照表</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>a</span>
                        <span className="font-bold">a</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>o</span>
                        <span className="font-bold">o</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>e</span>
                        <span className="font-bold">e</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>i</span>
                        <span className="font-bold">i</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>u</span>
                        <span className="font-bold">u</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>v</span>
                        <span className="font-bold">v</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>ai</span>
                        <span className="font-bold text-primary">d</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>ei</span>
                        <span className="font-bold text-primary">w</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>ui</span>
                        <span className="font-bold text-primary">v</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>ao</span>
                        <span className="font-bold text-primary">c</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>ou</span>
                        <span className="font-bold text-primary">z</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>iu</span>
                        <span className="font-bold text-primary">q</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>ie</span>
                        <span className="font-bold text-primary">p</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>ve/ue</span>
                        <span className="font-bold text-primary">t</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>an</span>
                        <span className="font-bold text-primary">j</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>en</span>
                        <span className="font-bold text-primary">f</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>in</span>
                        <span className="font-bold text-primary">b</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>un/vn</span>
                        <span className="font-bold text-primary">y</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>ang</span>
                        <span className="font-bold text-primary">h</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>eng</span>
                        <span className="font-bold text-primary">g</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>ing</span>
                        <span className="font-bold text-primary">k</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>ong</span>
                        <span className="font-bold text-primary">s</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>ia/ua</span>
                        <span className="font-bold text-primary">x</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>iao</span>
                        <span className="font-bold text-primary">n</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>ian</span>
                        <span className="font-bold text-primary">m</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>iang/uang</span>
                        <span className="font-bold text-primary">l</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>uan/van</span>
                        <span className="font-bold text-primary">r</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>uai</span>
                        <span className="font-bold text-primary">k</span>
                      </div>
                      <div className="flex justify-between p-2 bg-muted rounded">
                        <span>er</span>
                        <span className="font-bold text-primary">r</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>编码示例</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { char: '小', pinyin: 'xiao', shuangpin: 'xn', xingma: 'ld', full: 'xnld' },
                      { char: '鹤', pinyin: 'he', shuangpin: 'he', xingma: 'dn', full: 'hedn' },
                      { char: '音', pinyin: 'yin', shuangpin: 'yb', xingma: 'lo', full: 'yblo' },
                      { char: '型', pinyin: 'xing', shuangpin: 'xk', xingma: 'kp', full: 'xkkp' },
                    ].map((item) => (
                      <div key={item.char} className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-4xl font-bold mb-2">{item.char}</div>
                        <div className="text-sm text-muted-foreground">{item.pinyin}</div>
                        <div className="mt-2 font-mono">
                          <span className="text-blue-600">{item.shuangpin}</span>
                          <span className="text-purple-600">{item.xingma}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{item.full}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* 页脚 */}
      <footer className="border-t mt-12 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>小鹤音型打字练习 - 提升你的输入效率</p>
          <p className="mt-1">字库共 {charData.length} 个常用汉字</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
