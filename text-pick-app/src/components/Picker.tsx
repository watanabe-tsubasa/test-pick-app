import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';

interface Timestamps {
  start: string;
  picking: string;
  packing: string;
  complete: string;
}

interface HistoryEntry extends Timestamps {
  store: string;
  staff: string;
  orderNumber: string;
  submittedAt: string;
}

const PickingRateApp: React.FC = () => {
  const [store, setStore] = useState<string>("");
  const [staff, setStaff] = useState<string>("");
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [timestamps, setTimestamps] = useState<Timestamps>({
    start: "",
    picking: "",
    packing: "",
    complete: ""
  });
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handleStoreChange = (value: string) => {
    if (!isLocked) setStore(value);
  };

  const handleStaffChange = (value: string) => {
    if (!isLocked) setStaff(value);
  };

  const handleOrderNumberChange = (value: string) => {
    if (!isLocked) setOrderNumber(value);
  };

  const handleButtonClick = (action: keyof Timestamps) => {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 8);
    setTimestamps(prev => ({ ...prev, [action]: timeString }));
  };

  const handleTimeChange = (action: keyof Timestamps, value: string) => {
    setTimestamps(prev => ({ ...prev, [action]: value }));
  };

  const handleSubmit = () => {
    setShowConfirmDialog(true);
  };

  const confirmSubmit = async () => {
    setIsFetching(true);
    try {
      const res = await fetch(`https://api.steinhq.com/v1/storages/6695d1ac4d11fd04f013d7f0/${store}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify([{
          '担当者': staff,
          '注文番号': orderNumber,
          '移動開始': timestamps.start,
          'ピッキング': timestamps.picking,
          '梱包': timestamps.packing,
          '完了': timestamps.complete
        }])
      });
      const json = await res.json();
      console.log(json);  
      
      const newEntry: HistoryEntry = {
        store,
        staff,
        orderNumber,
        ...timestamps,
        submittedAt: new Date().toLocaleString()
      };
      setHistory(prev => [newEntry, ...prev]);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      
      // Reset timestamps
      setTimestamps({
        start: "",
        picking: "",
        packing: "",
        complete: ""
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
      setShowConfirmDialog(false);
    }
  };

  const isAllTimestampsSet = Object.values(timestamps).every(timestamp => timestamp !== "");

  return (
    <Tabs defaultValue="input" className="w-full max-w-3xl mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="input">データ入力</TabsTrigger>
        <TabsTrigger value="history">履歴</TabsTrigger>
      </TabsList>

      <TabsContent value="input">
        <Card>
          <CardHeader>
            <CardTitle>ピッキングレート計測</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="lock-switch"
                checked={isLocked}
                onCheckedChange={setIsLocked}
              />
              <Label htmlFor="lock-switch">プルダウンをロック</Label>
            </div>
            <Select onValueChange={handleStoreChange} value={store} disabled={isLocked}>
              <SelectTrigger>
                <SelectValue placeholder="店舗を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="東雲">東雲</SelectItem>
                <SelectItem value="八千代緑が丘">八千代緑が丘</SelectItem>
                <SelectItem value="葛西">葛西</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={handleStaffChange} value={staff} disabled={isLocked}>
              <SelectTrigger>
                <SelectValue placeholder="担当者を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="齋藤">齋藤</SelectItem>
                <SelectItem value="鉄川">鉄川</SelectItem>
                <SelectItem value="筒井">筒井</SelectItem>
                <SelectItem value="渡邊">渡邊</SelectItem>
                <SelectItem value="岩岡">岩岡</SelectItem>
                <SelectItem value="坂口">坂口</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={handleOrderNumberChange} value={orderNumber} disabled={isLocked}>
              <SelectTrigger>
                <SelectValue placeholder="注文番号を選択" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <SelectItem key={num} value={`注文${num}`}>注文{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(timestamps) as Array<keyof Timestamps>).map((key) => (
                <React.Fragment key={key}>
                  <Button onClick={() => handleButtonClick(key)} className="w-full">
                    {key === 'start' ? '移動開始' :
                     key === 'picking' ? 'ピッキング' :
                     key === 'packing' ? '梱包' : '完了'}
                  </Button>
                  <Input
                    type="time"
                    value={timestamps[key]}
                    onChange={(e) => handleTimeChange(key, e.target.value)}
                    step="1"
                    className="w-full"
                  />
                </React.Fragment>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
              <DialogTrigger asChild>
                <Button onClick={handleSubmit} className="w-full" disabled={!isAllTimestampsSet}>送信</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>確認</DialogTitle>
                  <DialogDescription>
                    データを送信しますか？
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button className='m-1' variant="outline" onClick={() => setShowConfirmDialog(false)}>キャンセル</Button>
                  <Button className='m-1' onClick={confirmSubmit} disabled={isFetching}>
                    {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isFetching ? '送信中...' : '送信'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
          {showAlert && (
            <Alert className="mt-4">
              <AlertTitle>成功</AlertTitle>
              <AlertDescription>データが正常に送信されました。</AlertDescription>
            </Alert>
          )}
        </Card>
      </TabsContent>

      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>履歴</CardTitle>
          </CardHeader>
          <CardContent>
            {history.map((entry, index) => (
              <div key={index} className="mb-4 p-4 border rounded">
                <p>店舗: {entry.store}</p>
                <p>担当者: {entry.staff}</p>
                <p>注文番号: {entry.orderNumber}</p>
                <p>移動開始: {entry.start}</p>
                <p>ピッキング: {entry.picking}</p>
                <p>梱包: {entry.packing}</p>
                <p>完了: {entry.complete}</p>
                <p>送信時刻: {entry.submittedAt}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default PickingRateApp;