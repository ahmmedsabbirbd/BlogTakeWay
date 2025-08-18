import React from 'react';

interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
    return (
        <div className="flex items-center space-x-2">
            <input
                type="color"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
                type="text"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#000000"
            />
        </div>
    );
};

export default ColorPicker;
