// Demo mode for the static page: answers the board's /api/data request with made-up but
// plausible data (same stations as the real board), so the real app.js runs unchanged.
(function () {
  // route -> [headway min, offset min, usual minutes to the target stop]
  var LINES = {
    2: [9, 1, 31], 3: [11, 5, 31], 4: [7, 2, 27], 5: [10, 6, 27], B: [12, 3, 24], Q: [8, 0, 23],
  };
  function arrivals(route, nowSec) {
    var l = LINES[route], h = l[0] * 60, o = l[1] * 60, out = [];
    var first = Math.ceil((nowSec - o) / h) * h + o;
    for (var k = 0; k < 8; k++) {
      var t = first + k * h;
      // a little jitter per train so travel times aren't all identical
      var jitter = ((Math.floor(t / h) * 7) % 3) - 1;
      out.push({ t: t, travelMin: l[2] + jitter, travelLive: k % 5 !== 3 });
    }
    return out;
  }
  function data() {
    var now = Math.floor(Date.now() / 1000), arr = {};
    for (var r in LINES) arr[r] = arrivals(r, now);
    return {
      now: now,
      version: "demo",
      display: { arrivalsPerRoute: 3, showUnlitDots: true, pixelShiftMinutes: 3 },
      subway: [
        {
          label: "Franklin", routes: ["2", "3", "4", "5"], rows: [["2", "3"], ["4", "5"]],
          show: { minTrains: 6, withinMin: 15, dimUnderMin: 5 },
          targets: { 2: "TSQ", 3: "TSQ", 4: "GCT", 5: "GCT" },
          arrivals: { 2: arr[2], 3: arr[3], 4: arr[4], 5: arr[5] },
        },
        {
          label: "7 Av", routes: ["B", "Q"], rows: [["B"], ["Q"]],
          show: { minTrains: 4, withinMin: 25, dimUnderMin: 10 },
          targets: { B: "42nd", Q: "TSQ" },
          arrivals: { B: arr.B, Q: arr.Q },
        },
      ],
      citibike: {
        bikes: [{ label: "Bike 1", bikes: 6 }, { label: "Bike 2", bikes: 2 }],
        docks: [{ label: "Dock 1", docks: 9 }, { label: "Dock 2", docks: 17 }],
      },
      weather: { temp: 19, text: "Clear", icon: "sun", hi: 20, lo: 7, humidity: 29, rain3h: 0 },
      errors: [],
    };
  }
  window.XMLHttpRequest = function () {
    var x = this;
    x.open = function () {};
    x.send = function () {
      setTimeout(function () {
        x.status = 200;
        x.responseText = JSON.stringify(data());
        if (x.onload) x.onload();
      }, 0);
    };
  };
})();
