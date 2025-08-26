var langs = [
     {
          "id": "ja",
          "href": "",
          "name": "日本語"
     },
     {
          "id": "en",
          "href": "en",
          "name": "English"
     },
     {
          "id": "zh",
          "href": "zh",
          "name": "繁體中文"
     }
]

function getPath() {
     var path = "/";
     if (window.location.pathname.includes('/date')) {
          path = "/date/";
     }
     var ppath = window.location.pathname.replace(path, '');
     if (ppath !== "") {
          ppath = "../";
     }

     return [ppath, window.location.pathname.replace(path, '')];
}

var lang = langs.find(item => item.href + "/" === getPath()[1]);
if (!lang) lang = langs[0];

var split = window.location.href.split('/');
var request = new XMLHttpRequest();
request.open('GET', `${getPath()[0]}lang/${lang.id}.yml`, false);
request.send(null);

var response = `${request.responseText}`;

var yaml = {};
response.split("\n").forEach((line) => {
     if (line === "") return;
     if (line.startsWith("#")) return;

     var key = line.split(": ")[0];
     var value = line.split(": ")[1].replaceAll(";", ":");
     yaml[key] = value === "null" ? " " : value;
});

function getLang(id, options = []) {
     var item = (yaml[id] === "" ? null : yaml[id]) ?? "";
     if (options.length > 0) {
          for (var i = 0; i < options.length; i++) {
               item = item.replaceAll(`/${i}/`, options[i]);
          }
     }

     return item;
}

getLang();

function Lang() {
     var items = [];
     for (var i = 0; i < langs.length; i++) {
          items.push(<option value={getPath()[0] + langs[i].href}>{langs[i].name}</option>);
     }
     var select = <select value={getPath()[0] + lang.href} id="lang" onChange={(e) => { window.location.href = e.target.value; }}>
          {items}
     </select>
     return select;
}

/**
 * 残り日数
 * @returns {JSX.Element}
 */
function percentageToNextYear() {
     /**
      * 残り時間
      * @param {*} end - 終了日
      * @returns {String} 残り日数
      */
     function showRemaining(end) {
          var _second = 1000;
          var _minute = _second * 60;
          var _hour = _minute * 60;
          var _day = _hour * 24;

          var now = new Date();
          var distance = end - now;

          var days = Math.floor(distance / _day);
          var hours = Math.floor((distance % _day) / _hour);
          var minutes = Math.floor((distance % _hour) / _minute);
          var seconds = Math.floor((distance % _minute) / _second);

          return getLang("time.day", [days]) + getLang("time.hour", [hours]) + getLang("time.minute", [minutes]) + getLang("time.second", [seconds]);
     }

     var now = new Date();
     var start = new Date(now.getFullYear(), 0, 0);
     var end = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 1);
     var percent = (now - start) / (end - start) * 100;

     var rounded = Math.round(percent * 10000) / 10000;

     return (
          <div className="full-cell component">
               <h1>
                    <a className="mid">{getLang("percent.start", [now.getFullYear()])}</a>
                    {getLang("percent", [rounded])}
                    <a className="mid">{getLang("percent.end", [now.getFullYear()])}</a>
               </h1>
               <p>{getLang("percent.left", [showRemaining(end)])}</p>
          </div>
     )
}

/**
 * 日付
 * @returns {JSX.Element}
 */
function getDate() {
     var now = new Date();

     return (
          <div className="component">
               <h1>{getLang("date", [now.getFullYear(), now.getMonth() + 1, now.getDate()])}</h1>
               <p>{getLang("weekday." + now.getDay())}</p>
          </div>
     )
}

/**
 * 時刻
 * @returns {JSX.Element}
 */
function getTime() {
     /**
      * 数値を指定した桁数にする
      * @param {Integer|Number|String} n - 数値
      * @param {Integer} length - 桁数
      * @param {Boolean|null} s - 0埋め
      * @returns {String} 指定した桁数になった数値
      */
     function format(n, length, s = null) {
          n = n.toString();
          while (n.length < length) {
               if (s) {
                    n = n + "0";
               } else {
                    n = "0" + n;
               }
          }
          return n;
     }

     /**
      * 残り時間
      * @param {*} end 
      * @returns 
      */
     function showRemaining(end) {
          var _second = 1000;
          var _minute = _second * 60;
          var _hour = _minute * 60;
          var _day = _hour * 24;

          var now = new Date();
          var distance = end - now;

          var days = Math.floor(distance / _day);
          var hours = Math.floor((distance % _day) / _hour);
          var minutes = Math.floor((distance % _hour) / _minute);
          var seconds = Math.floor((distance % _minute) / _second);

          return getLang("time.hour", [days * 24 + hours]) + getLang("time.minute", [minutes]) + getLang("time.second", [seconds]);
     }

     var now = new Date();
     var tmr = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);

     return (
          <div className="component">
               <h1>{getLang("time", [format(now.getHours(), 2), format(now.getMinutes(), 2), format(now.getSeconds(), 2)])}
                    <a>{getLang("time.ms", [format(Math.round(now.getMilliseconds() / 10), 2, true) === "100" ? "00" : format(Math.round(now.getMilliseconds() / 10), 2, true)])}</a>
               </h1>
               <p>{getLang("time.left", [showRemaining(tmr)])}</p>
          </div>
     )
}

/**
 * コンテンツ
 * @returns {JSX.Element}
 */
function Content() {
     return (
          <main>
               {getDate()}
               {getTime()}
               {percentageToNextYear()}
          </main>
     )
}

/**
 * フッター
 * @returns {JSX.Element}
 */
function Footer() {
     return (
          <footer>
               <p>{getLang("credits.code")}</p>
               <p>{getLang("credits.copyright")}</p>
               <p><a href="https://github.com/keishispl/date">{getLang("credits.source")}</a></p>
               <Lang />
          </footer>
     )
}

/**
 * アプリ
 * @returns {JSX.Element}
 */
function App() {
     return (
          <div>
               <h1 id="title">{getLang("title")}</h1>
               <Content />
               <Footer />
          </div>
     )
}

/**
 * 一定間隔で再描画
 */
setInterval(() => {
     ReactDOM.render(<App />, document.body);
}, 1);