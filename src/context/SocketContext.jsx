import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [priceUpdates, setPriceUpdates] = useState({});

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      withCredentials: false
    });

    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.warn('⚠️ WebSocket connection error:', error.message);
      setIsConnected(false);
    });

    newSocket.on('price_update', (data) => {
      setPriceUpdates(prev => ({
        ...prev,
        [data.coinId]: {
          change: data.change,
          timestamp: data.timestamp
        }
      }));
    });

    newSocket.on('market_update', (data) => {
      console.log('📊 Market update received:', data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const subscribeToCoin = (coinId) => {
    if (socket && isConnected) {
      socket.emit('subscribe_coin', coinId);
    }
  };

  const unsubscribeFromCoin = (coinId) => {
    if (socket && isConnected) {
      socket.emit('unsubscribe_coin', coinId);
    }
  };

  const value = {
    socket,
    isConnected,
    priceUpdates,
    subscribeToCoin,
    unsubscribeFromCoin
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
