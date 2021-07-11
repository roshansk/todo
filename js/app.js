// Class Tasks
class Task{

    constructor(id,taskName,dueDate,dueIn){
        this.id = id;
        this.taskName = taskName;
        this.dueDate = dueDate;
        this.dueIn = dueIn;
    }
}

// Class UI
class UI{

    static displayTasks(){
        const container  = document.getElementById('todo-list');
        container.innerHTML ="";
        const storedTasks = Storage.getTasks();
        const tasks = storedTasks;

        tasks.forEach( task => {
            UI.addTaskToList(task);

        });
    }

    static  addTaskToList(task){

        const {id,taskName,dueIn} = task;
        const tasksContainer = document.createElement('div');
        tasksContainer.id = id;
        const container  = document.getElementById('todo-list');
        tasksContainer.className = "task-container d-flex py-2 px-3 justify-content-between border shadow-sm"

        dueIn == 'Past Due.' ? tasksContainer.classList.add('past-due') : tasksContainer.classList.add('due');

        tasksContainer.innerHTML = `
        <span class="my-auto task-text">${taskName}</span>
        <span class="my-auto task-due-in">${dueIn}</span>
        <a class="btn my-auto delete-task" onclick="UI.deleteTask(${id})"><i class="fas fa-trash fa-xs"></i></a>`;

       container.appendChild(tasksContainer);

    }

    static showAlert(msg,classname){

        const form = document.querySelector('#task-form');
        const div = document.createElement('div');
        const txtNode = document.createTextNode(msg);
        div.className = `alert my-2 alert-sm alert-${classname}`;

        div.appendChild(txtNode);
        form.appendChild(div);

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 1500);

        
    }


    static clearFields(){
        const form = document.querySelector('#task-form');
        form.reset();
    }

    static getTime(){

        const now = new Date();
        const timeContainer = document.querySelector('span#time');
        let min = now.getMinutes()
        let hour = Math.floor(now.getHours()) > 12 ? Math.floor(now.getHours()-12) : Math.floor(now.getHours());
        let midday;
        const timeSpan = document.createElement('span');
        timeSpan.className = "fs-2 ms-1";
        const middaySpan = document.createElement('span');
        middaySpan.className = "fs-6";
        now.getHours() > 11 ? midday = "PM" : midday = "AM";
        middaySpan.innerHTML = midday;
        timeSpan.innerHTML = `${hour < 10 ? "0"+hour : hour}:${min < 10 ? "0"+min : min }`
        timeSpan.append(middaySpan);
        timeContainer.innerHTML ="";
        timeContainer.appendChild(timeSpan);        
    }

    static getDate(){
        const now = new Date();
        const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        const months = ["January","February","March","April","May","June","July","September","October","November","December"];
        const dayContainer = document.querySelector('span#day');
        const dateContainer = document.querySelector('p#date');
        let day = days[now.getDay()];
        let date = now.getDate();
        let month = months[now.getMonth()];
        let year =  now.getFullYear();
        let dateSuffix = this.getNumberSuffix(now.getDate());
        const daySpan = document.createElement('span');
        daySpan.className = "fs-3";
        daySpan.innerHTML = day;
        dayContainer.appendChild(daySpan);
        dateContainer.innerHTML = `${date}${dateSuffix} ${month} ${year}`;

        if(now.getHours() >= 5 && now.getHours() <= 16 ){
            document.querySelector('.date-time').classList.add(['day']);    
        }
        else{
            const night = ['night','text-light']
            document.querySelector('.date-time').classList.add(...night);

        }
    }

    static getNumberSuffix(number){
        const tempString = number.toString();
        const nthChar = tempString[tempString.length-1];
        if(nthChar == "1"){
            return "st";
        }
        else if(nthChar == "2"){
            return "nd";
        }
        else if(nthChar == "3"){
            return "rd"
        }
        else{
            return "th";
        }
    }

    static toggleForm(){
        const todoForm = document.querySelector('.todo-form');
        const icon = document.querySelector('#toggle-form-icon') 
        if(todoForm.style.display == 'block'){
            todoForm.classList.replace('show','hide');
            todoForm.style.display = '';
            icon.classList.replace('fa-times','fa-pen');
        }    
        else{
            todoForm.classList.replace('hide','show');
            todoForm.style.display = 'block';
            icon.classList.replace('fa-pen','fa-times');
        }
    
    }

    static deleteTask(id){
        document.getElementById(id).remove();
        Storage.deleteTask(id);
    }

}


//Class Storage

class Storage{

    static getTasks(){
        
        let tasks = JSON.parse(localStorage.getItem('tasks')); 

        if(tasks){
            
        }
        else{
            tasks = [];
        }

        return tasks;
    }

    static addTask(task){

        const tasks = Storage.getTasks();
        tasks.push(task);

        localStorage.setItem('tasks',JSON.stringify(tasks));
    }

    static refreshTasks(){

        const tasks  = Storage.getTasks();

        tasks.forEach((task) => {
            const newDueIN = calculateDueIn(new Date(task.dueDate));
            task.dueIn = newDueIN;
        });

        localStorage.setItem('tasks',JSON.stringify(tasks));
    }

    static deleteTask(id){

        const tasks = Storage.getTasks();
        tasks.forEach((task,index) => {

            if(task.id == id){
                tasks.splice(index,1);
            }
        });

        localStorage.setItem('tasks',JSON.stringify(tasks));

    }


}

//Events

document.getElementById('task-form').addEventListener('submit', (e) =>{ //submit task
    e.preventDefault();

    const taskName =  document.querySelector('#task').value;
    const dueDate = new Date(document.querySelector('#due-date').value);
    const cDate = new Date();
    let dateDiff = (dueDate.getTime() - cDate.getTime());

    if(taskName === "" || dueDate.toString() === "Invalid Date"){

        UI.showAlert('Please fill in all fields.','danger');
    }
    else{

        if(dateDiff < 0){
            UI.showAlert('Please select a valid date.','danger');
        }
        else{
            const dueIn =  calculateDueIn(dueDate);
            const id =  Math.floor(Math.random()*1000);
            const task = new Task(id,taskName,dueDate,dueIn);
            
            
            UI.addTaskToList(task);
            UI.showAlert('Task Added','primary');
            Storage.addTask(task);
            UI.clearFields();
        }
    }
    

} ); 


window.addEventListener('DOMContenLoaded', [UI.getDate(),Storage.refreshTasks(),setInterval(UI.displayTasks(),1000),setInterval(UI.getTime(),1000)]); //Refresh tasks  //Display tasks



function calculateDueIn(duedate){ //Calculate DueIn
    
    
    const cDate = new Date();
    let dateDiff = (duedate.getTime() - cDate.getTime());
    let dueInMins = (dateDiff)/(1000*60);
    let dueInHours = (dueInMins)/(60);
    let dueInDays = (dueInHours)/24;
    
    if(dateDiff <= 0){

        return 'Past Due.';
    }
    else if(dueInDays < 1){
        
        if(dueInHours < 1){

            return `${Math.round(dueInMins)} Min`;
        }
        else{

            dueInMins = (dueInHours - Math.floor(dueInHours))*60;
            console.log(dueInMins);
            if(dueInMins > 59){
                return `${Math.round(dueInHours)} Hours`;
            }
            else{
                return `${Math.floor(dueInHours)} Hours ${Math.ceil(dueInMins)} Min`;
            }
            
        }
         
    }
    else{
        dueInHours = (dueInDays - Math.floor(dueInDays))*24; 
        if(Math.round(dueInHours) === 24){
            return `${Math.round(dueInDays)} Days`;
        }
        else{
            return `${Math.floor(dueInDays)} Days`;
        }
    }

       
}

// document.querySelector('').addEventListener('click', (e) => {  //Remove Task

//     let el = e.target;
    
//     if(el.classList.contains('close')){
//         let row = el.parentElement.parentElement;
//         Storage.deleteTask(row);
//         row.remove();
//         UI.showAlert('Task Removed','info');
//     }

// });

