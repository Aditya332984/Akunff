import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  HiSearch,
  HiTrash,
  HiDocumentText,
  HiUser,
  HiX,
  HiPencil,
  HiPhotograph,
  HiTag,
  HiCurrencyDollar,
  HiCalendar,
  HiEye,
  HiOutlineExclamationCircle,
  HiPlus
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

function PostManagement({ compact = false }) {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postDetails, setPostDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState({ field: 'createdAt', direction: 'desc' });
  
  const postsPerPage = compact ? 5 : 10;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/products`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) throw new Error('Failed to fetch posts');

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        toast.error('Error loading posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const fetchPostDetails = async (postId) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/products/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch post details');

      const data = await response.json();
      setPostDetails(data);
    } catch (err) {
      toast.error('Error loading post details');
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    fetchPostDetails(post._id);
  };

  const closeDetails = () => {
    setSelectedPost(null);
    setPostDetails(null);
  };

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/products/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Failed to delete post');

      setPosts(posts.filter((post) => post._id !== postId));
      toast.success('Post deleted successfully');
      
      if (selectedPost?._id === postId) {
        closeDetails();
      }
    } catch (err) {
      toast.error('Failed to delete post');
      console.error(err);
    } finally {
      setShowConfirmModal(false);
      setPostToDelete(null);
    }
  };

  const confirmDelete = (post, e) => {
    e?.stopPropagation();
    setPostToDelete(post);
    setShowConfirmModal(true);
  };

  const handleSort = (field) => {
    setSortOrder(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedPosts = [...posts].sort((a, b) => {
    const field = sortOrder.field;
    const direction = sortOrder.direction === 'asc' ? 1 : -1;
    
    if (field === 'title') {
      return direction * (a.title || '').localeCompare(b.title || '');
    } else if (field === 'author') {
      return direction * ((a.user?.name || 'Unknown') === (b.user?.name || 'Unknown') ? 0 : (a.user?.name || 'Unknown') < (b.user?.name || 'Unknown') ? -1 : 1);
    } else if (field === 'createdAt') {
      return direction * ((new Date(a.createdAt || 0)) - (new Date(b.createdAt || 0)));
    }
    return 0;
  });

  const filteredPosts = sortedPosts.filter(post =>
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const displayedPosts = compact ? filteredPosts.slice(0, 5) : currentPosts;

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-12 bg-gray-100 rounded mb-4"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded mb-3"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#f8fafc] to-[#eef2ff] rounded-xl shadow-lg overflow-hidden border border-indigo-100">
      <div className="p-6 border-b border-indigo-100 bg-white">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h3 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
            Post Management
          </h3>
          {/* {!compact && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white rounded-lg shadow-md hover:shadow-indigo-300/50 transition-all duration-200 flex items-center gap-2"
            >
              <HiPlus className="h-5 w-5" />
              <span>Add New Post</span>
            </motion.button>
          )} */}
        </div>
        
        {!compact && (
          <div className="mt-6 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <HiSearch className="h-5 w-5 text-indigo-400" />
            </div>
            <input
              type="text"
              placeholder="Search posts by title, description or author..."
              className="block w-full pl-12 pr-4 py-3.5 border border-indigo-100 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-indigo-50/50 transition-all duration-200 shadow-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-indigo-100">
          <thead className="bg-indigo-50">
            <tr>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center">
                  <span>Post</span>
                  {sortOrder.field === 'title' && (
                    <span className="ml-1">{sortOrder.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>  
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('author')}
              >
                <div className="flex items-center">
                  <span>Author</span>
                  {sortOrder.field === 'author' && (
                    <span className="ml-1">{sortOrder.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center">
                  <span>Date</span>
                  {sortOrder.field === 'createdAt' && (
                    <span className="ml-1">{sortOrder.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-indigo-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-indigo-50">
            {displayedPosts.length > 0 ? (
              displayedPosts.map((post) => (
                <motion.tr 
                  key={post._id} 
                  className="hover:bg-indigo-50/50 cursor-pointer transition-colors duration-150"
                  onClick={() => handlePostClick(post)}
                  whileHover={{ backgroundColor: "rgba(238, 242, 255, 0.5)" }}
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-14 w-14 rounded-lg overflow-hidden shadow-sm border border-indigo-100">
                        {post.images && post.images[0] ? (
                          <img 
                            src={post.images[0]} 
                            alt={post.title} 
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                            <HiDocumentText className="w-6 h-6 text-indigo-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-800 line-clamp-1">{post.title}</div>
                        {post.description && (
                          <div className="text-xs text-gray-500 mt-1 line-clamp-1">{post.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white font-medium mr-2 text-xs">
                        {post.user?.name ? post.user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span>{post.user?.name || 'Unknown User'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap hidden md:table-cell">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-xs text-indigo-600">
                      <HiCalendar className="mr-1.5 h-3.5 w-3.5" /> 
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePostClick(post);
                        }}
                        className="text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg px-3 py-1.5 transition-colors duration-200 shadow-sm border border-blue-100"
                      >
                        <HiEye className="inline mr-1 h-4 w-4" /> View
                      </motion.button>
                     
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => confirmDelete(post, e)}
                        className="text-red-600 bg-red-50 hover:bg-red-100 rounded-lg px-3 py-1.5 transition-colors duration-200 shadow-sm border border-red-100"
                      >
                        <HiTrash className="inline mr-1 h-4 w-4" /> Delete
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="rounded-full bg-indigo-100 p-4 mb-4">
                      <HiOutlineExclamationCircle className="h-10 w-10 text-indigo-400" />
                    </div>
                    <p className="text-xl font-semibold text-gray-700 mb-1">No posts found</p>
                    <p className="text-sm text-gray-500 max-w-xs">
                      {searchTerm ? 'Try a different search term' : 'Add your first post to get started'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!compact && filteredPosts.length > postsPerPage && (
        <div className="px-6 py-4 border-t border-indigo-100 flex items-center justify-between bg-white">
          <div className="text-sm text-gray-700">
            <span className="bg-indigo-50 px-2 py-1 rounded-md">
              Showing <span className="font-medium">{indexOfFirstPost + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastPost, filteredPosts.length)}
              </span>{' '}
              of <span className="font-medium">{filteredPosts.length}</span> results
            </span>
          </div>
          
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100'
              } rounded-lg text-sm font-medium shadow-sm transition-colors duration-200`}
            >
              Previous
            </motion.button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around the current page
              let pageNum = currentPage - 2 + i;
              if (pageNum < 1) pageNum = i + 1;
              if (pageNum > totalPages) pageNum = totalPages - (4 - i);
              if (pageNum < 1 || pageNum > totalPages) return null;
              
              return (
                <motion.button
                  key={pageNum}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => paginate(pageNum)}
                  className={`px-3 py-2 ${
                    pageNum === currentPage
                      ? 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white shadow-md'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100'
                  } rounded-lg text-sm font-medium transition-colors duration-200`}
                >
                  {pageNum}
                </motion.button>
              );
            })}
            
            <motion.button
              whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
              onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100'
              } rounded-lg text-sm font-medium shadow-sm transition-colors duration-200`}
            >
              Next
            </motion.button>
          </div>
        </div>
      )}

      {compact && posts.length > 5 && (
        <div className="p-5 border-t border-indigo-100 text-center bg-white">
          <motion.a 
            href="#" 
            className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white rounded-lg shadow-md hover:shadow-indigo-300/50 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View all {posts.length} posts</span>
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </motion.a>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="flex items-center mb-5">
                <div className="bg-red-100 rounded-full p-3 mr-4">
                  <HiOutlineExclamationCircle className="h-7 w-7 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
              </div>
              <p className="text-gray-600 mb-8 text-lg">
                Are you sure you want to delete "<span className="font-semibold">{postToDelete?.title}</span>"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowConfirmModal(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors duration-200 font-medium shadow-sm"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deletePost(postToDelete?._id)}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-md"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Details Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-indigo-100 flex justify-between items-center z-10">
                <h3 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">Post Details</h3>
                <motion.button 
                  onClick={closeDetails} 
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(238, 242, 255, 0.5)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <HiX className="h-5 w-5" />
                </motion.button>
              </div>

              {loadingDetails ? (
                <div className="p-8 animate-pulse">
                  <div className="h-10 bg-indigo-100 rounded-lg w-3/4 mb-6"></div>
                  <div className="h-5 bg-indigo-50 rounded-lg w-1/3 mb-8"></div>
                  <div className="h-40 bg-indigo-50 rounded-lg mb-6"></div>
                  <div className="h-6 bg-indigo-50 rounded-lg w-1/2 mb-4"></div>
                  <div className="h-6 bg-indigo-50 rounded-lg w-1/3 mb-6"></div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="h-24 bg-indigo-50 rounded-lg"></div>
                    <div className="h-24 bg-indigo-50 rounded-lg"></div>
                  </div>
                </div>
              ) : postDetails ? (
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-3 text-gray-800">{postDetails.title}</h2>
                  <div className="flex items-center text-sm text-gray-500 mb-8">
                    <div className="flex items-center mr-6">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white font-medium mr-2 text-xs">
                        {postDetails.user?.name ? postDetails.user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span>{postDetails.user?.name || 'Unknown User'}</span>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-xs text-indigo-600">
                      <HiCalendar className="mr-1.5 h-3.5 w-3.5" />
                      <span>{formatDate(postDetails.createdAt)}</span>
                    </div>
                  </div>

                  <div className="bg-indigo-50/50 p-6 rounded-xl mb-8 border border-indigo-100 shadow-sm">
                    <h4 className="text-lg font-semibold flex items-center mb-3 text-gray-700">
                      <HiDocumentText className="mr-2 h-5 w-5 text-indigo-500" />
                      Description
                    </h4>
                    <p className="text-gray-700 whitespace-pre-line">{postDetails.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {postDetails.price && (
                      <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100 shadow-sm">
                        <h4 className="text-lg font-semibold flex items-center mb-3 text-gray-700">
                          <HiCurrencyDollar className="mr-2 h-5 w-5 text-indigo-500" />
                          Price
                        </h4>
                        <p className="text-gray-800 text-xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                          ${postDetails.price}
                        </p>
                      </div>
                    )}

                    {postDetails.category && (
                      <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100 shadow-sm">
                        <h4 className="text-lg font-semibold flex items-center mb-3 text-gray-700">
                          <HiTag className="mr-2 h-5 w-5 text-indigo-500" />
                          Category
                        </h4>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-sm text-indigo-800 font-medium">
                          {postDetails.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {postDetails.images && postDetails.images.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold flex items-center mb-4 text-gray-700">
                        <HiPhotograph className="mr-2 h-5 w-5 text-indigo-500" />
                        Images ({postDetails.images.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {postDetails.images.map((img, index) => (
                          <motion.div 
                            key={index} 
                            className="aspect-square bg-indigo-50 rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow duration-200 border border-indigo-100"
                            whileHover={{ scale: 1.03 }}
                          >
                            <img
                              src={img}
                              alt={`${postDetails.title} - Image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 mt-10 pt-6 border-t border-indigo-100">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => confirmDelete(postDetails)}
                      className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200 flex items-center border border-red-100 shadow-sm"
                    >
                      <HiTrash className="mr-2 h-5 w-5" />
                      Delete Post
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] hover:from-[#4f46e5] hover:to-[#9333ea] text-white rounded-lg transition-colors duration-200 flex items-center shadow-md"
                    >
                      <HiPencil className="mr-2 h-5 w-5" />
                      Edit Post
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="p-8 flex flex-col items-center justify-center">
                  <div className="rounded-full bg-indigo-100 p-4 mb-4">
                    <HiOutlineExclamationCircle className="h-10 w-10 text-indigo-400" />
                  </div>
                  <p className="text-gray-500 text-lg">No details found.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PostManagement;