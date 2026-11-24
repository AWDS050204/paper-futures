/* Paper Futures · 界面多语言层
 * 设计：不侵入主逻辑。字典精确匹配文本节点，切回中文时还原原文。
 * 注意：不要做「子串替换」兜底——它会把整句打成中英混排。
 */
(function () {
  'use strict';

  var KEY = 'paper.lang';

  var EN = {
    // ── 顶部 ──
    'PAPER FUTURES · 纸上合约': 'PAPER FUTURES',
    '导出': 'Export', '导入': 'Import', '重置': 'Reset',

    // ── 账户 ──
    '账户': 'Account',
    '单笔风险': 'Risk / trade', '最多持仓': 'Max positions', '杠杆': 'Leverage', '费率': 'Fee',
    '保存': 'Save', '做多': 'Long', '做空': 'Short',
    '单笔风险 %': 'Risk per trade %',

    // ── 图表 ──
    '图表周期': 'Timeframe',
    '指标说明（记不住就点开）': 'Glossary (click to open)',

    // ── 问一句 ──
    '问一句': 'Quick ask',
    '纯本地计算 · 只答事实': 'local only · facts, no opinions',
    '例：我的强平在哪': 'e.g. where is my liquidation price',
    '问': 'Ask',
    '我还能开几单': 'How many slots left', '我的强平在哪': 'Where is my liquidation',
    '止损是几个 ATR': 'Stop in ATR', 'v4 缺哪几条': 'Which v4 checks fail',
    '上次 v4 信号': 'Last v4 signal', '1R 是多少钱': 'What is 1R worth',
    '挂单还差多少': 'How far to my orders', '手续费多少': 'What are the fees',
    '现在跌了多少': 'Drawdown from high',

    // ── 挂单 ──
    '挂单': 'Limit orders', '挂价': 'Price', '止损': 'Stop',
    '默认': 'default', '盈亏比 R': 'Reward R', '有效期': 'Valid for',
    '用现价': 'Use last', '挂多': 'Buy limit', '挂空': 'Sell limit',
    '距现价': 'Distance', '无挂单': 'No orders', '撤': 'Cancel',

    // ── 持仓 ──
    '当前持仓': 'Positions', '数量': 'Qty', '开仓': 'Entry', '强平': 'Liq.',
    '浮动': 'Unrealised', '平': 'Close', '无持仓': 'No positions',
    '向': 'Side', '币': 'Pair',

    // ── 热力图 ──
    '爆仓热力图': 'Liquidation heatmap',
    '取不到价格，稍后自动重试': 'price unavailable, retrying shortly',

    // ── 历史 ──
    '历史成交': 'Trade history', '时间': 'Time', '盈亏': 'P&L', '费': 'Fee',
    '资金费': 'Funding', '原因': 'Reason', '暂无': 'None',
    '止盈': 'take-profit', '到期': 'timeout', '手动': 'manual',

    // ── 说明卡（被 <b> 切成多个文本节点，逐片段翻译）──
    '说明': 'About',
    '支持范围': 'Supported',
    '· 纯前端，所有数据只存在': '· Pure front-end. Everything lives in ',
    '本浏览器': 'this browser',
    '的 localStorage，换设备/清缓存会丢，请用「导出」备份。':
      "'s localStorage; a new device or a cache wipe loses it — back up with Export.",
    '· 行情直连币安公开接口，不需要任何 API key。':
      '· Market data comes straight from Binance public endpoints. No API key.',
    '新闻已移除': 'News removed',
    '：RSS 不支持跨域，纯前端拿不到。': ': RSS sends no CORS headers, so a front-end cannot fetch it.',
    '· 这是纸面账户，': '· This is a paper account. ',
    '不涉及真实资金，不构成投资建议': 'No real money, and not investment advice.',
    '浏览器 Chrome / Edge / Firefox 近两年版本（IE 不支持）':
      'Browser · Chrome / Edge / Firefox, last two years (no IE)',
    '设备 桌面端。手机能打开，但布局未适配，表格会挤':
      'Device · Desktop. Opens on phones, but the layout is not adapted and tables get cramped',
    '网络 需能访问 fapi.binance.com，国内部分网络要代理':
      'Network · Must reach fapi.binance.com; some mainland networks need a proxy',
    '币种 BTC / ETH / BNB 永续合约': 'Symbols · BTC / ETH / BNB perpetuals',
    '数据 币安公开接口，价格约 5 秒刷新一次':
      'Data · Binance public endpoints, prices refresh about every 5s',
    '这不是什么 实盘交易终端 · 投资建议工具 · 实时行情系统':
      'Not · a trading terminal, an advisory tool, or a real-time feed',
    '爆仓热力图按「未平仓量 × 杠杆档位」估算，不是真实强平分布。':
      'The heatmap is estimated from open interest × leverage tiers — not real liquidation clusters.',
    // 上面几行在页面里被 <b>/<code> 切成了片段，逐个补
    '网络 需能访问': 'Network · must reach',
    '，国内部分网络要代理': '; some mainland networks need a proxy',
    '这不是什么': 'Not',
    '实盘交易终端 · 投资建议工具 · 实时行情系统':
      'a trading terminal, an advisory tool, or a real-time feed',
    '爆仓热力图按「未平仓量 × 杠杆档位」': 'The heatmap is estimated from open interest × leverage tiers —',
    '估算': 'estimated',
    '，不是真实强平分布。': ', not real liquidation clusters.',

    // ── 指标说明 ──
    '单笔风险 % 每笔最多亏账户的百分比。仓位由它倒算，不是手填的。':
      'Risk per trade % · The most one trade may lose, as a share of equity. Position size is derived from it.',
    '最多持仓 同时持仓上限，v4 规则是 3。':
      'Max positions · How many may be open at once. The v4 rule is 3.',
    '杠杆 x 名义仓位 ÷ 保证金。只决定保证金占用和强平距离，不决定你亏多少钱。':
      'Leverage x · Notional ÷ margin. It sets margin usage and liquidation distance — not how much you lose.',
    '费率 ‱ 单边手续费，币安合约 taker = 5‱ = 0.05%，开平双边。':
      'Fee ‱ · One-side fee. Binance futures taker = 5 bps = 0.05%, charged on open and close.',
    '挂价 买单必须低于现价、卖单必须高于现价，否则会立即成交。':
      'Price · A buy must sit below the market and a sell above it, or it fills at once.',
    '止损 留空 = 成交时按 1.5×ATR；填了就按你填的。':
      'Stop · Blank = 1.5×ATR at fill. Filled in = exactly your number.',
    '杠杆 留空 = 账户默认。只是上限：止损太远时会自动降到「止损先于强平」的那一档。':
      'Leverage · Blank = account default. Only a cap: when the stop is far it drops to the tier where the stop still fires first.',
    '盈亏比 R 中文叫风险单位。1R = 入场到止损的距离。':
      'Reward R · R is a risk unit. 1R = the distance from entry to stop.',
    '填 3 = 止盈设在 3 倍风险处。R 不是杠杆。':
      'Enter 3 = take profit at three times the risk. R is not leverage.',
    '有效期 挂单存活小时数，0 = 不过期。':
      'Valid for · Hours the order stays alive. 0 = never expires.',
    '数量 币的数量，由「风险金额 ÷ 止损距离」倒算。':
      'Qty · Coin amount, derived as risk amount ÷ stop distance.',
    '强平 入场 × (1 − 1/杠杆 + 维持保证金率 0.4%)。':
      'Liq. · Entry × (1 − 1/leverage + 0.4% maintenance margin).',
    '止损先于强平 硬规则：止损必须比强平更早触发，否则那条止损等于不存在。':
      'Stop before liquidation · Hard rule: the stop must trigger first, or it does not exist.',
    '盈亏 净盈亏，已扣手续费和资金费。': 'P&L · Net, after fees and funding.',
    '资金费 每 8 小时结算，多头付正费率，按持仓时长折算。':
      'Funding · Settled every 8 hours. Longs pay a positive rate, prorated by holding time.',
    '滑点 成交价相对盘口中间价的偏离。': 'Slippage · Fill price deviation from mid.',
    'EMA20/50/200 指数移动平均。v4 要求价 > EMA50 与 EMA200，且 EMA50 上行。':
      'EMA20/50/200 · Moving averages. v4 wants price above EMA50 and EMA200, and EMA50 rising.',
    'RSI(14) 相对强弱。本系统不拿它做入场依据（回测无效）。':
      'RSI(14) · Relative strength. Not used for entries — it tested as ineffective.',
    'MACD 12/26 EMA 之差与 9 周期信号线。': 'MACD · 12/26 EMA spread against a 9-period signal line.',
    'ADX(14) 趋势强度。v4 要求 >30，否则在震荡里做趋势会亏。':
      'ADX(14) · Trend strength. v4 wants above 30; trends lose money in a range.',
    'ATR(14) 平均真实波幅，用 % 表示波动。v4 要 2%–6%；止损 = 1.5×ATR。':
      'ATR(14) · Average true range as a percentage. v4 wants 2–6%; stop = 1.5×ATR.',
    '资金费率 每 8 小时费率，正数 = 多头付给空头；×3×365 可折年化。':
      'Funding rate · The 8-hourly rate. Positive = longs pay shorts; ×3×365 annualises it.',
    'OI 未平仓合约价值。涨 = 新资金进场，跌 = 平仓离场。':
      'OI · Open interest notional. Up = new money in, down = positions closing.',
    '多空比 全局账户多空人数比，>2 说明多头拥挤。':
      'Long/short ratio · Global account ratio. Above 2 means crowded longs.',
    '爆仓热力图 用 OI × 常见杠杆档位估算，不是真实强平单。':
      'Liquidation heatmap · Estimated from OI × leverage tiers, not real orders.',
    '两本账 A 轨严格按 v4（唯一对外报数）；B 轨是练习盘，不计入绩效。':
      'Two books · Track A follows v4 strictly and is the only number reported; track B is practice, not counted.',

    // ── 短词 / 状态 ──
    '多': 'Long', '空': 'Short',
    '加载中…': 'Loading…',
    '无挂单': 'No orders', '无持仓': 'No positions', '暂无': 'None',
    '保存在动': 'saving',
    '已撤单': 'Order cancelled', '配置已保存': 'Settings saved', '已重置': 'Reset done',
    '已导入': 'Imported',
    '先填挂价': 'Enter a price first', '取不到现价': 'Cannot fetch last price',
    '止损无效': 'Invalid stop', '杠杆需在 1–125': 'Leverage must be 1–125',
    '多单止损必须低于挂价': 'Long stop must be below the limit price',
    '空单止损必须高于挂价': 'Short stop must be above the limit price',
    '找不到挂单': 'Order not found', '找不到持仓': 'Position not found',
    'ATR 数据不足': 'Not enough ATR data',
    '当前没有持仓，没有强平价。': 'No open positions, so no liquidation price.',
    '强平价只在开仓后才有。': 'A liquidation price only exists once a position is open.',
    '当前没有持仓，没有止损价。': 'No open positions, so no stop price.',
    '当前没有挂单。': 'No limit orders.',
    'v4 数据还没加载完，等两秒再问。': 'The v4 data has not loaded yet — give it a second.',
    '日线近 400 根里没有出现过完整的 v4 信号。': 'No complete v4 signal in the last 400 daily bars.',
    '这个问题我不回答。': 'I will not answer that.',
    '我的职责是报事实，不是替你判断。': 'My job is to report facts, not to decide for you.',
    '我只会算，不会猜。能回答这些：': 'I compute, I do not guess. I can answer these:',
    '投资建议类的问题（该不该买、会不会涨）我不回答。':
      'I do not answer advice questions such as whether to buy or whether price will rise.',
    '已满仓，必须先平掉一个。': 'Full — close one first.',
    '同一标的不能重复开仓（v4 规则）。': 'One position per symbol (v4 rule).',
    '这不是历史最高点，只是这 400 根日线里我拉到的范围。':
      'Not the all-time high — just the range of the 400 daily bars I fetched.',
    '最近操作': 'Recent activity',
    '还没有操作记录。开仓、平仓、挂单、撤单、自动止损都会记在这里。':
      'No activity yet. Opens, closes, limit orders, cancels and automatic exits all land here.',
    'ATR 2–6%': 'ATR 2–6%'
  };

  // 「最近操作」是代码拼出来的句子，用词表逐词替换（只作用于 #actLog 内部）
  var ACT = [
    [/^开多 /, 'Long '], [/^开空 /, 'Short '],
    [/^平仓 /, 'Closed '], [/^挂多 /, 'Buy limit '], [/^挂空 /, 'Sell limit '],
    [/^撤单 /, 'Cancelled '], [/^自动平仓 /, 'Auto closed '], [/^改配置：/, 'Settings: '],
    [/｜止损 /g, ' | stop '], [/｜盈亏 /g, ' | P&L '], [/｜/g, ' | '],
    [/默认杠杆/g, 'default leverage'], [/成交时按 ATR/g, 'ATR at fill'],
    [/（止损）/g, ' (stop)'], [/（止盈）/g, ' (target)'], [/（强平）/g, ' (liquidated)'], [/（到期）/g, ' (timeout)'],
    [/h 有效/g, 'h valid'], [/不过期/g, 'never expires'],
    [/ 多 @/g, ' long @'], [/ 空 @/g, ' short @'],
    [/\s·\s/g, ' · '],
    [/最多 /g, 'max '], [/单 · /g, 'pos · '], [/ 费率 /g, ' fee '],
    [/风险 /g, 'risk '],
    [/（最近 (\d+) 条）/, ' (last $1)']
  ];

  function translateActivity() {
    var box = document.getElementById('actLog');
    if (!box) return;
    var spans = box.querySelectorAll('div > span:last-child');
    var cnt = document.getElementById('actCount');

    if (LANG !== 'en') {
      // 切回中文：用记下的原文还原（这些节点是 render() 建的，store 里有中文原值）
      for (var j = 0; j < spans.length; j++) {
        if (store.has(spans[j]) && spans[j].textContent !== store.get(spans[j])) {
          spans[j].textContent = store.get(spans[j]);
        }
      }
      if (cnt && store.has(cnt) && cnt.textContent !== store.get(cnt)) cnt.textContent = store.get(cnt);
      return;
    }

    for (var i = 0; i < spans.length; i++) {
      var el = spans[i];
      if (!/[\u4e00-\u9fa5]/.test(el.textContent)) continue;
      if (!store.has(el)) store.set(el, el.textContent);
      var t = store.get(el);
      for (var k = 0; k < ACT.length; k++) {
        ACT[k][0].lastIndex = 0;
        t = t.replace(ACT[k][0], ACT[k][1]);
      }
      if (el.textContent !== t) el.textContent = t;
    }
    if (cnt && /[\u4e00-\u9fa5]/.test(cnt.textContent)) {
      if (!store.has(cnt)) store.set(cnt, cnt.textContent);
      var c = store.get(cnt).replace(/（最近 (\d+) 条）/, ' (last $1)');
      if (cnt.textContent !== c) cnt.textContent = c;
    }
  }

  // 针对动态生成的行（数字会变，只能按模式翻）
  var RULES = [
    [/^起始 (.+) ｜ 累计 (.+) ｜ 手续费 (.+) ｜ 浮动 (.+)$/, 'Start $1 | Total $2 | Fees $3 | Unrealised $4'],
    [/^估算 · WS (在线|离线) · 真实强平 (\d+) 条$/, function (m) {
      return 'estimated · WS ' + (m[1] === '在线' ? 'online' : 'offline') + ' · ' + m[2] + ' real liquidations';
    }],
    [/价>EMA50/g, 'Close>EMA50'],
    [/价>EMA200/g, 'Close>EMA200'],
    [/EMA50↑/g, 'EMA50 rising'],
    [/^v4 判定（固定日线，用上一根已收盘）：$/, 'v4 check (daily, last closed bar):'],
    // 顶部副行被 <span> 切成三段（norm 会 trim，正则不能依赖首尾空格）
    [/^起始 (.+) ｜ 累计$/, 'Start $1 | Total'],
    [/^｜ 手续费 -(.+) ｜ 浮动 (.+)$/, '| Fees -$1 | Unrealised $2'],
    // 热力图每档一行
    [/^多 (\d+)x · (.+)$/, 'Long $1x · $2'],
    [/^空 (\d+)x · (.+)$/, 'Short $1x · $2'],
    [/^(\d)\/5 · 不开仓$/, '$1/5 · no entry'],
    [/^(\d)\/5 · 可开仓$/, '$1/5 · entry allowed'],
    [/^(.+) 已有持仓，同一标的不重复开仓$/, '$1 already has a position; one per symbol'],
    [/^已达最大持仓 (\d+)$/, 'Max positions reached ($1)'],
    [/^(.+) 暂时取不到价格$/, 'No price for $1 right now'],
    [/^(.+) 暂时取不到价格，未平仓$/, 'No price for $1, position left open'],
    [/^多单止损 (.+) 必须低于入场 (.+)$/, 'Long stop $1 must be below entry $2'],
    [/^空单止损 (.+) 必须高于入场 (.+)$/, 'Short stop $1 must be above entry $2'],
    [/^止损 (.+) 离入场太远，任何杠杆下强平都会先于止损$/, 'Stop $1 is too far: under any leverage liquidation fires first'],
    [/^成交 (.+)，止损 (.+)，(\d+)x$/, 'Filled $1, stop $2, $3x'],
    [/^超过有效期自动撤销$/, 'expired past its validity'],
    [/^手动撤销$/, 'cancelled by hand'],
    [/^杠杆自动从 (\d+)x 降到 (\d+)x：原档位强平会先于止损触发$/,
      'Leverage dropped from $1x to $2x: liquidation would have fired before the stop'],
    [/^v4 只做多，此为练习单$/, 'v4 is long-only; this is a practice trade'],
    [/^(.+) 取不到现价$/, 'No price for $1'],
    [/^图表加载失败：/, 'Chart failed to load: '],
    [/^开仓失败：/, 'Open failed: '],
    [/^平仓失败：/, 'Close failed: '],
    [/^保存失败，本次操作已撤销：/, 'Save failed, change rolled back: '],
    [/^导入失败：/, 'Import failed: '],
    [/^v4 判定失败：/, 'v4 check failed: '],
    [/^已挂(多|空)单 (.+) @ (.+)｜止损 (.+)｜杠杆 (.+)｜(.+)$/, function (m) {
      return 'Limit ' + (m[1] === '多' ? 'buy' : 'sell') + ' placed: ' + m[2] + ' @ ' + m[3] + ' | stop ' + m[4] + ' | leverage ' + m[5] + ' | ' + m[6];
    }],
    [/^(.+)：入场 (.+) → 止损 (.+)$/, '$1: entry $2 → stop $3'],
    [/^还差 (.+) %$/],
    [/（需要下跌触发）/g, '(triggers on a drop)'],
    [/（需要上涨触发）/g, '(triggers on a rise)'],
    [/成交时按 ATR/g, 'ATR at fill'],
    [/默认杠杆/g, 'default leverage'],
    [/^账户净值 (.+)$/, 'Equity $1'],
    [/已实现/g, 'realised'],
    [/^成交 (\d+) 笔$/, '$1 trades'],
    [/^费率 (.+)（单边），开平双边 = (.+)%。$/, 'Fee $1 (one side), round trip = $2%.'],
    [/^例：仓位名义价值 (.+) → 开平共 (.+)。$/, 'Example: $1 notional → round trip costs $2.'],
    [/^历史累计：手续费 (.+)，资金费 (.+)。$/, 'Cumulative: fees $1, funding $2.'],
    [/^近 400 天最高 (.+)，现价 (.+)，距高点 (.+)。$/, '400-day high $1, last $2, drawdown $3.'],
    [/^最多持仓 (\d+)，已有 (\d+) 个，还能开 (\d+) 个。$/, 'Max $1, open $2, $3 slots left.'],
    [/^1R = 单笔愿意亏的钱 = 账户 (.+) × 风险 (.+) = (.+)$/, '1R = risk per trade = equity $1 × risk $2 = $3'],
    [/^上次 v4 信号：(.+)$/, 'Last v4 signal: $1'],
    [/^共 (\d+) 个（只显示最近 40 个箭头）。切到 1d 图能看到它们。$/,
      '$1 total (only the last 40 arrows are drawn). Switch to the 1d chart to see them.']
  ];

  var store = new WeakMap();
  var normDict = {};
  Object.keys(EN).forEach(function (k) { normDict[norm(k)] = EN[k]; });

  var LANG = (function () {
    var s = localStorage.getItem(KEY);
    if (s === 'zh' || s === 'en') return s;
    return (navigator.language || 'zh').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en';
  })();

  function norm(s) {
    return s.replace(/[\s\u3000]+/g, ' ').trim();
  }

  var skipTags = { SCRIPT: 1, STYLE: 1, CODE: 1, TEXTAREA: 1 };

  function translateText(original) {
    if (!/[\u4e00-\u9fa5]/.test(original)) return null;
    var core = norm(original);
    if (normDict[core] !== undefined) return normDict[core];
    for (var i = 0; i < RULES.length; i++) {
      var re = RULES[i][0];
      re.lastIndex = 0;
      if (!re.test(core)) continue;
      if (typeof RULES[i][1] === 'function') return core.replace(re, RULES[i][1]);
      if (!RULES[i][1]) return null;
      return core.replace(re, RULES[i][1]);
    }
    return null;
  }

  function walk(root) {
    if (!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p || skipTags[p.nodeName]) return NodeFilter.FILTER_REJECT;
        // #actLog 由 translateActivity 单独管，避免两套还原逻辑打架
        if (p.closest && p.closest('#actLog')) return NodeFilter.FILTER_REJECT;
        return n.nodeValue && n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (var i = 0; i < nodes.length; i++) apply(nodes[i]);
  }

  function apply(node) {
    if (!store.has(node)) store.set(node, node.nodeValue);
    var original = store.get(node);
    if (LANG === 'zh') {
      if (node.nodeValue !== original) node.nodeValue = original;
      return;
    }
    var out = translateText(original);
    if (out == null) return;
    var lead = original.match(/^\s*/)[0];
    var tail = original.match(/\s*$/)[0];
    var next = lead + out + tail;
    if (node.nodeValue !== next) node.nodeValue = next;
  }

  function attrs(root) {
    if (!root.querySelectorAll) return;
    var els = root.querySelectorAll('[placeholder],[title]');
    for (var i = 0; i < els.length; i++) {
      (function (el) {
        ['placeholder', 'title'].forEach(function (a) {
          var v = el.getAttribute(a);
          if (!v) return;
          var key = 'zh' + a;
          if (!el.dataset[key]) el.dataset[key] = v;
          var orig = el.dataset[key];
          el.setAttribute(a, LANG === 'en' ? (translateText(orig) || orig) : orig);
        });
      })(els[i]);
    }
  }

  var busy = false, pending = false;
  function refresh() {
    if (busy) { pending = true; return; }
    busy = true;
    try { walk(document.body); attrs(document.body); translateActivity(); }
    finally {
      busy = false;
      if (pending) { pending = false; setTimeout(refresh, 0); }
    }
  }

  function injectToggle() {
    var bar = document.querySelector('.card .flex');
    if (!bar || document.getElementById('langBtn')) return;
    var b = document.createElement('button');
    b.id = 'langBtn';
    b.className = 'ghost';
    b.style.marginLeft = '4px';
    b.textContent = LANG === 'en' ? '中文' : 'EN';
    b.title = 'Language / 语言';
    b.onclick = function () {
      LANG = LANG === 'en' ? 'zh' : 'en';
      localStorage.setItem(KEY, LANG);
      document.documentElement.lang = LANG === 'en' ? 'en' : 'zh-CN';
      b.textContent = LANG === 'en' ? '中文' : 'EN';
      refresh();
    };
    bar.appendChild(b);
  }

  function start() {
    document.documentElement.lang = LANG === 'en' ? 'en' : 'zh-CN';
    injectToggle();
    refresh();
    new MutationObserver(function () { if (!busy) refresh(); })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(start, 0); });
  } else { setTimeout(start, 0); }
})();
