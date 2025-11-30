import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

export interface SummaryCardItem {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

interface SummaryCardsProps {
  cards: SummaryCardItem[];
}

export default function SummaryCards({ cards }: SummaryCardsProps) {
  // Dynamic grid: show up to 5 columns on larger screens
  const gridCols =
    cards.length >= 5
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      : cards.length === 4
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        : cards.length === 3
          ? 'grid-cols-1 sm:grid-cols-3'
          : 'grid-cols-1 md:grid-cols-2';

  return (
    <div className={`grid ${gridCols} gap-3`}>
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
