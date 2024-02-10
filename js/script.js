document.addEventListener('DOMContentLoaded', function (){          // akan menjalankan kode yang ada di dalamnya, saat DOMContentLoaded dipanggil
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();                                     // mencegah biar gak ke reload, jadinya data yang diisikan tetp aman brok
        addTodo();                                                  // untuk menambahkan to do baru
    });
});

function addTodo() {
    const textTodo = document.getElementById('title').value;        // nagkep elemen input title todo
    const timestamp = document.getElementById('date').value;        // nangkep elemen date nya

    const generatedID = generatedId();                              //  
    const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
    todos.push(todoObject);                                         // nyimpen object yang dibuat dari generateTodoObject ke array todos 

    document.dispatchEvent(new Event(RENDER_EVENT));                // panggil sebuah custom event RENDER_EVENT yang digunaun untuk render data yang disimpan pada array todos
}

function generatedId() {                                            // berfungsi untuk menghasilkan identitad unik pada setiap item todo,
    return +new Date();                                             // dengan menggunakan +new Date()
}       

function generateTodoObject(id, task, timestamp, isCompleted) {     // berfungsi untuk membuat object dari data yang sudah disediakan dari inputan
    return {
        id,
        task,
        timestamp,
        isCompleted
    }
}

const todos = []                                                    // todos adalah variabel yang berisi array yang menampung bbrp object, berisi data user
const RENDER_EVENT = 'render-todo'                                  // mendefinisikan custom event dengan nama render-todo

document.addEventListener(RENDER_EVENT, function (){
    console.log(todos);
})

// membuat container tampilan todo yang akan dikerjakan
function makeTodo(todoObject) {
    const textTitle = document.createElement('h2');                 // membuat elemen html yaitu h2
    textTitle.innerText = todoObject.task;                          // set elemen h2 yang akan ditulis berdasarkan todoObject.task

    const textTimestamps = document.createElement('p');             // buat elemen html yakni p
    textTimestamps.innerText = todoObject.timestamp;                // set elemen p ke todoObject.timestamp

    const textContainer = document.createElement('div');            // buat elemen html yaitu div
    textContainer.classList.add('inner');                           // memberikan class pada div yang bernama 'inner'
    textContainer.append(textTitle, textTimestamps);                 // set textContainer agar menampilkan (textFile, dan textTimestamps) 

    const container = document.createElement('div');                // buat elemen div untuk container ygy
    container.classList.add('item', 'shadow');                      // set class dari elemen div container yang udah dibuat
    container.append(textContainer);                                // perintah agar container menampilkan textContainer dg menggunakan append
    container.setAttribute('id', `todo-${todoObject.id}`);          // memberikan identitas id pada setiap elemen todo

    if (todoObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function() {
            undoTaskFromCompleted(todoObject.id);
        })
        container.append(undoButton);

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function() {
            removeTaskFromCompleted(todoObject.id);
        })
        container.append(trashButton);

    } else { 
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        
        checkButton.addEventListener('click', function () {
            addTaskToCompleted(todoObject.id);
        });

        container.append(checkButton);
    }

    return container;

}

function removeTaskFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);

    if (todoTarget === -1) return;

    todos.splice(todoTarget, 1)
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoTaskFromCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// coba kode di dalam event handler dari custom event RENDER_EVENT untuk menerapkan makeTodo() 
document.addEventListener(RENDER_EVENT, function () {
    const uncompletedTODOList = document.getElementById('todos');
    uncompletedTODOList.innerHTML = '';

    for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        uncompletedTODOList.append(todoElement);
    }
});

function addTaskToCompleted (todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodo(todoId) {
    for (const todoItem of todos) {
        if (todoItem.id === todoId) {
            return todoItem;
        }
    }
    return null;
}

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedTODOList = document.getElementById('todos');
    uncompletedTODOList.innerHTML = '';

    for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if (!todoItem.isCompleted){
            uncompletedTODOList.append(todoElement);
        }
    }
})

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedTODOList = document.getElementById('todos')
    uncompletedTODOList.innerHTML = '';

    const completedTODOList = document.getElementById('completed-todos');
    completedTODOList.innerHTML ='';

    for (const todoItem of todos){
        const todoElement = makeTodo(todoItem);
        if (!todoItem.isCompleted)
            uncompletedTODOList.append(todoElement);
        else 
            completedTODOList.append(todoElement);
    }
})

function findTodoIndex(todoId) {
    for (const index in todos) {
        if (todos[index].id === todoId) {
            return index;
        }
    }

    return -1;
}