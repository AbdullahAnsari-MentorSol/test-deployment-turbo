'use client';

import { useEffect, useMemo, useState } from 'react';

import { ArrowDown, ArrowUp, Menu } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import { Badge } from '@kit/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@kit/ui/chart';

import { useMrrData } from '../../../../../packages/features/admin/src/hooks/mrr-chart-data';

export default function MrrChart() {
  const { data: mrrData, isLoading } = useMrrData();
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || isLoading) {
    return;
  }

  const chartData = Object.entries(mrrData || {}).map(([key, value]) => {
    const [month, year] = key.split('-');
    const formattedDate = new Date(Number(year), Number(month));
    const formatter = new Intl.DateTimeFormat('en-us', {
      month: 'long',
      year: '2-digit',
    });

    return {
      name: formatter.format(formattedDate),
      value: value.toFixed(2),
    };
  });

  if (chartData.length === 0) {
    return (
      <div
        className={
          'flex flex-col space-y-4 pb-36 duration-500 animate-in fade-in'
        }
      >
        <Card>
          <CardHeader>
            <CardTitle className={'flex items-center gap-2.5'}>
              <span>MRR</span>
            </CardTitle>

            <CardDescription>
              <span>No data available</span>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const lastValue = chartData[chartData.length - 1]?.value;

  return (
    <div
      className={
        'flex flex-col space-y-4 pb-36 duration-500 animate-in fade-in'
      }
    >
      <Card>
        <CardHeader>
          <CardTitle className={'flex items-center gap-2.5'}>
            <span>MRR</span>
            <Trend trend={'up'}>20%</Trend>
          </CardTitle>

          <CardDescription>
            <span>Monthly recurring revenue</span>
          </CardDescription>

          <div>
            <Figure>{`$${lastValue}`}</Figure>
          </div>
        </CardHeader>

        <CardContent className={'space-y-4'}>
          <Chart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
}

function Chart(
  props: React.PropsWithChildren<{ data: { value: string; name: string }[] }>,
) {
  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: 'hsl(var(--chart-1))',
    },
    mobile: {
      label: 'Mobile',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig}>
      <LineChart accessibilityLayer data={props.data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Line
          dataKey="value"
          type="linear"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={true}
        />
      </LineChart>
    </ChartContainer>
  );
}

function Figure(props: React.PropsWithChildren) {
  return (
    <div className={'font-heading text-2xl font-semibold'}>
      {props.children}
    </div>
  );
}

function Trend(
  props: React.PropsWithChildren<{
    trend: 'up' | 'down' | 'stale';
  }>,
) {
  const Icon = useMemo(() => {
    switch (props.trend) {
      case 'up':
        return <ArrowUp className={'h-3 w-3 text-green-500'} />;
      case 'down':
        return <ArrowDown className={'h-3 w-3 text-destructive'} />;
      case 'stale':
        return <Menu className={'h-3 w-3 text-orange-500'} />;
    }
  }, [props.trend]);

  return (
    <div>
      <BadgeWithTrend trend={props.trend}>
        <span className={'flex items-center space-x-1'}>
          {Icon}
          <span>{props.children}</span>
        </span>
      </BadgeWithTrend>
    </div>
  );
}

function BadgeWithTrend(props: React.PropsWithChildren<{ trend: string }>) {
  const className = useMemo(() => {
    switch (props.trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-destructive';
      case 'stale':
        return 'text-orange-500';
    }
  }, [props.trend]);

  return (
    <Badge
      variant={'outline'}
      className={'border-transparent px-1.5 font-normal'}
    >
      <span className={className}>{props.children}</span>
    </Badge>
  );
}
