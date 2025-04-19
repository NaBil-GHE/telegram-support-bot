// خدمات واجهة المستخدم (الأزرار والقوائم)

/**
 * إنشاء لوحة المفاتيح الخاصة برسائل الأدمن
 * @param {number} userId معرف المستخدم
 * @param {string} username اسم المستخدم إن وجد
 * @returns {Object} كائن يمثل لوحة المفاتيح
 */
function createAdminKeyboard(userId, username = null) {
  // صف الأزرار الأساسية
  const keyboard = {
    inline_keyboard: [
      [
        { text: 'رد عليه', callback_data: `reply_${userId}` },
        { text: 'حظر المستخدم', callback_data: `block_${userId}` }
      ],
      [
        { text: 'معلومات المستخدم', callback_data: `info_${userId}` },
        { text: 'إلغاء الحظر', callback_data: `unblock_${userId}` }
      ]
    ]
  };
  
  // إضافة زر "تواصل مباشر" إذا كان لدى المستخدم اسم مستخدم
  if (username) {
    keyboard.inline_keyboard.push([
      { text: 'تواصل مباشر', url: `https://t.me/${username.replace('@', '')}` }
    ]);
  }
  
  // إضافة صف إدارة المستخدمين
  keyboard.inline_keyboard.push([
    { text: 'إدارة المستخدمين', callback_data: `manage_users` }
  ]);
  
  return keyboard;
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