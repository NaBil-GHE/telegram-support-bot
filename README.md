# بوت تليغرام للتواصل بين المستخدمين والإدارة

هذا بوت تليغرام مصمم لتسهيل التواصل بين المستخدمين والمسؤول (الأدمن). يتيح البوت للمستخدمين إرسال الرسائل إلى الإدارة، ويمكن للأدمن الرد عليهم وإدارة الاتصالات.

## المميزات الأساسية

- استقبال رسائل المستخدمين وإعادة توجيهها للأدمن
- الرد على المستخدمين من خلال البوت
- حظر المستخدمين المزعجين وإلغاء الحظر
- عرض معلومات المستخدمين
- حفظ قائمة الحظر في ملف لاستعادتها عند إعادة تشغيل البوت
- التواصل المباشر مع المستخدمين للأدمن
- عرض إحصائيات استخدام البوت

## المميزات المضافة حديثاً

- **التواصل المباشر**: يمكن للأدمن الآن التواصل مباشرة مع المستخدم من خلال زر خاص، مما يسهل المحادثات المباشرة دون الحاجة للبوت كوسيط
- **إحصائيات متقدمة**: يمكن للأدمن الاطلاع على إحصائيات البوت مثل عدد الرسائل المستلمة والمرسلة ووقت التشغيل
- **واجهة مستخدم محسنة**: أزرار تفاعلية ورموز تعبيرية لتحسين تجربة المستخدم
- **معلومات المطور**: تم إضافة معلومات التواصل مع المطور (@B_NBL)

## هيكلة المشروع

البوت مصمم بهيكلة نمطية لسهولة التطوير والصيانة:

- **config.js**: ملف الإعدادات والتكوين
- **index.js**: الملف الرئيسي للبوت
- **services/userService.js**: خدمات إدارة المستخدمين
- **services/uiService.js**: خدمات واجهة المستخدم (الأزرار والقوائم)

## متطلبات النظام

- Node.js (v14 أو أحدث)
- npm (مدير حزم Node.js)

## التثبيت

1. قم بتثبيت الحزم المطلوبة:

```bash
npm install node-telegram-bot-api dotenv
```

2. قم بإنشاء ملف `.env` في المجلد الرئيسي للمشروع وأضف بيانات التكوين التالية:

```
TELEGRAM_TOKEN=your_telegram_bot_token
ADMIN_ID=your_telegram_user_id
```

استبدل `your_telegram_bot_token` بالرمز الخاص ببوت التليغرام الخاص بك (يمكنك الحصول عليه من [@BotFather](https://t.me/botfather)).
استبدل `your_telegram_user_id` بمعرف التليغرام الخاص بك (يمكنك الحصول عليه من [@userinfobot](https://t.me/userinfobot)).

## التشغيل

لتشغيل البوت، استخدم أحد الأمرين التاليين:

```bash
npm start         # للتشغيل العادي
npm run dev       # للتشغيل في وضع التطوير (مع إعادة التشغيل التلقائي عند تغيير الملفات)
```

## الأوامر المتاحة

البوت يدعم الأوامر التالية:

- `/start` - بدء استخدام البوت
- `/help` - عرض صفحة المساعدة
- `/about` - معلومات عن البوت والمطور

## كيفية الاستخدام

### للمستخدمين:
- أرسل أي رسالة إلى البوت وستصل إلى المسؤول
- ستتلقى تأكيداً بأن الرسالة قد تم إرسالها
- ستتلقى رداً من المسؤول عندما يرد على رسالتك

### للمسؤول:
- ستتلقى رسائل المستخدمين مع اسم المستخدم وبيانات الاتصال الخاصة به
- سترى الأزرار التالية مع كل رسالة:
  - **رد عليه**: لإرسال رد إلى المستخدم عبر البوت
  - **حظر المستخدم**: لمنع المستخدم من إرسال المزيد من الرسائل
  - **معلومات المستخدم**: لعرض المزيد من المعلومات حول المستخدم
  - **إلغاء الحظر**: لإلغاء حظر مستخدم سبق حظره
  - **تواصل مباشر**: للانتقال مباشرة إلى محادثة خاصة مع المستخدم (يظهر فقط للمستخدمين الذين لديهم @username)
  - **إدارة المستخدمين**: للوصول إلى لوحة إدارة المستخدمين

## أمان وخصوصية

- يتم تخزين توكن البوت في ملف `.env` منفصل لمنع تسريبه
- تم تحسين معالجة الأخطاء لمنع تسريب المعلومات الحساسة
- البوت يستخدم إدارة آمنة للاتصال بواجهة برمجة تطبيقات تليغرام

## خطة التطوير المستقبلية

- إضافة دعم للوسائط المتعددة (صور، فيديو، ملفات)
- إضافة قاعدة بيانات لحفظ سجلات المحادثات
- إضافة لوحة تحكم للمسؤول
- إضافة دعم متعدد اللغات
- دعم الإشعارات المجدولة

## المساهمة في المشروع

نرحب بمساهماتكم في تطوير البوت! يمكنكم:
1. فتح issue لاقتراح ميزات جديدة أو الإبلاغ عن مشاكل
2. إرسال طلبات pull للمساهمة بالكود

## التواصل مع المطور

للاستفسارات والدعم، يمكنكم التواصل مع المطور:
- تليغرام: [@B_NBL](https://t.me/B_NBL)

## الترخيص

هذا المشروع تحت ترخيص NABIL GHENISSA.

---

تم التحديث الأخير: أبريل 2025

