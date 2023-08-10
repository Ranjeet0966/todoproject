const taskInput = document.getElementById('task');
		const descriptionInput = document.getElementById('description');
		const btn = document.querySelector('.addTask button');
		const notCompletedList = document.querySelector('.notCompletedList');
		const completedList = document.querySelector('.completedList');

		btn.addEventListener('click', addList);
		taskInput.addEventListener('keyup', (e) => {
			(e.keyCode === 13 ? addList(e) : null);
		});

		// Load tasks from local storage on page load
		window.addEventListener('load', loadTasks);

		function createTaskItem(taskDescription) {
			const newLi = document.createElement('li');
			newLi.textContent = taskDescription;

			const checkBtn = document.createElement('button');
			checkBtn.innerHTML = '<i class="fa fa-check"></i>';

			const delBtn = document.createElement('button');
			delBtn.innerHTML = '<i class="fa fa-trash"></i>';

			newLi.appendChild(checkBtn);
			newLi.appendChild(delBtn);

			checkBtn.addEventListener('click', async function() {
				const parent = this.parentNode;
				parent.remove();
				completedList.appendChild(parent);
				checkBtn.style.display = 'none';
				await saveTasks();
			});

			delBtn.addEventListener('click', async function() {
				const parent = this.parentNode;
				parent.remove();
				 await saveTasks();
			});

			return newLi;
		}

		async function addList(e) {
			const taskValue = taskInput.value;
			const descriptionValue = descriptionInput.value;

			if (taskValue !== '') {
				const newLi = createTaskItem(taskValue + ' - ' + descriptionValue);
				taskInput.value = '';
				descriptionInput.value = '';
				notCompletedList.appendChild(newLi);

				await saveTasks();
			}
		}

		async function saveTasks() {
			const notCompletedTasks = Array.from(notCompletedList.children).map(task => task.textContent);
			const completedTasks = Array.from(completedList.children).map(task => task.textContent);

			 localStorage.setItem('notCompletedTasks', JSON.stringify(notCompletedTasks));
			 localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
            /*axios.post("https://crudcrud.com/api/2a409e927c8d4a88bb3705f31e55ef92/todos", {
  notCompletedTasks: Array.from(notCompletedList.children).map(task => task.textContent),
  completedTasks: Array.from(completedList.children).map(task => task.textContent)
})
.then((response) => {
    console.log(response);
})
.catch((err) => {
    console.log(err);
});*/
		}

		async function loadTasks() {
			notCompletedList.innerHTML = '';
			completedList.innerHTML = '';

			const storedNotCompletedTasks = JSON.parse (  localStorage.getItem('notCompletedTasks')) || [];
			const storedCompletedTasks = JSON.parse(  localStorage.getItem('completedTasks')) || [];
            

			storedNotCompletedTasks.forEach(task => {
				const newLi = createTaskItem(task);
				notCompletedList.appendChild(newLi);
                saveTasks();
			});

			storedCompletedTasks.forEach(task => {
				const newLi = createTaskItem(task);
				completedList.appendChild(newLi)
                  saveTasks();
        
			});
		}
