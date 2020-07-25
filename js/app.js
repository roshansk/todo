// Class Tasks
class Task{

    constructor(taskName,dueDate,dueIn){
        this.taskName = taskName;
        this.dueDate = dueDate;
        this.dueIn = dueIn;
    }
}

// Class UI
class UI{

    static displayTasks(){

        const storedTasks = Storage.getTasks();
        const tasks = storedTasks;

        tasks.forEach( task => {
            const {taskName,dueIn} = task;
            UI.addTaskToList(taskName,dueIn);

        });
    }

    static  addTaskToList(taskName,dueIn){

        const tr = document.createElement('tr');
        const taskTable  = document.getElementById('table-body');

        dueIn === 'Past Due.' ? tr.classList.add('table-danger') : tr.className = ''; 

        tr.innerHTML = `
        <td>${taskName}</td>
        <td>${dueIn}</td>
        <td><a class ="btn close">&times;</a></td>`;

        taskTable.appendChild(tr);

    }

    static showAlert(msg,classname){

        const form = document.querySelector('#task-form');
        const div = document.createElement('div');
        const txtNode = document.createTextNode(msg);
        div.className = `alert alert-${classname}`;

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

    static deleteTask(row){

        const tasks = Storage.getTasks();
        const taskName = row.firstElementChild.innerText;
        const dueIn = row.firstElementChild.nextElementSibling.innerText;
        tasks.forEach((task,index) => {

            if(task.taskName === taskName && task.dueIn === dueIn){
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
            const task = new Task(taskName,dueDate,dueIn);
    
            
            UI.addTaskToList(taskName,dueIn);
            UI.showAlert('Task Added','primary');
            Storage.addTask(task);
            UI.clearFields();
        }
    }
    

} ); 


window.addEventListener('DOMContenLoaded', Storage.refreshTasks()); //Refresh tasks
window.addEventListener('DOMContenLoaded', UI.displayTasks());  //Display tasks



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

            return `${Math.round(dueInMins)} Mins`;
        }
        else{

            dueInMins = (dueInHours - Math.floor(dueInHours))/60;
            if(Math.round(dueInMins)===60){
                return `${Math.round(dueInHours)} Hours`;
            }
            else{
                return `${Math.floor(dueInHours)} Hours ${Math.round(dueInMins)} Mins`;
            }
            
        }
         
    }
    else{
        dueInHours = (dueInDays - Math.floor(dueInDays))*24; 
        if(Math.round(dueInHours) === 24){
            return `${Math.round(dueInDays)} Days`;
        }
        else{
            return `${Math.floor(dueInDays)} Days ${Math.round(dueInHours)} Hours`;
        }
    }

       
}

document.querySelector('#table-body').addEventListener('click', (e) => {  //Remove Task

    let el = e.target;
    
    if(el.classList.contains('close')){
        let row = el.parentElement.parentElement;
        Storage.deleteTask(row);
        row.remove();
        UI.showAlert('Task Removed','info');
    }

});

