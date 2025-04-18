// ملف التكوين - يحتوي على إعدادات البوت
require('dotenv').config();

module.exports = {
  // بيانات التكوين الأساسية
  token: process.env.TELEGRAM_TOKEN,
  adminId: process.env.ADMIN_ID || 123456789,
  
  // إعدادات البوت
  botOptions: { 
    polling: true,
    request: {
      timeout: 30000
    }
  },
  
  // مسارات الملفات
  blockedUsersFile: './data/blockedUsers.json',
  
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