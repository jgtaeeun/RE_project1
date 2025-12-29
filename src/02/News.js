import React from 'react';

export default function News({ title, ID, onClick, isSelected }) {
  return (
    <div
      className={`max-w-xs rounded-lg overflow-hidden shadow-lg transition-transform transform cursor-pointer ${
        isSelected ? 'scale-110 order-first' : 'hover:scale-105'
      }`}
      onClick={onClick}
    >
      <div
        className="p-4 flex flex-col justify-center items-center h-full"
        style={{
          backgroundColor: isSelected ? 'rgb(173, 203, 230)' : 'rgb(206, 228, 242)',
        }}
      >
        <div>
          <div className="font-semibold text-gray-900" style={{ fontSize: '0.9rem' }}>
            {title}
          </div>
        </div>
      </div>
    </div>
  );
}
