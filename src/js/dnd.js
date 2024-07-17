export function drop(listItems) {
  // перетаскивание
  const containers = document.querySelectorAll(".tasks_list");
  const draggables = listItems;

  [...draggables].forEach((draggable) => {
    draggable.addEventListener("dragstart", () => {
      draggable.classList.add("dragging");
    });

    draggable.addEventListener("dragend", () => {
      draggable.classList.remove("dragging");
    });
  });

  containers.forEach((contrainer) => {
    contrainer.addEventListener("dragover", (e) => {
      e.preventDefault();
      // получаем текущий элемент, на котором произошло событие dragover
      const currentElement = e.target;
      const dragging = document.querySelector(".dragging");

      // определеяем, можно ли перетащить текущий элемент
      const isMoveable =
        dragging !== currentElement &&
        currentElement.classList.contains("task");

      // если нельзя перетащить, завершаем функцию
      if (!isMoveable) {
        return;
      }

      // Вычисляется следующий элемент для перетаскивания
      const nextElement = getDropPositionY(e.clientY, currentElement);

      // Проверяется, является ли следующий элемент подходящим для перетаскивания.
      if (
        (nextElement && dragging === nextElement.previousElementSibling) ||
        dragging === nextElement
      ) {
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
    const draggableElements = [
      ...container.querySelectorAll(".draggable:not(.dragging)"),
    ];

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
    const currentElementCenter =
      currentElementCoord.y + currentElementCoord.height / 2;

    // Проверяем положение курсора относительно центра текущего элемента.
    // Если курсор находится слева от центра, то следующий элемент после текущего — это элемент, который будет целью перетаскивания.
    // Если курсор справа от центра, текущий элемент остаётся целью перетаскивания.
    const nextElement =
      cursorPosition < currentElementCenter
        ? currentElement
        : currentElement.nextElementSibling;

    // возвращаем следующий элемент как результат функции
    return nextElement;
  };
}
