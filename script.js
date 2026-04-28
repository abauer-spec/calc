(function(){
'use strict';

const fmt = v => new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(Math.round(v)) + ' $';

const st = {
  name: '',
  email: '',
  target: 50000,
  strategy: null,
  rate: 0,
  stratKey: '',
  balance: 0,
  invest: 0,
  wpct: 0
};

const screens = ['sc1', 'sc2', 'sc3', 'sc4', 'scLoad', 'scResults'];

function show(id) {
  screens.forEach(s => document.getElementById(s).classList.remove('on'));
  document.getElementById(id).classList.add('on');
  window.scrollTo({top: 0, behavior: 'smooth'});
}

function setBar(p) {
  document.getElementById('topFill').style.width = p + '%';
}

function setDots(cur) {
  [1, 2, 3, 4].forEach(n => {
    const d = document.getElementById('sd' + n);
    d.classList.remove('on', 'dn');
    if (n < cur) {
      d.classList.add('dn');
      d.textContent = '✓';
    } else if (n === cur) {
      d.classList.add('on');
      d.textContent = n;
    } else {
      d.textContent = n;
    }
    if (n < 4) {
      const l = document.getElementById('sl' + n);
      l.classList.toggle('dn', n < cur);
    }
  });
}

function bonusInfo(dep) {
  if (dep < 10000)  return {pct: 25, lbl: '25% — бонус для начинающих'};
  if (dep < 25000)  return {pct: 50, lbl: '50% — бонус для опытных участников'};
  if (dep < 50000)  return {pct: 75, lbl: '75% — бонус для серьёзных инвесторов'};
  if (dep < 100000) return {pct: 100, lbl: '100% — бонус для крупных участников'};
  return {pct: 150, lbl: '150% — VIP-бонус для топ-инвесторов'};
}

// Step 1 -> Step 2
document.getElementById('b1').addEventListener('click', () => {
  const nm = document.getElementById('fname').value.trim();
  const em = document.getElementById('femail').value.trim();
  let ok = true;

  if (!nm) {
    document.getElementById('fname').classList.add('err');
    document.getElementById('e1').classList.add('show');
    ok = false;
  } else {
    document.getElementById('fname').classList.remove('err');
    document.getElementById('e1').classList.remove('show');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
    document.getElementById('femail').classList.add('err');
    document.getElementById('e2').classList.add('show');
    ok = false;
  } else {
    document.getElementById('femail').classList.remove('err');
    document.getElementById('e2').classList.remove('show');
  }

  if (!ok) return;
  st.name = nm;
  st.email = em;
  show('sc2');
  setDots(2);
  setBar(25);
});

['fname', 'femail'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    document.getElementById(id).classList.remove('err');
    document.getElementById(id === 'fname' ? 'e1' : 'e2').classList.remove('show');
  });
});

// Step 2 Slider
function fillSlider(el, mn, mx) {
  const p = ((el.value - mn) / (mx - mn)) * 100;
  el.style.background = `linear-gradient(to right, #1a56db 0%, #1a56db ${p}%, var(--color-border-secondary) ${p}%)`;
}

const ta = document.getElementById('ta');
ta.addEventListener('input', () => {
  st.target = +ta.value;
  document.getElementById('tav').textContent = fmt(+ta.value);
  fillSlider(ta, 10000, 250000);
});
fillSlider(ta, 10000, 250000);

document.getElementById('b2').addEventListener('click', () => {
  show('sc3');
  setDots(3);
  setBar(50);
});
document.getElementById('bk1').addEventListener('click', () => {
  show('sc1');
  setDots(1);
  setBar(0);
});

// Step 3 Cards
document.querySelectorAll('.scard').forEach(c => {
  c.addEventListener('click', () => {
    document.querySelectorAll('.scard').forEach(x => x.classList.remove('sel'));
    c.classList.add('sel');
    st.rate = parseFloat(c.dataset.rate);
    st.stratKey = c.dataset.key;
    st.strategy = c.querySelector('.sctitle').textContent;
    document.getElementById('s3hint').classList.remove('show');
  });
});

document.getElementById('b3').addEventListener('click', () => {
  if (!st.strategy) {
    document.getElementById('s3hint').classList.add('show');
    return;
  }
  show('sc4');
  setDots(4);
  setBar(75);
});
document.getElementById('bk2').addEventListener('click', () => {
  show('sc2');
  setDots(2);
  setBar(25);
});

// Step 4 Inputs
function updateBonusPreview() {
  const bal = parseFloat(document.getElementById('fbal').value) || 0;
  const inv = parseFloat(document.getElementById('fwk').value) || 0;
  if (bal <= 0 && inv <= 0) {
    document.getElementById('bonusPreview').style.display = 'none';
    return;
  }
  const dep = bal + inv;
  const b = bonusInfo(dep);
  const bv = Math.round(dep * (b.pct / 100));
  const total = dep + bv;
  document.getElementById('bonusPreview').style.display = 'block';
  document.getElementById('bonusPreview').innerHTML =
    `<strong>Предварительный расчёт стартового капитала:</strong><br>` +
    `Баланс ${fmt(bal)} + Инвестиция ${fmt(inv)} + Партнёрский бонус ${fmt(bv)} (${b.pct}%) = <strong>${fmt(total)}</strong>`;
}

document.getElementById('fbal').addEventListener('input', updateBonusPreview);
document.getElementById('fwk').addEventListener('input', updateBonusPreview);

document.querySelectorAll('.segbtn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.segbtn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    st.wpct = +btn.dataset.v;
  });
});

document.getElementById('b4').addEventListener('click', () => {
  const bal = parseFloat(document.getElementById('fbal').value);
  const wk = parseFloat(document.getElementById('fwk').value);
  let ok = true;
  if (isNaN(bal) || bal < 0) {
    document.getElementById('fbal').classList.add('err');
    document.getElementById('e3').classList.add('show');
    ok = false;
  } else {
    document.getElementById('fbal').classList.remove('err');
    document.getElementById('e3').classList.remove('show');
  }
  if (isNaN(wk) || wk < 0) {
    document.getElementById('fwk').classList.add('err');
    document.getElementById('e4').classList.add('show');
    ok = false;
  } else {
    document.getElementById('fwk').classList.remove('err');
    document.getElementById('e4').classList.remove('show');
  }
  if (!ok) return;
  st.balance = bal;
  st.invest = wk;
  show('scLoad');
  setBar(90);
  startLoader();
});

document.getElementById('bk3').addEventListener('click', () => {
  show('sc3');
  setDots(3);
  setBar(50);
});

// Loader Logic
function startLoader() {
  const pf = document.getElementById('pfill');
  const pl = document.getElementById('plbl');
  const ls = document.getElementById('lsub');
  const msgs = ['Анализируем рынок...', 'Суммируем капитал...', 'Рассчитываем доходность...', 'Формируем 12-месячный план...', 'Готово!'];
  let pct = 0, mi = 0;
  const iv = setInterval(() => {
    pct++;
    pf.style.width = pct + '%';
    pl.textContent = pct + '%';
    const ni = Math.min(Math.floor((pct / 100) * msgs.length), msgs.length - 1);
    if (ni !== mi) {
      mi = ni;
      ls.textContent = msgs[mi];
    }
    if (pct >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        showResults();
        setBar(100);
      }, 300);
    }
  }, 50);
}

// Calculation & Results
function buildTable(startCapital) {
  const rows = [];
  let bal = startCapital;
  for (let m = 1; m <= 12; m++) {
    const start = bal;
    const profit = start * st.rate;
    const withdraw = profit * (st.wpct / 100);
    const end = start + profit - withdraw;
    rows.push({m, start, profit, withdraw, end});
    bal = end;
  }
  return rows;
}

function showResults() {
  show('scResults');

  const dep = st.balance + st.invest;
  const b = bonusInfo(dep);
  const bonusVal = Math.round(dep * (b.pct / 100));
  const startCapital = dep + bonusVal;

  const rows = buildTable(startCapital);
  const finalBal = rows[rows.length - 1].end;
  const totalW = rows.reduce((s, r) => s + r.withdraw, 0);
  const totalP = rows.reduce((s, r) => s + r.profit, 0);
  const growPct = Math.round((finalBal / startCapital - 1) * 100);

  const smap = {intraday: 'внутридневной торговли', midterm: 'позиционной торговли', longterm: 'долгосрочного инвестирования'};
  const sn = smap[st.stratKey] || st.strategy;

  let goalMonth = null;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].end >= st.target) {
      goalMonth = rows[i].m;
      break;
    }
  }

  const recos = [
    {t: `Стратегия: ${st.strategy}`, d: `Подход ${sn} с ежемесячной доходностью ${Math.round(st.rate * 100)}% обеспечит максимальный результат вашего портфеля за 12 месяцев.`},
    {t: 'Стартовый капитал портфеля', d: `Баланс ${fmt(dep)} + партнёрский бонус ${fmt(bonusVal)} = ${fmt(startCapital)}. Именно эта сумма запускает ваш инвестиционный цикл.`},
    {t: 'Прогнозируемая прибыль за 12 мес.', d: `Совокупная прибыль составит ${fmt(totalP)}. Сложный процент работает на вас каждый месяц.`},
    {t: 'Капитал на конец 12-го месяца', d: `Итоговый баланс: ${fmt(finalBal)} — рост ${growPct}% от стартового капитала.`},
    {t: 'Доход к выводу', d: `По схеме вывода ${st.wpct}% вы получите ${fmt(totalW)} в течение года.`},
  ];

  const list = document.getElementById('recol');
  list.innerHTML = '';
  recos.forEach((r, i) => {
    const li = document.createElement('li');
    li.className = 'recoi';
    li.innerHTML = `<div class="recon">${i + 1}</div><div class="recot"><strong>${r.t}</strong>${r.d}</div>`;
    list.appendChild(li);
  });

  const items = list.querySelectorAll('.recoi');
  items.forEach((item, i) => {
    setTimeout(() => {
      item.classList.add('vis');
      if (i === items.length - 1) {
        setTimeout(() => {
          document.getElementById('bonuslbl').textContent = b.lbl;
          document.getElementById('bonusamnt').textContent = fmt(bonusVal);
          document.getElementById('bonusdiv').style.display = 'flex';

          document.getElementById('startsumDesc').textContent =
            `${fmt(st.balance)} баланс + ${fmt(st.invest)} инвестиция + ${fmt(bonusVal)} бонус`;
          document.getElementById('startsumVal').textContent = fmt(startCapital);
          document.getElementById('startsumDiv').style.display = 'flex';

          setTimeout(() => buildResultTable(rows, finalBal, totalW, goalMonth), 700);
        }, 700);
      }
    }, i * 2000);
  });

  sendData(finalBal);
}

function buildResultTable(rows, finalBal, totalW, goalMonth) {
  const tc = document.getElementById('tcard');
  tc.style.display = 'block';

  const tbody = document.getElementById('tbody');
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    const highlight = goalMonth && r.m === goalMonth ? 'style="background:rgba(5,122,85,.06)"' : '';
    tr.innerHTML = `
      <td class="mc" ${highlight}>${r.m}</td>
      <td ${highlight}>${fmt(r.start)}</td>
      <td class="pc" ${highlight}>+${fmt(r.profit)}</td>
      <td class="wc" ${highlight}>${r.withdraw > 0 ? fmt(r.withdraw) : '—'}</td>
      <td ${highlight}>${fmt(r.end)}</td>
    `;
    tbody.appendChild(tr);
  });

  const banner = document.getElementById('goalBanner');
  if (goalMonth) {
    banner.className = 'goal-banner ok';
    banner.innerHTML = `<span class="goal-banner-ico">🎯</span>Вы достигнете своей цели <strong>${fmt(rows[goalMonth - 1].end)}</strong> уже на <strong>${goalMonth}-м месяце</strong>!`;
  } else {
    banner.className = 'goal-banner fail';
    banner.innerHTML = `<span class="goal-banner-ico">⚠️</span>За 12 месяцев цель <strong>${fmt(st.target)}</strong> не будет достигнута. Вам нужно больше стартового капитала.`;
  }

  document.getElementById('totg').innerHTML = `
    <div class="tbox hi"><div class="tlbl">Баланс на конец 12 месяцев</div><div class="tval">${fmt(finalBal)}</div></div>
    <div class="tbox"><div class="tlbl">Общая сумма вывода</div><div class="tval">${fmt(totalW)}</div></div>
  `;

  setTimeout(() => tc.scrollIntoView({behavior: 'smooth', block: 'start'}), 200);
}

async function sendData(finalBal) {
  try {
    await fetch('https://httpbin.org/post', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        to: 'tradingviewfindep@gmail.com',
        name: st.name,
        email: st.email,
        strategy: st.strategy,
        finalBalance: fmt(finalBal),
        ts: new Date().toISOString()
      })
    });
  } catch (_) {}
}

document.getElementById('bpdf').addEventListener('click', () => window.print());

document.getElementById('brest').addEventListener('click', () => {
  Object.assign(st, {name: '', email: '', target: 50000, strategy: null, rate: 0, stratKey: '', balance: 0, invest: 0, wpct: 0});
  document.getElementById('fname').value = '';
  document.getElementById('femail').value = '';
  document.getElementById('fbal').value = '';
  document.getElementById('fwk').value = '';
  ta.value = 50000;
  fillSlider(ta, 10000, 250000);
  document.getElementById('tav').textContent = fmt(50000);
  document.querySelectorAll('.scard').forEach(c => c.classList.remove('sel'));
  document.querySelectorAll('.segbtn').forEach((b, i) => b.classList.toggle('on', i === 0));
  document.getElementById('tcard').style.display = 'none';
  document.getElementById('bonusdiv').style.display = 'none';
  document.getElementById('startsumDiv').style.display = 'none';
  document.getElementById('bonusPreview').style.display = 'none';
  document.getElementById('recol').innerHTML = '';
  document.getElementById('s3hint').classList.remove('show');
  show('sc1');
  setDots(1);
  setBar(0);
});

// Init
setDots(1);
setBar(0);

})();
