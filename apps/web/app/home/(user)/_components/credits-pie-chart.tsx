"use client";
import React, { useMemo, useState, useEffect } from 'react';
import { Pie, PieChart, Cell, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';

const colors = ['#5EECFF', '#A08FFF'];

interface PlanData {
  name: string;
  credits: number;
}

interface ChartData {
  name: string;
  credits: number;
}

export function CreditPieChart() {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const plans = useMemo<PlanData[]>(() => [
    { name: 'Free Plan', credits: 1 },
    { name: '$5 Plan', credits: 5 },
    { name: '$10 Plan', credits: 10 },
    { name: '$20 Plan', credits: 30 },
  ], []);

  const renderCharts = useMemo(() => {
    return plans.map((plan, index) => {
      const creditsUsed = Math.floor(Math.random() * plan.credits);
      const remainingCredits = plan.credits - creditsUsed;

      const data: ChartData[] = [
        { name: 'Used Credits', credits: creditsUsed },
        { name: 'Remaining Credits', credits: remainingCredits > 0 ? remainingCredits : 0 },
      ];

      return (
        <Card key={index} className="mb-4">
          <CardHeader>
            <CardTitle>Credits Details ({plan.name})</CardTitle>
            <CardDescription>
              Remaining podcast credits for the {plan.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <PieChart width={400} height={400}>
              <Pie
                data={data}
                dataKey="credits"
                nameKey="name"
                cx={120}
                cy={200}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                blendStroke
                paddingAngle={5}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </CardContent>
        </Card>
      );
    });
  }, [plans]);

  if (!isClient) {
    return null;
  }

  return (
    <div>
      {renderCharts}
    </div>
  );
}
