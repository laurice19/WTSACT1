import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/database';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

const firebaseConfig = {
  apiKey: "AIzaSyAGxEn5nAaQT4bANo4Pj06JnQVQcx8t6ts",
  authDomain: "todo-list-16162.firebaseapp.com",
  projectId: "todo-list-16162",
  storageBucket: "todo-list-16162.appspot.com",
  messagingSenderId: "434867611495",
  appId: "1:434867611495:web:bd13753b206ab87fdab1c2"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState('');


  useEffect(() => {
    const tasksRef = database.ref('tasks');
    tasksRef.on('value', snapshot => {
      const tasks = [];
      snapshot.forEach(childSnapshot => {
        const task = {
          id: childSnapshot.key,
          text: childSnapshot.val().text,
          completed: childSnapshot.val().completed
        };
        tasks.push(task);
      });
      setTasks(tasks);
    });
    return () => tasksRef.off('value');
  }, []);

  const handleNewTaskChange = e => {
    setNewTask(e.target.value);
  };

  const handleNewTaskSubmit = e => {
    e.preventDefault();
    if (newTask.trim() === '') {
      alert('Please enter a task');
      return;
    }
    const newTaskRef = database.ref('tasks').push();
    newTaskRef.set({
      text: newTask.trim(),
      completed: false
    });
    setNewTask('');
  };

  const handleTaskDelete = taskId => {
    database.ref(`tasks/${taskId}`).remove();
  };  

  const handleTaskComplete = (taskId, completed) => {
    database.ref(`tasks/${taskId}`).update({ completed });
  };  

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5 card" style={{ height: "500px", width: "600px", backgroundColor: "lightpink", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)" }}>
      <div style={{ height: "100%", width: "100%", overflowY: "auto" }}>
      <h1 className="text-center mb-3 mt-4 h4">To-Do List</h1>
      <form onSubmit={handleNewTaskSubmit}>
        <div className="input-group mb-3 px-3">
          <input
            type="text"
            id="newTask"
            className="form-control"
            value={newTask}
            onChange={handleNewTaskChange}
          />
          <button type="submit" className="btn btn-primary">
          Add
        </button>
        </div>
      </form>
      <table className='table px-3' style={{ overflowY: "auto", maxHeight: "350px" }}>
        <thead>
          <tr>
            <th>Task</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className='px-3'>
  {tasks.map(task => (
    <tr key={task.id} className={task.completed ? 'table-success' : ''}>
    <td style={{ width: "60%", whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
        {editingTaskId === task.id ? (
          <input
            type="text"
            className="form-control"
            value={editingTaskText}
            onChange={e => setEditingTaskText(e.target.value)}
          />
        ) : (
          task.text
        )}
      </td>
      <td className='d-flex justify-content-end'>
        {!editingTaskId && (
          <>
            {!task.completed && (
              <button
                className="btn btn-success me-2"
                onClick={() => handleTaskComplete(task.id, true)}
              >
                Complete
              </button>
            )}
            {task.completed && (
              <button
                className="btn btn-warning me-2"
                onClick={() => handleTaskComplete(task.id, false)}
              >
                Incomplete
              </button>
            )}
            <button
              className="btn btn-primary me-2"
              onClick={() => {
                setEditingTaskId(task.id);
                setEditingTaskText(task.text);
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleTaskDelete(task.id)}
            >
              Delete
            </button>
          </>
        )}
        {editingTaskId === task.id && (
          <>
            <button
              className="btn btn-primary me-2"
              onClick={() => {
                database.ref(`tasks/${task.id}`).update({ text: editingTaskText });
                setEditingTaskId(null);
                setEditingTaskText('');
              }}
            >
              Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setEditingTaskId(null);
                setEditingTaskText('');
              }}
            >
              Cancel
            </button>
          </>
        )}
      </td>
              </tr>
              ))}
              </tbody>
              </table>
              </div>
              </Container>
              );
              }

export default TodoList;