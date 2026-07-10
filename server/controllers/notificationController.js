const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error('Get Notifications Error:', err);
    res.status(500).json({ message: 'Internal Server Error fetching notifications.' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );
    res.status(200).json({ message: 'All notifications marked as read.' });
  } catch (err) {
    console.error('Mark Notifications Read Error:', err);
    res.status(500).json({ message: 'Internal Server Error marking notifications read.' });
  }
};
