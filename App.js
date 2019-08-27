import React from 'react';
import { AppRegistry } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import PokemonsScreen from './components/PokemonsScreen';
import PokemonDetailScreen from './components/PokemonDetailScreen';

const MainNavigator = createStackNavigator({
  Pokemons: { screen: PokemonsScreen },
  PokemonDetails: { screen: PokemonDetailScreen },
});

const MyRootComponent = createAppContainer(MainNavigator);

const cache = new InMemoryCache();
const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: 'https://graphql-pokemon.now.sh/graphql',
  }),
});

const App = () => (
  <ApolloProvider client={client}>
    <MyRootComponent />
  </ApolloProvider>
);

AppRegistry.registerComponent('MyApp', () => App);

export default App;
