import React from '../core/React';

import './index.css';

function ToDos() {
  const originList = localStorage.getItem('todos')
    ? JSON.parse(localStorage.getItem('todos'))
    : [];
  const [todoList, setTodoList] = React.useState(originList);

  function handleAdd() {
    const inputEl = document.querySelector('#input');
    setTodoList([
      ...todoList,
      { id: Date.now(), name: inputEl.value, isDone: false }
    ]);
    inputEl.value = '';
  }

  function handleEnter(event) {
    if (event.keyCode === 13) {
      handleAdd();
    }
  }

  function handleSave() {
    localStorage.setItem('todos', JSON.stringify(todoList));
  }

  const [doneStatus, useDoneStatus] = React.useState('all');
  function handleFilter(doneStatus) {
    useDoneStatus(doneStatus);
  }

  function handleRemove(index) {
    const newList = [...todoList];
    newList.splice(index, 1);
    setTodoList(newList);
  }

  function handleStatusChange(index) {
    const newList = [...todoList];
    newList[index].isDone = !newList[index].isDone;
    setTodoList(newList);
  }

  return (
    <div>
      <h1>TODOS</h1>
      <div className="add-block">
        <input type="text" id="input" onKeyDown={handleEnter} />
        <button onClick={handleAdd}>add</button>
      </div>
      <div className="save-block">
        <button onClick={handleSave}>save</button>
      </div>
      <div className="filters-block">
        <form action="">
          <label for="all">
            <input
              type="radio"
              name="status"
              id="all"
              checked={doneStatus === 'all'}
              onClick={() => handleFilter('all')}
            />
            all
          </label>
          <label for="done">
            <input
              type="radio"
              name="status"
              id="done"
              checked={doneStatus === 'done'}
              onClick={() => handleFilter('done')}
            />
            done
          </label>
          <label for="active">
            <input
              type="radio"
              name="status"
              id="active"
              checked={doneStatus === 'active'}
              onClick={() => handleFilter('active')}
            />
            active
          </label>
        </form>
        <ul>
          {todoList
            .filter((todo) => {
              if (doneStatus === 'all') return true;
              if (doneStatus === 'done') return todo.isDone;
              return !todo.isDone;
            })
            .map((todo, index) => {
              const className = todo.isDone ? 'done' : '';

              return (
                <li>
                  <span className={className}>{todo.name}</span>
                  <button onClick={() => handleRemove(index)}>remove</button>
                  <button onClick={() => handleStatusChange(index)}>
                    {todo.isDone ? 'cancel' : 'done'}
                  </button>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

export default ToDos;
