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
        socket.on('disconnect', () => {
            console.log('user disconnected')
        });
        socket.on('new message', () => {
            console.log('new message')
        });
        socket.on('new comment', () => {
            console.log('new comment')
        });
        socket.on('new message', () => {
            console.log('new message')
        });
        socket.on('new message', () => {
            console.log('new message')
        });
    })
}
