// js pragma https://stackoverflow.com/questions/14593350/what-exactly-is-a-javascript-pragma
import React from './core/React';

function SingerWrapper({ singer }) {
  return <Singer singer={singer} />;
}

let isSpan = true;
function Singer({ singer }) {
  function changeType() {
    isSpan = !isSpan;
    React.update();
  }

  return (
    <div>
      {isSpan ? <span>{singer}</span> : <div>{singer}</div>}
      <button onClick={changeType}>更换 span or div</button>
    </div>
  );
}

let times = 0;
const ListenTimes = () => {
  function oneMore() {
    times++;
    React.update();
  }
  return (
    <div>
      <span>当前已经听了{times}次</span>
      <button onClick={oneMore}>再播放一次</button>
    </div>
  );
};

const App = (
  <div id="app">
    <h1>app</h1>
    <h3>
      <p>
        <SingerWrapper singer={'容祖儿'} />
      </p>
    </h3>
    <h3>歌单</h3>
    <ul>
      <li>
        <span>华丽邂逅</span>
      </li>
      <li>
        <span>东京人寿</span>
      </li>
      <li>
        <span>再见我的初恋</span>
      </li>
      <li>
        <span>隆重登场</span>
      </li>
      <li>
        <span>未知</span>
      </li>
    </ul>
    <ListenTimes />
  </div>
);

export default App;
