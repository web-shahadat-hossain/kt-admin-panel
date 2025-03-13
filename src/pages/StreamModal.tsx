import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';

const StreamModal = ({ isOpen, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      playbackUrl: '',
      streamKey: '',
      isLive: false,
      startDate: new Date().toISOString().split('T')[0],
      upcomming: false,
      createdAt: '',
      updatedAt: '',
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Upcoming Live Details
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Playback URL */}
            <div>
              <label
                htmlFor="playbackUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Playback URL
              </label>
              <input
                id="playbackUrl"
                name="playbackUrl"
                type="url"
                value={formData.playbackUrl}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Stream Key */}
            <div>
              <label
                htmlFor="streamKey"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Stream Key
              </label>
              <div className="relative">
                <input
                  id="streamKey"
                  name="streamKey"
                  type="text"
                  value={formData.streamKey}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                  onClick={() =>
                    navigator.clipboard.writeText(formData.streamKey)
                  }
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date
              </label>
              <div className="relative">
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <Calendar
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <div className="flex items-center mb-2 sm:mb-0">
                <input
                  id="isLive"
                  name="isLive"
                  type="checkbox"
                  checked={formData.isLive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isLive" className="ml-2 text-sm text-gray-700">
                  Is Live
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="upcomming"
                  name="upcomming"
                  type="checkbox"
                  checked={formData.upcomming}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="upcomming"
                  className="ml-2 text-sm text-gray-700"
                >
                  Upcoming
                </label>
              </div>
            </div>

            {/* Read-only Fields */}
            {formData.createdAt && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created At
                </label>
                <input
                  type="text"
                  value={formData.createdAt}
                  className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                  readOnly
                />
              </div>
            )}

            {formData.updatedAt && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Updated At
                </label>
                <input
                  type="text"
                  value={formData.updatedAt}
                  className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                  readOnly
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StreamModal;
