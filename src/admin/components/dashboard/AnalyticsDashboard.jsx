import React from 'react';
import { X, BarChart3 } from 'lucide-react';

const AnalyticsDashboard = ({ promoBar, onClose, promoBars }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <BarChart3 className="w-12 h-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                        <p className="text-gray-600">Analytics functionality will be implemented in the next phase.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
