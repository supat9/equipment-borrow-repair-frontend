'use client';
import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import th from 'date-fns/locale/th';
import { GoCalendar } from "react-icons/go";
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('th', th);

export default function DatePickerInput({
    value,
    onChange,
    placeholderText = 'เลือกวันที่',
    dateFormat = "MM/dd/yyyy",
    minDate,
    maxDate,
    disabled = false,
    inputClassName = 'text-[#4E5155] text-sm md:text-base w-full focus:outline-none',
    containerClassName = 'flex items-center justify-between border border-[#D1D5DB] group rounded-[5px] py-2.5 px-4 duration-300 focus-within:border-[#1BC688] focus-within:ring-1 focus-within:ring-[#1BC688]',
}) {
    return (
        <div className={containerClassName}>
            <DatePicker
                selected={value}
                onChange={onChange}
                locale="th"
                dateFormat={dateFormat}
                placeholderText={placeholderText}
                className={inputClassName}
                minDate={minDate}
                maxDate={maxDate}
                disabled={disabled}
                popperPlacement="bottom-start"
                portalId="datepicker-portal"
                popperClassName="!z-[10001]"
            />
            <GoCalendar className='flex-shrink-0 text-gray-500 group-focus-within:text-[#1BC688] duration-300' size={20} />
        </div>
    );
}