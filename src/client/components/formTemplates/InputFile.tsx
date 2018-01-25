import * as React from 'react';
import styled from 'styled-components';

export namespace InputFile {
  export interface Props {
    text?: string;
    imgSrc?: string;
    id:string;
  }

  export interface State {
      imgSrc: string
  }

export interface Callbacks {
    onChange: (event) => void
    }

    export interface IProps extends Props, Callbacks {

    }
}

export default class InputFile extends React.Component<InputFile.IProps,InputFile.State> {
    constructor(props?: InputFile.IProps, context?: any) {
        super(props, context);
        this.state = {
            imgSrc: ''
        };
        console.log("In InputFile");
    }

    handleChange=(e)=>{
        e.preventDefault();
        this.props.onChange(e);
        let reader = new FileReader();
        let file = e.target.files[0];
    
        reader.onloadend = () => {
          this.setState({
            imgSrc: reader.result
          });
        }

        reader.readAsDataURL(file)
    }

    render() {
        let {imgSrc} = this.state;
        let imgPreview = null;
        if (imgSrc) {
          imgPreview = (<img src={imgSrc} />);
        }
        return (
                <FileContainer className="custom-file">
                    <input className="custom-file-input"
                        id={this.props.id}
                        type="file"
                        onChange={this.handleChange}/>
                    <label className="custom-file-label" htmlFor={this.props.id}>{this.props.text}</label>
                    {imgPreview}  
                </FileContainer>                    
                          
        );
    }
}

const FileContainer = styled.div`
    & img {
        max-width:200px;
    }
`;