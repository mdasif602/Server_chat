// Node server which will handle socket io connections
// const io = require('socket.io')(8000)
const io = require('socket.io')(process.env.PORT || 8080)

const users = {};

function getIST() {
    const now = new Date();
    const ISTOffset = 5.5 * 60; // IST is UTC+5.5
    const ISTTime = new Date(now.getTime() + ISTOffset);
    return ISTTime;
}

function formatIST(time) {
    return time.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}



io.on('connection', socket =>{
    // If any new user joins, let other users connected to the server know
    socket.on('new-user-joined', user =>{
        // console.log("New user", name)
        users[socket.id] = user;
        const IST = getIST();
        const formattedTime = formatIST(IST);
        socket.broadcast.emit('user-joined', {name: user, time: formattedTime});
    });

    // If someone sends a message to all other people
    socket.on('send', message =>{
        const IST = getIST();
        const formattedTime = formatIST(IST);
        socket.broadcast.emit('receive', {message: message, name: users[socket.id], time: formattedTime})
    });
    
    // If someone leaves the chat let other knows
    socket.on('disconnect', message =>{
        const IST = getIST();
        const formattedTime = formatIST(IST);
        socket.broadcast.emit('leave',{name: users[socket.id], time: formattedTime});
        delete users[socket.id];
    });

})

// io.listen(3000);
