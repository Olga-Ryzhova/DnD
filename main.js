/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/dnd.js
function drop(listItems) {
  // перетаскивание
  const containers = document.querySelectorAll(".tasks_list");
  const draggables = listItems;
  [...draggables].forEach(draggable => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });
    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
    });
  });
  containers.forEach(contrainer => {
    contrainer.addEventListener("dragover", e => {
      e.preventDefault();
      // получаем текущий элемент, на котором произошло событие dragover
      const currentElement = e.target;
      const dragging = document.querySelector(".dragging");

      // определеяем, можно ли перетащить текущий элемент
      const isMoveable = dragging !== currentElement && currentElement.classList.contains("task");

      // если нельзя перетащить, завершаем функцию
      if (!isMoveable) {
        return;
      }

      // Вычисляется следующий элемент для перетаскивания
      const nextElement = getDropPositionY(e.clientY, currentElement);

      // Проверяется, является ли следующий элемент подходящим для перетаскивания.
      if (nextElement && dragging === nextElement.previousElementSibling || dragging === nextElement) {
        dragging;
        return;
      }

      // Текущий контейнер вставляет элемент с классом dragging перед следующим элементом
      contrainer.insertBefore(dragging, nextElement);

      // вычисляется позиция внутри контейнера для вставки элемента с классом dragging, если она есть
      const dropTarget = getDropPositionX(contrainer, e.clientX);

      // Если позиция найдена, текущий контейнер вставляет элемент с классом dragging в эту позицию.
      if (dropTarget) {
        contrainer.insertBefore(dragging, dropTarget);
      }
    });
  });
  const getDropPositionX = (container, x) => {
    // получаем все элементы с классом draggable, кроме элементов с классом dragging
    const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")];

    // получаем данные элементы в цикле
    for (const draggable of draggableElements) {
      // для каждого элемента вычисляем  его позицию
      const pos = draggable.getBoundingClientRect();

      // Если значение x больше значения left позиции элемента, то функция возвращает текущий элемент.
      // элемент подходит для вставки в него элемента с классом dragging
      if (x > pos.left) {
        return draggable;
      }
    }
    // Если ни один из элементов не подходит, возвращаем null.
    return null;
  };
  const getDropPositionY = (cursorPosition, currentElement) => {
    // для каждого элемента вычисляем  его позицию
    const currentElementCoord = currentElement.getBoundingClientRect();

    // Вычисляем центр текущего элемента
    const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

    // Проверяем положение курсора относительно центра текущего элемента.
    // Если курсор находится слева от центра, то следующий элемент после текущего — это элемент, который будет целью перетаскивания.
    // Если курсор справа от центра, текущий элемент остаётся целью перетаскивания.
    const nextElement = cursorPosition < currentElementCenter ? currentElement : currentElement.nextElementSibling;

    // возвращаем следующий элемент как результат функции
    return nextElement;
  };
}
;// CONCATENATED MODULE: ./src/js/addTasks.js

const addTask = document.querySelectorAll(".add_task");
const tasks = document.querySelectorAll(".tasks");
const tasksList = document.querySelectorAll(".tasks_list");
let listItems = [];

// при нажатии на Add another card появлется окно для добавления задачи
addTask.forEach((elem, item) => {
  elem.addEventListener("click", e => {
    e.preventDefault();

    // открытие textarea для написания задачи
    createTextArea(tasks[item], elem);
    const column = e.target.closest(".board-item");
    const tasksInput = document.querySelector(".tasks_input");
    const btns = document.querySelector(".buttons");

    // закрываем окно для добавления задачи
    const closeAdd = column.querySelector(".close_add");
    const closeWindowAdd = e => {
      e.preventDefault();
      elem.classList.remove("hidden");
      tasksInput.remove();
      btns.remove();
    };

    // добавление задачи
    const cardAdd = column.querySelector(".card_add");
    const pushTasks = e => {
      e.preventDefault();

      // получаем введенные значения из textarea
      const taskInput = document.querySelector(".tasks_input");
      const tasksValue = taskInput.value;
      if (!tasksValue) return;
      tasksList[item].insertAdjacentHTML("afterBegin", `<div class="task"  draggable = "true">
				<div class="task_title">${tasksValue}</div> 
				<a class="task_remove">&times;</a>
			</div>`);

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
  taskValue.insertAdjacentHTML("afterBegin", `<textarea class="tasks_input" placeholder="Enter a title for this card..."></textarea>
	<div class="buttons">
		<button class="card_add">Add Card</button> 
		<button class="close_add">&times;</button> 
	</div>`);
  elem.classList.add("hidden");
}
;// CONCATENATED MODULE: ./src/index.js



/******/ })()
;