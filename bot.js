const { Telegraf, Markup } = require('telegraf');
const admin = require('firebase-admin');

// ─────────────────────────────────────────
//  Firebase Init
// ─────────────────────────────────────────
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: "fullmark-neweddition",
      private_key_id: "8e6bea610e1b4d1af3d27c27e137bd34e6636a4e",
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCj593kaisD2UBo\noiWS25EmmBDCer1zV9LTsjtkh0Si7iEkZHA9wknRV71bAdhnBYB9ZVYSN5mjlnSf\nNhkO/CJ5gUtP9v0XPXk1SwFnx2qXq+WS3Cu+P87k43s/n7GhU3upFRGH5mi01Wq1\nBdW86TgTbwwSROXCnJ7N/8f3CvLj8rfuVO9C8Q57OLPVLZJxLqcRH52Fl/d0I+uv\n87pUl8+TjUOkkUEi94q/Wnv4+RG99hMuZxTY8K+zVs7nrkYVMszGnLV7Ww7chN9L\nql4Ws9m3Xk8DfN0qsl2Mm3Zlkyx5Kn21Z8uf1MvK5gj6e8FThg5rtvMNGuBkdLv6\nIfVcz9yDAgMBAAECgf9Z6EM8MseoBDMlycvShSyZwV5mpOPCI8Si/C+hkZsP/XMd\nmwQJhy+E9jhoM11M/6lj8Aegqq+g9J/LOlgJQ8m4ToSKxaA+SfCy1IAbhNqsYWo8\nFoAhD/I5M1+vBr93W1iRfqx5MAHqJlaDSx0d5nFJG0a4ARx49Kl891FVZgYraxLU\nlLwK00kJbQaZ7cltFw76puOfwces1Zjyfa7csLUUnABO/4GkjN5JIbMGjGFetCNM\n1xN0kT8FhTTf/o1IP0YDVuPNgosYGanfQrKtWlBdw6CbeIxb06lDjW20glAD97Bd\nTIm6DsiNl9HS5bot2qOYekEbNfzPqweEinN6Da0CgYEA1sMr+DjgQB3QqCyHrFRg\nnfovm4uQFb6bVVgmOQHb9MCn5BjQQgsF6gvTrxpp69p0ALKJJCdk1trI9N7i+qwv\nz8eAf4ytHLFJMEyo9XJJmDu3i8EOACYuCyWzwCwbY/ckAc6FsZiMgAmIaSoNFpjH\nlNvyON5gGKgWJvPA4t6Ik1UCgYEAw2DK5K+DoieUbT4MzMl5U5syJZi0iPox5tpb\n+FL2+f8vbZq+mWOHosGA0YL9ejwCCoJ01exulNOlTdGI2o28u+fyoH0ozt54yqDR\ntqxbfDsPzQOYiwWn+Du1VEHAZuXH9az5PHM9ggqc/KuCONHbMsIG1RI7eFOQzawu\nJuLF4HcCgYEAtk3W9U7SjZrBlQC36sF1gqTt5MwD83FpyniZearqXEluO2IU5vsU\neiiv+OQjJeK6thzX7ajDIN931uWdJ80iiO6BVcTE7qZPyoBIrJHnhyKqHCg1Ckte\nqnfGrkrCtYkFN8NoGem02rs84Iihs5zdTq+mXj/mswd8RnSEOBFPPkECgYAk5rEr\nhCLei48zGtccDqmFqvhLtY3TmT23lmJsgm73RMVWdDWvjubdTKLh71WkspTIG1+p\nz+AK5/Z+viaU8NRGwUZIHZuJhudVjg5N7DvTOOyBEj7LcyQIdG6JHWoThS7BLgxc\n6H8jgpGn/1S3GpvF+HOF5s2oqk/dKLoGyioJfQKBgQDQc2sWkR7raz1Z8v92hEE8\nkOE/FPLvDdlH5psghq05ZU0yxbBPCjJ6QmV1LLy1F+Ya+XeLjp5AE0jTpgorUlLB\nZIc4wYipK2x0PypqgJD7+L3evqAwuXZEvtWiZPB2N+ueXsE00T4m35N4w9VNadI4\ndDfLoOIsWbfGCuvOA0SmZQ==\n-----END PRIVATE KEY-----\n",
      client_email: "firebase-adminsdk-fbsvc@fullmark-neweddition.iam.gserviceaccount.com",
      client_id: "103917924440939464168"
    }),
    databaseURL: "https://fullmark-neweddition-default-rtdb.europe-west1.firebasedatabase.app"
  });
}

const db = admin.database();
const bot = new Telegraf('8762693401:AAEm5BcD5yG_szPs273svduTv8TlK9BP1dM');

const OWNER_ID = 1778665778;
const CASH_NUMBER = '01090747536';

// ─────────────────────────────────────────
//  Helper Functions
// ─────────────────────────────────────────
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'FM-';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const mainKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('💳 أرقام الكاش', 'cash')],
  [Markup.button.callback('✅ تأكيد الدفع', 'confirm_payment')],
  [Markup.button.callback('🎁 كود تجربة', 'trial_code')],
  [Markup.button.callback('🔄 تجديد الاشتراك', 'renew')],
]);

const backKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback('🔙 رجوع', 'back')]
]);

// ─────────────────────────────────────────
//  /start
// ─────────────────────────────────────────
bot.start(async (ctx) => {
  const name = ctx.from.first_name || 'طالب';
  await ctx.reply(
    `🎓 *أهلاً ${name} في Full Mark!*\n\nاختار اللي عايزه:`,
    { parse_mode: 'Markdown', ...mainKeyboard }
  );
});

// ─────────────────────────────────────────
//  أرقام الكاش
// ─────────────────────────────────────────
bot.action('cash', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(
    `💳 *أرقام الكاش لدفع الاشتراك:*\n\n📱 *فودافون كاش:*\n\`${CASH_NUMBER}\`\n\n💰 *سعر الاشتراك: 200 جنيه*`,
    { parse_mode: 'Markdown', ...backKeyboard }
  );
});

// ─────────────────────────────────────────
//  تأكيد الدفع
// ─────────────────────────────────────────
bot.action('confirm_payment', async (ctx) => {
  await ctx.answerCbQuery();
  const userId = ctx.from.id;
  await db.ref(`pending/${userId}`).set({ step: 'waiting_screenshot', ts: Date.now() });
  await ctx.editMessageText(
    `📸 *تأكيد الدفع*\n\nابعت اسكرين بالتحويل دلوقتي 👇`,
    { parse_mode: 'Markdown', ...backKeyboard }
  );
});

// ─────────────────────────────────────────
//  كود تجربة
// ─────────────────────────────────────────
bot.action('trial_code', async (ctx) => {
  await ctx.answerCbQuery();
  const userId = String(ctx.from.id);
  const snap = await db.ref(`trials/${userId}`).get();

  if (snap.exists()) {
    const data = snap.val();
    await ctx.editMessageText(
      `🎁 *كود التجربة بتاعك:*\n\n\`${data.code}\`\n\n_الكود ده خاص بيك ومش هيتغير_ ✅`,
      { parse_mode: 'Markdown', ...backKeyboard }
    );
  } else {
    const code = generateCode();
    await db.ref(`trials/${userId}`).set({ code, createdAt: Date.now(), name: ctx.from.first_name || '' });
    await ctx.editMessageText(
      `🎁 *كود التجربة بتاعك:*\n\n\`${code}\`\n\n_الكود ده خاص بيك ومش هيتغير_ ✅`,
      { parse_mode: 'Markdown', ...backKeyboard }
    );
  }
});

// ─────────────────────────────────────────
//  تجديد الاشتراك
// ─────────────────────────────────────────
bot.action('renew', async (ctx) => {
  await ctx.answerCbQuery();
  const userId = ctx.from.id;
  await db.ref(`pending/${userId}`).set({ step: 'waiting_renew_code', ts: Date.now() });
  await ctx.editMessageText(
    `🔄 *تجديد الاشتراك*\n\nاكتب كودك القديم 👇`,
    { parse_mode: 'Markdown', ...backKeyboard }
  );
});

// ─────────────────────────────────────────
//  رجوع
// ─────────────────────────────────────────
bot.action('back', async (ctx) => {
  await ctx.answerCbQuery();
  const name = ctx.from.first_name || 'طالب';
  await ctx.editMessageText(
    `🎓 *أهلاً ${name} في Full Mark!*\n\nاختار اللي عايزه:`,
    { parse_mode: 'Markdown', ...mainKeyboard }
  );
});

// ─────────────────────────────────────────
//  Messages Handler
// ─────────────────────────────────────────
bot.on('message', async (ctx) => {
  const userId = ctx.from.id;
  const userIdStr = String(userId);
  const snap = await db.ref(`pending/${userIdStr}`).get();

  if (!snap.exists()) return;
  const pending = snap.val();

  // انتظار اسكرين التحويل
  if (pending.step === 'waiting_screenshot') {
    if (ctx.message.photo) {
      const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      await db.ref(`pending/${userIdStr}`).update({ step: 'waiting_phone', fileId });
      await ctx.reply('📱 *تمام! دلوقتي ابعتلي الرقم اللي حولت منه:*', { parse_mode: 'Markdown' });
    } else {
      await ctx.reply('❌ لازم تبعت صورة (اسكرين التحويل) مش نص.');
    }
    return;
  }

  // انتظار الرقم
  if (pending.step === 'waiting_phone') {
    const phone = ctx.message.text?.trim();
    if (!phone || !/^01[0-9]{9}$/.test(phone)) {
      await ctx.reply('❌ الرقم مش صح، ابعت رقم مصري صحيح زي: 01090747536');
      return;
    }
    await db.ref(`pending/${userIdStr}`).update({ step: 'waiting_name', phone });
    await ctx.reply('✏️ *اكتب اسمك الكامل:*', { parse_mode: 'Markdown' });
    return;
  }

  // انتظار الاسم بعد تأكيد الأونر
  if (pending.step === 'waiting_name_after_confirm') {
    const name = ctx.message.text?.trim();
    if (!name || name.length < 3) {
      await ctx.reply('❌ اكتب اسمك صح (3 حروف على الأقل)');
      return;
    }
    const code = generateCode();
    await db.ref(`subscriptions/${userIdStr}`).set({
      name,
      code,
      phone: pending.phone || '',
      createdAt: Date.now(),
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
    });
    await db.ref(`pending/${userIdStr}`).remove();
    await ctx.reply(
      `✅ *تم تفعيل اشتراكك يا ${name}!*\n\n🔑 *كودك:*\n\`${code}\`\n\n_احتفظ بالكود ده_ 🎓`,
      { parse_mode: 'Markdown' }
    );
    return;
  }

  // انتظار الاسم (قبل إرسال للأونر)
  if (pending.step === 'waiting_name') {
    const name = ctx.message.text?.trim();
    if (!name || name.length < 3) {
      await ctx.reply('❌ اكتب اسمك صح (3 حروف على الأقل)');
      return;
    }
    await db.ref(`pending/${userIdStr}`).update({ step: 'waiting_owner_confirm', name });

    // ابعت للأونر
    await bot.telegram.sendPhoto(OWNER_ID, pending.fileId, {
      caption: `💳 *طلب اشتراك جديد*\n\n👤 الاسم: ${name}\n📱 الرقم: ${pending.phone}\n🆔 User ID: ${userId}\n\nهل تأكد التحويل؟`,
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback(`✅ تأكيد - ${userId}`, `approve_${userId}`)],
        [Markup.button.callback(`❌ رفض - ${userId}`, `reject_${userId}`)]
      ])
    });

    await ctx.reply('⏳ *تم إرسال طلبك، استنى التأكيد من الأدمن...*', { parse_mode: 'Markdown' });
    return;
  }

  // انتظار كود التجديد
  if (pending.step === 'waiting_renew_code') {
    const code = ctx.message.text?.trim();
    const subsSnap = await db.ref(`subscriptions/${userIdStr}`).get();
    if (!subsSnap.exists() || subsSnap.val().code !== code) {
      await ctx.reply('❌ الكود غلط، تأكد وحاول تاني.');
      return;
    }
    await db.ref(`pending/${userIdStr}`).update({ step: 'waiting_renew_screenshot' });
    await ctx.reply(
      `✅ *الكود صح!*\n\nدلوقتي حول *200 جنيه* على:\n\`${CASH_NUMBER}\`\n\nوابعت اسكرين التحويل 👇`,
      { parse_mode: 'Markdown' }
    );
    return;
  }

  // انتظار اسكرين التجديد
  if (pending.step === 'waiting_renew_screenshot') {
    if (ctx.message.photo) {
      const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      await db.ref(`pending/${userIdStr}`).update({ step: 'waiting_renew_phone', fileId });
      await ctx.reply('📱 *تمام! ابعتلي الرقم اللي حولت منه:*', { parse_mode: 'Markdown' });
    } else {
      await ctx.reply('❌ لازم تبعت صورة اسكرين التحويل.');
    }
    return;
  }

  // انتظار رقم التجديد
  if (pending.step === 'waiting_renew_phone') {
    const phone = ctx.message.text?.trim();
    if (!phone || !/^01[0-9]{9}$/.test(phone)) {
      await ctx.reply('❌ الرقم مش صح.');
      return;
    }
    const subsSnap = await db.ref(`subscriptions/${userIdStr}`).get();
    const name = subsSnap.val()?.name || ctx.from.first_name || '';
    await db.ref(`pending/${userIdStr}`).update({ step: 'waiting_renew_owner', phone, name });

    await bot.telegram.sendPhoto(OWNER_ID, pending.fileId, {
      caption: `🔄 *طلب تجديد اشتراك*\n\n👤 الاسم: ${name}\n📱 الرقم: ${phone}\n🆔 User ID: ${userId}`,
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [Markup.button.callback(`✅ تأكيد تجديد - ${userId}`, `renew_approve_${userId}`)],
        [Markup.button.callback(`❌ رفض - ${userId}`, `reject_${userId}`)]
      ])
    });

    await ctx.reply('⏳ *تم إرسال طلب التجديد، استنى التأكيد...*', { parse_mode: 'Markdown' });
    return;
  }
});

// ─────────────────────────────────────────
//  Owner Actions - تأكيد / رفض
// ─────────────────────────────────────────
bot.action(/approve_(\d+)/, async (ctx) => {
  if (ctx.from.id !== OWNER_ID) return ctx.answerCbQuery('مش مسموح لك');
  const targetId = ctx.match[1];
  await ctx.answerCbQuery('✅ تم التأكيد');
  await db.ref(`pending/${targetId}`).update({ step: 'waiting_name_after_confirm' });
  await bot.telegram.sendMessage(targetId, '✅ *تم تأكيد تحويلك!*\n\nاكتب اسمك الكامل عشان نبعتلك الكود 👇', { parse_mode: 'Markdown' });
  await ctx.editMessageCaption('✅ تم التأكيد');
});

bot.action(/renew_approve_(\d+)/, async (ctx) => {
  if (ctx.from.id !== OWNER_ID) return ctx.answerCbQuery('مش مسموح لك');
  const targetId = ctx.match[1];
  await ctx.answerCbQuery('✅ تم تأكيد التجديد');
  const newExpiry = Date.now() + (30 * 24 * 60 * 60 * 1000);
  await db.ref(`subscriptions/${targetId}`).update({ expiresAt: newExpiry, renewedAt: Date.now() });
  await db.ref(`pending/${targetId}`).remove();
  await bot.telegram.sendMessage(targetId, '🎉 *تم تجديد اشتراكك بنجاح!*\n\nاشتراكك شغال لمدة شهر من دلوقتي ✅', { parse_mode: 'Markdown' });
  await ctx.editMessageCaption('✅ تم تأكيد التجديد');
});

bot.action(/reject_(\d+)/, async (ctx) => {
  if (ctx.from.id !== OWNER_ID) return ctx.answerCbQuery('مش مسموح لك');
  const targetId = ctx.match[1];
  await ctx.answerCbQuery('❌ تم الرفض');
  await db.ref(`pending/${targetId}`).remove();
  await bot.telegram.sendMessage(targetId, '❌ *تم رفض طلبك.*\n\nلو في مشكلة تواصل مع الأدمن: @elgizawy9', { parse_mode: 'Markdown' });
  await ctx.editMessageCaption('❌ تم الرفض');
});

// ─────────────────────────────────────────
//  Vercel Handler
// ─────────────────────────────────────────
module.exports = async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method === 'POST') {
      await bot.handleUpdate(req.body);
      return res.status(200).send('OK');
    }
    res.status(200).send('🤖 FullMark Sub Bot is running!');
  } catch (err) {
    console.error('Bot error:', err.message);
    res.status(200).send('OK');
  }
};
