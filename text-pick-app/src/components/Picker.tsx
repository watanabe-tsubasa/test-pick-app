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
  ready: string;
  moveStart: string;
  moveEnd: string;
  picking: string;
  packing: string;
  complete: string;
  customerStart: string;
  customerEnd: string;
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
    ready: "",
    moveStart: "",
    moveEnd: "",
    picking: "",
    packing: "",
    complete: "",
    customerStart: "",
    customerEnd: "",
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

  const handleOrderNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLocked) setOrderNumber(e.target.value);
  };

  const handleTimeStamp = (action: keyof Timestamps) => {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 8);
    setTimestamps(prev => ({ ...prev, [action]: timeString }));
  };

  const handleTimeChange = (action: keyof Timestamps, value: string) => {
    setTimestamps(prev => ({ ...prev, [action]: value }));
  };

  const handleSubmit = () => {
    handleTimeStamp('complete');
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
          '準備開始': timestamps.ready,
          '移動開始': timestamps.moveStart,
          '棚前到着': timestamps.moveEnd,
          'ピック開始': timestamps.picking,
          '梱包開始': timestamps.packing,
          '完了': timestamps.complete,
          'お客さま対応開始': timestamps.customerStart,
          'お客さま対応終了': timestamps.customerEnd,
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
        ready: "",
        moveStart: timestamps.complete,
        moveEnd: "",
        picking: "",
        packing: "",
        complete: "",
        customerStart: "",
        customerEnd: "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <Tabs defaultValue="input" className="w-full max-w-3xl mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="input">データ入力</TabsTrigger>
        <TabsTrigger value="history">履歴</TabsTrigger>
      </TabsList>
      <TabsContent value="input">
        <Card>
          <CardHeader>
            <div className='flex'>
              <CardTitle className='flex items-center flex-grow'>ピッキングレート計測</CardTitle>
              <div className="flex flex-col items-center space-y-2">
                <Label htmlFor="lock-switch">ロック</Label>
                <Switch
                  id="lock-switch"
                  checked={isLocked}
                  onCheckedChange={setIsLocked}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className='grid grid-cols-2 gap-2'>
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
            </div>
            <Input
             type="text"
             placeholder='注文番号を入力'
             value={orderNumber}
             onChange={handleOrderNumberChange}
             disabled={isLocked}
            />
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(timestamps) as Array<keyof Timestamps>)
                .filter((key) => key !== 'complete')
                .map((key) => (
                  <React.Fragment key={key}>
                    <Button 
                      variant={['ready', 'moveStart', 'customerStart', 'customerEnd'].includes(key) ? "outline" : "secondary"} 
                      onClick={() => handleTimeStamp(key)} 
                      className="w-full"
                    >
                      {key === 'ready' ? '準備開始' :
                      key === 'moveStart' ? '移動開始' :
                      key === 'moveEnd' ? '棚前到着' :
                      key === 'picking' ? 'ピック開始' :
                      key === 'packing' ? '梱包開始' :
                      key === 'customerStart' ? 'お客さま対応開始' :
                      'お客さま対応終了'}
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
                <Button onClick={handleSubmit} className="w-full">完了</Button>
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
                    {isFetching ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
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
              <div key={index} className="p-4 mb-4 border rounded">
                <p>店舗: {entry.store}</p>
                <p>担当者: {entry.staff}</p>
                <p>注文番号: {entry.orderNumber}</p>
                <p>準備開始: {entry.ready}</p>
                <p>移動開始: {entry.moveStart}</p>
                <p>棚前到着: {entry.moveEnd}</p>
                <p>ピック開始: {entry.picking}</p>
                <p>梱包開始: {entry.packing}</p>
                <p>完了: {entry.complete}</p>
                <p>お客さま対応開始: {entry.customerStart}</p>
                <p>お客さま対応終了: {entry.customerEnd}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default PickingRateApp;
