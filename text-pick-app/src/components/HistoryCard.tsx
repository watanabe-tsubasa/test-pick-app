import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HistoryEntry } from './Picker';

interface HistoryCardProps {
  history: HistoryEntry[]
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ history }) => {
  return (
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
  )
}