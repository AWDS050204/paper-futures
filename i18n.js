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
    '取不到价格': 'price unavailable',
    '空=ATR': 'blank = ATR',

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

    // ── 指标说明（按真实 DOM 的文本节点逐个给条目）──
    // 页面结构是 <b>术语</b>　描述，描述里还会再嵌 <b>…</b>，所以一句话常被切成 2~3 个节点，
    // 必须每个节点各给一条；整行（术语+描述）的条目永远匹配不上。
    // 值里带前导空格是故意的：被 <b> 切开的两个节点之间，中文没有空格，英文需要。
    // 段标题
    '持仓表': 'Positions', '历史': 'History', '指标': 'Indicators', '其他': 'Other',
    // 术语（粗体）
    '杠杆 x': 'Leverage x', '费率 ‱': 'Fee ‱', '止损先于强平': 'Stop before liquidation',
    '滑点': 'Slippage', '资金费率': 'Funding rate', '多空比': 'Long/short ratio', '两本账': 'Two books',
    // 账户
    '每笔最多亏账户的百分比。': 'The most one trade may lose, as a share of equity.',
    '仓位由它倒算': ' Position size is derived from it',
    '，不是手填的。': ', not typed in.',
    '同时持仓上限，v4 规则是 3。': 'How many may be open at once. The v4 rule is 3.',
    '名义仓位 ÷ 保证金。': 'Notional ÷ margin.',
    '只决定保证金占用和强平距离，不决定你亏多少钱。': ' It sets margin usage and liquidation distance — not how much you lose.',
    '单边手续费，币安合约 taker = 5‱ = 0.05%，开平双边。': 'One-side fee. Binance futures taker = 5 bps = 0.05%, charged on open and close.',
    // 挂单
    '买单必须低于现价、卖单必须高于现价，否则会立即成交。': 'A buy must sit below the market and a sell above it, or it fills at once.',
    '留空 = 成交时按': 'Blank =',                       // 后面紧跟 <b>1.5×ATR</b>
    '；填了就按你填的。': ' at fill; filled in = exactly your number.',
    '留空 = 账户默认。': 'Blank = account default.',
    '只是上限': ' Only a cap',
    '：止损太远时会自动降到「止损先于强平」的那一档。': ': when the stop is far it drops to the tier where the stop still fires first.',
    '中文叫': 'R is a',
    '风险单位': ' risk unit',
    '。1R = 入场到止损的距离。': '. 1R = the distance from entry to stop.',
    '填 3 = 止盈设在 3 倍风险处。': 'Enter 3 = take profit at three times the risk.',
    'R 不是杠杆。': ' R is not leverage.',
    '挂单存活小时数，0 = 不过期。': 'Hours the order stays alive. 0 = never expires.',
    // 持仓表
    '币的数量，由「风险金额 ÷ 止损距离」倒算。': 'Coin amount, derived as risk amount ÷ stop distance.',
    '入场 × (1 − 1/杠杆 + 维持保证金率 0.4%)。': 'Entry × (1 − 1/leverage + 0.4% maintenance margin).',
    '硬规则：止损必须比强平更早触发，否则那条止损等于不存在。': 'Hard rule: the stop must trigger before liquidation, or it does not exist.',
    // 历史
    '净盈亏，已扣手续费和资金费。': 'Net, after fees and funding.',
    '每 8 小时结算，多头付正费率，按持仓时长折算。': 'Settled every 8 hours. Longs pay a positive rate, prorated by holding time.',
    '成交价相对盘口中间价的偏离。': 'Fill price deviation from mid.',
    // 指标
    '指数移动平均。v4 要求价 > EMA50 与 EMA200，且 EMA50 上行。': 'Moving averages. v4 wants price above EMA50 and EMA200, and EMA50 rising.',
    '相对强弱。本系统': 'Relative strength. This system',
    '不拿它做入场依据': ' does not use it for entries',
    '（回测无效）。': ' (it tested as ineffective).',
    '12/26 EMA 之差与 9 周期信号线。': '12/26 EMA spread against a 9-period signal line.',
    '趋势强度。v4 要求 >30，否则在震荡里做趋势会亏。': 'Trend strength. v4 wants above 30; trends lose money in a range.',
    '平均真实波幅，用 % 表示波动。v4 要 2%–6%；止损 = 1.5×ATR。': 'Average true range as a percentage. v4 wants 2–6%; stop = 1.5×ATR.',
    // 其他
    '每 8 小时费率，正数 = 多头付给空头；×3×365 可折年化。': 'The 8-hourly rate. Positive = longs pay shorts; ×3×365 annualises it.',
    '未平仓合约价值。涨 = 新资金进场，跌 = 平仓离场。': 'Open interest notional. Up = new money in, down = positions closing.',
    '全局账户多空人数比，>2 说明多头拥挤。': 'Global account ratio. Above 2 means crowded longs.',
    '用 OI × 常见杠杆档位估算，': 'Estimated from OI × leverage tiers,',
    '不是真实强平单': ' not real orders',
    '。': '.',                                           // 句号单独成节点（如 </b>。）
    'A 轨严格按 v4（唯一对外报数）；B 轨是练习盘，不计入绩效。': 'Track A follows v4 strictly and is the only number reported; track B is practice, not counted.',

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
    // 开/平仓/导入的错误原因（来自 core 与页面）
    '日线还没加载完。': 'The daily bars have not loaded yet.',
    '不支持的标的': 'Unsupported symbol', '参数错误': 'Invalid parameters', '数量过小': 'Quantity too small',
    '价格无效，未平仓': 'Invalid price, position left open',
    '资金费无效，未平仓': 'Invalid funding amount, position left open',
    '暂时取不到价格，未平仓': 'No price right now, position left open',
    '保存失败，操作已撤销': 'Save failed, operation rolled back',
    '保存失败，未开仓': 'Save failed, no position opened',
    '格式不对': 'Invalid format',
    'ATR 2–6%': 'ATR 2–6%',
    // 「最近操作」卡片（#actLog 内部的行由 translateActivity 逐词处理，这两条是标题和空状态）
    '最近操作': 'Recent activity',
    '还没有操作记录。开仓、平仓、挂单、撤单、自动止损都会记在这里。':
      'No activity yet. Opens, closes, limit orders, cancels and automatic exits all land here.'
  };

  // 前缀型：换掉中文前缀，后面的部分递归再翻一遍。
  // 以前只换前缀，后半句原样保留，结果是 "Open failed: 已达最大持仓 2" 这种中英混排。
  var PREFIX = [
    ['开仓失败：', 'Open failed: '], ['平仓失败：', 'Close failed: '], ['导入失败：', 'Import failed: '],
    ['图表加载失败：', 'Chart failed to load: '], ['v4 判定失败：', 'v4 check failed: '],
    ['保存失败，本次操作已撤销：', 'Save failed, change rolled back: ']
  ];

  // 针对动态生成的行（数字会变，只能按模式翻）。
  // 注意：整句规则只能匹配「一个文本节点」。被 <b>/<span> 切开的内容（如「问一句」的答案）走下面的 ASK 模板。
  // 函数型规则收到的是 core.match(re) 的结果（数组，m[1] 是第一个括号）。
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
    // 开/平仓失败原因（前面的「开仓失败：」由 PREFIX 处理）
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
    // core 里的文案没有结尾的「触发」，页面旧文案有，两种都认
    [/^杠杆自动从 (\d+)x 降到 (\d+)x：原档位强平会先于止损(?:触发)?$/,
      'Leverage dropped from $1x to $2x: liquidation would have fired before the stop'],
    [/^v4 只做多，此为练习单$/, 'v4 is long-only; this is a practice trade'],
    [/^(.+) 取不到现价$/, 'No price for $1'],
    // 挂单日志：「05-24 12:00 BTC 多 @60,000.00 — 成交：成交 59900，止损 …」整行是一个文本节点
    [/^(\d\d-\d\d \d\d:\d\d) (\S+) (多|空) @(\S+) — (成交|过期|拒绝|撤销)：(.*)$/, function (m) {
      var st = { '成交': 'filled', '过期': 'expired', '拒绝': 'rejected', '撤销': 'cancelled' }[m[5]];
      var note = m[6] ? (translateText(m[6]) || m[6]) : '';
      return m[1] + ' ' + m[2] + ' ' + (m[3] === '多' ? 'Long' : 'Short') + ' @' + m[4] + ' — ' + st + (note ? ': ' + note : '');
    }],
    // #msg 提示
    [/^已平仓，盈亏 (.+)$/, 'Closed, P&L $1'],
    [/^买单挂价 (.+) 不低于现价 (.+)，会立即成交；想进场请直接做多$/, 'Buy limit $1 is not below the market ($2), so it would fill at once. To enter now, just go long.'],
    [/^卖单挂价 (.+) 不高于现价 (.+)，会立即成交；想进场请直接做空$/, 'Sell limit $1 is not above the market ($2), so it would fill at once. To enter now, just go short.'],
    [/^(\S+) 已有(多|空)单挂单，请先撤销$/, function (m) { return m[1] + ' already has a ' + (m[2] === '多' ? 'buy' : 'sell') + ' limit order; cancel it first'; }],
    [/^已挂(多|空)单 (\S+) @ (\S+)｜止损 (.+?)｜杠杆 (.+?)｜(.+)$/, function (m) {
      var tr = function (s) { return translateText(s) || s; };
      return 'Limit ' + (m[1] === '多' ? 'buy' : 'sell') + ' placed: ' + m[2] + ' @ ' + m[3] + ' | stop ' +
        (m[4] === '成交时按 ATR' ? 'ATR at fill' : tr(m[4])) + ' | leverage ' + (m[5] === '默认' ? 'default' : m[5]) + ' | ' + m[6];
    }],
    [/^(做多|做空) (\S+) (\S+) @ (\S+)｜止损 (\S+)｜(\d+)x(?:｜\u26a0\ufe0f (.+))?$/, function (m) {
      return (m[1] === '做多' ? 'Long' : 'Short') + ' ' + m[2] + ' ' + m[3] + ' @ ' + m[4] + ' | stop ' + m[5] + ' | ' + m[6] + 'x' +
        (m[7] ? ' | \u26a0\ufe0f ' + (translateText(m[7]) || m[7]) : '');
    }]
  ];

  // ───────── 「最近操作」：代码拼出来的句子，逐词替换（只作用于 #actLog）─────────
  // 和上面的字典分开管：这些句子每句都带数字和符号，只能用词表拼，不能整句匹配。
  var ACT = [
    [/^开多 /, 'Long '], [/^开空 /, 'Short '],
    [/^平仓 /, 'Closed '], [/^挂多 /, 'Buy limit '], [/^挂空 /, 'Sell limit '],
    [/^撤单 /, 'Cancelled '], [/^自动平仓 /, 'Auto closed '], [/^改配置：/, 'Settings: '],
    [/｜止损 /g, ' | stop '], [/｜盈亏 /g, ' | P&L '], [/｜/g, ' | '],
    [/默认杠杆/g, 'default leverage'], [/成交时按 ATR/g, 'ATR at fill'],
    [/（止损）/g, ' (stop)'], [/（止盈）/g, ' (target)'], [/（强平）/g, ' (liquidated)'], [/（到期）/g, ' (timeout)'],
    [/h 有效/g, 'h valid'], [/不过期/g, 'never expires'],
    [/ 多 @/g, ' long @'], [/ 空 @/g, ' short @'],
    [/最多 /g, 'max '], [/单 · /g, 'pos · '], [/ 费率 /g, ' fee '], [/风险 /g, 'risk '],
    [/（最近 (\d+) 条）/, ' (last $1)']
  ];

  function translateActivity() {
    var box = document.getElementById('actLog');
    if (!box) return;
    var spans = box.querySelectorAll('div > span:last-child');
    var cnt = document.getElementById('actCount');

    if (LANG !== 'en') {
      // 切回中文：用记下的原文还原（这些节点由 render() 重建，store 里是中文原值）
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

  // ───────── 「问一句」的答案：按整段 HTML 的模板翻 ─────────
  // ask() 返回的是一整段带 <b>/<span>/<br> 的 HTML，里面一句话常被切成很多文本节点，逐节点翻既碎又脆。
  // 所以英文模式下把 ask() 的返回值当字符串，按「整句模板」翻一遍，再交给页面写进 DOM —— 不依赖节点怎么切，也不会先闪一下中文。
  // 模板里 {} 是动态部分（不跨标签）；英文里 $1 $2… 是对应的捕获组，字面美元符写 $$。
  var ASK = [];
  function T(zh, en) {
    var re = new RegExp(zh.split('{}').map(function (p) { return p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('([^<]*?)'), 'g');
    ASK.push([re, en]);
  }
  // 先把短语换掉，后面的模板就能直接吃英文
  [['成交时按 ATR', 'ATR at fill'], ['默认杠杆', 'default leverage'], ['不过期', 'no expiry'],
   ['（需要下跌触发）', '(triggers on a drop)'], ['（需要上涨触发）', '(triggers on a rise)'],
   ['· 我的强平在哪', '· Where is my liquidation'], ['· 止损是几个 ATR', '· Stop in ATR'], ['· v4 缺哪几条', '· Which v4 checks fail'],
   ['· 上次 v4 信号', '· Last v4 signal'], ['· 我还能开几单', '· How many slots left'], ['· 1R 是多少钱', '· What is 1R worth'],
   ['· 挂单还差多少', '· How far to my orders'], ['· 手续费多少', '· What are the fees'], ['· 现在跌了多少', '· Drawdown from high'],
   ['· 账户盈亏', '· Account P&L']
  ].forEach(function (p) { ASK.push([new RegExp(p[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), p[1]]); });
  ASK.push([/<b>([A-Z]+) (多|空)<\/b>/g, function (_, sym, side) { return '<b>' + sym + ' ' + (side === '多' ? 'Long' : 'Short') + '</b>'; }]);

  T('<b class="down">这个问题我不回答。</b><br>我的职责是报事实，不是替你判断。<br>v4 只认五条硬条件，现在是 <b>{}/5</b>。条件够了就是够了，不够我也说不出花来。<br><span class="muted">想复核事实可以问：v4 缺哪几条 / 我的强平在哪 / 1R 是多少钱</span>',
    '<b class="down">I will not answer that.</b><br>My job is to report facts, not to decide for you.<br>v4 has five hard conditions and <b>$1/5</b> pass right now. Enough is enough; not enough cannot be argued into it.<br><span class="muted">To re-check facts, ask: which v4 checks fail / where is my liquidation / what is 1R worth</span>');
  T('当前没有持仓，没有强平价。<br><span class="muted">强平价只在开仓后才有。</span>',
    'No open positions, so no liquidation price.<br><span class="muted">A liquidation price only exists once a position is open.</span>');
  T('：强平 <b class="down">{}</b>', ': liquidation <b class="down">$1</b>');
  T('，现价 {}，还差 <b>{}%</b>（{}x）', ', last $1, <b>$2%</b> away ($3x)');
  T('<br><span class="muted">止损在 {}，止损比强平更近 → 先触碰止损。</span>', '<br><span class="muted">Stop at $1; the stop is closer than liquidation → the stop is hit first.</span>');
  T('<br><span class="muted">止损在 {}，强平比止损更近 → 先爆仓。</span>', '<br><span class="muted">Stop at $1; liquidation is closer than the stop → liquidation comes first.</span>');
  T('<b>{}</b>：入场 {} → 止损 <b class="down">{}</b><br>距离 {}，占入场 <b>{}%</b>', '<b>$1</b>: entry $2 → stop <b class="down">$3</b><br>distance $4, <b>$5%</b> of entry');
  T('，等于 <b>{}×ATR</b>（日线 ATR {}）', ', equal to <b>$1×ATR</b> (daily ATR $2)');
  T('<br><span class="muted">按 1R = {} 美元反推，数量 {}。</span>', '<br><span class="muted">Sized back from 1R = $$$1, quantity $2.</span>');
  T('<b>v4 判定（固定日线）：{}/5</b>', '<b>v4 check (daily): $1/5</b>');
  T('<span class="muted">五条全满足 → 按规则可以开多。</span>', '<span class="muted">All five met → the rules allow a long.</span>');
  T('<span class="muted">还差 {} 条，按规则不开仓。</span>', '<span class="muted">$1 still missing → no entry under the rules.</span>');
  T('上次 v4 信号：<b>{}</b>', 'Last v4 signal: <b>$1</b>');
  T('，当根收盘 {}', ', bar close $1');
  T('<br><span class="muted">共 {} 个（只显示最近 40 个箭头）。切到 1d 图能看到它们。</span>', '<br><span class="muted">$1 in total (only the last 40 arrows are drawn). Switch to the 1d chart to see them.</span>');
  T('最多持仓 <b>{}</b>，已有 <b>{}</b> 个，还能开 <b>{}</b> 个。', 'Max positions <b>$1</b>, <b>$2</b> open, <b>$3</b> slots left.');
  T('<br><span class="down">已满仓，必须先平掉一个。</span>', '<br><span class="down">Full — close one first.</span>');
  T('<br><span class="muted">同一标的不能重复开仓（v4 规则）。</span>', '<br><span class="muted">One position per symbol (v4 rule).</span>');
  T('1R = 单笔愿意亏的钱 = 账户 {} × 风险 {}% = <b>${}</b>', '1R = the amount you accept losing per trade = equity $1 × risk $2% = <b>$$$3</b>');
  T('<br><span class="muted">仓位是这样倒算的：数量 = 1R ÷ 止损距离。止损放宽，仓位自动变小。</span>', '<br><span class="muted">Size is derived as quantity = 1R ÷ stop distance. A wider stop shrinks the position automatically.</span>');
  T('<b>{} {}</b> 挂 {}，现价 {}<br>还差 <b>{}%</b> {}｜止损 {}｜{}｜到期 {}', '<b>$1 $2</b> limit $3, last $4<br><b>$5%</b> to go $6 | stop $7 | $8 | expires $9');
  T('费率 <b>{}‱</b>（单边），开平双边 = {}%。<br>例：仓位名义价值 $1,000 → 开平共 <b>${}</b>。<br><span class="muted">历史累计：手续费 ${}，资金费 ${}。</span>',
    'Fee <b>$1‱</b> (one side), round trip = $2%.<br>Example: $$1,000 notional → round trip costs <b>$$$3</b>.<br><span class="muted">Cumulative: fees $$$4, funding $$$5.</span>');
  T('近 400 天最高 {}，现价 <b>{}</b>，距高点 <b class="down">{}%</b>。', '400-day high $1, last <b>$2</b>, <b class="down">$3%</b> from the high.');
  T('<br><span class="muted">这不是历史最高点，只是这 400 根日线里我拉到的范围。</span>', '<br><span class="muted">Not the all-time high — just the range of the 400 daily bars I fetched.</span>');
  T('账户净值 <b>${}</b>（起始 ${}，{}%）<br>已实现 {}${}｜浮动 {}${}｜成交 {} 笔', 'Equity <b>$$$1</b> (start $$$2, $3%)<br>Realised $4$$$5 | Unrealised $6$$$7 | $8 trades');
  T('我只会算，不会猜。能回答这些：', 'I compute, I do not guess. I can answer these:');
  T('<span class="muted">投资建议类的问题（该不该买、会不会涨）我不回答。</span>', '<span class="muted">I do not answer advice questions such as whether to buy or whether price will rise.</span>');

  function translateAskHtml(html) {
    var s = String(html).replace(/\n\s*/g, '');
    for (var i = 0; i < ASK.length; i++) s = s.replace(ASK[i][0], ASK[i][1]);
    return s;
  }
  var lastAskRaw = null;
  // 包一层 ask()：英文模式下返回翻好的 HTML。放在 start() 里调用，那时页面脚本已经定义好了 ask
  function wrapAsk() {
    var orig = window.ask;
    if (typeof orig !== 'function' || orig.__i18n) return;
    var wrapped = function (raw) {
      lastAskRaw = raw;
      var html = orig(raw);
      return LANG === 'en' ? translateAskHtml(html) : html;
    };
    wrapped.__i18n = true;
    window.ask = wrapped;
  }
  // 切语言时，已经显示出来的答案用同一个问题重新生成（节点级的「还原原文」对整段重写的 HTML 不起作用）
  function rerenderAsk() {
    var box = document.getElementById('qAns');
    if (box && lastAskRaw && box.innerHTML.trim() && typeof window.ask === 'function') box.innerHTML = window.ask(lastAskRaw);
  }

  // 页面标题：中文取页面自带的（不在这里写死一份会跟页面不一致的中文），英文用固定文案
  var TITLE_EN = 'Paper Futures · paper trading dashboard';
  var TITLE_ZH = null;
  function applyTitle() {
    if (TITLE_ZH === null) TITLE_ZH = document.title;
    document.title = LANG === 'en' ? TITLE_EN : TITLE_ZH;
  }

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
    // 含汉字、全角标点（如单独成节点的「。」）或 ↑ 才需要处理。
    // ↑ 必须放行：五盏灯里的 "✗ EMA50↑" 一个汉字都没有，以前被这里直接挡掉，后面的规则根本没机会执行。
    if (!/[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef\u2191]/.test(original)) return null;
    var core = norm(original);
    if (normDict[core] !== undefined) return normDict[core];
    for (var p = 0; p < PREFIX.length; p++) {
      if (core.indexOf(PREFIX[p][0]) === 0) {
        var rest = core.slice(PREFIX[p][0].length);
        var tr = translateText(rest);
        return PREFIX[p][1] + (tr == null ? rest : tr);
      }
    }
    for (var i = 0; i < RULES.length; i++) {
      var re = RULES[i][0];
      re.lastIndex = 0;
      var m = core.match(re);
      if (!m) continue;
      // 函数型规则要的是 match 数组（m[1] 是第一个括号）；String.replace 传进去的是整串匹配，不能直接用
      if (typeof RULES[i][1] === 'function') return RULES[i][1](m, core);
      re.lastIndex = 0;
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
        // #actLog 由 translateActivity 单独管，避免两套还原逻辑互相打架
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
      applyTitle();
      refresh();
      rerenderAsk();
    };
    bar.appendChild(b);
  }

  function start() {
    document.documentElement.lang = LANG === 'en' ? 'en' : 'zh-CN';
    wrapAsk();
    injectToggle();
    applyTitle();
    refresh();
    // 防御：变更发生在 refresh 执行期间时，记下来补一轮，而不是丢掉
    new MutationObserver(function () { if (busy) { pending = true; return; } refresh(); })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(start, 0); });
  } else { setTimeout(start, 0); }
})();
