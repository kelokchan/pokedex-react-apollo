import gql from 'graphql-tag';
import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Modal, Image, TouchableWithoutFeedback } from 'react-native';
import { Button, Card } from 'react-native-elements';
import ImageViewer from 'react-native-image-zoom-viewer';

const GET_POKEMON = gql`
  query pokemon($pokemonId: String) {
    pokemon(id: $pokemonId) {
      name
      number
      image
      maxCP
      maxHP
      classification
      types
      evolutions {
        id
        name
        number
      }
    }
  }
`;

const PokemonDetailScreen = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { loading, error, data } = useQuery(GET_POKEMON, {
    pollInterval: 500,
    variables: { pokemonId: navigation.getParam('id') },
  });

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

  const { pokemon } = data;
  const { image, number, maxCP, maxHP, classification, types, evolutions } = pokemon;

  return (
    <ScrollView>
      <Card>
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(true)}>
          <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
        </TouchableWithoutFeedback>
        <View>
          <Text style={styles.title}>Number:</Text>
          <Text style={styles.value}>{`#${number}`}</Text>
        </View>
        <View>
          <Text style={styles.title}>Max CP:</Text>
          <Text style={styles.value}>{maxCP}</Text>
        </View>
        <View>
          <Text style={styles.title}>Max HP:</Text>
          <Text style={styles.value}>{maxHP}</Text>
        </View>
        <View>
          <Text style={styles.title}>Classification:</Text>
          <Text style={styles.value}>{classification}</Text>
        </View>
        <View>
          <Text style={styles.title}>Types:</Text>
          {types.map((type, index) => (
            <Text
              key={type}
              style={[styles.value, {
                marginBottom: index === types.length - 1 ? 15 : 5,
              }]}
            >
              {type}
            </Text>
          ))}
        </View>
        {evolutions && (
          <View>
            <Text style={styles.title}>Evolutions:</Text>
            {evolutions.map(({ name, id }) => (
              <Button
                key={id}
                type="clear"
                buttonStyle={styles.button}
                title={name}
                onPress={() => navigation.push('PokemonDetails', {
                  id,
                  name,
                })}
              />
            ))}
          </View>
        )}
      </Card>
      <Modal transparent visible={isModalVisible}>
        <ImageViewer
          enableSwipeDown
          renderIndicator={() => {}}
          onCancel={() => setIsModalVisible(false)}
          imageUrls={[{
            url: image,
          }]}
        />
      </Modal>
    </ScrollView>
  );
};

PokemonDetailScreen.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('name', 'Pokemon Details'),
});

const styles = StyleSheet.create({
  image: {
    marginTop: 10,
    width: null,
    height: 150,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  value: {
    fontSize: 18,
    marginBottom: 15,
  },
  button: {
    alignSelf: 'flex-start',
    padding: 0,
    marginBottom: 5,
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

export default PokemonDetailScreen;
