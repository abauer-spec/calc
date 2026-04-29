export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    
    // Формируем текст
    const message = `💰 <b>Новая заявка!</b>\n\n👤 Имя: ${data.name}\n📞 Контакт: ${data.contact}`;

    // Отправляем в Telegram
    const url = `https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`;
    
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: env.CHAT_ID,
        text: message,
        parse_mode: "HTML"
      })
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
