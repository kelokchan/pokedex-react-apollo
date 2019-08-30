import React, { Component } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, Text } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_POKEMONS = gql`
  {
    pokemons(first: 151) {
      id
      name
      number
      maxCP
      image
      attacks {
        fast {
          name
        }
      }
    }
  }
`;

class PokemonsScreens extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Pokedex',
  });

  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };
  }

  setSearchQuery = search => this.setState({ search });

  keyExtractor = (item, index) => index.toString();

  getData = pokemons => pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(this.state.search.toLowerCase()));

  renderItem = ({ item: { name, image, id } }) => (
    <ListItem
      title={name}
      leftAvatar={{ source: { uri: image } }}
      onPress={() => {
        this.props.navigation.navigate('PokemonDetails', {
          name,
          id,
        });
      }}
      chevron
      bottomDivider
    />
  );

  render() {
    const { search } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <SearchBar
          placeholder="Search for your pokemon here..."
          onChangeText={this.setSearchQuery}
          value={search}
          lightTheme
        />
        <Query pollInterval={500} query={GET_POKEMONS}>
          {({ loading, error, data, refetch, networkStatus }) => {
            if (loading) {
              return (
                <View style={styles.activity}>
                  <ActivityIndicator size="large" />
                </View>
              );
            }
            if (error) {
              return (
                <View style={styles.activity}>
                  <Text>`Error! ${error.message}`</Text>
                </View>
              );
            }

            return (
              <FlatList
                refreshing={networkStatus === 4}
                onRefresh={refetch}
                keyExtractor={this.keyExtractor}
                data={this.getData(data.pokemons)}
                renderItem={this.renderItem}
              />
            );
          }}
        </Query>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PokemonsScreens;
