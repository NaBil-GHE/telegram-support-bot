const path = require('path');
const dotenv = require('dotenv');

// يدعم .env القياسي و.env.local المستخدم محلياً، مع أولوية للقيم المحلية.
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '.env.local'), override: true });

const token = process.env.TELEGRAM_TOKEN?.trim();
const adminIdValue = process.env.ADMIN_ID?.trim();
const adminId = Number(adminIdValue);

if (!token) {
  throw new Error('TELEGRAM_TOKEN غير مضبوط في ملف .env');
}

if (!adminIdValue || !Number.isSafeInteger(adminId) || adminId <= 0) {
  throw new Error('ADMIN_ID يجب أن يكون رقماً صحيحاً');
}

module.exports = {
  // بيانات التكوين الأساسية
  token,
  adminId,
  
  // إعدادات البوت
  botOptions: { 
    polling: true,
    request: {
      timeout: 30000
    }
  },
  
  // مسارات الملفات
  blockedUsersFile: path.join(__dirname, 'data', 'blockedUsers.json'),
  
  // رسائل البوت
  messages: {
    welcome: 'مرحباً بك في بوت التواصل مع الأدمن. أرسل رسالتك وسنرد عليك في أقرب وقت.',
    messageSent: 'تم إرسال رسالتك إلى الأدمن، وسيتم الرد عليك قريباً.',
    adminWelcome: 'مرحباً بك أيها الأدمن! استخدم الأزرار المرفقة مع رسائل المستخدمين للرد عليهم.',
    replySent: 'تم إرسال ردك إلى المستخدم.',
    userBlocked: 'تم حظر المستخدم بنجاح.',
    replyPrompt: 'الرجاء كتابة ردك للمستخدم:',
    adminPrefix: 'رسالة من الأدمن: ',
  }
};