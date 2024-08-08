import { saveTasksState } from '../js/addTasks'; 

let insertionPoint = null; // Инициализируем переменную

export function drop(listItems) {
  const containers = document.querySelectorAll(".tasks_list");

  // Функция для создания фантома
  function createInsertionPoint() {
    if (!insertionPoint) {
      insertionPoint = document.createElement("div");
      insertionPoint.className = "highlight";
    }
    return insertionPoint;
  }

  // Функция для удаления фантома
  function removeInsertionPoint() {
    if (insertionPoint) {
      insertionPoint.remove();
      insertionPoint = null;
    }
  }

  listItems.forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");

      // Устанавливаем абсолютное позиционирование для перетаскиваемого элемента
      draggable.style.position = 'relative';

      createInsertionPoint();
    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");

      // Сбрасываем позиционирование
      draggable.style.position = '';
      draggable.style.zIndex = '';

      // убираем выделение всех элементов после окончания перетаскивания
      document.querySelectorAll(".highlight").forEach((elem) => elem.remove());

      removeInsertionPoint();

      // Сохраняем состояние в LocalStorage после завершения перетаскивания
      saveTasksState();
    });
  });

  containers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault();

      // Получаем элемент, над которым находится курсор
      const target = e.target;

      removeInsertionPoint(); 

      // Если курсор находится над задачей
      if (target.classList.contains("task")) {
        const { top, bottom } = target.getBoundingClientRect(); //Получаем размеры и позицию задачи.
        const isAbove = e.clientY < (top + bottom) / 2;   //Определяем, находится ли курсор выше середины задачи.

        if (isAbove || e.clientY > bottom) {                // Если курсор выше середины или ниже конца задачи.
          const insertionPoint = createInsertionPoint();   // Создаем элемент выделения.

          if (isAbove) {
            // Вставляем элемент выделения перед задачей.
            target.parentNode.insertBefore(insertionPoint, target);
          } else {
            // Вставляем элемент выделения после задачи.
            const nextElement = target.nextElementSibling;
            if (nextElement) {
              target.parentNode.insertBefore(insertionPoint, nextElement);
            } 
          }
        }
      } else if (target.classList.contains("tasks_list")) {    // Если курсор находится над контейнером задач
        const nextElement = getDropPositionY(e.clientY, container);   // Определяем позицию для вставки в контейнер
        const insertionPoint = createInsertionPoint();  // Создаем элемент выделения.

        if (nextElement) {
          // Вставляем элемент выделения перед следующей задачей.
          container.insertBefore(insertionPoint, nextElement);
        } else {
          // Если задач в контейнере нет, добавляем выделение в конец.
          container.appendChild(insertionPoint);
        }
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
        insertionPoint.remove();  // Убираем выделение после вставки
      }

      // Сохраняем состояние в LocalStorage после завершения перетаскивания
      saveTasksState();
    });
  });

  // Функция для определения вертикальной позиции для вставки задачи.
  function getDropPositionY(y, container) {
    // Получаем все задачи в контейнере, кроме текущей перетаскиваемой.
    const tasks = Array.from(container.querySelectorAll(".task:not(.dragging)"));
    // Находим задачу, у которой верхняя граница находится ниже позиции курсора.
    return tasks.find((task) => {
      const { top, bottom } = task.getBoundingClientRect();
      return y < (top + bottom) / 2;
    });
  }
}