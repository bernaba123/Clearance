import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('/api/admin/news');
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingNews) {
        await axios.put(`/api/admin/news/${editingNews._id}`, data);
        toast.success('News updated successfully');
      } else {
        await axios.post('/api/admin/news', data);
        toast.success('News created successfully');
      }
      
      fetchNews();
      setShowModal(false);
      setEditingNews(null);
      reset();
    } catch (error) {
      toast.error('Failed to save news');
    }
  };

  const deleteNews = async (newsId) => {
    if (!window.confirm('Are you sure you want to delete this news item?')) return;
    
    try {
      await axios.delete(`/api/admin/news/${newsId}`);
      setNews(news.filter(item => item._id !== newsId));
      toast.success('News deleted successfully');
    } catch (error) {
      toast.error('Failed to delete news');
    }
  };

  const openEditModal = (newsItem) => {
    setEditingNews(newsItem);
    reset(newsItem);
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingNews(null);
    reset();
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-aastu-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage News & Events</h1>
          <p className="text-gray-600">Create and manage news articles and announcements</p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add News
        </button>
      </div>

      {/* News List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {news.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No news articles</h3>
              <p className="text-gray-500 mb-4">Create your first news article or announcement.</p>
              <button onClick={openAddModal} className="btn-primary">
                Add News
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {news.map((item) => (
                <div key={item._id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full mr-3 ${
                          item.category === 'announcement' ? 'bg-blue-100 text-blue-800' :
                          item.category === 'event' ? 'bg-green-100 text-green-800' :
                          item.category === 'deadline' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {item.content}
                      </p>
                      
                      <div className="mt-2 text-xs text-gray-500">
                        By: {item.author?.fullName || 'System Admin'}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-aastu-blue hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteNews(item._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingNews ? 'Edit News' : 'Add News'}
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    type="text"
                    className="mt-1 input-field"
                    placeholder="Enter news title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className="mt-1 input-field"
                  >
                    <option value="">Select category</option>
                    <option value="announcement">Announcement</option>
                    <option value="event">Event</option>
                    <option value="deadline">Deadline</option>
                    <option value="update">System Update</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Content *
                  </label>
                  <textarea
                    {...register('content', { required: 'Content is required' })}
                    rows={6}
                    className="mt-1 input-field"
                    placeholder="Enter news content"
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingNews(null);
                      reset();
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingNews ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageNews;