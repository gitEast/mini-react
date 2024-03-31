import React from '../core/React';

import './index.css';

function TodoItem({ todo, handleRemove, handleStatusChange }) {
  const className = todo.isDone ? 'done' : '';

  return (
    <li>
      <span className={className}>{todo.name}</span>
      <button onClick={() => handleRemove(todo.id)}>remove</button>
      <button onClick={() => handleStatusChange(todo.id)}>
        {todo.isDone ? 'cancel' : 'done'}
      </button>
    </li>
  );
}

function ToDos() {
  const [todoList, setTodoList] = React.useState([]);
  React.useEffect(() => {
    const list = localStorage.getItem('todos');
    if (list) {
      setTodoList(JSON.parse(list));
    }
  }, []);

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

  function handleRemove(id) {
    const newList = todoList.filter((todo) => todo.id !== id);
    setTodoList(newList);
  }

  function handleStatusChange(id) {
    const newList = todoList.map((todo) => ({
      ...todo,
      isDone: todo.id === id ? !todo.isDone : todo.isDone
    }));
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
            .map((todo) => {
              return (
                <TodoItem
                  todo={todo}
                  handleRemove={handleRemove}
                  handleStatusChange={handleStatusChange}
                />
              );
            })}
        </ul>
      </div>
    </div>
  );
}

export default ToDos;
