import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function AdminTours() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTours, setSelectedTours] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [bulkAction, setBulkAction] = useState('');
    const [processing, setProcessing] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            setLoading(true);
            const response = await api.get('/tours');
            setTours(response.data);
        } catch (error) {
            console.error('Failed to fetch tours:', error);
            alert('Failed to load tours');
        } finally {
            setLoading(false);
        }
    };

    const toggleSelectTour = (tourId) => {
        setSelectedTours(prev => 
            prev.includes(tourId) 
                ? prev.filter(id => id !== tourId)
                : [...prev, tourId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedTours.length === tours.length) {
            setSelectedTours([]);
        } else {
            setSelectedTours(tours.map(tour => tour.id));
        }
    };

    const handleBulkAction = (action) => {
        if (selectedTours.length === 0) {
            alert('Please select at least one tour');
            return;
        }
        setBulkAction(action);
        setShowConfirmModal(true);
    };

    const confirmBulkAction = async () => {
        try {
            setProcessing(true);
            
            if (bulkAction === 'delete') {
                await api.post('/admin/tours/bulk-delete', {
                    tour_ids: selectedTours
                });
                alert(`Successfully deleted ${selectedTours.length} tours`);
            } else if (bulkAction === 'restore') {
                await api.post('/admin/tours/bulk-restore', {
                    tour_ids: selectedTours
                });
                alert(`Successfully restored ${selectedTours.length} tours`);
            }
            
            setShowConfirmModal(false);
            setSelectedTours([]);
            fetchTours();
            
        } catch (error) {
            console.error('Bulk action failed:', error);
            alert('Failed to perform bulk action: ' + (error.response?.data?.message || error.message));
        } finally {
            setProcessing(false);
        }
    };

    const handleExport = async (format) => {
        try {
            const token = localStorage.getItem('token');
            const url = `/api/admin/export/tours?format=${format}`;
            
            // Create a temporary link to download the file
            const link = document.createElement('a');
            link.href = `${window.location.origin}${url}`;
            link.setAttribute('download', `tours_${new Date().toISOString().split('T')[0]}.${format}`);
            
            // Trigger download by adding authorization header via fetch
            const response = await fetch(`${window.location.origin}${url}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv'
                }
            });
            
            if (!response.ok) throw new Error('Export failed');
            
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            link.href = downloadUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
            
            setShowExportModal(false);
            alert('Export successful!');
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export tours');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading tours...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Tour Management</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Manage and organize your tour packages
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowExportModal(true)}
                                className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100"
                            >
                                📥 Export Data
                            </button>
                            <button
                                onClick={() => navigate('/management/activity-logs')}
                                className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
                            >
                                📋 Activity Logs
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                ← Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions Bar */}
                {selectedTours.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-blue-900">
                                    {selectedTours.length} tour{selectedTours.length > 1 ? 's' : ''} selected
                                </span>
                                <button
                                    onClick={() => setSelectedTours([])}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Clear selection
                                </button>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleBulkAction('delete')}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    🗑️ Delete Selected
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tours Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="w-12 px-6 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedTours.length === tours.length && tours.length > 0}
                                        onChange={toggleSelectAll}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                    />
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tour Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Duration
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Seats
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tours.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                        No tours found
                                    </td>
                                </tr>
                            ) : (
                                tours.map((tour) => (
                                    <tr 
                                        key={tour.id}
                                        className={`hover:bg-gray-50 transition-colors ${
                                            selectedTours.includes(tour.id) ? 'bg-blue-50' : ''
                                        }`}
                                    >
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedTours.includes(tour.id)}
                                                onChange={() => toggleSelectTour(tour.id)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{tour.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{tour.name}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-md">{tour.destination}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {tour.category?.name || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            Rp {Number(tour.price).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {tour.duration}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {tour.available_seats || (tour.max_participants - tour.booked_participants)} / {tour.max_participants}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => navigate(`/tours/${tour.id}`)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => alert('Edit feature coming soon!')}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Stats Footer */}
                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">Total Tours</p>
                            <p className="mt-2 text-3xl font-bold text-gray-900">{tours.length}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">Selected</p>
                            <p className="mt-2 text-3xl font-bold text-blue-600">{selectedTours.length}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">Available Tours</p>
                            <p className="mt-2 text-3xl font-bold text-green-600">
                                {tours.filter(t => t.available_seats > 0 || (t.max_participants - t.booked_participants) > 0).length}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-500">Sold Out</p>
                            <p className="mt-2 text-3xl font-bold text-red-600">
                                {tours.filter(t => (t.available_seats === 0) || (t.max_participants - t.booked_participants === 0)).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Confirm Bulk {bulkAction === 'delete' ? 'Delete' : 'Restore'}</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    This action cannot be undone easily.
                                </p>
                            </div>
                        </div>
                        
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to {bulkAction} <strong>{selectedTours.length}</strong> selected tour{selectedTours.length > 1 ? 's' : ''}?
                        </p>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                disabled={processing}
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmBulkAction}
                                disabled={processing}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : `Yes, ${bulkAction}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Modal */}
            {showExportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Export Tours</h3>
                            <button
                                onClick={() => setShowExportModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <p className="text-gray-700 mb-6">
                            Choose the format for exporting all tours data:
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => handleExport('xlsx')}
                                className="w-full flex items-center justify-between px-4 py-3 text-left border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                                            <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Excel (XLSX)</p>
                                        <p className="text-sm text-gray-500">Best for spreadsheet software</p>
                                    </div>
                                </div>
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            <button
                                onClick={() => handleExport('csv')}
                                className="w-full flex items-center justify-between px-4 py-3 text-left border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">CSV</p>
                                        <p className="text-sm text-gray-500">Universal format, smaller file</p>
                                    </div>
                                </div>
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowExportModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
