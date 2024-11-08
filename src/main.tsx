import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import client from './utils/apolloClient.ts';

import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { store } from './app/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <App />
      </Provider>
    </ApolloProvider>
  </React.StrictMode>
);
