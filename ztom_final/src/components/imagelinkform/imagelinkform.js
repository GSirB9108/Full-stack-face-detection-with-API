import React from 'react'
import './imagelinkform.css'

const  imagelinkform=({oninputchange,onbuttonsubmit}) =>{
    return (
        <div>
            <p className='f3'>
                {'face recognition'}
            </p>

            <div className='center'>
                <div className='form center pa4 br3 shadow-5'>
                <input className='f4 pa2 w-70 center' type='text' onChange={oninputchange}/>
                <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-blue' onClick={onbuttonsubmit}>Detect Face</button>
                </div>
            </div>

        </div>
    )
}

export default imagelinkform