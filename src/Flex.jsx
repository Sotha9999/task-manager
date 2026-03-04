import React from 'react'

function Flex() {
  return (
    <>
      <div className='bg-amber-400 flex justify-center gap-2 max-md:flex-wrap'>
        <div className='w-[300px] bg-blue-200 w-50 p-2'>
            <div className=''>
                <img className='w-full h-full object-cover' src="https://shorturl.at/7RaPc
" alt="" />
            </div>
            <p>Grape</p>
        </div>
        <div className='w-[300px] bg-blue-200 w-50 p-2'>
            <div className=''>
                <img className='w-full h-full object-cover' src="https://shorturl.at/7RaPc
" alt="" />
            </div>
            <p>Grape</p>
        </div>
        <div className='w-[300px] bg-blue-200 w-50 p-2'>
            <div className=''>
                <img className='w-full h-full object-cover' src="https://shorturl.at/7RaPc
" alt="" />
            </div>
            <p>Grape</p>
        </div>
      </div>
      
    </>
  )
}

export default Flex
