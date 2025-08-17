# Socket.IO Integration Guide

This guide explains how to use the Socket.IO integration in your components.

## Background Connection

The Socket.IO connection is managed by the background script. It establishes and maintains the connection to the server. The connection is automatically initialized when the extension starts.

## Implementation Details

- **No Storage Dependency**: The socket connection state is managed entirely through browser messaging, without relying on the extension's storage.
- **Real-time Communication**: Messages are passed between the background script and components using the browser's messaging system.
- **Automatic Status Updates**: Components receive real-time updates about connection status changes.

## Using the Socket in Components

Two hooks are provided for using the Socket.IO connection in your components:

### 1. `useSocket`

This hook provides full access to the Socket.IO connection.

```tsx
import { useSocket } from '@/hooks/useSocket';

function MyComponent() {
  const { 
    isConnected, 
    socketId, 
    emit, 
    on, 
    off, 
    connect, 
    disconnect 
  } = useSocket();

  // Check if connected
  console.log('Connected:', isConnected);
  console.log('Socket ID:', socketId);

  // Send a message to the server
  const handleSendMessage = () => {
    emit('message', { text: 'Hello from component!' });
  };

  // Listen for events
  useEffect(() => {
    // Register event handler
    on('updateData', (data) => {
      console.log('Received data update:', data);
    });

    // Cleanup on unmount
    return () => {
      off('updateData');
    };
  }, [on, off]);

  return (
    <div>
      <div>Connection status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      <button onClick={handleSendMessage}>Send Message</button>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}
```

### 2. `useSocketEvent`

This hook is a simplified version for subscribing to a single event.

```tsx
import { useSocketEvent } from '@/hooks/useSocket';
import { useState } from 'react';

function NotificationComponent() {
  const [notifications, setNotifications] = useState([]);
  
  // The callback will be automatically registered/unregistered
  const isConnected = useSocketEvent('notification', (data) => {
    setNotifications(prev => [...prev, data]);
  });

  return (
    <div>
      <div>Connection status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      <h3>Notifications</h3>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Sending Messages from Any Component

You can use the `emit` function from `useSocket` to send messages to the server:

```tsx
import { useSocket } from '@/hooks/useSocket';

function ChatComponent() {
  const { emit } = useSocket();
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    emit('chat', { message });
    setMessage('');
  };

  return (
    <div>
      <input 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
```

## Advanced Usage: Reconnecting Manually

If you need to manually reconnect the socket:

```tsx
import { useSocket } from '@/hooks/useSocket';

function ConnectionManager() {
  const { isConnected, connect, disconnect } = useSocket();

  return (
    <div>
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      <button onClick={connect} disabled={isConnected}>Connect</button>
      <button onClick={disconnect} disabled={!isConnected}>Disconnect</button>
    </div>
  );
}
```
