import React from 'react';
import { render } from 'react-dom';

import ReactHtml from '../../src';
import fixtures from '../../tests/fixtures';

const Context = React.createContext(0);

class Square extends React.Component {
  state = {
    hover: false
  };

  render() {
    const {
      width = '200px',
      color = '#666',
      hoverColor = 'black',
      background = 'black',
      hoverBackground = 'white',
      text
    } = this.props;

    return (
      <Context.Consumer>
        {value => (
          <div
            onMouseEnter={() => {
              this.setState({ hover: true });
            }}
            onMouseLeave={() => {
              this.setState({ hover: false });
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              border: `5px solid ${background}`,
              width,
              height: width,
              color: this.state.hover ? hoverColor : color,
              background: this.state.hover ? hoverBackground : background
            }}>
            <span>context value: {value}</span>
            <span>text: {text}</span>
          </div>
        )}
      </Context.Consumer>
    );
  }
}

const FakeElement = ({ color = 'red' }) =>
  React.createElement('span', { style: { color } }, 'hello');

class Editor extends React.Component {
  state = {
    html: `<div data-react-component="Square" data-react-props='{ "text": "hello world 1", "width": "150px", "background": "#ffb3ba" }'></div>
<div data-react-component="Square" data-react-props='{ "text": "hello world 2", "width": "150px", "background": "#baffc9" }'></div>
<div data-react-component="Square" data-react-props='{ "text": "hello world 3", "width": "150px", "background": "#bae1ff" }'></div>`
  };

  handleInputChange = event =>
    this.setState({
      [event.target.name]: event.target.value
    });

  render() {
    return (
      <div style={{ display: 'flex' }}>
        <div>
          <ReactHtml
            html={this.state.html}
            componentMap={{ Square }}
            afterFirstRender={() => {
              console.log('rendered html');
            }}
          />
        </div>
        <textarea
          style={{ width: '100%' }}
          name="html"
          onChange={this.handleInputChange}
          value={this.state.html}
        />
      </div>
    );
  }
}

class Demo extends React.Component {
  state = {
    value: 1,
    show: true
  };

  render() {
    return (
      <Context.Provider value={this.state.value}>
        <h1>ReactHtmlConverter Demo</h1>
        {this.state.show && <Editor />}
        <button
          onClick={() =>
            this.setState(prevState => ({ value: prevState.value + 1 }))
          }>
          increment
        </button>

        <button
          onClick={() =>
            this.setState(prevState => ({ show: !prevState.show }))
          }>
          {this.state.show ? 'hide' : 'show'}
        </button>
        {Object.keys(fixtures).map(fixture => {
          const html = fixtures[fixture];
          return (
            <div key={fixture}>
              <h3>{fixture}</h3>
              <pre>{html}</pre>
              <ReactHtml html={html} componentMap={{ FakeElement }} />
            </div>
          );
        })}
      </Context.Provider>
    );
  }
}

render(<Demo />, document.querySelector('#demo'));
