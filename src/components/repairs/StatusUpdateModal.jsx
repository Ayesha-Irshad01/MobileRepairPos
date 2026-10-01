'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { repairApi } from '@/lib/api/repairs';

const statusFlow = {
  'Received': ['Diagnosing', 'Cancelled'],
  'Diagnosing': ['Awaiting Approval', 'In Progress', 'Cancelled'],
  'Awaiting Approval': ['In Progress', 'Cancelled'],
  'In Progress': ['Testing'],
  'Testing': ['Ready for Collection', 'In Progress'],
  'Ready for Collection': ['Delivered'],
  'Delivered': [],
  'Cancelled': []
};

export function StatusUpdateModal({ isOpen, onClose, currentStatus, repairId, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);

  const validNextStatuses = statusFlow[currentStatus] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStatus) return;
    
    setLoading(true);
    setError(null);
    try {
      await repairApi.updateStatus(repairId, selectedStatus, notes);
      onUpdate(selectedStatus, notes);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Repair Status">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-600 font-medium">{currentStatus}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
          <div className="space-y-2">
            {validNextStatuses.length === 0 ? (
              <p className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded-lg">No further statuses available in the workflow.</p>
            ) : (
              validNextStatuses.map(status => (
                <label key={status} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${selectedStatus === status ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50 border-gray-200'}`}>
                  <input 
                    type="radio" 
                    name="status" 
                    value={status} 
                    checked={selectedStatus === status}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">{status}</span>
                </label>
              ))
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Internal Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Add any technical notes, findings, or reasons for status change..."
          ></textarea>
        </div>

        <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-6">
          <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" loading={loading} disabled={!selectedStatus || validNextStatuses.length === 0}>
            Update Status
          </Button>
        </div>
      </form>
    </Modal>
  );
}
