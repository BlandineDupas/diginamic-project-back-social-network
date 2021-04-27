const { Server } = require('socket.io');
const { Service: UserService } = require('./user/service');
const { Service: PostService } = require('./post/service');
const { Service: CommentService } = require('./comment/service');

const userService = UserService();
const postService = PostService();
const commentService = CommentService();

exports.socket = (server, corsOptions) => {
    const io = new Server(server, {
        cors: {
            ...corsOptions,
            credentials: true,
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.emit('update')
        socket.on('disconnect', () => {
            console.log('user disconnected')
        });
        socket.on('new friend', () => {
            console.log('new friend')
            socket.emit('update')
        });
    })
}
