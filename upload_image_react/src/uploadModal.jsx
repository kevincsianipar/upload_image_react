import React from 'react'
import ReactCrop, { makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Button, Icon, message, Row, Col } from 'antd';
import ZoomSlider from './zoomSlider';

import './index.css'

function beforeUpload(file) {
    console.log(file);
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isLt2M) {
      message.error('Image must smaller than 4MB!');
    }
    return isJPG && isLt2M;
  }

class UploadModal extends React.Component {
  state = {
    loading: false,
    src: null,
    crop: {
      x: 0,
      y: 0,
      width: 90,
      height: 90,
      aspect: 9/5
    },
  }

  onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0 && beforeUpload(e.target.files[0])) {
      const reader = new FileReader()
      reader.addEventListener(
        'load',
        () =>
          this.setState({
            src: reader.result,
          }),
        false
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }

  onImageLoaded = image => {
    console.log('onCropComplete', image)
  }

  onCropComplete = crop => {
    console.log('onCropComplete', crop)
  }

  onCropChange = crop => {
    this.setState({ crop })
  }

  render() {
    return (
      <div className="UploadModal" type="flex" justify="center" flexDirection="column">
        <Row type="flex" justify="center" align="middle" style={{height:308, backgroundColor:'#7C7C7C', margin: -24}}>
            {this.state.src && (
                <ReactCrop
                    src={this.state.src}
                    crop={this.state.crop}
                    onImageLoaded={this.onImageLoaded}
                    onComplete={this.onCropComplete}
                    onCropChange={this.onCropChange}
                />
            )}
            
            {!this.state.src && (
                <Col span={14} style={{height:308, backgroundColor:'white'}}>
                    <Row type="flex" justify="center" align="middle">
                    <label class="custom-file-upload" style={{cursor: 'pointer'}}>
                        <input type="file" onChange={this.onSelectFile} style={{display:'none'}}/>
                        <Icon type= "camera" /> 
                        <p> Upload Photo </p>
                    </label>
                    </Row>
                </Col>
            )
            }
        </Row>
        <Row type="flex" justify="space-around" align="bottom" style={{marginTop:28}}>
            <Col span={10}>
                <label style={{marginLeft:6}}> Zoom </label>
                <ZoomSlider />
            </Col>
            <Col span={1}>
            </Col>
            <Col span={10}>
                <label style={{marginLeft:6}}> Straighten </label>
                <ZoomSlider />
            </Col>
            <Col span={2}>
            </Col>
            <Col span={1}>
                <Icon type="enter" />
            </Col>
        </Row>
      </div>

    )
  }
}

export default UploadModal;