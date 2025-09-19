class TodoList{
    constructor(){
        this.tasks= [];
        this.todoForm = document.getElementById('todo-form');
        this.todoInput = document.getElementById('todo-input');
        this.todoList = document.getElementById('todo-list');
        this.messageElement = document.getElementById('message');
    }

    addTask(taskText){
        if(taskText.trim() === ''){
            this.showMessage('Vui lòng nhập nhiệm vụ mới !');
            return;
        }
        let obj1 ={
            text : taskText,
            status : false
        }

        this.tasks.push(obj1);
        this.saveTasks();
        this.renderTasks();
        this.showMessage('Đã thêm nhiệm vụ thành công !');
    }

    toggleStatus(index){
        const task = this.tasks[index];
        task.status = !task.status;

        this.saveTasks();
        this.renderTasks();
    }

    editTask(index){
        const ListItem = this.todoList.children[index];
        const currentText = this.tasks[index].text;

        const input = document.createElement('input');
        input.type ='text';
        input.value = currentText;
        input.classList.add('edit-input');  

        const listItem = this.todoList.children[index]; 
        const taskTextSpan = listItem.querySelector('span');
        ListItem.replaceChild(input, taskTextSpan);

        input.focus();

        input.addEventListener('keydown', (e) => {
        if(e.key === 'Enter'){
            this.saveEdit(input, index); 
        }
    });

    input.addEventListener('blur',() => {
        this.saveEdit(input, index); 
    });
}

    handleFormSubmit(e){
        e.preventDefault();
        const taskText= this.todoInput.value;
        this.addTask(taskText);
        this.todoInput.value = '';
    }

    saveEdit(input,index){
        const newText = input.value;

        if(newText.trim() === ''){
            this.showMessage('Nội dung công việc không được để trống!');
        }else{
            this.tasks[index].text = newText;
            this.saveTasks();
            this.renderTasks();
            this.showMessage('Đã cập nhật công việc thành công!');
        }
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks))
    }

    loadTasks(){
        const storedTasks = localStorage.getItem('tasks');
        if(storedTasks){
            this.tasks = JSON.parse(storedTasks);
        }
    }

    removeTask(index){
        this.tasks.splice(index,1);
        this.saveTasks();
        this.renderTasks();
        this.showMessage('Đã xóa nhiệm vụ thành công!');
    }

    renderTasks() {
        this.todoList.innerHTML = ' ';
        this.tasks.forEach((task, index) => {
            const ListItem = document.createElement('li');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.status;
            
            const taskText =document.createElement('span');
            taskText.textContent=task.text;

            const deleteBtn =document.createElement('button');
            deleteBtn.textContent = 'Xoá';
            deleteBtn.classList.add('delete-btn');

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Chỉnh sửa';
            editBtn.classList.add('edit-btn');

            if(task.status){
                taskText.classList.add('completed');
            }

            checkbox.addEventListener('click', ()=>{
                this.toggleStatus(index);
            });

            deleteBtn.addEventListener('click', () =>{
                this.removeTask(index);
            });

            editBtn.addEventListener('click', () =>{
                this.editTask(index);
            });

            ListItem.appendChild(checkbox);
            ListItem.appendChild(taskText);
            ListItem.appendChild(editBtn);
            ListItem.appendChild(deleteBtn);
            this.todoList.appendChild(ListItem);


        });
    }

    showMessage(message){
        this.messageElement.textContent =message;
        setTimeout(() =>{
            this.messageElement.textContent= ' ';
        }, 3000);

    }
    init(){
        this.loadTasks();
        this.renderTasks();
        this.todoForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
}

const app = new TodoList();
app.init();