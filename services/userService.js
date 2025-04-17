// خدمات إدارة المستخدمين
const fs = require('fs');
const path = require('path');
const config = require('../config');

// التأكد من وجود مجلد البيانات
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// المستخدمين المحظورين
const blockedUsers = new Set();

// تحميل المستخدمين المحظورين
function loadBlockedUsers() {
  try {
    if (fs.existsSync(config.blockedUsersFile)) {
      const data = fs.readFileSync(config.blockedUsersFile, 'utf8');
      const blocked = JSON.parse(data);
      blocked.forEach(id => blockedUsers.add(id));
      console.log(`تم تحميل ${blockedUsers.size} مستخدم محظور`);
    }
  } catch (error) {
    console.error('خطأ في تحميل قائمة المستخدمين المحظورين:', error.message);
  }
}

// حفظ المستخدمين المحظورين
function saveBlockedUsers() {
  try {
    // التأكد من وجود مجلد البيانات
    const dirPath = path.dirname(config.blockedUsersFile);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    fs.writeFileSync(config.blockedUsersFile, JSON.stringify([...blockedUsers]), 'utf8');
    console.log('تم حفظ قائمة المستخدمين المحظورين');
  } catch (error) {
    console.error('خطأ في حفظ قائمة المستخدمين المحظورين:', error.message);
  }
}

// التحقق مما إذا كان المستخدم محظوراً
function isUserBlocked(userId) {
  return blockedUsers.has(parseInt(userId));
}

// حظر مستخدم
function blockUser(userId) {
  blockedUsers.add(parseInt(userId));
  saveBlockedUsers();
  return true;
}

// إلغاء حظر مستخدم
function unblockUser(userId) {
  const result = blockedUsers.delete(parseInt(userId));
  if (result) {
    saveBlockedUsers();
  }
  return result;
}

// الحصول على معلومات المستخدم من الرسالة
function getUserInfo(msg) {
  const userId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : 'غير متوفر';
  const firstName = msg.from.first_name || '';
  const lastName = msg.from.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'غير متوفر';
  const languageCode = msg.from.language_code || 'غير متوفر';
  
  return {
    id: userId,
    username,
    firstName,
    lastName,
    fullName,
    languageCode,
    displayName: username !== 'غير متوفر' ? username : fullName !== 'غير متوفر' ? fullName : userId.toString()
  };
}

// تحميل المستخدمين المحظورين عند بدء التشغيل
loadBlockedUsers();

module.exports = {
  getUserInfo,
  isUserBlocked,
  blockUser,
  unblockUser,
  saveBlockedUsers
};