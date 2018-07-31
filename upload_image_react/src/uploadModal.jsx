import React, {Component} from 'react'
import ReactCrop, { makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Icon, message, Row, Col, Button } from 'antd';
import ZoomSlider from './zoomSlider';
import {extractImageFileExtensionFromBase64, base64StringtoFile} from './util';

import './index.css'

function beforeUpload(file) {
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

function getCroppedImg(canvasRef, image64, pixelCrop) {
    const canvas = canvasRef//document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = image64;
    image.onload = function() {
        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
          );
    }
}

class UploadModal extends Component {
    constructor(props) {
        super(props);
        this.imagePreviewCanvasRef = React.createRef();
        this.state = {
            preview: false,
            loading: false,
            src: null,
            crop: {
            x: 10,
            y: 10,
            width: 80,
            aspect: 9/5,
            },
        }
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
    this.setState({
        crop: makeAspectCrop({
          x: 10,
          y: 10,
          aspect: 9/5,
          width: 80,
        }, image.width / image.height),
      });
  }

  onCropComplete = (crop, pixelCrop) => {
    const canvasRef = this.imagePreviewCanvasRef.current;
    const imgSrc = this.state.src;
    getCroppedImg(canvasRef, imgSrc, pixelCrop);
  }

  onPreview = (event) => {
    event.preventDefault();
    this.setState({ preview : true })
  }

  onSubmit() {
    const canvasRef = this.imagePreviewCanvasRef.current;
    const imgSrc = this.state.src;
    const fileExt = extractImageFileExtensionFromBase64(imgSrc);
    const imgData = canvasRef.toDataURL('image/' + fileExt);
    const newFileName = "preview." + fileExt;
    const newCroppedFile = base64StringtoFile(imgData, newFileName);
    this.props.passingImage(newCroppedFile,imgData);
    console.log(newCroppedFile,imgData);
    this.setState({ imgSrc : newCroppedFile, preview : true });
  }

  onCropChange = crop => {
    this.setState({ crop })
  }

  deletePhoto() {
    this.setState({ 
      src : null,
      preview : false, 
    })
  }

  render() {
    return (
      <div className="UploadModal">
        <Row type="flex" justify="center" align="middle" style={{height:308, backgroundColor:'#7C7C7C', margin: -24}}>
            {this.state.src && !this.state.preview &&(
                <ReactCrop
                    src={this.state.src}
                    crop={this.state.crop}
                    onImageLoaded={this.onImageLoaded}
                    onChange={this.onCropChange}
                    onComplete={this.onCropComplete}
                    minHeight={40}
                    minWidth={36}
                    style={{display: this.state.preview === true ? 'none' : 'block'}}
                />
            )}
            {!this.state.src && (
                <Col span={14} style={{height:308, backgroundColor:'white'}}>
                    <Row type="flex" justify="center" align="middle">
                    <label style={{cursor: 'pointer', textAlign: 'center', marginTop: 130}}>
                        <input type="file" onChange={this.onSelectFile} style={{display:'none'}}/>
                        <Icon type= "camera" /> 
                        <p> Upload Photo </p>
                    </label>
                    </Row>
                </Col>
            )
            }
            <canvas ref={this.imagePreviewCanvasRef} style={{height:'100%', display: this.state.preview === false ? 'none' : 'block'}}></canvas>
        </Row>
        <Row type="flex" justify="space-around" align="bottom" style={{marginTop:28}}>
            <Col span={9}>
                <label style={{marginLeft:6}}> Zoom </label>
                <ZoomSlider />
            </Col>
            <Col span={9}>
                <label style={{marginLeft:6}}> Straighten </label>
                <ZoomSlider />
            </Col>
            <Col span={3}>
                <Icon type="enter" />
            </Col>
            <Col span={3}>
              <Button key="preview" onClick={this.onPreview}>Preview</Button>
            </Col>
        </Row>
      </div>
    )
  }
}

export default UploadModal;