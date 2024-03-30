// js pragma https://stackoverflow.com/questions/14593350/what-exactly-is-a-javascript-pragma
import React from './core/React';

function SingerWrapper({ singer }) {
  return <Singer singer={singer} />;
}

let isSpan = true;
function Singer({ singer }) {
  const update = React.update();
  function changeType() {
    isSpan = !isSpan;
    update();
  }

  return (
    <div>
      {isSpan ? <span>{singer}</span> : <div>{singer}</div>}
      <button onClick={changeType}>更换 span or div</button>
    </div>
  );
}

const ListenTimes = () => {
  const [times, setTimes] = React.useState(0);
  function oneMore() {
    setTimes(() => times + 1);
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

function SongList() {
  const [index, setIndex] = React.useState(0);
  function add() {
    setIndex((index) => {
      songs.push(backSongs[index % 4]);
      return index + 1;
    });
  }

  function del() {
    songs.pop();
    update();
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
      <div>当前已添加{index}首歌</div>
      <button onClick={add}>add a song</button>
      <button onClick={del}>delete a song</button>
    </div>
  );
}

let isShowCompany = true;
function Company() {
  const update = React.update();
  function change() {
    isShowCompany = !isShowCompany;
    update();
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
