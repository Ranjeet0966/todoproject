var enter_key = 13;
var esc_key = 27;

var todoModel = {
    todos: [],
    countTodos: function () {
        var totalTodos = this.todos.length;
        var completedTodos = 0;
        
        this.todos.forEach(function (todo) {
            if (todo.completed === true) {
                completedTodos++;
            }
        });
        return {
            totalTodos: totalTodos,
            completedTodos: completedTodos
        };
    },
    createTodo: function (todoText) {
        var alertBox = document.getElementById("alert-box");
        var trimmedTodoText = todoText.trim();
        if (trimmedTodoText) {
            this.todos.push({
                todoText: trimmedTodoText,
                completed: false
            });
            alertBox.textContent = "";
        } else {
            alertBox.textContent = "Please enter something";
            setTimeout(function () {
                alertBox.textContent = "";
            }, 3000);
        }
    },
    changeTodo: function (position, todoText) {
        this.todos[position].todoText = todoText;
    },
    deleteTodo: function (position) {
        this.todos.splice(position, 1);
    },
  
    toggleCompleted: function (position) {
        var todo = this.todos[position];
        todo.completed = !todo.completed;
    },
    toggleAll: function () {
        var totalTodos = this.todos.length;
        var completedTodos = 0;
        this.todos.forEach(function (todo) {
            if (todo.completed === true) {
                completedTodos++;
            }
        });

        this.todos.forEach(function (todo) {
            if (completedTodos === totalTodos) {
                todo.completed = false;
            } else {
                todo.completed = true;
            }
        });
    },
    isMobileDevice: function () {
        return (
            typeof window.orientation !== "undefined" ||
            navigator.userAgent.indexOf("IEMobile") !== -1
        );
    }
};

var view = {
    displayTodos: function () {
        var todosUl = document.querySelector("ul");
        todosUl.innerHTML = "";
        todoModel.todos.forEach(function (todo, position) {
         
            var todoLi = document.createElement("li");
       
            var toggleCheckbox = document.createElement("input");
            toggleCheckbox.type = "checkbox";
            toggleCheckbox.classList.add("todo-check-box");
            toggleCheckbox.setAttribute(
                "onchange",
                "controller.toggleCompleted(this)"
            );

          
            var updateBox = document.createElement("input");
            updateBox.classList.add("update-Box", "hide");
            updateBox.type = "text";
            updateBox.value = todo.todoText;
            updateBox.setAttribute("onkeyup", "controller.updateKeyup(this)");
            updateBox.setAttribute("onfocusout", "controller.updateFocusOut(this)");
          
            var todoItemLabel = document.createElement("label");
            todoItemLabel.setAttribute("onclick", "controller.updatingMode(this)");
            todoItemLabel.textContent = todo.todoText;
            todoItemLabel.classList.add("todo-label");
            var mobileEditButton = document.createElement("button");
            mobileEditButton.setAttribute(
                "onclick",
                "controller.mobileUpdatingMode(this)"
            );
            mobileEditButton.textContent = "Edit";
            mobileEditButton.classList.add("hide", "editButton");
            if (todoModel.isMobileDevice()) {
                mobileEditButton.classList.remove("hide");
            }
            if (todo.completed === true) {
                todoItemLabel.classList.add("todos-strikethrough");
            } else {
                todoItemLabel.classList.remove("todos-strikethrough");
            }
            todoLi.id = position;
            if (todo.completed === true) {
                toggleCheckbox.checked = true;
            } else {
                toggleCheckbox.checked = false;
            }
            todoLi.appendChild(toggleCheckbox);
            todoLi.appendChild(todoItemLabel);
            todoLi.appendChild(updateBox);
            todoLi.appendChild(this.createDeleteButton());
            todosUl.insertBefore(todoLi, todosUl.childNodes[0]);
        }, this);
      

        var toggleAllButton = document.querySelector("#toggle-all-btn");
        if (todoModel.countTodos().totalTodos > 0) {
            toggleAllButton.classList.remove("hide");
        } else {
            toggleAllButton.classList.add("hide");
        }
        var createTodoButton = document.querySelector("#create-todo-btn");
        var inputElement = document.getElementById("create-todo-input");
        if (inputElement.value) {
            createTodoButton.classList.remove("hide");
        } else {
            createTodoButton.classList.add("hide");
        }
    },
    toggleHide: function (selectedElement) {
        //  Toggles the hide class which shows or hides the element being passed in.
        selectedElement.classList.toggle("hide");
    },
    toggleTutorialDiv: function () {
        var tutorialDiv = document.querySelector('.tutorial-div');
        this.toggleHide(tutorialDiv);
    },
    createDeleteButton: function () {
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "x";
        deleteButton.className = "delete-btn";
        return deleteButton;
    },
    setUpEventListeners: function () {
        var todosUl = document.querySelector("ul");

        todosUl.addEventListener("click", function (event) {
            var elementClicked = event.target;
            if (elementClicked.className === "delete-btn") {
                controller.deleteTodo(parseInt(elementClicked.parentNode.id));
            }
        });
    }
};
var controller = {
    createTodo: function () {
        var createTodoTextInput = document.getElementById("create-todo-input");
        todoModel.createTodo(createTodoTextInput.value);
        createTodoTextInput.value = "";
        view.displayTodos();
    },
    createTodoEntered: function () {
        var inputElement = document.getElementById("create-todo-input","des");
        if (inputElement.value && event.keyCode === enter_key) {
            if (todoModel.isMobileDevice()) {
                inputElement.blur();
            }
            this.createTodo();
        }
        view.displayTodos();
    },
    updateKeyup: function (updateInputElement) {
        var id = updateInputElement.parentNode.getAttribute("id");
        var newUpdateInputValue = updateInputElement.value;
        if (updateInputElement.value && event.keyCode === enter_key) {
            this.changeTodo(id, newUpdateInputValue);
        }
        if (event.keyCode === esc_key) {
            updateInputElement.value = todoModel.todos[id].todoText;
            view.displayTodos();
        }
    },
    updateFocusOut: function (updateInputElement) {
        var id = updateInputElement.parentNode.getAttribute("id");
        var newUpdateInputValue = updateInputElement.value;
        if (updateInputElement.value) {
            this.changeTodo(id, newUpdateInputValue);
        } else {
            controller.deleteTodo(id);
        }
    },
    changeTodo: function (id, value) {
        todoModel.changeTodo(id, value);
        view.displayTodos();
    },
    deleteTodo: function (position) {
        todoModel.deleteTodo(position);
        view.displayTodos();
    },
    updatingMode: function (todoLabelElement) {
        var updateBoxElement = todoLabelElement.parentNode.querySelector(
            ".update-Box"
        );
        view.toggleHide(todoLabelElement);
        view.toggleHide(updateBoxElement);
        updateBoxElement.focus();
    },
    mobileUpdatingMode: function (editButtonElement) {
        var updateBoxElement = editButtonElement.parentNode.querySelector(
            ".update-Box"
        );
        var todoLabelElement = editButtonElement.parentNode.querySelector(
            ".todo-label"
        );
        view.toggleHide(todoLabelElement);
        view.toggleHide(updateBoxElement);
    },
    toggleCompleted: function (toggleElement) {
        todoModel.toggleCompleted(toggleElement.parentNode.getAttribute("id"));
        view.displayTodos();
    },
    toggleAll: function () {
        todoModel.toggleAll();
        view.displayTodos();
    }
    

};

view.setUpEventListeners();
