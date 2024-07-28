/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/dnd.js

function drop(listItems) {
  const containers = document.querySelectorAll(".tasks_list");
  listItems.forEach(draggable => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });
    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");

      // убираем выделение всех элементов после окончания перетаскивания
      document.querySelectorAll(".highlight").forEach(elem => {
        elem.remove();
      });

      // Сохраняем состояние в LocalStorage после завершения перетаскивания
      saveTasksState();
    });
  });
  containers.forEach(container => {
    container.addEventListener("dragover", e => {
      e.preventDefault();

      // получаем текущий элемент, на котором произошло событие dragover
      const dragging = document.querySelector(".dragging");
      const {
        clientX,
        clientY
      } = e;

      // Убираем выделение всех элементов перед установкой нового
      document.querySelectorAll(".highlight").forEach(elem => {
        elem.remove();
      });

      // Определяем место для вставки задачи по вертикали (выше или ниже текущего элемента)
      const nextElementY = getDropPositionY(clientY, container);
      // Определяем место для вставки задачи по горизонтали (между задачами)
      const nextElementX = getDropPositionX(clientX, container);

      //Создаем элемент для выделения места вставки
      const insertionPoint = document.createElement("div");
      insertionPoint.className = "highlight";
      const {
        height
      } = dragging.getBoundingClientRect();
      insertionPoint.style.height = `${height}px`;

      // Определяем место вставки по оси Y и X
      if (nextElementY) {
        container.insertBefore(insertionPoint, nextElementY);
      } else if (nextElementX) {
        container.insertBefore(insertionPoint, nextElementX);
      } else {
        container.appendChild(insertionPoint);
      }
    });
    container.addEventListener("drop", e => {
      e.preventDefault();
      // Находим текущий перетаскиваемый элемент
      const dragging = document.querySelector(".dragging");

      // Находим элемент highlight, чтобы вставить задачу на его место.
      const insertionPoint = container.querySelector(".highlight");

      // Вставляем перетаскиваемый элемент перед элементом с классом highlight
      if (insertionPoint) {
        // вставляем перетаскиваемую задачу перед insertionPoint, если он существует. 
        container.insertBefore(dragging, insertionPoint);
        insertionPoint.remove(); // Убираем выделение после вставки
      }
      // Сохраняем состояние в LocalStorage после завершения перетаскивания
      saveTasksState();
    });
  });

  // Функция для определения горизонтальной позиции для вставки задачи.
  function getDropPositionX(x, container) {
    // Получаем все задачи в контейнере, кроме текущей перетаскиваемой.
    const tasks = Array.from(container.querySelectorAll(".task:not(.dragging)"));

    // Находим задачу, у которой левая граница находится правее позиции курсора.
    return tasks.find(task => {
      const {
        left,
        right
      } = task.getBoundingClientRect();
      return x < (left + right) / 2;
    });
  }

  // Функция для определения вертикальной позиции для вставки задачи.
  function getDropPositionY(y, container) {
    // Получаем все задачи в контейнере, кроме текущей перетаскиваемой.
    const tasks = Array.from(container.querySelectorAll(".task:not(.dragging)"));

    // Находим задачу, у которой верхняя граница находится ниже позиции курсора.
    for (const task of tasks) {
      const {
        top,
        bottom
      } = task.getBoundingClientRect();
      if (y < top + (bottom - top) / 2) {
        return task;
      }
    }
  }
}
;// CONCATENATED MODULE: ./src/js/addTasks.js

const addTaskButtons = document.querySelectorAll(".add_task");
const tasksLists = document.querySelectorAll(".tasks_list");

// Функция для создания элемента textarea и кнопок для добавления задачи
function createTextArea(taskList, button) {
  taskList.insertAdjacentHTML("afterEnd", `<textarea class="tasks_input" placeholder="Enter a title for this card..."></textarea>
    <div class="buttons">
      <button class="card_add">Add Card</button>
      <button class="close_add">&times;</button>
    </div>`);
  button.classList.add("hidden");
}

// добавление задачи
function addTask(e, item) {
  e.preventDefault();
  const column = e.target.closest(".board-item");
  const taskInput = column.querySelector(".tasks_input");
  const tasksValue = taskInput.value.trim();
  if (!tasksValue) return;
  tasksLists[item].insertAdjacentHTML("afterBegin", `<div class="task" draggable="true">
      <div class="task_title">${tasksValue}</div>
      <a class="task_remove">&times;</a>
    </div>`);
  taskInput.value = "";

  // Сохраняем состояние в localStorage
  saveTasksState();

  //вызываем удаление задачи
  removeTask();

  // Обновляем список задач для возможности перетаскивания
  const listItems = document.querySelectorAll(".task");
  drop(listItems);
}

// удаление задачи
function removeTask() {
  document.querySelectorAll(".task_remove").forEach(elem => {
    elem.addEventListener("click", () => {
      elem.closest(".task").remove();

      // Сохраняем состояние в localStorage после удаления задачи
      saveTasksState();
    });
  });
}

// Функция для сохранения состояния задач в localStorage
function saveTasksState() {
  // Создаем пустой объект для хранения состояния задач
  const tasksData = {};

  // Перебираем все списки задач
  tasksLists.forEach((list, index) => {
    // Получаем все задачи в текущем списке
    const tasks = Array.from(list.querySelectorAll(".task")).map(task => task.querySelector(".task_title").textContent); // Извлекаем текст заголовка задачи и сохраняем в массив

    // Сохраняем массив задач в объекте
    tasksData[`list${index}`] = tasks;
  });

  // Сохраняем объект состояния задач в localStorage
  localStorage.setItem('tasksState', JSON.stringify(tasksData));
}

// Функция для восстановления состояния задач из LocalStorage
function loadTasksState() {
  // Получаем данные из localStorage или создаем пустой объект
  const tasksData = JSON.parse(localStorage.getItem('tasksState') || '{}');

  // Перебираем все сохраненные задачи
  for (const [listIndex, tasks] of Object.entries(tasksData)) {
    // Извлекаем числовую часть ключа
    const index = parseInt(listIndex.replace('list', ''), 10);

    // Проверяем, существует ли список с данным индексом
    if (tasksLists[index]) {
      // Перебираем все заголовки задач из сохраненных данных
      tasks.forEach(taskTitle => {
        tasksLists[index].insertAdjacentHTML("beforeEnd", `<div class="task" draggable="true">
            <div class="task_title">${taskTitle}</div>
            <a class="task_remove">&times;</a>
          </div>`);
      });
    }
  }

  //вызываем удаление задачи
  removeTask();

  // Обновляем список задач для возможности перетаскивания
  const listItems = document.querySelectorAll(".task");
  drop(listItems);
}

// при нажатии на Add another card появлется окно для добавления задачи
addTaskButtons.forEach((elem, item) => {
  elem.addEventListener("click", e => {
    e.preventDefault();
    createTextArea(tasksLists[item], elem);
    const column = e.target.closest(".board-item");
    const closeAdd = column.querySelector(".close_add");
    closeAdd.addEventListener("click", e => {
      e.preventDefault();
      elem.classList.remove("hidden");
      column.querySelector(".tasks_input").remove();
      column.querySelector(".buttons").remove();
    });
    const cardAdd = column.querySelector(".card_add");
    cardAdd.addEventListener("click", e => addTask(e, item));
  });
});

//  перетаскивание задач
const initialTasks = document.querySelectorAll(".task");
drop(initialTasks);

// Вызов функции для восстановления состояния задач из localStorage
loadTasksState();
;// CONCATENATED MODULE: ./src/index.js



// import "./js/dnd.js";
/******/ })()
;