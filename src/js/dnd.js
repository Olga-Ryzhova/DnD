import { saveTasksState } from '../js/addTasks'; 

export function drop(listItems) {
  const containers = document.querySelectorAll(".tasks_list");

  listItems.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");

      // Устанавливаем абсолютное позиционирование для перетаскиваемого элемента
      draggable.style.position = 'relative';

    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");

      // Сбрасываем позиционирование
      draggable.style.position = '';
      draggable.style.zIndex = '';
  

      // убираем выделение всех элементов после окончания перетаскивания
      document.querySelectorAll(".highlight").forEach((elem) => {
        elem.remove();
      });

      // Сохраняем состояние в LocalStorage после завершения перетаскивания
      saveTasksState();
    });
  });

  containers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault(); 

      // получаем текущий элемент, на котором произошло событие dragover
      const dragging = document.querySelector(".dragging");
      const { clientX, clientY } = e;
      
      // Убираем выделение всех элементов перед установкой нового
      document.querySelectorAll(".highlight").forEach((elem) => {
        elem.remove();
      });

			// Определяем место для вставки задачи по вертикали (выше или ниже текущего элемента)
			const nextElementY = getDropPositionY(clientY, container);
			// Определяем место для вставки задачи по горизонтали (между задачами)
			const nextElementX = getDropPositionX(clientX, container);

      //Создаем элемент для выделения места вставки
      const insertionPoint = document.createElement("div");
      insertionPoint.className = "highlight";
			const { height } = dragging.getBoundingClientRect();
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

    container.addEventListener("drop", (e) => {
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
    return tasks.find((task) => {
      const { left, right } = task.getBoundingClientRect();
      return x < (left + right) / 2;
    });
  }

	// Функция для определения вертикальной позиции для вставки задачи.
	function getDropPositionY(y, container) {
    // Получаем все задачи в контейнере, кроме текущей перетаскиваемой.
    const tasks = Array.from(container.querySelectorAll(".task:not(.dragging)"));

    // Находим задачу, у которой верхняя граница находится ниже позиции курсора.
    for (const task of tasks) {
      const { top, bottom } = task.getBoundingClientRect();
      if (y < top + (bottom - top) / 2) {
        return task;
      }
    }
  }
}