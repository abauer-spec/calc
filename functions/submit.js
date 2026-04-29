export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    
    // Формируем красивое и подробное сообщение
    const message = `
💰 <b>Новый инвестор на борту!</b>

👤 <b>Имя:</b> ${data.name || 'Не указано'}
📧 <b>Email:</b> ${data.email || 'Не указано'}
📈 <b>Стратегия:</b> ${data.strategy || 'Не выбрана'}
💵 <b>Старт. баланс:</b> $${data.balance || 0}
💸 <b>Инвестиция:</b> $${data.investment || 0}
🎯 <b>Итог через год:</b> ${data.finalBalance || 'Не рассчитан'}

<i>Данные получены из калькулятора 2026</i>
    `;

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
