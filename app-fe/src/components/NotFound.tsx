import { Link } from "@tanstack/react-router";
import { type PropsWithChildren } from "react";

export const NotFound = ({ children }: PropsWithChildren) => {
  return (
    <div className='h-full flex items-center justify-center p-4'>
      <div className='max-w-md w-full text-center space-y-6'>
        {/* 404 Large Text */}
        <h1 className='text-9xl font-extrabold text-gray-700 dark:text-gray-300 animate-bounce'>
          404
        </h1>

        {/* Error Message */}
        <div className='space-y-2'>
          <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-200'>
            Oops! Page Not Found
          </h2>
          <div className='text-gray-600 dark:text-gray-400'>
            {children || (
              <p>
                The page you are looking for might have been removed, had its name changed, or is
                temporarily unavailable.
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center justify-center gap-4 pt-4'>
          <button
            onClick={() => window.history.back()}
            className='bg-emerald-500 hover:bg-emerald-600 transition-colors text-white px-4 py-2 rounded-lg uppercase font-bold text-sm flex items-center gap-2'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
                clipRule='evenodd'
              />
            </svg>
            Go Back
          </button>
          <Link
            to='/'
            className='bg-cyan-600 hover:bg-cyan-700 transition-colors text-white px-4 py-2 rounded-lg uppercase font-bold text-sm flex items-center gap-2'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
            </svg>
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};
