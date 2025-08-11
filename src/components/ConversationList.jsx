import React from 'react';
import '../styles/ConversationList.scss';

const ConversationList = ({ conversations, onSelect }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    console.log("ConversationList Props:", {
        conversations,
        onSelect
    });

    const truncateMessage = (message, length = 50) => {
        return message.length > length ? message.substring(0, length) + '...' : message;
    };

    // Ensure conversations is an array
    const conversationArray = Array.isArray(conversations) ? conversations : (conversations?.conversations || []);

    console.log("Processed conversations array:", conversationArray);

    return (
        <div className="conversation-list">
            {conversationArray.length === 0 ? (
                <div className="no-conversations">
                    No previous conversations found
                </div>
            ) : (
                conversationArray.map((conversation) => (
                    <div
                        key={conversation.conversation_id}
                        className="conversation-item"
                        onClick={() => onSelect(conversation.conversation_id)}
                    >
                        <div className="conversation-header">
                            <span className="conversation-date">
                                {formatDate(conversation.created_at)}
                            </span>
                            <span className={`conversation-status ${conversation.status}`}>
                                {conversation.status}
                            </span>
                        </div>
                        {conversation.preview && (
                            <div className="conversation-preview">
                                {truncateMessage(conversation.preview)}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default ConversationList;