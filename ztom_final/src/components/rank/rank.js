import React from 'react'

export default function rank({name, entries}) {
    return (
        <div>
            <div className='black f3'>
                {`${name}, your current entry count is`}
            </div>

            <div className='black f1'>
                {entries}
            </div>
        </div>
    )
}
