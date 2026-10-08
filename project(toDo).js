//let todos = [];
  // { this is written for idea so that we see and work on that ..
  //   id:Date.now(),
  //   text:"Go to gym",
  //   isCompleted:false
  // },{
  //   id:Date.now() + 2,
  //   text:"Takeclass",
  //   isCompleted:true
  // },{
  //   id:Date.now() + 3,
  //   text:"web development lecture",
  //   isCompleted:false
  // }
//] use local storage
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todoInput");
const todoList = document.querySelector("#todo-List");
const formBtn = document.querySelector("#form-btn");
const taskCount = document.querySelector("#task-count");
const completeCount = document.querySelector("#complete-count");
const cancelBtn = document.querySelector("#cancel-btn");
let todos = JSON.parse(localStorage.getItem("todos"))||[];
let EditTodoId = null;//esse pta chlaega edit krna ya add aur ek chij aur kise edit krana ye bhi pta chalega
todoForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  const todoValue = todoInput.value.trim();
  if(!todoValue){
    return;
  }
  if(EditTodoId){
    //editing 1phase of edit
    todos=todos.map((todo)=>{
      if(todo.id===Number(EditTodoId)){
        return{
          ...todo,//todo ki sari information rakho bs text update kr do..
          text:todoValue
        }
      }return todo;//jo match nhi hue unko retun kr do..
    })
   localStorage.setItem("todos",JSON.stringify(todos))
  }
  else{
    //second phase of edit (adding )
    let newTodo = {
    id:Date.now(),
    text:todoValue,
    isCompleted:false
  }
  todos.push(newTodo)//adding new todo to existing todos list...
  localStorage.setItem("todos",JSON.stringify(todos));
  
  }
  
  // todoInput.value=" "//when you click add then input empty ho jaye aur phir jo input diya tha vo render ho jaye
  cancelEdit();
  renderTodo();//jab koi naya todo add hoga first updated todos render ho jayega..
})
function renderTodo(){
  todoList.innerHTML="";//todoList ka jo inner html hae vo empty kr diya..
  todos.forEach((todo)=>{
    addTodo(todo);
  
})
taskCount.textContent=`TASKS (${todos.length})`;
completeCount.textContent = `COMPLETED :${todos.filter((todo)=>todo.isCompleted).length}`;
}
renderTodo();//jab first time file execute ho tab existing todos render ho jayega..

function addTodo(todo){
  const li = document.createElement("li");//<li></li>
  li.className =`flex gap-2 border border-slate-300 p-4 rounded-xl m-2 focus: border-2 border-slate-300`;
  li.dataset.id=todo.id;//this is orginal method
  //li.setAttribute("data-id",todo.id)//this is jugad
  li.innerHTML=
  `
         <input data-action="toggle" ${todo.isCompleted?"checked": ""} data-id=${todo.id} type="checkbox">
         <p class=" flex-1 ${todo.isCompleted ? "line-through text-red-500":""}">${todo.text}</p>
         <div class="flex gap-2">
           <button  data-action="edit" class="hover:underline cursor-pointer text-yellow-600 font-bold bg-yellow-100 rounded-sm" >Edit</button>
           <button data-action="delete" class="hover:underline cursor-pointer text-red-600 font-bold bg-pink-100 rounded-sm" >Delete</button>
         </div>
  `
  todoList.append(li);//ul->li
}

  //event delegation
  todoList.addEventListener('click',(e)=>{
    e.stopPropagation();
    const li = e.target.closest('li');
    const id = li.dataset.id;
    let action = e.target.dataset.action//target dlete ko find kr rha so that jab delete pe click kru tabhi dlete ho
    if(action==="delete"){
     deleteTodo(id);
    }
    if(action==="edit"){
      editTodo(id);
     
    }
    
    if(action==="toggle"){
      todos = todos.map((todo)=>{
        if(todo.id===Number(id)){
          return{
            ...todo,
            isCompleted:!todo.isCompleted
          }
        }
        return todo;
      })
      localStorage.setItem("todos",JSON.stringify(todos));
      renderTodo();
    }
   })
    function deleteTodo(id){
      todos=todos.filter((todo)=>{
      if(todo.id!== Number(id)){
        return todo;//jo match ho jayega vo return nhi hoga means dlete ho jayega ab ese render kra do jo return hua hae
      }
    })
    localStorage.setItem("todos",JSON.stringify(todos));
    renderTodo();
    }
    
    function editTodo(id) {
      EditTodoId=id;
      let currentTodo = todos.find((todo)=>{
      if(todo.id===Number(id)){
        return todo
      }
     })
     todoInput.value = currentTodo.text; 
     formBtn.textContent = "Update";
     formBtn.className = `bg-orange-500  p-2 rounded text-white`;
     cancelBtn.classList.remove("hidden");
    
    }
    function cancelEdit(){
      EditTodoId = null;
      todoInput.value ="";//cancel btn click kroge input khaali ho jayega
      formBtn.textContent = "Add";//aur update btn change hokr add btn bn jayega
      formBtn.className = `px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors cursor-pointer`;
      cancelBtn.classList.add("hidden");//hidden property add ho jayegi jisse cancelEdit nhi dikhega vo tabhi dikhega jab update krna chahoge 
    }
    cancelBtn.addEventListener("click",()=>{
      cancelEdit();
    });
    
 