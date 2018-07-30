import { Slider } from 'antd';
import React from 'react'

function onChange(value) {
  console.log('onChange: ', value);
}

function onAfterChange(value) {
  console.log('onAfterChange: ', value);
}

class ZoomSlider extends React.Component{
    render() {
        return (
            <Slider defaultValue={50} onChange={onChange} onAfterChange={onAfterChange} style={{marginTop:5}}/>
        );
    };
}

export default ZoomSlider;

