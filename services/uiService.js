// خدمات واجهة المستخدم (الأزرار والقوائم)

/**
 * إنشاء لوحة المفاتيح الخاصة برسائل الأدمن
 * @param {number} userId معرف المستخدم
 * @returns {Object} كائن يمثل لوحة المفاتيح
 */
function createAdminKeyboard(userId) {
  return {
    inline_keyboard: [
      [
        { text: 'رد عليه', callback_data: `reply_${userId}` },
        { text: 'حظر المستخدم', callback_data: `block_${userId}` }
      ],
      [
        { text: 'معلومات المستخدم', callback_data: `info_${userId}` },
        { text: 'إلغاء الحظر', callback_data: `unblock_${userId}` }
      ],
      [
        { text: 'إدارة المستخدمين', callback_data: `manage_users` }
      ]
    ]
  };
}

/**
 * إنشاء لوحة مفاتيح ترحيب للمستخدمين الجدد
 * @returns {Object} كائن يمثل لوحة المفاتيح
 */
function createWelcomeKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: 'المساعدة', callback_data: 'help' },
        { text: 'حول البوت', callback_data: 'about' }
      ]
    ]
  };
}

/**
 * إنشاء لوحة مفاتيح إدارة المستخدمين
 * @returns {Object} كائن يمثل لوحة المفاتيح
 */
function createUserManagementKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: 'عرض المستخدمين المحظورين', callback_data: 'list_blocked' }
      ],
      [
        { text: 'إحصائيات', callback_data: 'stats' },
        { text: 'رجوع', callback_data: 'back' }
      ]
    ]
  };
}

module.exports = {
  createAdminKeyboard,
  createWelcomeKeyboard,
  createUserManagementKeyboard
};