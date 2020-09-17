import React from 'react';

class submitButton extends React.Component {
  render()
  {
  return (
    <div className="subButton">
    <button
      className="btn"
      disabled={this.props.disabled}
      onClick={()=>this.props.onClick()}
    >
    {this.props.text}
    </button>
    </div>
  );
  }
}

export default submitButton;
