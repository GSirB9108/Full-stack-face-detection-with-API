import React from 'react';
import './facerecognition.css';

export default function FaceRecognition({imageurl, box}) {
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
            <img id='inputimg' alt="" src= {imageurl} width='500px' height='auto'></img>
            <div className='bounding-box' style={{top: box.top_row, right:box.rightCol, left: box.leftCol, bottom: box.bottom_row }}></div>
            </div>
        </div>
    )
}
