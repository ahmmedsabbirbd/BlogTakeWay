import React, { useState, useRef, useEffect } from 'react';
import { Bold, Underline, Link, Unlink } from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder = "Enter text...", className = "" }) => {
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [selectedText, setSelectedText] = useState('');
    const editorRef = useRef(null);
    const selectionRef = useRef(null);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        updateValue();
    };

    const updateValue = () => {
        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            onChange(html);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // Insert a line break instead of a new paragraph
            execCommand('insertHTML', '<br>');
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        execCommand('insertText', text);
    };

    const saveSelection = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            selectionRef.current = selection.getRangeAt(0).cloneRange();
        }
    };

    const restoreSelection = () => {
        if (selectionRef.current) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(selectionRef.current);
        }
    };

    const openLinkModal = () => {
        // Save current selection
        saveSelection();
        
        // Get selected text
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        setSelectedText(selectedText);
        
        // Pre-fill link text with selected text
        if (selectedText) {
            setLinkText(selectedText);
        }
        
        setIsLinkModalOpen(true);
    };

    const insertLink = () => {
        if (!linkUrl.trim()) {
            alert('Please enter a valid URL');
            return;
        }

        // Validate URL format
        let validUrl = linkUrl.trim();
        if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
            validUrl = 'https://' + validUrl;
        }

        try {
            new URL(validUrl);
        } catch (e) {
            alert('Please enter a valid URL');
            return;
        }

        // Restore selection
        restoreSelection();
        
        if (editorRef.current) {
            editorRef.current.focus();
            
            const linkTextToUse = linkText.trim() || selectedText || validUrl;
            const linkHTML = `<a href="${validUrl}" target="_blank" rel="noopener noreferrer">${linkTextToUse}</a>`;
            
            try {
                // If there's selected text, replace it with the link
                if (selectedText) {
                    execCommand('insertHTML', linkHTML);
                } else {
                    // Insert link at cursor position
                    execCommand('insertHTML', linkHTML);
                }
                
                // Debug: Log the inserted HTML
                console.log('Link inserted:', linkHTML);
                console.log('Editor content after insertion:', editorRef.current.innerHTML);
            } catch (error) {
                console.error('Error inserting link:', error);
                alert('Error inserting link. Please try again.');
            }
        }

        setIsLinkModalOpen(false);
        setLinkUrl('');
        setLinkText('');
        setSelectedText('');
        selectionRef.current = null;
    };

    const removeLink = () => {
        execCommand('unlink');
    };

    const handleModalKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            insertLink();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setIsLinkModalOpen(false);
            setLinkUrl('');
            setLinkText('');
            setSelectedText('');
            selectionRef.current = null;
        }
    };

    const getPlainText = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    };

    const getTextWithFormatting = (html) => {
        // Convert HTML to a format that preserves basic formatting
        return html
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n')
            .replace(/<p[^>]*>/gi, '')
            .replace(/<\/div>/gi, '\n')
            .replace(/<div[^>]*>/gi, '')
            .replace(/<[^>]*>/g, '');
    };

    return (
        <div className={`rich-text-editor ${className}`}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border border-gray-300 border-b-0 rounded-t-md bg-gray-50">
                <button
                    type="button"
                    onClick={() => execCommand('bold')}
                    className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                        document.queryCommandState('bold') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                    }`}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </button>
                
                <button
                    type="button"
                    onClick={() => execCommand('underline')}
                    className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                        document.queryCommandState('underline') ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                    }`}
                    title="Underline"
                >
                    <Underline className="w-4 h-4" />
                </button>
                
                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                
                <button
                    type="button"
                    onClick={openLinkModal}
                    className="p-1 rounded hover:bg-gray-200 transition-colors text-gray-600"
                    title="Insert Link"
                >
                    <Link className="w-4 h-4" />
                </button>
                
                <button
                    type="button"
                    onClick={removeLink}
                    className="p-1 rounded hover:bg-gray-200 transition-colors text-gray-600"
                    title="Remove Link"
                >
                    <Unlink className="w-4 h-4" />
                </button>
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                className="min-h-[80px] p-3 border border-gray-300 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onInput={updateValue}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onBlur={updateValue}
                placeholder={placeholder}
                style={{ 
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                }}
            />

            {/* Link Modal */}
            {isLinkModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Insert Link</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL *
                                </label>
                                <input
                                    type="url"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    onKeyDown={handleModalKeyDown}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://example.com"
                                    autoFocus
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Link Text {selectedText && '(pre-filled with selected text)'}
                                </label>
                                <input
                                    type="text"
                                    value={linkText}
                                    onChange={(e) => setLinkText(e.target.value)}
                                    onKeyDown={handleModalKeyDown}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={selectedText || "Link text"}
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLinkModalOpen(false);
                                    setLinkUrl('');
                                    setLinkText('');
                                    setSelectedText('');
                                    selectionRef.current = null;
                                }}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={insertLink}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Insert Link
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RichTextEditor;
