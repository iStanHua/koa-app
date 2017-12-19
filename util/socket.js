module.exports = (socket) => {
    let isLogin = false
    let users = []
    let numUsers = 0
    // when the client emits 'add user', this listens and executes
    socket.on('add:user', function (username) {
        if (isLogin) return

        // we store the username in the socket session for this client
        socket.username = username
        users.push(username)
        ++numUsers
        isLogin = true
        socket.emit('login', {
            numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user:joined', {
            username: users.username,
            numUsers: users.numUsers
        });
    });

    // when the client emits 'send:message', this listens and executes
    socket.on('send:message', function (data) {
        // we tell the client to execute 'send:message'
        socket.broadcast.emit('send:message', {
            username: socket.username,
            message: data
        })
    })

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function () {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop:typing', we broadcast it to others
    socket.on('stop:typing', function () {
        socket.broadcast.emit('stop:typing', {
            username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        if (isLogin) {
            users.splice((numUsers - 1), 0)
            --numUsers
            // echo globally that this client has left
            socket.broadcast.emit('user:logout', {
                username: socket.username,
                numUsers: numUsers
            })
            console.log(users)
        }
    })
}