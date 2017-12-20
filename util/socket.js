
//在线用户
var onlineUsers = {}
//当前在线人数
var onlineCount = 0

module.exports = (socket) => {
    socket.on('add:user', (obj) => {
        //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
        socket.name = obj.id

        //检查在线列表，如果不在里面就加入
        if (!onlineUsers.hasOwnProperty(obj.id)) {
            onlineUsers[obj.id] = obj.name
            //在线人数+1
            ++onlineCount
        }
        socket.emit('login', {
            onlineCount: onlineCount,
            onlineUsers: onlineUsers,
            user: obj
        });
        //向所有客户端广播用户加入
        socket.broadcast.emit('user:joined', {
            username: obj.name
        });
    });

    // when the client emits 'send:message', this listens and executes
    socket.on('send:message', function (data) {
        // we tell the client to execute 'send:message'
        socket.broadcast.emit('send:message', {
            name: socket.name,
            message: data
        })
    })

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function () {
        socket.broadcast.emit('typing', {
            name: socket.name
        });
    });

    // when the client emits 'stop:typing', we broadcast it to others
    socket.on('stop:typing', function () {
        socket.broadcast.emit('stop:typing', {
            name: socket.name
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        //删除
        delete onlineUsers[socket.name]

        --onlineCount
        // echo globally that this client has left
        socket.broadcast.emit('user:logout', {
            name: socket.name
        })
    })
}