'use client';

import React, { useEffect, useMemo, useState } from 'react';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';

import { usePersonalAccountCredit } from '../../../../../../packages/features/accounts/src/hooks/use-personal-account-credit-data';

const colors = ['#5EECFF', '#A08FFF'];

interface PlanData {
  name: string;
  remainingTime: number;
}

export function CreditBarChart(
  props: React.PropsWithChildren<{
    userId: string;
  }>,
) {
  const [isClient, setIsClient] = useState<boolean>(false);
  const {
    data: user,
    isPending,
    error,
  } = usePersonalAccountCredit(props.userId);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const convertTimeToMinutes = (time: string) => {
    // Assuming the time format is in 'HH:MM:SS' or 'MM:SS'
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return (hours || 0) * 60 + (minutes || 0) + (seconds || 0) / 60;
  };

  const selectedPlan: PlanData = useMemo<PlanData>(() => {
    if (!user) return { name: 'Loading...', remainingTime: 0 };

    const remainingMinutes = convertTimeToMinutes(user?.credit || '00:00:00'); // Remaining time from user's credit

    return {
      name: user?.tier || 'Unknown Plan', // Plan name (tier)
      remainingTime: remainingMinutes, // Remaining time from user's credit
    };
  }, [user]);

  const renderChart = useMemo(() => {
    if (!selectedPlan || isPending || error) return null;

    // Prepare data for the bar chart (showing only remaining time)
    const data = [{ name: 'Remaining Time', time: selectedPlan.remainingTime }];
    function CustomTooltip() {
      return <div>{user?.credit || '00:00:00'}</div>;
    }
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Current Plan ({selectedPlan.name})</CardTitle>
          <CardDescription>
            Showing the remaining time for the {selectedPlan.name}.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="time" fill={colors[0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }, [selectedPlan, isPending, error]);

  if (!isClient) {
    return null;
  }

  if (error || !user) {
    return <div>No Subscription</div>;
  }

  return <div>{renderChart}</div>;
}
