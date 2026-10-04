/**
 * بوت تليغرام للتواصل بين المستخدمين والإدارة
 * يسمح بإرسال الرسائل، الرد، وإدارة المستخدمين
 */
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const userService = require('./services/userService');
const uiService = require('./services/uiService');



const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;


// إنشاء كائن البوت
const bot = new TelegramBot(config.token, config.botOptions);

// متغيرات لحفظ حالات المحادثة
const userStates = {};
let waitingForReply = false;
let replyToUserId = null;

// إحصائيات البوت
const stats = {
  messagesReceived: 0,
  messagesSent: 0,
  startTime: new Date()
};

// معالجة أمر /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(
    chatId, 
    config.messages.welcome, 
    { reply_markup: uiService.createWelcomeKeyboard() }
  );
});

// معالجة أمر /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, `
📝 *كيفية استخدام البوت*
- فقط أرسل رسالتك وسنقوم بتوصيلها للأدمن
- ستتلقى ردًا من الأدمن عبر هذا البوت

🛠 *الأوامر المتاحة*
/start - بدء استخدام البوت
/help - عرض هذه المساعدة
/about - حول البوت
  `, { parse_mode: 'Markdown' });
});

// معالجة أمر /about
bot.onText(/\/about/, (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, `
*بوت التواصل مع الإدارة* 📱

هذا البوت يسهل التواصل بين المستخدمين والإدارة.
الإصدار: 1.1.0
*المطور:* @B_NBL
*للتواصل:* t.me/B_NBL
  `, { parse_mode: 'Markdown' });
});

// معالجة الرسائل الواردة
bot.on('message', (msg) => {
  try {
    // تجاهل الرسائل التي تبدأ بـ /
    if (msg.text && msg.text.startsWith('/')) {
      return;
    }
    
    const chatId = msg.chat.id;
    const text = msg.text || '';
    const userInfo = userService.getUserInfo(msg);
    
    // زيادة عدد الرسائل المستلمة
    stats.messagesReceived++;
    
    // التحقق مما إذا كانت الرسالة من الأدمن
    if (chatId == config.adminId) {
      handleAdminMessage(msg, userInfo, text);
      return;
    }
    
    // التعامل مع رسائل المستخدمين العاديين
    handleUserMessage(msg, userInfo, text);
  } catch (error) {
    // معالجة الاستثناءات بشكل آمن
    console.error('خطأ في معالجة الرسالة:', error.message);
  }
});

// معالجة رسائل المستخدمين
function handleUserMessage(msg, userInfo, text) {
  const chatId = msg.chat.id;
  const userId = userInfo.id;
  
  // التحقق من المستخدمين المحظورين
  if (userService.isUserBlocked(userId)) {
    // تجاهل الرسالة إذا كان المستخدم محظورًا
    return;
  }
  
  // إرسال تأكيد استلام الرسالة للمستخدم
  bot.sendMessage(chatId, config.messages.messageSent);
  
  // إرسال الرسالة إلى الأدمن مع معلومات المرسل وأزرار التفاعل
  const adminMessage = `📨 رسالة جديدة من: ${userInfo.displayName}\n\nالرسالة: ${text}`;
  
  // استخراج اسم المستخدم إذا كان موجودًا (للتواصل المباشر)
  const username = userInfo.username !== 'غير متوفر' ? userInfo.username : null;
  
  bot.sendMessage(config.adminId, adminMessage, {
    reply_markup: uiService.createAdminKeyboard(userId, username)
  });
  
  stats.messagesSent++;
}

// معالجة رسائل الأدمن
function handleAdminMessage(msg, userInfo, text) {
  const chatId = msg.chat.id;
  
  // إذا كان الأدمن في انتظار كتابة رد للمستخدم
  if (waitingForReply && replyToUserId) {
    // إرسال الرد إلى المستخدم
    bot.sendMessage(replyToUserId, `${config.messages.adminPrefix}${text}`);
    bot.sendMessage(chatId, config.messages.replySent);
    
    // إعادة تعيين حالة الانتظار
    waitingForReply = false;
    replyToUserId = null;
    
    stats.messagesSent++;
    return;
  }
  
  // رسالة عادية من الأدمن
  bot.sendMessage(chatId, config.messages.adminWelcome);
}

// معالجة نقرات الأزرار
bot.on('callback_query', (callbackQuery) => {
  try {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const adminId = callbackQuery.from.id;
    
    // التعامل مع أزرار المستخدمين العاديين
    if (adminId != config.adminId) {
      handleUserCallbacks(callbackQuery);
      return;
    }
    
    // معالجة أزرار الأدمن
    handleAdminCallbacks(callbackQuery);
    
  } catch (error) {
    // معالجة الاستثناءات بشكل آمن
    console.error('خطأ في معالجة نقرة الزر:', error.message);
  }
});

// معالجة نقرات أزرار المستخدمين
function handleUserCallbacks(callbackQuery) {
  const queryId = callbackQuery.id;
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  
  if (action === 'help') {
    bot.answerCallbackQuery(queryId, { text: 'عرض المساعدة' });
    bot.sendMessage(chatId, `
📝 *كيفية استخدام البوت*
- فقط أرسل رسالتك وسنقوم بتوصيلها للإدارة
- ستتلقى ردًا من الإدارة عبر هذا البوت
    `, { parse_mode: 'Markdown' });
  } 
  else if (action === 'about') {
    bot.answerCallbackQuery(queryId, { text: 'حول البوت' });
    bot.sendMessage(chatId, `
*بوت التواصل مع الإدارة* 📱

هذا البوت يسهل التواصل بين المستخدمين والإدارة.
الإصدار: 1.1.0
*المطور:* @B_NBL
*للتواصل:* t.me/B_NBL
    `, { parse_mode: 'Markdown' });
  }
}

// معالجة نقرات أزرار الأدمن
function handleAdminCallbacks(callbackQuery) {
  const queryId = callbackQuery.id;
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  
  // إذا كانت البيانات تحتوي على مُعرّف مستخدم
  if (action.includes('_')) {
    const [command, userId] = action.split('_');
    
    if (command === 'reply') {
      // الرد على المستخدم
      waitingForReply = true;
      replyToUserId = userId;
      bot.sendMessage(chatId, `${config.messages.replyPrompt} (${userId}):`);
      bot.answerCallbackQuery(queryId, { text: 'الرجاء كتابة ردك الآن' });
    } 
    else if (command === 'block') {
      // حظر المستخدم
      userService.blockUser(userId);
      bot.sendMessage(chatId, `تم حظر المستخدم (${userId}) بنجاح.`);
      bot.answerCallbackQuery(queryId, { text: 'تم حظر المستخدم' });
    } 
    else if (command === 'unblock') {
      // إلغاء حظر المستخدم
      const result = userService.unblockUser(userId);
      const message = result 
        ? `تم إلغاء حظر المستخدم (${userId}) بنجاح.`
        : `المستخدم (${userId}) غير محظور بالفعل.`;
      
      bot.sendMessage(chatId, message);
      bot.answerCallbackQuery(queryId, { text: result ? 'تم إلغاء الحظر' : 'غير محظور' });
    }
    else if (command === 'info') {
      // عرض معلومات المستخدم
      bot.sendMessage(chatId, `
📊 *معلومات المستخدم*
🆔 معرّف المستخدم: ${userId}
      `, { parse_mode: 'Markdown' });
      bot.answerCallbackQuery(queryId, { text: 'تم عرض معلومات المستخدم' });
    }
  }
  // أزرار عامة للأدمن
  else {
    if (action === 'manage_users') {
      bot.sendMessage(chatId, '*إدارة المستخدمين* 👥', {
        parse_mode: 'Markdown',
        reply_markup: uiService.createUserManagementKeyboard()
      });
      bot.answerCallbackQuery(queryId, { text: 'إدارة المستخدمين' });
    }
    else if (action === 'list_blocked') {
      // عرض قائمة المستخدمين المحظورين - تنفيذ لاحقًا
      bot.sendMessage(chatId, 'سيتم تنفيذ هذه الميزة لاحقًا');
      bot.answerCallbackQuery(queryId, { text: 'قائمة المحظورين' });
    }
    else if (action === 'stats') {
      // عرض إحصائيات البوت
      const uptime = Math.floor((new Date() - stats.startTime) / 1000 / 60); // بالدقائق
      
      bot.sendMessage(chatId, `
📊 *إحصائيات البوت*
📨 الرسائل المستلمة: ${stats.messagesReceived}
📤 الرسائل المرسلة: ${stats.messagesSent}
⏱ وقت التشغيل: ${uptime} دقيقة
      `, { parse_mode: 'Markdown' });
      bot.answerCallbackQuery(queryId, { text: 'إحصائيات البوت' });
    }
    else if (action === 'back') {
      bot.sendMessage(chatId, 'تم الرجوع للقائمة الرئيسية');
      bot.answerCallbackQuery(queryId, { text: 'رجوع' });
    }
  }
}

/**
 * معالجة أخطاء الاتصال بشكل آمن دون كشف معلومات حساسة
 */
bot.on('polling_error', (error) => {
  // طباعة رسالة الخطأ فقط بدلاً من كائن الخطأ الكامل
  console.error('خطأ في الاتصال بواجهة برمجة تطبيقات تليغرام:', error.message);
  
  // تسجيل نوع الخطأ ورمزه إن وجد، دون كشف تفاصيل حساسة
  if (error.code) {
    console.error('رمز الخطأ:', error.code);
  }
});

// سجل بدء تشغيل البوت
console.log('تم تشغيل البوت بنجاح!');


app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    bot: 'running'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Health API running on port ${PORT}`);
});



// التعامل مع الإغلاق الآمن للبوت
process.on('SIGINT', () => {
  console.log('إيقاف تشغيل البوت...');
  userService.saveBlockedUsers();
  bot.stopPolling();
  process.exit(0);
});





