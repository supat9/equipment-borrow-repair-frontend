'use client';
import { Switch } from '@headlessui/react';

export default function ActiveSwitch({ checked, onChange, label = 'สถานะการใช้งาน', activeText = 'เปิด', inactiveText = 'ปิด' }) {
    const handleChange = (isChecked) => {
        onChange(isChecked ? 1 : 0);
    }
    return (
        <div className="flex items-center gap-x-4">
            <Switch
                checked={checked}
                onChange={handleChange}
                className={`cursor-pointer ${checked
                    ? 'bg-[#1bc866] shadow-lg'
                    : 'bg-gray-300 hover:bg-gray-400'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out `}
            >
                <span className="sr-only">{label}</span>
                <span
                    className={`${checked ? 'translate-x-6' : 'translate-x-1'
                        } inline-block size-4 transform bg-white rounded-full shadow-sm transition-all duration-300 ease-in-out '
                        }`}
                />
            </Switch>
            <div className='w-[30px] text-end'>
                <span className={`text-base font-medium transition-colors duration-300 ${checked
                        ? 'text-emerald-600'
                        : 'text-gray-600'
                    }`}>
                    {checked ? activeText : inactiveText}
                </span>
            </div>
        </div>
    );
}