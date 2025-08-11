import React, { useState, useRef } from 'react';
import { ChevronDown, Send, History } from 'lucide-react';
import '../styles/Topbar.scss';

const Topbar = React.forwardRef((props, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [showConversations, setShowConversations] = useState(false);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [widgetPosition, setWidgetPosition] = useState('bottom-right');
    const [widgetPlaceholder, setWidgetPlaceholder] = useState('Type your message...');
    const [isInitializingConversation, setIsInitializingConversation] = useState(false);
    const isSendingMessage = useRef(false);
    const initializationPromise = useRef(null);

    const {
        chatwidget: {
            widget_color: color = '#4F46E5',
            widget_logo: widgetLogo = '',
            widget_text: widgetText = '',
            widget_greeting: widgetGreeting = '',
            suggested_questions: suggestedQuestions = [],
            chat_icon: chatIcon,
            bubble_type: bubbleType = 'default',
            rolling_messages: rollingMessages = [
                "👋 Need help?",
                "💬 Chat with us!",
                "🛍️ Find products"
            ],
            default_message: defaultMessage = "Hey, need help? 👋"
        } = {},
        integrations: {
            whatsapp: {
                enabled: whatsappEnabled = false,
                phone_number: whatsappNumber = ''
            } = {},
            telegram: {
                enabled: telegramEnabled = false,
                bot_username: telegramUsername = ''
            } = {}
        } = {},
        colors = {
            primary: '#4F46E5',
            secondary: '#E0E7FF',
            text: '#FFFFFF'
        },
        pluginUrl
    } = window.AiskData || {};

    const defaultIcon = `${pluginUrl}assets/images/icons/message-square.svg`;
    const finalChatIcon = chatIcon || defaultIcon;

    const styles = {
        headerBg: { backgroundColor: color },
        headerText: { color: colors.text },
        suggestedQuestion: {
            backgroundColor: colors.secondary,
            color: color
        },
        primaryButton: {
            backgroundColor: color,
            color: colors.text
        }
    };

  
    return (
        <div className={`support-buddy-widget ${widgetPosition}`}>
        </div>
    );
});

export default Topbar;