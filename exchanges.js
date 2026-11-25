/* 行情数据源适配层
 * 只做一件事：把「K 线」和「最新价」抽象成同一套调用，页面换交易所只换这里。
 * 全部走公共接口，不需要任何 API key。
 *
 * 统一接口：
 *   klines(sym, iv, limit) → [{time(秒), open, high, low, close, volume}]  时间升序
 *   price(sym)             → number
 *
 * 符号沿用币安写法（BTCUSDT），各家内部自己转换。
 */
(function () {
  'use strict';

  var FAPI = 'https://fapi.binance.com';
  var SAPI = 'https://api.binance.com';

  function j(u) {
    return fetch(u, { signal: AbortSignal.timeout(15000) }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  // ───────── 币安（线性合约，失败回落现货）─────────
  var binance = {
    name: 'Binance',
    klines: async function (sym, iv, limit) {
      var raw;
      try {
        raw = await j(FAPI + '/fapi/v1/klines?symbol=' + sym + '&interval=' + iv + '&limit=' + limit);
      } catch (e) { raw = e; }
      if (!Array.isArray(raw)) {
        var r2 = await j(SAPI + '/api/v3/klines?symbol=' + sym + '&interval=' + iv + '&limit=' + limit);
        if (!Array.isArray(r2)) throw new Error('K 线取数失败');
        raw = r2;
      }
      return raw.map(function (x) {
        return { time: Math.floor(+x[0] / 1000), open: +x[1], high: +x[2], low: +x[3], close: +x[4], volume: +x[5] };
      });
    },
    price: async function (sym) {
      try { return +(await j(FAPI + '/fapi/v1/ticker/price?symbol=' + sym)).price; } catch (e) {}
      return +(await j(SAPI + '/api/v3/ticker/price?symbol=' + sym)).price;
    }
  };

  // ───────── OKX（永续，单页最多 100 根，要翻页）─────────
  // 注意：OKX 的日线默认按 UTC+8 切，跟币安/Bybit 的 UTC 口径不同，
  // 会让同一根日线的 OHLC 不一样、指标算出来也不一样。所以一律用带 utc 的 bar。
  var OKX_BAR = { '15m': '15m', '1h': '1H', '4h': '4H', '1d': '1Dutc' };
  function okxInst(sym) { return sym.replace('USDT', '-USDT-SWAP'); }

  var okx = {
    name: 'OKX',
    klines: async function (sym, iv, limit) {
      var bar = OKX_BAR[iv] || '1H';
      var inst = okxInst(sym);
      var want = Math.min(limit, 400);
      var out = [];
      var after = '';
      var guard = 0;
      // 一次最多 100 根，拿 400 根要翻 4 次
      while (out.length < want && guard++ < 10) {
        var take = Math.min(100, want - out.length);
        var u = 'https://www.okx.com/api/v5/market/candles?instId=' + inst + '&bar=' + bar + '&limit=' + take +
          (after ? '&after=' + after : '');
        var d = await j(u);
        var rows = (d && d.data) || [];
        if (!rows.length) break;
        for (var i = 0; i < rows.length; i++) {
          var x = rows[i];
          out.push({ time: Math.floor(+x[0] / 1000), open: +x[1], high: +x[2], low: +x[3], close: +x[4], volume: +x[5] });
        }
        after = rows[rows.length - 1][0]; // 该页最老的一根，下一页取它之前
        if (rows.length < take) break;
      }
      out.sort(function (a, b) { return a.time - b.time; });
      return out.slice(-want);
    },
    price: async function (sym) {
      var d = await j('https://www.okx.com/api/v5/market/ticker?instId=' + okxInst(sym));
      var t = d && d.data && d.data[0];
      return t ? +t.last : NaN;
    }
  };

  // ───────── Bybit（线性永续，单页最多 1000 根）─────────
  var BYBIT_IV = { '15m': '15', '1h': '60', '4h': '240', '1d': 'D' };

  var bybit = {
    name: 'Bybit',
    klines: async function (sym, iv, limit) {
      var itv = BYBIT_IV[iv] || '60';
      var u = 'https://api.bybit.com/v5/market/kline?category=linear&symbol=' + sym +
        '&interval=' + itv + '&limit=' + Math.min(limit, 1000);
      var d = await j(u);
      var list = (d && d.result && d.result.list) || [];
      // Bybit 也是倒序：[start, open, high, low, close, volume, turnover]
      var out = list.map(function (x) {
        return { time: Math.floor(+x[0] / 1000), open: +x[1], high: +x[2], low: +x[3], close: +x[4], volume: +x[5] };
      });
      out.sort(function (a, b) { return a.time - b.time; });
      return out;
    },
    price: async function (sym) {
      var d = await j('https://api.bybit.com/v5/market/tickers?category=linear&symbol=' + sym);
      var t = d && d.result && d.result.list && d.result.list[0];
      return t ? +t.lastPrice : NaN;
    }
  };

  window.EX = { binance: binance, okx: okx, bybit: bybit };
})();
