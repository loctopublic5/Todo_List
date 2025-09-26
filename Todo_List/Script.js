class TodoList {
    constructor() {
        this.tasks = [];
        this.todoForm = document.getElementById('todo-form');
        this.todoInput = document.getElementById('todo-input');
        this.todoList = document.getElementById('todo-list');
        this.messageElement = document.getElementById('message');
    }

    addTask(taskText) {
        if (taskText.trim() === '') {
            this.showMessage('Vui lòng nhập nhiệm vụ mới !');
            return;
        }
        let obj1 = {
            text: taskText,
            status: false
        }
        this.tasks.push(obj1);
        this.saveTasks();
        this.renderTasks();
        this.showMessage('Đã thêm nhiệm vụ thành công !');
    }

    toggleStatus(index) {
        const task = this.tasks[index];
        task.status = !task.status;
        this.saveTasks();
        this.renderTasks();
    }

    animateScroll(element) {
    // Chỉ cuộn khi nội dung dài hơn khối
    if (element.scrollWidth > element.clientWidth) {
        let scrollSpeed = 50; 
        let scrollPosition = 0;
        let animationFrame;

        const scroll = () => {
            scrollPosition++;
            element.scrollLeft = scrollPosition;
            
            
            if (scrollPosition >= element.scrollWidth - element.clientWidth) {
                scrollPosition = 0;
                element.scrollLeft = 0;
            }
            animationFrame = setTimeout(scroll, scrollSpeed);
        };
        
        scroll();
        
        
        element.addEventListener('mouseleave', () => {
            clearTimeout(animationFrame);
            element.scrollLeft = 0; 
        }, { once: true });
    }
}

    editTask(index) {
    const listItem = this.todoList.children[index];
    const taskTextSpan = listItem.querySelector('span');
    const editInput = listItem.querySelector('.edit-input');

    // Hiện ô input và ẩn thẻ span
    taskTextSpan.style.display = 'none';
    editInput.style.display = 'block';

    // Đặt giá trị cho ô input và focus vào nó
    editInput.value = this.tasks[index].text;
    editInput.focus();

        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.saveEdit(editInput, index);
            }
        });

        editInput.addEventListener('blur', () => {
            this.saveEdit(editInput, index);
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const taskText = this.todoInput.value;
        this.addTask(taskText);
        this.todoInput.value = '';
    }

    saveEdit(editInput, index) {
        const newText = editInput.value;
        const listItem = this.todoList.children[index];
        const taskTextSpan = listItem.querySelector('span');
        
        // Cải thiện logic: Hiện lại span và ẩn input trước khi lưu
        taskTextSpan.style.display = 'block';
        editInput.style.display = 'none';

        if (newText.trim() === '') {
            this.showMessage('Nội dung công việc không được để trống!');
            // Trả lại nội dung cũ
            this.tasks[index].text = this.tasks[index].text; 
            this.renderTasks();
        } else {
            this.tasks[index].text = newText;
            this.saveTasks();
            this.renderTasks();
            this.showMessage('Đã cập nhật công việc thành công!');
        }
    }

sortTasks() {
    this.tasks.sort((a, b) => {
        // Nếu a đã hoàn thành và b chưa hoàn thành, b sẽ đứng trước a
        if (a.status && !b.status) {
            return 1;
        }
        // Nếu b đã hoàn thành và a chưa hoàn thành, a sẽ đứng trước b
        if (!a.status && b.status) {
            return -1;
        }
        // Giữ nguyên thứ tự nếu cả hai cùng trạng thái
        return 0;
    });
}

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            this.tasks = JSON.parse(storedTasks);
        }
    }

    removeTask(index) {
        this.tasks.splice(index, 1);
        this.saveTasks();
        this.renderTasks();
        this.showMessage('Đã xóa nhiệm vụ thành công!');
    }

    renderTasks() {
        this.sortTasks();
        this.todoList.innerHTML = ' ';
        this.tasks.forEach((task, index) => {
            const listItem = document.createElement('li');

            const taskContent = document.createElement('div');
            taskContent.classList.add('task-content');

            const taskActions = document.createElement('div');
            taskActions.classList.add('task-actions');

            const checkbox = document.createElement('input');
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.classList.add('edit-input');
            editInput.style.display = 'none';

            checkbox.type = 'checkbox';
            checkbox.checked = task.status;

            const taskText = document.createElement('span');
            taskText.textContent = task.text;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'X';
            deleteBtn.classList.add('delete-btn');

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Sửa';
            editBtn.classList.add('edit-btn');

            if (task.status) {
                taskText.classList.add('completed');
            }

            taskText.addEventListener('mouseenter',()=>{
                this.animateScroll(taskText);
            })

            checkbox.addEventListener('click', () => {
                this.toggleStatus(index);
            });

            deleteBtn.addEventListener('click', () => {
                this.removeTask(index);
            });

            editBtn.addEventListener('click', () => {
                this.editTask(index);
            });

            taskContent.appendChild(checkbox);
            taskContent.appendChild(taskText);
            taskContent.appendChild(editInput);

            taskActions.appendChild(editBtn);
            taskActions.appendChild(deleteBtn);

            listItem.appendChild(taskContent);
            listItem.appendChild(taskActions);

            this.todoList.appendChild(listItem);
        });
    }

    showMessage(message) {
        this.messageElement.textContent = message;
        setTimeout(() => {
            this.messageElement.textContent = ' ';
        }, 3000);
    }

    init() {
        this.loadTasks();
        this.renderTasks();
        this.todoForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
}

const app = new TodoList();
app.init();