import React from 'react'
import { Modal, Button } from 'antd';
import 'antd/dist/antd.css';
import UploadModal from './uploadModal';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      srcPreview: null,
      srcFile: null,
      visible: false,
      confirmLoading: false,
    }
 }
  
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  
  handleOk = async () => {
    await this.child.current.onSubmit()
    this.setState({
      visible: false,
    });
  }
  handleSubmit = function(src){
    this.setState({
        src: src,
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  deletePhoto = () => {
    this.child.current.deletePhoto()
  }

  handleGetImage = (file, base64) => {
    this.setState({
      srcPreview: base64,
      srcFile: file,
    });
  }

  render() {
    const { visible, confirmLoading } = this.state;
    const footer = [
      <Button key="delete" onClick={this.deletePhoto} style={{float:'left', border:'none'}}>Delete Photo</Button>,
      <Button key="upload" onClick={this.handleCancel}>Cancel</Button>,
      <Button key="submit" type="primary" onClick={this.handleOk}>
        Submit
      </Button>,
    ];

    return (
      <div>
        {!this.state.srcPreview && (<Button type="ghost" onClick={this.showModal} style={{color:'#00A5CF', border:'none'}}>Add Photo</Button>)}
        {this.state.srcPreview && (
        <Button type="ghost" onClick={this.showModal} style={{color:'#00A5CF', width:120, height:66}}>
          <img src={this.state.srcPreview} alt="uploaded" style={{height:'90%',padding:2}}/>
        </Button>)}
        <Modal title="W:H 9:5 Photo"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          width={665}
          footer={footer}
        >
          <div style={{height: 340}}>
            <UploadModal ref={this.child} passingImage={this.handleGetImage}/>
          </div>
        </Modal>
      </div>
    );
  }
}

export default App;
