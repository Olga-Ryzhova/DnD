import { drop } from "./dnd";
const addTask = document.querySelectorAll(".add_task");
const tasks = document.querySelectorAll(".tasks");
const tasksList = document.querySelectorAll(".tasks_list");
let listItems = [];

// при нажатии на Add another card появлется окно для добавления задачи
addTask.forEach((elem, item) => {
  elem.addEventListener("click", (e) => {
    e.preventDefault();

    // открытие textarea для написания задачи
    createTextArea(tasks[item], elem);

    const column = e.target.closest(".board-item");
    const tasksInput = document.querySelector(".tasks_input");
    const btns = document.querySelector(".buttons");

    // закрываем окно для добавления задачи
    const closeAdd = column.querySelector(".close_add");
    const closeWindowAdd = (e) => {
      e.preventDefault();

      elem.classList.remove("hidden");
      tasksInput.remove();
      btns.remove();
    };

    // добавление задачи
    const cardAdd = column.querySelector(".card_add");
    const pushTasks = (e) => {
      e.preventDefault();

      // получаем введенные значения из textarea
      const taskInput = document.querySelector(".tasks_input");
      const tasksValue = taskInput.value;

      if (!tasksValue) return;

      tasksList[item].insertAdjacentHTML(
        "afterBegin",
        `<div class="task"  draggable = "true">
				<div class="task_title">${tasksValue}</div> 
				<a class="task_remove">&times;</a>
			</div>`,
      );

      // Очищаем поле после ввода задачи для возможности ввода новой задачи
      taskInput.value = "";

      // Удаление отдельной задачи
      const task = document.querySelector(".task");
      const taskRemove = document.querySelector(".task_remove");

      taskRemove.addEventListener("click", () => {
        task.remove();
      });

      // добавляем в массив получившиеся значения
      listItems = document.querySelectorAll(".task");
      drop(listItems);
    };

    closeAdd.addEventListener("click", closeWindowAdd);
    cardAdd.addEventListener("click", pushTasks);
  });
});

// открытие textarea для написания задачи
function createTextArea(taskValue, elem) {
  taskValue.insertAdjacentHTML(
    "afterBegin",
    `<textarea class="tasks_input" placeholder="Enter a title for this card..."></textarea>
	<div class="buttons">
		<button class="card_add">Add Card</button> 
		<button class="close_add">&times;</button> 
	</div>`,
  );

  elem.classList.add("hidden");
}
