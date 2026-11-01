'use client';
import React from 'react';

export default function Footer({ text, text_2 }) {
    return (
        <div id="footer" className='hidden lg:block'>
            <footer className='px-8 py-4.5 border-t border-[#E0E0E0]'>
                <div className='flex items-center gap-x-2 tracking-[.5px] text-[16px] text-[#4E5155]'>
                    <p>{text || `${new Date().getFullYear()} © ภาควิชาเทคโนโลยีสารสนเทศ มหาวิทยาลัยเกษตรศาสตร์`}</p>
                    <p className="">{text_2 || 'พัฒนาโดยนักศึกษาสาขา IT | เวอร์ชั่น 1.0'}</p>
                </div>
            </footer>
        </div>
    )
}
