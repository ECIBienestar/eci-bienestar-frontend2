import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

type Message = {
  title: string;
  content: string;
};

export default function WebSocketClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [client, setClient] = useState<InstanceType<typeof Client> | null>(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.subscribe('/topic/messages', (msg: any) => {
          try {
            const parsed: Message = JSON.parse(msg.body);
            setMessages(prev => [...prev, parsed]);
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        });
      },
      onStompError: (frame: { headers?: { message?: string }; body?: string }) => {
        console.error('Broker reported error: ' + frame.headers?.message);
        console.error('Additional details: ' + frame.body);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  return (
    <div>
      <h1>Notificaciones</h1>
      <div style={{ position: 'fixed', top: 10, right: 10 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              background: '#fefefe',
              border: '1px solid #ccc',
              margin: '5px',
              padding: '10px',
              borderRadius: '5px',
            }}
          >
            <strong>{msg.title}</strong>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
