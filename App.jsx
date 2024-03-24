// js pragma https://stackoverflow.com/questions/14593350/what-exactly-is-a-javascript-pragma
/**@jsx ZReact.createElement */
import ZReact from './core/React';

function Singer() {
  return <span>容祖儿</span>;
}

const App = (
  <div id="app">
    <h1>app</h1>
    <h3>
      <p>
        <Singer />
      </p>
    </h3>
    <h3>歌单</h3>
    <ul>
      <li>华丽邂逅</li>
      <li>东京人寿</li>
      <li>再见我的初恋</li>
      <li>隆重登场</li>
      <li>未知</li>
    </ul>
  </div>
);

export default App;
