import React, { useState, useRef, useEffect } from 'react';

const ColorPicker = ({ color, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentColor, setCurrentColor] = useState(color);
    const pickerRef = useRef(null);

    const presetColors = [
        '#000000', '#ffffff', '#dc2626', '#ea580c', '#d97706', '#65a30d',
        '#16a34a', '#0d9488', '#0891b2', '#2563eb', '#4F46E5', '#7c3aed',
        '#9333ea', '#c026d3', '#e11d48', '#f59e0b', '#10b981', '#06b6d4',
        '#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#84cc16', '#14b8a6'
    ];

    useEffect(() => {
        setCurrentColor(color);
    }, [color]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleColorSelect = (selectedColor) => {
        setCurrentColor(selectedColor);
        onChange(selectedColor);
        setIsOpen(false);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setCurrentColor(value);
        onChange(value);
    };

    return (
        <div className="relative" ref={pickerRef}>
            <div className="flex items-center space-x-2">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-10 h-10 rounded border border-gray-300 shadow-sm"
                    style={{ backgroundColor: currentColor }}
                    title="Choose color"
                />
                <input
                    type="text"
                    value={currentColor}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#000000"
                />
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="grid grid-cols-6 gap-2 mb-3">
                        {presetColors.map((presetColor) => (
                            <button
                                key={presetColor}
                                type="button"
                                onClick={() => handleColorSelect(presetColor)}
                                className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                                style={{ backgroundColor: presetColor }}
                                title={presetColor}
                            />
                        ))}
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                        Click a color to select
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorPicker;
