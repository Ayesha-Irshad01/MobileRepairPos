import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';

const statuses = [
  'Received',
  'Diagnosing',
  'Awaiting Approval',
  'In Progress',
  'Testing',
  'Ready for Collection',
  'Delivered'
];

export function RepairTimeline({ currentStatus }) {
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="py-8 px-4 w-full overflow-x-auto">
      <div className="flex items-center justify-between min-w-[600px]">
        {statuses.map((status, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isPending = index > currentIndex;
          const isApproval = status === 'Awaiting Approval';
          const isErrorState = currentStatus === 'Cancelled';

          let icon = <Clock className="w-4 h-4 text-gray-400" />;
          let bgColor = 'bg-gray-100 border-gray-300';
          let textColor = 'text-gray-500';

          if (isErrorState) {
            if (isActive) {
              icon = <AlertCircle className="w-4 h-4 text-white" />;
              bgColor = 'bg-red-500 border-red-500';
              textColor = 'text-red-700 font-medium';
            }
          } else {
            if (isCompleted) {
              icon = <Check className="w-4 h-4 text-white" />;
              bgColor = 'bg-blue-600 border-blue-600';
              textColor = 'text-gray-900';
            } else if (isActive) {
              if (isApproval) {
                icon = <AlertCircle className="w-4 h-4 text-white" />;
                bgColor = 'bg-orange-500 border-orange-500';
                textColor = 'text-orange-700 font-bold';
              } else {
                icon = <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />;
                bgColor = 'bg-white border-blue-600 border-2';
                textColor = 'text-blue-700 font-bold';
              }
            }
          }

          return (
            <div key={status} className="flex flex-col items-center relative flex-1">
              {/* Connecting line */}
              {index !== 0 && (
                <div 
                  className={`absolute top-4 -left-1/2 w-full h-[2px] -z-10 ${
                    isCompleted || (isActive && !isErrorState) ? 'bg-blue-600' : 'bg-gray-200'
                  }`} 
                />
              )}
              
              {/* Circle */}
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center z-10 ${bgColor} shadow-sm transition-all duration-300`}>
                {icon}
              </div>
              
              {/* Label */}
              <div className={`mt-3 text-xs text-center px-2 ${textColor}`}>
                {status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
