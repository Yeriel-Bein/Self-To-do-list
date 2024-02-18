// 유저가 task 값을 입력하고 add 버튼을 누르면 task-list에 입력 값이 추가된다.
// 입력하고 엔터만 쳐도 task-list에 값이 입력된다.
// All을 누르면 입력한 모든 것들이 나온다.
// ongoing을 누르면 check를 누르지 않는 task만 나온다.
// done을 누르면 check 누른 값들만 나온다.
// delete를 누르면 모든 값들이 삭제 된다.
// delete를 어떤 탭에서 누르든지 바로 리스트 삭제가 된다.
// 빈값들은 입력되지 않도록 한다.
// check를 누르면 밑줄이 가도록 한다.
// 1. check 버튼을 클릭하는 순간 true false
// 2. true이면 끝난걸로 간주하고 밑줄 보여주기
// 3. false이면 안 끝난 걸로 간주하고 그대로

let taskInput = document.getElementById("task-input"); //html의 input을 javascript로 가져오기 위해서 변수선언하여 정의를 내린다.
let addButton = document.getElementById("add-button");
let menu = document.querySelectorAll(".task-menu div");
let taskList = []; //Input에 입력한 값들을 저장하기 위해 만들었다.
let menuID = "all";
let filterList = []; // 탭을 눌렀을 때 필터된 정보들만 들어갈 수 있게
let underLine = document.getElementById("under-line")

addButton.addEventListener("click", addTask);
taskInput.addEventListener("keydown",(e)=>{if(e.keyCode === 13){addTask(e)}});

for(let i=1; i<menu.length; i++){
    menu[i].addEventListener("click",(e) => filter(e))
} // 메뉴들을 누를 때마다 함수가 실행되도록 하기 위해서

function addTask(){
    let taskInputValue = taskInput.value;
    if(taskInputValue === ""){
        return;
    }
    let task = {
        id : randomID(),
        inputValue : taskInput.value,
        isComplete : false
    }//객체를 사용하는 이유는 값을 들고 올 때 inputValue(입력한 값)과 이걸 완수했는지 여부도 확인해야하기 때문이다.

    taskList.push(task); //input에 입력한 값을 taskList 배열에 추가하기
    resetInput();
    console.log(taskList);
    render();
} // input에 입력한 값을 배열에 추가하는 함수

function render(){
    // 1. 내가 선택한 탭에 따라서
    // 2. 리스트를 달리 보여준다.
    // all -> taskList
    // ongoing, done -> filterList
    let printList = [];
    if(menuID === "all"){
        printList = taskList;
    }else if(menuID === "ongoing" || menuID === "done"){
        printList = filterList;
    }

    let resultHTML = '';
    for(let i=0; i<printList.length;i++){
        if(printList[i].isComplete === true){
            resultHTML += `<div class = "task-list task-done">
        <div class = "check-task">
            <button onclick = "toggleComplete('${printList[i].id}')"><i class="fa-solid fa-plus"></i></i></button>
            <div class = "line-through task-box">${printList[i].inputValue}</div>
        </div>
        <button onclick = "deleteTask('${printList[i].id}')"><i class="fa-solid fa-xmark"></i></button>
    </div>`
        }else{
            resultHTML += `<div class = "task-list task-ongoing">
        <div class = "check-task">
            <button onclick = "toggleComplete('${printList[i].id}')"><i class="fa-solid fa-check"></i></button>
            <div class = "task-box">${printList[i].inputValue}</div>
        </div>
        <button onclick = "deleteTask('${printList[i].id}')"><i class="fa-solid fa-xmark"></i></button>
    </div>`//button onclick을 하면 함수값이 적용될 수 있도록 한다.
        }
    }//for문을 쓰는 이유는 taskList에 등록된 값들의 갯수만큼 resultHTML을 보여줘야해서

    document.getElementById("task-board").innerHTML = resultHTML; //resultHTML 코드 내용이 HTML를 통해 UI로 보여질 수 있도록 하는 것이다.
}// html task-list에 표시가 되도록 표현하는 함수

function toggleComplete(id){
    console.log("id:",id)
    for(let i=0; i < taskList.length;i++){
        if(taskList[i].id === id){
            taskList[i].isComplete = !taskList[i].isComplete;
            break
        }
    }
    console.log(taskList);
    filter();
}

function randomID(){
    return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
}

function deleteTask(id){

    for(let i = 0; i < taskList.length;i++){
        if(taskList[i].id === id){
            taskList.splice(i,1);
            break;
        }
    }console.log(taskList);
    filter();
}

function resetInput(){
    taskInput.value = ""
}

function filter(e){
    if(e){
        menuID = e.target.id;
        underLine.style.width = e.target.offsetWidth + "px";
        underLine.style.left = e.target.offsetLeft + "px";
        underLine.style.top =
          e.target.offsetTop + (e.target.offsetHeight-18) + "px";
    }
    filterList = []; // 이걸 쓰는 이유는 filterList를 전역변수로 선언 후에 ongoing 탭을 누를 때마다 필터된 값들이 계속 추가가 된다.
    //함수를 쓸 때 빈값을 설정해야 동일 데이터가 쌓이지 않는다.
// 정말이지 id같은 건 복사 붙여넣기해야 진정한 프로다!
    if(menuID === "all"){
        render();
    }else if(menuID === "ongoing"){
        for(let i=0; i < taskList.length ; i++){
            if(taskList[i].isComplete === false){
                filterList.push(taskList[i]);
            }
        }
        console.log("진행중",filterList);
    }else if(menuID === "done"){
        for(let i=0; i < taskList.length ; i++){
            if(taskList[i].isComplete === true){
                filterList.push(taskList[i]);
            }
        }
        console.log("완료",filterList);
    }render() // if문을 탈출해야 바로바로 삭제가 된다. 왜 그런지는 잘 모르겠다...
} // filter함수를 만드는 이유는 메뉴들을 클릭 할 때마다 필터된 페이지를 보여주기 위해서
