/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 779:
/***/ (() => {

document.addEventListener("DOMContentLoaded", () => {
  const addTask = document.querySelectorAll(".add_task");
  const tasks = document.querySelectorAll(".tasks");

  // при нажатии на Add another card появлется окно для добавления задачи
  addTask.forEach((elem, item) => {
    elem.addEventListener("click", e => {
      e.preventDefault();
      const tasksControl = document.createElement("form");
      tasksControl.className = "tasks_control";
      tasksControl.classList.add("tasks_control");
      tasks[item].insertAdjacentHTML("afterEnd", ` 
			<textarea class="tasks_input" placeholder="Enter a title for this card..."></textarea>
			<div class="buttons">
				<button class="card_add">Add Card</button> 
				<button class="close_add">&times;</button> 
			</div>`);
      elem.classList.add("hidden");

      // закрываем окно для добавления задачи
      const closeAdd = document.querySelector(".close_add");
      const tasksInput = document.querySelector(".tasks_input");
      const btns = document.querySelector(".buttons");
      closeAdd.addEventListener("click", e => {
        e.preventDefault();
        elem.classList.remove("hidden");
        tasksInput.classList.add("hidden");
        btns.classList.add("hidden");
      });

      // добавление задачи
      const cardAdd = document.querySelector(".card_add");
      cardAdd.addEventListener("click", e => {
        e.preventDefault();

        // получаем введенные значения из textarea
        const taskInput = document.querySelector(".tasks_input");
        const tasksValue = taskInput.value;
        if (!tasksValue) return;
        tasks[item].insertAdjacentHTML("afterBegin", ` 
					<div class="task">
						<div class="task_title">${tasksValue}</div> 
					</div>
				`);

        // Очищаем поле после ввода задачи для возможности ввода новой задачи
        taskInput.value = "";

        // Удаление отдельной задачи
        const task = document.querySelector(".task");
        const taskRemove = document.createElement("a");
        taskRemove.className = "task_remove";
        task.appendChild(taskRemove);
        taskRemove.innerHTML = "&times;";
        taskRemove.addEventListener("click", () => {
          task.remove();
        });
      });
    });
  });
});

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/* harmony import */ var _js_tasks_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(779);
/* harmony import */ var _js_tasks_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_js_tasks_js__WEBPACK_IMPORTED_MODULE_0__);


})();

/******/ })()
;