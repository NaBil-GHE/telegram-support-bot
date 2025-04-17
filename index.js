require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// بيانات التكوين
const token = process.env.TELEGRAM_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID || 123456789; // قم بتغيير هذا إلى معرف الأدمن الخاص بك

// إنشاء كائن البوت
const bot = new TelegramBot(token, { polling: true });

// متغيرات لحفظ حالات المحادثة
const userStates = {};
const blockedUsers = new Set();
let waitingForReply = false;
let replyToUserId = null;

// محاولة تحميل المستخدمين المحظورين من ملف (إذا وجد)
try {
  if (fs.existsSync('./blockedUsers.json')) {
    const data = fs.readFileSync('./blockedUsers.json', 'utf8');
    const blocked = JSON.parse(data);
    blocked.forEach(id => blockedUsers.add(id));
    console.log(`تم تحميل ${blockedUsers.size} مستخدم محظور`);
  }
} catch (error) {
  console.error('خطأ في تحميل قائمة المستخدمين المحظورين:', error);
}

// دالة لحفظ المستخدمين المحظورين
function saveBlockedUsers() {
  try {
    fs.writeFileSync('./blockedUsers.json', JSON.stringify([...blockedUsers]), 'utf8');
    console.log('تم حفظ قائمة المستخدمين المحظورين');
  } catch (error) {
    console.error('خطأ في حفظ قائمة المستخدمين المحظورين:', error);
  }
}

// دالة للحصول على معلومات المستخدم
function getUserInfo(msg) {
  const userId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : 'غير متوفر';
  const firstName = msg.from.first_name || '';
  const lastName = msg.from.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'غير متوفر';
  
  return {
    id: userId,
    username,
    fullName,
    displayName: username !== 'غير متوفر' ? username : fullName !== 'غير متوفر' ? fullName : userId.toString()
  };
}

// دالة لإنشاء لوحة المفاتيح الخاصة برسائل الأدمن
function createAdminKeyboard(userId) {
  return {
    inline_keyboard: [
      [
        { text: 'رد عليه', callback_data: `reply_${userId}` },
        { text: 'حظر المستخدم', callback_data: `block_${userId}` }
      ],
      [
        { text: 'معلومات المستخدم', callback_data: `info_${userId}` }
      ]
    ]
  };
}

// معالجة الرسائل الواردة
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || '';
  const userInfo = getUserInfo(msg);
  
  // التحقق مما إذا كانت الرسالة من الأدمن
  if (chatId == ADMIN_ID) {
    // إذا كان الأدمن في انتظار كتابة رد للمستخدم
    if (waitingForReply && replyToUserId) {
      // إرسال الرد إلى المستخدم
      bot.sendMessage(replyToUserId, `رسالة من الإدارة: ${text}`);
      bot.sendMessage(chatId, 'تم إرسال ردك إلى المستخدم.');
      
      // إعادة تعيين حالة الانتظار
      waitingForReply = false;
      replyToUserId = null;
      return;
    }
    
    // رسالة عادية من الأدمن
    bot.sendMessage(chatId, 'مرحباً بك أيها الأدمن! استخدم الأزرار المرفقة مع رسائل المستخدمين للرد عليهم.');
    return;
  }
  
  // التعامل مع رسائل المستخدمين العاديين
  const userId = userInfo.id;
  
  // التحقق من المستخدمين المحظورين
  if (blockedUsers.has(userId)) {
    // يمكننا تجاهل الرسالة أو إرسال إشعار للمستخدم أنه محظور
    return;
  }
  
  // إرسال تأكيد استلام الرسالة للمستخدم
  bot.sendMessage(chatId, 'تم إرسال رسالتك إلى الإدارة، وسيتم الرد عليك قريباً.');
  
  // إرسال الرسالة إلى الأدمن مع معلومات المرسل وأزرار التفاعل
  const adminMessage = `رسالة جديدة من: ${userInfo.displayName}\n\nالرسالة: ${text}`;
  bot.sendMessage(ADMIN_ID, adminMessage, {
    reply_markup: createAdminKeyboard(userId)
  });
});

// معالجة نقرات الأزرار
bot.on('callback_query', (callbackQuery) => {
  const action = callbackQuery.data;
  const adminId = callbackQuery.from.id;
  
  // التأكد من أن النقرة من الأدمن
  if (adminId != ADMIN_ID) {
    bot.answerCallbackQuery(callbackQuery.id, { text: 'غير مصرح لك باستخدام هذه الأوامر.' });
    return;
  }
  
  // استخراج معرّف المستخدم ونوع الإجراء من البيانات
  const [command, userId] = action.split('_');
  
  if (command === 'reply') {
    // الرد على المستخدم
    waitingForReply = true;
    replyToUserId = userId;
    bot.sendMessage(adminId, `الرجاء كتابة ردك للمستخدم (${userId}):`);
    bot.answerCallbackQuery(callbackQuery.id, { text: 'الرجاء كتابة ردك الآن' });
  } 
  else if (command === 'block') {
    // حظر المستخدم
    blockedUsers.add(parseInt(userId));
    saveBlockedUsers();
    bot.sendMessage(adminId, `تم حظر المستخدم (${userId}) بنجاح.`);
    bot.answerCallbackQuery(callbackQuery.id, { text: 'تم حظر المستخدم' });
  } 
  else if (command === 'info') {
    // عرض معلومات المستخدم
    bot.sendMessage(adminId, `معلومات المستخدم:\nمعرّف المستخدم: ${userId}`);
    bot.answerCallbackQuery(callbackQuery.id, { text: 'تم عرض معلومات المستخدم' });
  }
});

// معالجة الأخطاء
bot.on('polling_error', (error) => {
  console.error('خطأ في الاتصال بواجهة برمجة تطبيقات تليغرام:', error);
});

console.log('تم تشغيل البوت بنجاح!');


