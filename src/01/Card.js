import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { PiPhoneCallBold } from "react-icons/pi";

export default function Card({ id, name, phone, onClick, level }) {
    return (
        <div
            onClick={onClick}
            className="cursor-pointer max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105"
        >
            <h5 className="text-lg font-semibold mb-2 text-left">{name}</h5>
            <div className="flex items-center text-sm text-gray-700 mb-3">
                <PiPhoneCallBold  className="mr-1 text-blue-500" />&nbsp;&nbsp;
                <p>{phone}</p>
            </div>
            <div className="flex items-center">
                <p className="text-sm font-medium text-gray-600 mr-2">간호등급</p>
                <span className="bg-blue-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
                    {level}
                </span>
            </div>
        </div>
    );
}

Card.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    level: PropTypes.string.isRequired
};