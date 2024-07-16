import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
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

  const confirmSubmit = () => {
    const newEntry: HistoryEntry = {
      store,
      staff,
      orderNumber,
      ...timestamps,
      submittedAt: new Date().toLocaleString()
    };
    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false)
    }, 3000);
    setHistory(prev => [newEntry, ...prev]);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
    setShowConfirmDialog(false);
    // Reset timestamps
    setTimestamps({
      start: "",
      picking: "",
      packing: "",
      complete: ""
    });
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
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
              <AlertDialogTrigger asChild>
                <Button onClick={handleSubmit} className="w-full" disabled={!isAllTimestampsSet}>送信</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>確認</AlertDialogTitle>
                  <AlertDialogDescription>
                    データを送信しますか？
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmSubmit}>
                    {isFetching ? <Loader2 className='animate-spin' /> : '送信'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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