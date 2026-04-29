/**
 * Cloudflare Pages Function
 * Путь:  functions/api/telegram.js
 * URL:   /api/telegram  (POST)
 *
 * Принимает FormData, формирует сообщение из всех полей
 * и отправляет в Telegram-бот через Bot API.
 *
 * Не зависит от имён полей — новые формы подхватятся автоматически.
 */


const BOT_TOKEN = '7720417095:AAGl5swgnjMjTb_9KZ0GVTSi4J1oMZ3n7yQ';
const CHAT_ID   = '7938607334';
const TG_URL    = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

export async function onRequestPost(context) {
  const { request, env } = context;

  const BOT_TOKEN = env.BOT_TOKEN;
  const CHAT_ID   = env.CHAT_ID;
  const TG_URL    = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  /* ── Разрешаем CORS для локальной разработки ── */
  const corsHeaders = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    /* ── Парсим FormData ── */
    const formData = await request.formData();

    /* ── IP отправителя (Cloudflare заголовок) ── */
    const ip = request.headers.get('CF-Connecting-IP')
            || request.headers.get('X-Forwarded-For')
            || 'неизвестен';

    /* ── Страна (бонус от Cloudflare) ── */
    const country = request.headers.get('CF-IPCountry') || '—';

    /* ── Формируем текст сообщения ── */
    const lines = ['📊 *Новая заявка — Investment Portfolio*', ''];

    for (const [key, value] of formData.entries()) {
      if (!value || value.toString().trim() === '') continue;
      // Экранируем спецсимволы Markdown v1
      const safeKey   = escapeMarkdown(key);
      const safeValue = escapeMarkdown(value.toString().trim());
      lines.push(`*${safeKey}:* ${safeValue}`);
    }

    lines.push('');
    lines.push(`🌐 *IP:* \`${ip}\``);
    lines.push(`🏳️ *Страна:* ${country}`);
    lines.push(`🕐 *Время:* ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`);

    const text = lines.join('\n');

    /* ── Отправляем в Telegram ── */
    const tgResponse = await fetch(TG_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id:    CHAT_ID,
        text:       text,
        parse_mode: 'Markdown',
      }),
    });

    const tgJson = await tgResponse.json();

    if (!tgResponse.ok) {
      console.error('Telegram API error:', tgJson);
      return new Response(
        JSON.stringify({ ok: false, error: tgJson.description }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (err) {
    console.error('Function error:', err);
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
}

/* ── OPTIONS preflight ── */
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

/* ── Escape Markdown v1 спецсимволов ── */
function escapeMarkdown(str) {
  return str.replace(/([_*`\[\]])/g, '\\$1');
}
