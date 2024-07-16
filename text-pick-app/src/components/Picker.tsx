import React, { useReducer, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { HistoryCard } from './HistoryCard';
import { NumberSelector, StringSelector } from './CommonSelector';
import { timestampReducer } from '@/reducer';
import { Loader2 } from 'lucide-react';

export interface Timestamps {
  start: string;
  picking: string;
  packing: string;
  complete: string;
}

export interface HistoryEntry extends Timestamps {
  store: string;
  staff: string;
  orderNumber: string;
  submittedAt: string;
}

export const initialTimestamps = {
  start: "",
  picking: "",
  packing: "",
  complete: ""
}

export const PickingRateApp: React.FC = () => {
  const storeValues = ['東雲', '八千代緑が丘', '葛西']
  const staffValues = ['齋藤', '鉄川', '筒井', '渡邊', '岩岡', '坂口']
  const orderValues = [1,2,3,4,5,6]
  const [store, setStore] = useState<string>("");
  const [staff, setStaff] = useState<string>("");
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [timestamps, dispatch] = useReducer(timestampReducer, initialTimestamps);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [isFetching, setIsfetching] = useState<boolean>(false);

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
    dispatch({ type:'SET_TIMESTAMP', action, value: timeString})
  };

  const handleTimeChange = (action: keyof Timestamps, value: string) => {
    dispatch({ type: 'SET_TIMESTAMP', action, value})
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
    setIsfetching(true);
    setTimeout(() => {
      setIsfetching(false);
    }, 3000)
    setHistory(prev => [newEntry, ...prev]);
    toast("Event has been created", {
      description: "Sunday, December 03, 2023 at 9:00 AM",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    })
    setShowConfirmDialog(false);
    dispatch({ type: 'RESET_TIMESTAMPS' })
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
            <StringSelector
             onValueChange={handleStoreChange}
             value={store}
             disabled={isLocked}
             placeholder='店舗を選択'
             values={storeValues}
            />
            <StringSelector
             onValueChange={handleStaffChange}
             value={staff}
             disabled={isLocked}
             placeholder='担当者を選択'
             values={staffValues}
            />
            <NumberSelector
             onValueChange={handleOrderNumberChange}
             value={orderNumber}
             disabled={isLocked}
             placeholder='注文番号を選択'
             values={orderValues}
            />
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(timestamps) as Array<keyof Timestamps>).map((key) => (
                <React.Fragment key={key}>
                  <Button variant='secondary' onClick={() => handleButtonClick(key)} className="w-full">
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
                    {isFetching? <Loader2 /> :'データを送信しますか？'}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmSubmit}>送信</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="history">
        <HistoryCard history={history} />
      </TabsContent>
    </Tabs>
  );
};

export default PickingRateApp;