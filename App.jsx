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

const songs = ['华丽邂逅', '东京人寿', '再见我的初恋', '隆重登场', '未知'];
const backSongs = ['卸妆', '心之科学', '悲观生物学', '蛇'];
let index = 0;

function SongList() {
  function add() {
    index = index % 4;
    songs.push(backSongs[index++]);
    React.update();
  }

  function del() {
    songs.pop();
    React.update();
  }

  return (
    <div>
      <ul>
        {songs.map((song) => (
          <li>
            <span>{song}</span>
          </li>
        ))}
      </ul>
      <button onClick={add}>add a song</button>
      <button onClick={del}>delete a song</button>
    </div>
  );
}

let isShowCompany = true;
function Company() {
  function change() {
    isShowCompany = !isShowCompany;
    React.update();
  }
  return (
    <div>
      <span>{isShowCompany && '英皇娱乐'}</span>
      <button onClick={change}>change isShowCompany</button>
    </div>
  );
}

const App = (
  <div id="app">
    <h1>app</h1>
    <h3>
      <p>
        <SingerWrapper singer={'容祖儿'} />
      </p>
      <Company />
    </h3>
    <SongList />
    <h3>歌单</h3>

    <ListenTimes />
  </div>
);

export default App;
