import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function ActivityLogs() {
    const navigate = useNavigate();
    
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [filters, setFilters] = useState({
        action: 'all',
        model: 'all',
        page: 1,
        per_page: 20
    });
    const [pagination, setPagination] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        fetchActivities();
        fetchStats();
    }, [filters]);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams(filters).toString();
            const response = await api.get(`/admin/activity-logs?${params}`);
            setActivities(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Failed to fetch activities:', error);
            alert('Failed to load activity logs');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/activity-logs/stats');
            setStats(response.data.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const viewDetails = async (activityId) => {
        try {
            const response = await api.get(`/admin/activity-logs/${activityId}`);
            setSelectedActivity(response.data.data);
            setShowDetailModal(true);
        } catch (error) {
            console.error('Failed to fetch activity details:', error);
            alert('Failed to load activity details');
        }
    };

    const getActionBadge = (action) => {
        const colors = {
            created: 'bg-green-100 text-green-800',
            updated: 'bg-blue-100 text-blue-800',
            deleted: 'bg-red-100 text-red-800',
            restored: 'bg-purple-100 text-purple-800',
        };
        return colors[action] || 'bg-gray-100 text-gray-800';
    };

    const getActionIcon = (action) => {
        const icons = {
            created: '➕',
            updated: '✏️',
            deleted: '🗑️',
            restored: '↩️',
        };
        return icons[action] || '📝';
    };

    if (loading && activities.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading activity logs...</p>
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
                            <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Track all system activities and changes
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/management/tours')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            ← Back to Tours
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <p className="text-sm font-medium text-gray-500">Total Activities</p>
                            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_activities}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <p className="text-sm font-medium text-gray-500">Today</p>
                            <p className="mt-2 text-3xl font-bold text-blue-600">{stats.today}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <p className="text-sm font-medium text-gray-500">This Week</p>
                            <p className="mt-2 text-3xl font-bold text-green-600">{stats.this_week}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <p className="text-sm font-medium text-gray-500">This Month</p>
                            <p className="mt-2 text-3xl font-bold text-purple-600">{stats.this_month}</p>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Action Type
                            </label>
                            <select
                                value={filters.action}
                                onChange={(e) => setFilters({ ...filters, action: e.target.value, page: 1 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Actions</option>
                                <option value="created">Created</option>
                                <option value="updated">Updated</option>
                                <option value="deleted">Deleted</option>
                                <option value="restored">Restored</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Model Type
                            </label>
                            <select
                                value={filters.model}
                                onChange={(e) => setFilters({ ...filters, model: e.target.value, page: 1 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Models</option>
                                <option value="Tour">Tours</option>
                                <option value="Booking">Bookings</option>
                                <option value="User">Users</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Per Page
                            </label>
                            <select
                                value={filters.per_page}
                                onChange={(e) => setFilters({ ...filters, per_page: e.target.value, page: 1 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Activity Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Model
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subject
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {activities.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No activity logs found
                                    </td>
                                </tr>
                            ) : (
                                activities.map((activity) => (
                                    <tr key={activity.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadge(activity.description)}`}>
                                                <span className="mr-1">{getActionIcon(activity.description)}</span>
                                                {activity.description}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {activity.subject_type}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <div className="max-w-xs truncate">{activity.subject_name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{activity.causer_name}</div>
                                            {activity.causer_email && (
                                                <div className="text-sm text-gray-500">{activity.causer_email}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{activity.created_at_human}</div>
                                            <div className="text-xs text-gray-500">{activity.created_at}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => viewDetails(activity.id)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {pagination && pagination.last_page > 1 && (
                        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{pagination.from}</span> to{' '}
                                    <span className="font-medium">{pagination.to}</span> of{' '}
                                    <span className="font-medium">{pagination.total}</span> results
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                                        disabled={filters.page === 1}
                                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1 text-sm">
                                        Page {pagination.current_page} of {pagination.last_page}
                                    </span>
                                    <button
                                        onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                                        disabled={filters.page === pagination.last_page}
                                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedActivity && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Activity Details</h3>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Action</label>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getActionBadge(selectedActivity.description)} mt-1`}>
                                    {getActionIcon(selectedActivity.description)} {selectedActivity.description}
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Model</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedActivity.subject_type}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Subject</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedActivity.subject_name}</p>
                            </div>

                            {selectedActivity.causer && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Performed By</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {selectedActivity.causer.name} ({selectedActivity.causer.email})
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Time</label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {selectedActivity.created_at} ({selectedActivity.created_at_human})
                                </p>
                            </div>

                            {selectedActivity.properties && Object.keys(selectedActivity.properties).length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Changes</label>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto">
                                            {JSON.stringify(selectedActivity.properties, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
