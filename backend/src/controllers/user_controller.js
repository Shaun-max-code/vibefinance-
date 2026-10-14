/**
 * User Controller
 * Manages user profile, workspace preferences, and notifications.
 */

const userProfileData = require('../data/user_profile.json');

let activeUser = JSON.parse(JSON.stringify(userProfileData));

class UserController {
  /**
   * Get current user profile and workspace configuration
   */
  getProfile(req, res) {
    res.json({
      success: true,
      user: activeUser.user,
      preferences: activeUser.preferences,
      unread_notifications_count: activeUser.notifications.filter(n => !n.read).length,
      notifications: activeUser.notifications
    });
  }

  /**
   * Update preferences (e.g. risk profile, theme, benchmark)
   */
  updatePreferences(req, res) {
    const { risk_profile, risk_score, selected_benchmark, auto_rebalance_alerts, theme } = req.body;

    if (risk_profile) activeUser.preferences.risk_profile = risk_profile;
    if (risk_score !== undefined) activeUser.preferences.risk_score = parseInt(risk_score);
    if (selected_benchmark) activeUser.preferences.selected_benchmark = selected_benchmark;
    if (auto_rebalance_alerts !== undefined) activeUser.preferences.auto_rebalance_alerts = Boolean(auto_rebalance_alerts);
    if (theme) activeUser.preferences.theme = theme;

    res.json({
      success: true,
      message: 'Preferences updated successfully.',
      preferences: activeUser.preferences
    });
  }

  /**
   * Mark a notification as read
   */
  markNotificationRead(req, res) {
    const notif = activeUser.notifications.find(n => n.id === req.params.id);
    if (notif) {
      notif.read = true;
    }

    res.json({
      success: true,
      unread_count: activeUser.notifications.filter(n => !n.read).length
    });
  }
}

module.exports = new UserController();
