import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Navigation from './navigation';
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <StatusBar style="auto" />
      <Navigation />
    </ApolloProvider>
  );
}
