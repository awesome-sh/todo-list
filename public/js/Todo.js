/**
 * Light, Dark Mode 전환
 */
const state = {
    styleMode: 'light',
    isWriting: false,
    todo_list: [],
};

function refreshTodo() {
    console.info(">> Refresh Todo List");
    console.log(state.todo_list);
    /**
     * Local Storage 할일 목록 초기화
     */
    let todoHTML = "";

    if(localStorage.getItem('todo_list')) {
        let undecodeList = JSON.parse(localStorage.getItem('todo_list'));
        
        undecodeList.filter((row, idx) => {
            state.todo_list.push(JSON.parse(decodeURI(row)));
        });

        if(state.todo_list.length > 0) {
            // 미완료 목록 상단
            for(let i = state.todo_list.length; i > 0; i-- ) {
                let item = state.todo_list[i-1];
                if(!item.isComplete) {
                    todoHTML += '<div class="todo-item">';
                    todoHTML +=     '<div class="todo-item-date">';
                    todoHTML +=         '<span class="status-incomplete">';
                    todoHTML +=             item.isComplete ? 'Complete' : 'Incomplete';
                    todoHTML +=         '</span>';
                    todoHTML +=         item.date + ' ' + item.time;
                    todoHTML +=     '</div>'
                    todoHTML +=     '<div class="todo-item-middle">';
                    todoHTML +=         '<div class="todo-item-content">';
                    todoHTML +=             item.todo.replaceAll(/\n/g, '<br/>');
                    todoHTML +=         '</div>';
                    todoHTML +=         '<div class="todo-item-btns">';
                    // todoHTML +=             '<button>삭제</button>';
                    todoHTML +=             '<button onclick="fn_complete(' + item.index + ');">완료</button>';
                    todoHTML +=         '</div>';
                    todoHTML +=     '</div>';
                    todoHTML += '</div>';
                }
            }
            // 완료 목록 하단
            for(let i = state.todo_list.length; i > 0; i-- ) {
                let item = decodeURI(state.todo_list[i-1]);
                if(item.isComplete) {
                    todoHTML += '<div class="todo-item">';
                    todoHTML +=     '<div class="todo-item-date">';
                    todoHTML +=         '<span class="status-complete">';
                    todoHTML +=             item.isComplete ? 'Complete' : 'Incomplete';
                    todoHTML +=         '</span>';
                    todoHTML +=         item.date + ' ' + item.time;
                    todoHTML +=     '</div>'
                    todoHTML +=     '<div class="todo-item-middle">';
                    todoHTML +=         '<div class="todo-item-content">';
                    todoHTML +=             item.todo.replaceAll(/\n/g, '<br/>');
                    todoHTML +=         '</div>';
                    todoHTML +=         '<div class="todo-item-btns">';
                    todoHTML +=             '<button onclick="fn_delete(' + item.index + ');">삭제</button>';
                    // todoHTML +=             '<button>완료</button>';
                    todoHTML +=         '</div>';
                    todoHTML +=     '</div>';
                    todoHTML += '</div>';
                }
            }
        } else {
            todoHTML += '<div class="todo-item">';
            todoHTML +=     '할일 목록이 없습니다.<br/>Add ToDo 버튼을 눌러 할일을 생성해보세요.';
            todoHTML += '</div>';
        }
        
    } else {
        localStorage.setItem('todo_list', JSON.stringify([]));
    }

    const appMiddle = document.querySelector('#app-middle');
    appMiddle.innerHTML = todoHTML;
}


/**
 * 선택한 항목 할일 완료 처리하기
 * @param {*} todoIndex 
 */
function fn_complete(todoIndex) {
    let prevTodoList = state.todo_list;
    prevTodoList[todoIndex].isComplete = true;
    let nextTodoList = [];
    nextTodoList.push(encodeURI(JSON.stringify(prevTodoList)));
    console.log(nextTodoList);
    localStorage.setItem('todo_list', nextTodoList);
    refreshTodo();
}

window.onload = () => {
    //Initialize
    refreshTodo();

    /**
     * 모드체크
     */
    const toggleEL = document.querySelector('#style-mode-toggle');

    /**
     * 모드전환 이벤트 위임
     */
    toggleEL.addEventListener('click', (e) => {
        const mode = e.target.innerText;
        state.styleMode = mode;

        const appContainer = document.querySelector('#AppContainer');
        const appComponent = document.querySelector('#app-component');
        const toggleBtns = document.querySelector('#style-mode-toggle').children;
        console.log(toggleBtns);
        
        if(state.styleMode === 'Dark') {
            toggleBtns[0].classList.remove('mode-select');
            toggleBtns[1].classList.add('mode-select');

            appContainer.classList.remove("AppContainer");
            appContainer.classList.add("AppContainer-dark-mode");

            appComponent.classList.remove("app-component");
            appComponent.classList.add("app-component-dark");
        } else {
            toggleBtns[1].classList.remove('mode-select');
            toggleBtns[0].classList.add('mode-select');

            appContainer.classList.remove("AppContainer-dark-mode");
            appContainer.classList.add("AppContainer");

            appComponent.classList.remove("app-component-dark");
            appComponent.classList.add("app-component");
        }
    });


    /**
     * Add Todo
     */
    const addBtn = document.querySelector('#addTodo');
    const backBlur = document.querySelector('#backBlur');
    const submitBtn = document.querySelector('#submitBtn');
    const addComponent = document.querySelector('#add-todo-component');

    addBtn.addEventListener('click', () => {
        if(!state.isWriting) {
            state.isWriting = !state.isWriting;
            backBlur.style.height = '100%';
            addComponent.style.left = '50%';
            addComponent.style.opacity = 1;
        }
    });

    backBlur.addEventListener('click', () => {
        if(state.isWriting) {
            state.isWriting = !state.isWriting;
            backBlur.style.height = '0%';
            addComponent.style.left = '-50%';
            addComponent.style.opacity = 0;
        }
    });

    submitBtn.addEventListener('click', () => {
        const todoFrm = document.querySelector('#addTodoFrm');
        const formData = new FormData(todoFrm);
        
        const tempDate = formData.get('date');
        const tempTime = formData.get('time');
        const tempTodo = formData.get('todo');

        /**
         * Validation
         */
        if(tempDate === null || tempDate === '') {
            alert('날짜를 선택해주세요');
            document.querySelector('#form-date').focus();
            return;
        }
        if(tempTime === null || tempTime === '') {
            alert('시간을 선택해주세요');
            document.querySelector('#form-time').focus();
            return;
        }
        if(tempTodo === null || tempTodo === '') {
            alert('할일을 입력해주세요');
            document.querySelector('#form-todo').focus();
            return;
        }

        let todo_list = JSON.parse(localStorage.getItem('todo_list'));
        const tempIndex = todo_list.length;

        // 줄바꿈 처리
        tempTodo.replace(/\n/g, '<br/>');
        
        const todo = {
            index: tempIndex,
            date: tempDate,
            time: tempTime,
            todo: tempTodo,
            isComplete: false,
        };
        
        let encodeTodo = encodeURI(JSON.stringify(todo));
        todo_list.push(encodeTodo);
        localStorage.setItem('todo_list', JSON.stringify(todo_list));

        state.isWriting = !state.isWriting;
        backBlur.style.height = '0';
        addComponent.style.left = '-50%';
        addComponent.style.opacity = 0;
        refreshTodo();
    });
};