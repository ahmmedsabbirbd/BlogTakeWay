// src/components/ChatMessage.jsx
import React from 'react';
import OrderStatus from './OrderStatus';
import '../styles/ChatMessage.scss';
import formatMessageTimestamp from './utils/formatMessageTimestamp';

const ChatMessage = ({ message }) => {
    const { type, content, order } = message || {};

    return (
        <div className={`chat-message ${type}-message`}>
            <div className="message-avatar">
                {type === 'bot' ? (
                    <div className="bot-avatar">
                        <svg
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                            />
                        </svg>
                    </div>
                ) : (
                    <div className="user-avatar">
                        <svg
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </div>
                )}
            </div>

            <div className="message-content">
                <div className="message-text">
                    {typeof content === 'string' && <p>{content}</p>}
                    {order?.order_info && (
                        <OrderStatus order={order.order_info} />
                    )}
                </div>
                <div className="message-timestamp">{formatMessageTimestamp(message.timestamp)}</div>
            </div>
        </div>
    );
};

export default ChatMessage;