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

          return `${days}日${hours}時${minutes}分${seconds}秒`;
     }

     var now = new Date();
     var start = new Date(now.getFullYear(), 0, 0);
     var end = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 1);
     var percent = (now - start) / (end - start) * 100;

     var rounded = Math.round(percent * 10000) / 10000;
     var date = showRemaining(end);

     return (
          <div className="full-cell component">
               <h1><a className="mid">{now.getFullYear()}の</a>{rounded}%<a className="mid">が完了</a></h1>
               <p>残り{date}</p>
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
               <h1>{now.getFullYear()}年{now.getMonth() + 1}月{now.getDate()}日</h1>
               <p>{["日", "月", "火", "水", "木", "金", "土"][now.getDay()]}曜日</p>
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

          return `${(days * 24 + hours)}時${minutes}分${seconds}秒`;
     }

     var now = new Date();
     var tmr = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
     var time = format(now.getHours(), 2) + ":" + format(now.getMinutes(), 2) + ":" + format(now.getSeconds(), 2);
     var ms = format(Math.round(now.getMilliseconds() / 10), 2, true) === "100" ? "00" : format(Math.round(now.getMilliseconds() / 10), 2, true);
     
     return (
          <div className="component">
               <h1>{time}<a>.{ms}</a></h1>
               <p>明日まであと{showRemaining(tmr)}</p>
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
               <p>JavaScript + React + JSXで作成てる</p>
               <p>keishisplが作成したサイト</p>
               <p><a href="https://github.com/keishispl/date">ソースコード</a></p>
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
               <h1 id="title">日付と時刻</h1>
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