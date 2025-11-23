import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { summaryCards as CardType } from '@/services/data/dashboard.api';

interface SummaryCardsProps {
  cards: typeof CardType;
}

export default function SummaryCards({ cards }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-slate-600 text-sm">{card.title}</CardTitle>
              <div className={`${card.bgColor} p-1.5 rounded-lg`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-slate-900 text-2xl">{card.value}</div>
              <p className="text-slate-500 text-xs">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
