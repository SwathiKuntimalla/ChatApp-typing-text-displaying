const socket = io();

const messageContainer = document.getElementById('message-container');
const clientsTotal = document.getElementById("clients-total");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");



messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage()
})

// function for submmit button
function sendMessage() {
    //    if input is empty should return means msg wont send
    if (messageInput.value === " ") return
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    }
    socket.emit('message', data);
    // while sending the msg we have to the function
    addMessageToUI(true, data);
    messageInput.value = ' ';
}

socket.on('chat-message', (data) => {
    // calling when ever we are reciving the msgs
    addMessageToUI(false, data);
})

// showing elements in UI
function addMessageToUI(isOwnMessage, data) {
    clearFeedBack();
    const element = `
    <li class= "${isOwnMessage ? 'message-right' : 'message-left'}"  >
    <p class="message">
      ${data.message}
      <span>${data.name}  ● ${moment(data.dateTime).fromNow()}</span>
    </p>
  </li>`
    messageContainer.innerHTML += element;
    //   calling scrolling function
    scrollToBottom();
}

// automatic scrolling down

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

// shpwing the clients  connected to this server
socket.on('clients-total', (data) => {
    // console.log(data);
    // updating clients  count in real time
    clientsTotal.innerHTML = `Total clinets: ${data}`

});

// focus showing who is typing
messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: ` ${nameInput.value} is Typing...`
    })
})

messageInput.addEventListener('keypress', (e) => {
    const message =  messageInput.value.trim();
    socket.emit('feedback', {
        feedback: ` ${nameInput.value} is Typing: ${message}`
    })
})


socket.on('feedback', (data) => {

    clearFeedBack();
    const element =
        ` <li class="message-feedback">
        <p class="feedback" id="feedback">
          ${data.feedback}
        </p>
    </li>`
    messageContainer.innerHTML += element;
})

// clear 

function clearFeedBack() {
    document.querySelectorAll(`li.message-feedback`).forEach(element => {
        element.parentNode.removeChild(element);
    })
}



