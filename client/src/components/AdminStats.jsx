import { motion } from 'framer-motion';
import { HiUsers, HiDocumentText } from 'react-icons/hi';

function AdminStats({ stats }) {
  const statItems = [
    {
      title: 'Total Users',
      value: stats.users,
      icon: <HiUsers className="w-8 h-8 text-blue-500" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      percentage: '12%',
      trend: 'up'
    },
    {
      title: 'Total Posts',
      value: stats.posts,
      icon: <HiDocumentText className="w-8 h-8 text-purple-500" />,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      percentage: '8%',
      trend: 'up'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 font-medium">{item.title}</p>
                <h3 className={`text-3xl font-bold mt-1 ${item.textColor}`}>
                  {item.value.toLocaleString()}
                </h3>
              </div>
              <div className={`p-3 rounded-lg ${item.bgColor}`}>{item.icon}</div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={item.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {item.percentage}
              </span>
              <span className="text-gray-500 text-sm ml-1">vs last month</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default AdminStats;