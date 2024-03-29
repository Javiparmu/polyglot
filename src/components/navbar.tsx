'use client';

import React from 'react';
import { Logo } from './icons';
import { Button } from './ui/button';
import { UploadIcon } from '@radix-ui/react-icons';

const Navbar = () => {
  const onUploadClick = () => {
    console.log('Upload clicked');
  };

  return (
    <header className="hidden lg:flex h-[60px] items-center justify-between border-b px-6">
      <div className="flex items-center gap-2 font-semibold">
        <Logo className="h-8 w-8 stroke-red-500" />
        <span className="">Translation Checker</span>
      </div>
      <div className="flex items-center gap-8">
        <Button onClick={onUploadClick} variant="outline" className="text-base px-4 gap-2">
          <UploadIcon className="h-4 w-4" />
          Upload
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-500 text-base px-6">Update</Button>
      </div>
    </header>
  );
};

export default Navbar;
