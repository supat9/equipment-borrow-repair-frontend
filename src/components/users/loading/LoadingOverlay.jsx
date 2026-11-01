'use client';
import Spinner from '@/components/users/loading/Spinner';
import { useEffect } from 'react';

export function SubmitLoading({ style = 'fixed inset-0 z-50 bg-[rgba(0,0,0,0.1)]' }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);
    return (
        <div className={`${style} flex justify-center items-center`}>
            <div className="relative w-20 h-20 flex items-center justify-center">
                <Spinner />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
            </div>
        </div>
    )
}

export function DataLoading({ style = 'h-[180px]' }) {
    return (
        <div className={`${style} flex justify-center items-center`}>
            <div className="relative w-20 h-20 flex items-center justify-center">
                <Spinner />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1BC688] to-[#16A085] opacity-20 animate-ping"></div>
            </div>
        </div>
    )
}