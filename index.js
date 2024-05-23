const addBtn = document.querySelector('.add');
const removeBtn = document.querySelector('.remove');
const modal = document.querySelector('.modal');
const priorityColorList = document.querySelectorAll('.priority-color');
let modalPriorityColor = 'red'
let addTaskFlag = false;
let removeTaskFlag = false;
let colors = ['red', 'green', 'blue', 'black'];
let ticketsArray = [];
// console.log(localStorage.getItem('data'));
if(localStorage.getItem('data')) ticketsArray = JSON.parse(localStorage.getItem('data'));
ticketsArray.forEach(ele => {
    createTicket(ele.ticketColor, ele.text, false);
})

// console.log(addBtn);
addBtn.addEventListener('click', (e)=>{
    if(!addTaskFlag) modal.style.display = 'flex';
    else modal.style.display = 'none';
    addTaskFlag = !addTaskFlag;
})

priorityColorList.forEach(ele => {
    ele.addEventListener('click', (e) => {
        priorityColorList.forEach(el => {
            el.classList.remove('active');
        });
        ele.classList.add('active');
        modalPriorityColor = ele.classList[0];
    })
});

modal.addEventListener('keydown',(event) => {
    if(event.key == 'Shift'){
        let data = document.querySelector('textarea').value;
        createTicket(modalPriorityColor, data);
    }
})

function createTicket(ticketColor, text, flag = true){
    let ticketCont = document.createElement('div');
    ticketCont.classList.add('ticket');
    let list = document.querySelectorAll('.ticket');
    ticketCont.innerHTML = ` <div class="ticket-color ${ticketColor}"></div>
                            <div class="ticket-id">${list.length}</div>
                            <div class="task-area">${text}</div>
                            <div class="ticket-lock">
                                <i class="fa-solid fa-lock"></i>
                            </div>`;    
    // let color = document.createElement('div');
    // let id = document.createElement('div');
    // let area = document.createElement('div');

    
    // color.classList.add(`ticket-color`);
    // color.classList.add(`${ticketColor}`);
    // id.classList.add('ticket-id');
    // area.classList.add('task-area');

    
    // id.innerText = list.length;
    // area.innerText = text;

    // ticketCont.appendChild(color);
    // ticketCont.appendChild(id);
    // ticketCont.appendChild(area);
    if(flag){
        let ticketData = {
            ticketColor,
            id: list.length,
            text
        };
        ticketsArray.push(ticketData);
        localStorage.removeItem('data')
        setLocalStorage();
    }
    
    document.querySelector('.main').appendChild(ticketCont);
    modal.style.display = 'none';
    document.querySelector('textarea').value = '';
    ticketCont.addEventListener('click',()=>{
        handleDelete(ticketCont);
    })
    // console.log(ticketCont.children);
    ticketCont.children[0].addEventListener('click',()=>{
        handleColor(ticketCont.children[0]);
    })
    handleLock(ticketCont);
}

function setLocalStorage(){
    localStorage.setItem('data', JSON.stringify(ticketsArray));
}


removeBtn.addEventListener('click',()=>{
    if(!removeTaskFlag) {
        alert('Delete Mode On');
        removeBtn.style.color = 'maroon';
    }
    else{
        alert('Delete Mode Off');
        removeBtn.style.color = '#ffffff';
    }

    removeTaskFlag = !removeTaskFlag;
})

const handleDelete = (ticket) => {
    if(removeTaskFlag){
        ticket.remove();
        ticketsArray.forEach(ele=>{
            if(ele.id == ticket.id) ticketsArray.splice(ticketsArray.indexOf(ele), 1);
        })
        localStorage.removeItem('data');
        setLocalStorage();
    }
}

const handleColor = (ticket) => {
    let color = ticket.classList[1];
    console.log('hello', ticket, color);
    let newIndex = colors.indexOf(color) < colors.length-1 ? colors.indexOf(color)+1 : colors.indexOf(color);
    console.log(newIndex);
    ticket.classList.remove(color);
    ticket.classList.add(colors[newIndex]);
    ticketsArray.forEach(ele=>{
        if(ele.id == ticket.id) ele.ticketColor = colors[newIndex];
    })
    localStorage.removeItem('data');
    setLocalStorage();
}

function handleLock(ticket){
    let lockDiv = ticket.children[3];
    let lockIcon = lockDiv.children[0];
    const taskArea = ticket.querySelector('.task-area');
    lockDiv.addEventListener('click',()=>{
        if(lockIcon.classList.contains('fa-lock')){
            lockIcon.classList.remove('fa-lock');
            lockIcon.classList.add('fa-lock-open');
            taskArea.setAttribute('contenteditable',true);
        }
        else{
            lockIcon.classList.remove('fa-lock-open');
            lockIcon.classList.add('fa-lock');
            taskArea.setAttribute('contenteditable',false);
        }
        ticketsArray.forEach(ele=>{
            if(ele.id == ticket.id) ele.text = taskArea.innerText; 
            console.log(taskArea.innerText);
        })
        localStorage.removeItem('data');
        setLocalStorage();
    })
    
}

//Filter
const filterColors = document.querySelectorAll('.filter');
// console.log(colors);
filterColors.forEach(color => {
    color.addEventListener('dblclick', () => {
        let tickets = document.querySelectorAll('.ticket');
        tickets.forEach(ele => {
            ele.remove();
        });
        
        // let temp = [...ticketsArray];
        // ticketsArray = [];
        // localStorage.removeItem('data');
        ticketsArray.forEach(ele=> {
            createTicket(ele.ticketColor, ele.text, false);
        });
    });
    color.addEventListener('click', (e) => {
        
        let tickets = document.querySelectorAll('.ticket');
        const selectedColor = color.classList[0];
        console.log(selectedColor);
        let filteredTickets = ticketsArray.filter(x => {
            return x.ticketColor == selectedColor;
        })
        tickets.forEach(ele => {
            ele.remove();
        });
        filteredTickets.forEach(ele => {
            createTicket(ele.ticketColor, ele.text, false);
        })
    });
})