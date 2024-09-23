// 'use client';

// import { useMemo } from 'react';
// import { User } from '@supabase/supabase-js';
// import { usePersonalAccountCredit } from '../hooks/use-personal-account-credit-data';

// export function PersonalAccountCreditBar({
//   user,
//   account,
// }: {
//   user: User;
//   account?: {
//     id: string | null;
//     name: string | null;
//     picture_url: string | null;
//   };
// }) {
//   const { data: personalAccountCreditData } = usePersonalAccountCredit(user.id);

//   // Declare hooks at the top, before any early returns
//   const convertTimeToMinutes = (time: string) => {
//     const timeParts = time.split(':').map(Number);
//     if (timeParts.length === 3) {
//       // HH:MM:SS format
//       const [hours, minutes, seconds] = timeParts;
//       return (hours || 0) * 60 + (minutes || 0) + (seconds || 0) / 60;
//     } else if (timeParts.length === 2) {
//       // MM:SS format
//       const [minutes, seconds] = timeParts;
//       return (minutes || 0) + (seconds || 0) / 60;
//     }
//     return 0;
//   };

//   const totalTimeInMinutes = useMemo(() => {
//     return convertTimeToMinutes(personalAccountCreditData?.totalTime || '00:00:00');
//   }, [personalAccountCreditData]);

//   const remainingTimeInMinutes = useMemo(() => {
//     return convertTimeToMinutes(personalAccountCreditData?.credit || '00:00:00');
//   }, [personalAccountCreditData]);

//   const percentageRemaining = useMemo(() => {
//     if (totalTimeInMinutes === 0) return 100; // Full bar if no total time is available
//     return Math.max((remainingTimeInMinutes / totalTimeInMinutes) * 100, 0); // Ensure percentage doesn't go below 0
//   }, [totalTimeInMinutes, remainingTimeInMinutes]);

//   // Handle loading or no data states after hooks are declared
//   if (!personalAccountCreditData) {
//     return null;
//   }

//   return (
//     <div className="w-full">
//       <div className="flex items-center justify-between mb-2">
//         <p className="text-sm">{personalAccountCreditData?.tier || 'Free'}</p>
//       </div>
//       <div className="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden">
//         <div
//           className="absolute top-0 left-0 h-full bg-[#A08FFF]"
//           style={{ width: `${percentageRemaining}%` }}
//         />
//       </div>
//       <p className="text-sm mt-2 text-right font-medium text-muted-foreground">
//         {remainingTimeInMinutes.toFixed(2)}/{totalTimeInMinutes.toFixed(2)} min
//       </p>
//     </div>
//   );
// }
// 'use client';

// import { useMemo } from 'react';
// import { User } from '@supabase/supabase-js';
// import { usePersonalAccountCredit } from '../hooks/use-personal-account-credit-data';

// export function PersonalAccountCreditBar({
//   user,
//   account,
// }: {
//   user: User;
//   account?: {
//     id: string | null;
//     name: string | null;
//     picture_url: string | null;
//   };
// }) {
//   const { data: personalAccountCreditData } = usePersonalAccountCredit(user.id);

//   // Function to convert time to minutes
//   const convertTimeToMinutes = (time: string) => {
//     const timeParts = time.split(':').map(Number);
//     if (timeParts.length === 3) {
//       // HH:MM:SS format
//       const [hours, minutes, seconds] = timeParts;
//       return (hours || 0) * 60 + (minutes || 0) + (seconds || 0) / 60;
//     } else if (timeParts.length === 2) {
//       // MM:SS format
//       const [minutes, seconds] = timeParts;
//       return (minutes || 0) + (seconds || 0) / 60;
//     }
//     return 0;
//   };

//   // Calculate remaining time in minutes
//   const remainingTimeInMinutes = useMemo(() => {
//     return convertTimeToMinutes(personalAccountCreditData?.credit || '00:00:00');
//   }, [personalAccountCreditData]);

//   // Handle loading or no data states after hooks are declared
//   if (!personalAccountCreditData) {
//     return null;
//   }

//   return (
//     <div className="w-full">
//       <div className="flex items-center justify-between mb-2">
//         <p className="text-sm">{personalAccountCreditData?.tier || 'Free'}</p>
//       </div>
//       <div className="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden">
//         <div
//           className="absolute top-0 left-0 h-full bg-[#A08FFF]"
//           style={{ width: `100%` }} // The bar is always 100% since we're not comparing to total time
//         />
//       </div>
//       <p className="text-sm mt-2 text-right font-medium text-muted-foreground">
//         {remainingTimeInMinutes.toFixed(2)}/min left
//       </p>
//     </div>
//   );
// }
'use client';

import { useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { usePersonalAccountCredit } from '../hooks/use-personal-account-credit-data';

export function PersonalAccountCreditBar({
  user,
}: {
  user: User;
  account?: {
    id: string | null;
    name: string | null;
    picture_url: string | null;
  };
}) {
  const { data: personalAccountCreditData } = usePersonalAccountCredit(user.id);

  const remainingTime = useMemo(() => {
    return personalAccountCreditData?.credit || '00:00:00';
  }, [personalAccountCreditData]);

  if (!personalAccountCreditData) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm">{personalAccountCreditData?.tier || 'Free'}</p>
      </div>
      <div className="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-[#A08FFF]"
          style={{ width: `100%` }} // The bar is always 100% since we're not comparing to total time
        />
      </div>
      <p className="text-sm mt-2 text-right font-medium text-muted-foreground">
        {remainingTime}
      </p>
    </div>
  );
}


