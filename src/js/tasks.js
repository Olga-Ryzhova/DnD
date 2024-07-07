document.addEventListener("DOMContentLoaded", () => {
  const addTask = document.querySelectorAll(".add_task");
  const tasks = document.querySelectorAll(".tasks");

  // при нажатии на Add another card появлется окно для добавления задачи
  addTask.forEach((elem, item) => {
    elem.addEventListener("click", (e) => {
      e.preventDefault();

      const tasksControl = document.createElement("form");
      tasksControl.className = "tasks_control";
      tasksControl.classList.add("tasks_control");

      tasks[item].insertAdjacentHTML(
        "afterEnd",
        ` 
			<textarea class="tasks_input" placeholder="Enter a title for this card..."></textarea>
			<div class="buttons">
				<button class="card_add">Add Card</button> 
				<button class="close_add">&times;</button> 
			</div>`,
      );

      elem.classList.add("hidden");

      // закрываем окно для добавления задачи
      const closeAdd = document.querySelector(".close_add");
      const tasksInput = document.querySelector(".tasks_input");
      const btns = document.querySelector(".buttons");

      closeAdd.addEventListener("click", (e) => {
        e.preventDefault();
        elem.classList.remove("hidden");
        tasksInput.classList.add("hidden");
        btns.classList.add("hidden");
      });

      // добавление задачи
      const cardAdd = document.querySelector(".card_add");

      cardAdd.addEventListener("click", (e) => {
        e.preventDefault();

        // получаем введенные значения из textarea
        const taskInput = document.querySelector(".tasks_input");
        const tasksValue = taskInput.value;

        if (!tasksValue) return;

        tasks[item].insertAdjacentHTML(
          "afterBegin",
          ` 
					<div class="task">
						<div class="task_title">${tasksValue}</div> 
					</div>
				`,
        );

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
