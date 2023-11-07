
import React from 'react';
import { createRoot } from 'react-dom/client';

import AuthPage from './App'
import 'styles/main.css'
import 'bootstrap/dist/css/bootstrap.css'

import eruda from 'eruda'
eruda.init()

// render
const root = createRoot(document.getElementById('root'));
root.render(<AuthPage/>);