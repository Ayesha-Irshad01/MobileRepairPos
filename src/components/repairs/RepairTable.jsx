import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export function RepairTable({ repairs = [] }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Received': return 'default';
      case 'Diagnosing': return 'warning';
      case 'Awaiting Approval': return 'warning';
      case 'In Progress': return 'primary';
      case 'Testing': return 'purple';
      case 'Ready for Collection': return 'success';
      case 'Delivered': return 'success';
      case 'Cancelled': return 'danger';
      default: return 'default';
    }
  };

  if (!repairs || repairs.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <Eye className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-lg font-medium">No repairs found</p>
        <p className="text-sm mt-1">Try adjusting your filters or create a new repair.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 font-medium tracking-wider">Ticket ID</th>
            <th className="px-4 py-3 font-medium tracking-wider">Customer</th>
            <th className="px-4 py-3 font-medium tracking-wider">Device</th>
            <th className="px-4 py-3 font-medium tracking-wider">Issue</th>
            <th className="px-4 py-3 font-medium tracking-wider">Status</th>
            <th className="px-4 py-3 font-medium tracking-wider">Date</th>
            <th className="px-4 py-3 font-medium tracking-wider text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {repairs.map((repair) => (
            <tr key={repair._id || repair.id} className="bg-white hover:bg-slate-50 transition-colors duration-150">
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                #{repair.ticketNumber || (repair._id || repair.id).slice(-6).toUpperCase()}
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{repair.customer?.name || 'Unknown Customer'}</div>
                <div className="text-xs text-gray-500">{repair.customer?.phone || 'No phone'}</div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{repair.device?.brand} {repair.device?.model}</div>
              </td>
              <td className="px-4 py-3 max-w-[200px] truncate" title={repair.issueDescription}>
                {repair.issueDescription}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Badge variant={getStatusColor(repair.status)}>
                  {repair.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                {new Date(repair.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-left whitespace-nowrap">
                <div className="flex items-center justify-start space-x-2">
                  <Link 
                    href={`/dashboard/repairs/${repair._id || repair.id}`}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit Repair">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete Repair">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
