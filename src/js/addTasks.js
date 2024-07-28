import { drop } from "./dnd";

const addTaskButtons = document.querySelectorAll(".add_task");
const tasksLists = document.querySelectorAll(".tasks_list");

// Функция для создания элемента textarea и кнопок для добавления задачи
function createTextArea(taskList, button) {
  taskList.insertAdjacentHTML(
    "afterEnd",
    `<textarea class="tasks_input" placeholder="Enter a title for this card..."></textarea>
    <div class="buttons">
      <button class="card_add">Add Card</button>
      <button class="close_add">&times;</button>
    </div>`
  );

  button.classList.add("hidden");
}

// добавление задачи
function addTask(e, item) {
  e.preventDefault();
  const column = e.target.closest(".board-item");

  const taskInput = column.querySelector(".tasks_input");
  const tasksValue = taskInput.value.trim();

  if (!tasksValue) return;

  tasksLists[item].insertAdjacentHTML(
    "afterBegin",
    `<div class="task" draggable="true">
      <div class="task_title">${tasksValue}</div>
      <a class="task_remove">&times;</a>
    </div>`
  );

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
  document.querySelectorAll(".task_remove").forEach((elem) => {
    elem.addEventListener("click", () => {
      elem.closest(".task").remove();

      // Сохраняем состояние в localStorage после удаления задачи
      saveTasksState();
    });
  });
}

// Функция для сохранения состояния задач в localStorage
export function saveTasksState() {
  // Создаем пустой объект для хранения состояния задач
  const tasksData = {};

  // Перебираем все списки задач
  tasksLists.forEach((list, index) => {
    // Получаем все задачи в текущем списке
    const tasks = Array.from(list.querySelectorAll(".task")).
    map((task) => task.querySelector(".task_title").textContent); // Извлекаем текст заголовка задачи и сохраняем в массив

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
      tasks.forEach((taskTitle) => {
        tasksLists[index].insertAdjacentHTML(
          "beforeEnd",
          `<div class="task" draggable="true">
            <div class="task_title">${taskTitle}</div>
            <a class="task_remove">&times;</a>
          </div>`
        );
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
  elem.addEventListener("click", (e) => {
    e.preventDefault();

    createTextArea(tasksLists[item], elem);

    const column = e.target.closest(".board-item");

    const closeAdd = column.querySelector(".close_add");
    closeAdd.addEventListener("click", (e) => {
      e.preventDefault();
      elem.classList.remove("hidden");
      column.querySelector(".tasks_input").remove();
      column.querySelector(".buttons").remove();
    });

    const cardAdd = column.querySelector(".card_add");
    cardAdd.addEventListener("click", (e) => addTask(e, item));
  });
});

//  перетаскивание задач
const initialTasks = document.querySelectorAll(".task");
drop(initialTasks);

// Вызов функции для восстановления состояния задач из localStorage
loadTasksState();