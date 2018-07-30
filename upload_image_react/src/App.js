import React from 'react'
import { Modal, Button } from 'antd';
import 'antd/dist/antd.css';
import UploadModal from './uploadModal';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      src: null,
      visible: false,
      confirmLoading: false,
    }
 }
  
  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = () => {
    this.setState({
      src: 'hai',
      visible: false,
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  deletePhoto = () => {
    this.child.current.deletePhoto()
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
        {!this.state.src && (<Button type="ghost" onClick={this.showModal} style={{color:'#00A5CF', border:'none'}}>Add Photo</Button>)}
        {this.state.src && (
        <Button type="ghost" onClick={this.showModal} style={{color:'#00A5CF', width:120, height:66}}>
          <img src={this.state.src} alt="uploaded"/>
        </Button>)}
        <Modal title="W:H 9:5 Photo"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          width={665}
          footer={footer}
        >
          <div style={{height: 340}}>
            <UploadModal ref={this.child}/>
          </div>
        </Modal>
      </div>
    );
  }
}

export default App;
