import React from 'react';
import ReactDOM from 'react-dom';
import StyledComponents from 'styled-components';
import * as ui from 'ui';

const global = window as any;

global.React = React;
global.ReactDOM = ReactDOM;
global.StyledComponents = StyledComponents;
global.ui = ui;
