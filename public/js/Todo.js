/**
 * Light, Dark Mode 전환
 */
const state = {
    styleMode: 'light',
    isWriting: false,
    isConfirm: false,
    isDelete: false,
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
        state.todo_list = JSON.parse(decodeURI(localStorage.getItem('todo_list')));
        console.log(state.todo_list);

        if(state.todo_list.length > 0) {
            // 미완료 목록 상단
            for(let i = state.todo_list.length; i > 0; i-- ) {
                let item = state.todo_list[i-1];
                if(!item.isComplete) {
                    todoHTML +=  state.styleMode === 'Dark' ? '<div class="todo-item-dark">' : '<div class="todo-item">';
                    todoHTML +=     '<div class="todo-item-date">';
                    todoHTML +=         '<span class="status-incomplete">';
                    todoHTML +=             item.isComplete ? '완료된 일' : '할 일';
                    todoHTML +=         '</span>';
                    todoHTML +=         item.date + ' ' + item.time;
                    todoHTML +=     '</div>'
                    todoHTML +=     '<div class="todo-item-middle">';
                    todoHTML +=         '<div class="todo-item-content">';
                    todoHTML +=             item.todo.replaceAll(/\n/g, '<br/>');
                    todoHTML +=         '</div>';
                    todoHTML +=         '<div class="todo-item-btns">';
                    todoHTML +=             '<button class="btn-complete" onclick="fn_complete(' + item.index + ');"><i class="fas fa-check-circle"></i></button>';
                    todoHTML +=         '</div>';
                    todoHTML +=     '</div>';
                    todoHTML += '</div>';
                }
            }

            // 완료목록 분기
            todoHTML += '<div class="complete-todo-line">완료된 일</div>';

            // 완료 목록 하단
            for(let i = state.todo_list.length; i > 0; i-- ) {
                let item = state.todo_list[i-1];
                if(item.isComplete) {
                    
                    todoHTML +=  state.styleMode === 'Dark' ? '<div class="todo-item-dark">' : '<div class="todo-item">';
                    todoHTML +=     '<div class="todo-item-date">';
                    todoHTML +=         '<span class="status-complete">';
                    todoHTML +=             item.isComplete ? '완료된 일' : '할 일';
                    todoHTML +=         '</span>';
                    todoHTML +=         item.date + ' ' + item.time;
                    todoHTML +=     '</div>'
                    todoHTML +=     '<div class="todo-item-middle">';
                    todoHTML +=         '<div class="todo-item-content complete">';
                    todoHTML +=             item.todo.replaceAll(/\n/g, '<br/>');
                    todoHTML +=         '</div>';
                    todoHTML +=         '<div class="todo-item-btns">';
                    todoHTML +=             '<button class="btn-remove" onclick="fn_remove(' + item.index + ');"><i class="fas fa-trash-alt"></i></button>';
                    todoHTML +=         '</div>';
                    todoHTML +=     '</div>';
                    todoHTML += '</div>';
                }
            }
        } else {
            todoHTML += '<div class="todo-item-blank">';
            todoHTML +=     '<i class="fas fa-ghost"></i><br/>할일 목록이 없습니다.<br/>"할일 추가하기" 버튼을 눌러 할일을 생성해보세요.';
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
    console.log(">> Complete Todo");
    let prevTodoList = state.todo_list;
    prevTodoList.forEach((row) => {
        if(row.index === todoIndex) {
            row.isComplete = true;
        }
    });
    localStorage.setItem('todo_list', encodeURI(JSON.stringify(prevTodoList)));
    refreshTodo();
}



/**
 * 완료된 항목 삭제하기
 * @param {*} todoIndex 
 */
function fn_remove(todoIndex) {
    console.log(">> Remove Todo", todoIndex);
    let message = '<i class="fas fa-exclamation-triangle"></i><br>';
    message += '해당 항목을 완전히 <b>삭제</b>하시겠습니까?<br>';
    message += '<button type="button" id="confirm-cancle" onclick="fn_confirm_cancle()";>취소</button>';
    message += '<button type="button" id="confirm-delete" onclick="fn_confirm_ok(' + todoIndex + ')">삭제</button>';

    fn_confirm(message);

    // let nextTodoList = state.todo_list.filter((item) => {
    //     if(item.index !== todoIndex) {
    //         return item;
    //     }
    // });

    // localStorage.setItem('todo_list', encodeURI(JSON.stringify(nextTodoList)));
    // refreshTodo();
    
}


/**
 * Notification
 * @param {Number} type
 */
function fn_notice(message) {
    let alertDiv = document.createElement('div');
    alertDiv.className = 'notice';
    let alertHTML = message;
    alertDiv.innerHTML = alertHTML;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.style.bottom = '0px';
        setTimeout(() => {
            alertDiv.style.bottom = '-60px';
            setTimeout(() => {
                document.body.removeChild(alertDiv);
            }, 1000);
        }, 2500);
    }, 200);
}


/**
 * Confirm
 * @param {*} type 
 */
function fn_confirm(message) {
    const backBlur = document.querySelector('#backBlur');
    let confirmDiv = document.createElement('div');
    confirmDiv.className = 'confirm';
    let confirmHTML = message;
    confirmDiv.innerHTML = confirmHTML;
    document.body.appendChild(confirmDiv);
    confirmDiv.style.top = '50%';
    confirmDiv.style.opacity = 1;
    backBlur.style.height = '100%';
}

/**
 * Confirm Cancle
 * @param {*} todoIndex 
 */
function fn_confirm_cancle() {
    const confirmPopup = document.getElementsByClassName('confirm');
    const backBlur = document.querySelector('#backBlur');
    document.body.removeChild(confirmPopup[0]);
    backBlur.style.height = '0';
}

/**
 * Confirm Ok
 * @param {*} todoIndex 
 */
function fn_confirm_ok(todoIndex) {
    console.log(todoIndex);
    console.log(typeof todoIndex);

    const confirmPopup = document.getElementsByClassName('confirm');
    const backBlur = document.querySelector('#backBlur');
    document.body.removeChild(confirmPopup[0]);
    backBlur.style.height = '0';
    
    let nextTodoList = state.todo_list.filter((item) => {
        if(item.index !== todoIndex) return item;
    });

    localStorage.setItem('todo_list', encodeURI(JSON.stringify(nextTodoList)));
    refreshTodo();
}


/**
 * Category Change Handler
 */
function fn_cate(type) {
    let todoHTML = "";

    switch(type) {
        case '모아보기' :
            if(state.todo_list.length > 0) {
                // 미완료 목록 상단
                for(let i = state.todo_list.length; i > 0; i-- ) {
                    let item = state.todo_list[i-1];
                    if(!item.isComplete) {
                        todoHTML +=  state.styleMode === 'Dark' ? '<div class="todo-item-dark">' : '<div class="todo-item">';
                        todoHTML +=     '<div class="todo-item-date">';
                        todoHTML +=         '<span class="status-incomplete">';
                        todoHTML +=             item.isComplete ? '완료된 일' : '할 일';
                        todoHTML +=         '</span>';
                        todoHTML +=         item.date + ' ' + item.time;
                        todoHTML +=     '</div>'
                        todoHTML +=     '<div class="todo-item-middle">';
                        todoHTML +=         '<div class="todo-item-content">';
                        todoHTML +=             item.todo.replaceAll(/\n/g, '<br/>');
                        todoHTML +=         '</div>';
                        todoHTML +=         '<div class="todo-item-btns">';
                        todoHTML +=             '<button class="btn-complete" onclick="fn_complete(' + item.index + ');"><i class="fas fa-check-circle"></i></button>';
                        todoHTML +=         '</div>';
                        todoHTML +=     '</div>';
                        todoHTML += '</div>';
                    }
                }
    
                // 완료목록 분기
                todoHTML += '<div class="complete-todo-line">완료된 일</div>';
    
                // 완료 목록 하단
                for(let i = state.todo_list.length; i > 0; i-- ) {
                    let item = state.todo_list[i-1];
                    if(item.isComplete) {
                        
                        todoHTML +=  state.styleMode === 'Dark' ? '<div class="todo-item-dark">' : '<div class="todo-item">';
                        todoHTML +=     '<div class="todo-item-date">';
                        todoHTML +=         '<span class="status-complete">';
                        todoHTML +=             item.isComplete ? '완료된 일' : '할 일';
                        todoHTML +=         '</span>';
                        todoHTML +=         item.date + ' ' + item.time;
                        todoHTML +=     '</div>'
                        todoHTML +=     '<div class="todo-item-middle">';
                        todoHTML +=         '<div class="todo-item-content complete">';
                        todoHTML +=             item.todo.replaceAll(/\n/g, '<br/>');
                        todoHTML +=         '</div>';
                        todoHTML +=         '<div class="todo-item-btns">';
                        todoHTML +=             '<button class="btn-remove" onclick="fn_remove(' + item.index + ');"><i class="fas fa-trash-alt"></i></button>';
                        todoHTML +=         '</div>';
                        todoHTML +=     '</div>';
                        todoHTML += '</div>';
                    }
                }
            } else {
                todoHTML += '<div class="todo-item-blank">';
                todoHTML +=     '<i class="fas fa-ghost"></i><br/>할일 목록이 없습니다.<br/>"할일 추가하기" 버튼을 눌러 할일을 생성해보세요.';
                todoHTML += '</div>';
            }
            break;
        case '할 일' : 
            let IncompleteList = state.todo_list.filter((item) => {
                if(!item.isComplete) return item;
            });

            if(IncompleteList.length > 0) {
                // 미완료 목록 상단
                for(let i = IncompleteList.length; i > 0; i-- ) {
                    let item = IncompleteList[i-1];
                    todoHTML +=  state.styleMode === 'Dark' ? '<div class="todo-item-dark">' : '<div class="todo-item">';
                    todoHTML +=     '<div class="todo-item-date">';
                    todoHTML +=         '<span class="status-incomplete">';
                    todoHTML +=             '할 일';
                    todoHTML +=         '</span>';
                    todoHTML +=         item.date + ' ' + item.time;
                    todoHTML +=     '</div>'
                    todoHTML +=     '<div class="todo-item-middle">';
                    todoHTML +=         '<div class="todo-item-content">';
                    todoHTML +=             item.todo.replaceAll(/\n/g, '<br/>');
                    todoHTML +=         '</div>';
                    todoHTML +=         '<div class="todo-item-btns">';
                    todoHTML +=             '<button class="btn-complete" onclick="fn_complete(' + item.index + ');"><i class="fas fa-check-circle"></i></button>';
                    todoHTML +=         '</div>';
                    todoHTML +=     '</div>';
                    todoHTML += '</div>';
                }
            } else {
                todoHTML += '<div class="todo-item-blank">';
                todoHTML +=     '<i class="fas fa-ghost"></i><br/>할일 목록이 없습니다.<br/>"할일 추가하기" 버튼을 눌러 할일을 생성해보세요.';
                todoHTML += '</div>';
            }
            break;
        case '완료된 일' : 
            let completeList = state.todo_list.filter((item) => {
                if(item.isComplete) return item;
            });
            if(completeList.length > 0) {
                for(let i = completeList.length; i > 0; i-- ) {
                    let item = completeList[i-1];
                    todoHTML +=  state.styleMode === 'Dark' ? '<div class="todo-item-dark">' : '<div class="todo-item">';
                    todoHTML +=     '<div class="todo-item-date">';
                    todoHTML +=         '<span class="status-complete">';
                    todoHTML +=             '완료된 일';
                    todoHTML +=         '</span>';
                    todoHTML +=         item.date + ' ' + item.time;
                    todoHTML +=     '</div>'
                    todoHTML +=     '<div class="todo-item-middle">';
                    todoHTML +=         '<div class="todo-item-content complete">';
                    todoHTML +=             item.todo.replaceAll(/\n/g, '<br/>');
                    todoHTML +=         '</div>';
                    todoHTML +=         '<div class="todo-item-btns">';
                    todoHTML +=             '<button class="btn-remove" onclick="fn_remove(' + item.index + ');"><i class="fas fa-trash-alt"></i></button>';
                    todoHTML +=         '</div>';
                    todoHTML +=     '</div>';
                    todoHTML += '</div>';
                }
            } else {
                todoHTML += '<div class="todo-item-blank">';
                todoHTML +=     '<i class="fas fa-ghost"></i><br/>할일 목록이 없습니다.<br/>"할일 추가하기" 버튼을 눌러 할일을 생성해보세요.';
                todoHTML += '</div>';
            }
            break;
    }

    const appMiddle = document.querySelector('#app-middle');
    appMiddle.innerHTML = todoHTML;
}



/**
 * DOM Load End
 */
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
        
        if(state.styleMode === 'Dark') {
            toggleBtns[0].classList.remove('mode-select');
            toggleBtns[1].classList.add('mode-select');

            appContainer.classList.remove("AppContainer");
            appContainer.classList.add("AppContainer-dark-mode");

            appComponent.classList.remove("app-component");
            appComponent.classList.add("app-component-dark");

            const todoItems = document.querySelectorAll('.todo-item');
            todoItems.forEach((item) => {
                item.classList.remove('todo-item');
                item.classList.add('todo-item-dark');
            });

        } else {
            toggleBtns[1].classList.remove('mode-select');
            toggleBtns[0].classList.add('mode-select');

            appContainer.classList.remove("AppContainer-dark-mode");
            appContainer.classList.add("AppContainer");

            appComponent.classList.remove("app-component-dark");
            appComponent.classList.add("app-component");

            const todoItems = document.querySelectorAll('.todo-item-dark');
            todoItems.forEach((item) => {
                item.classList.remove('todo-item-dark');
                item.classList.add('todo-item');
            });
        }
    });

    

    /**
     * Category Change
     */
    const cateEL = document.querySelector('#app-cate');
    cateEL.addEventListener('click', (e) => {
        let target = e.target.innerText;

        if(target.length > 10) {
            return;
        }
        
        let cateBtns = cateEL.children;
        for (let item of cateBtns) {
            item.classList.remove('selected');
        }
        
        e.target.classList.add('selected');
        fn_cate(target);
    });


    /**
     * Add Todo
     */
    const addBtn = document.querySelector('#addTodo');
    const backBlur = document.querySelector('#backBlur');
    const submitBtn = document.querySelector('#submitBtn');
    const addComponent = document.querySelector('#add-todo-component');

    /**
     * Popup Event
     * @param {} flag 
     */
    function addTodoPopup(flag) {
        if(flag) {
            state.isWriting = !state.isWriting;
            backBlur.style.height = '100%';
            addComponent.style.left = '50%';
            addComponent.style.opacity = 1;
        } else {
            state.isWriting = !state.isWriting;
            backBlur.style.height = '0%';
            addComponent.style.left = '-50%';
            addComponent.style.opacity = 0;
        }
    }

    addBtn.addEventListener('click', () => {
        addTodoPopup(true);
        console.log(">> Add ToDo Popup");
        console.log(state.isWriting);
    });

    backBlur.addEventListener('click', () => {
        if(state.isWriting) addTodoPopup(false);
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
            fn_notice('<i class="fas fa-exclamation-circle"></i> 날짜를 선택해주세요');
            document.querySelector('#form-date').focus();
            return;
        }
        if(tempTime === null || tempTime === '') {
            fn_notice('<i class="fas fa-exclamation-circle"></i> 시간을 선택해주세요');
            document.querySelector('#form-time').focus();
            return;
        }
        if(tempTodo === null || tempTodo === '') {
            fn_notice('<i class="fas fa-exclamation-circle"></i> 할일을 입력해주세요');
            document.querySelector('#form-todo').focus();
            return;
        }

        // 인덱스 생성을 위해 투두리스트 배열길이 세팅
        const tempIndex = state.todo_list.length;

        // 줄바꿈 처리
        tempTodo.replace(/\n/g, '<br/>');
        
        const todo = {
            index: tempIndex,
            date: tempDate,
            time: tempTime,
            todo: tempTodo,
            isComplete: false,
        };
        
        console.log(state.todo_list);
        state.todo_list.push(todo);
        localStorage.setItem('todo_list', encodeURI(JSON.stringify(state.todo_list)));

        addTodoPopup(false);
        fn_notice('성공적으로 할 일을 추가했습니다.');
        refreshTodo();
    });
};