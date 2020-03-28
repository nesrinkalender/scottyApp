import React, {useEffect, useState, useContext} from 'react';
import {Text, View, ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {FavoritesContext} from './Providers/FavoritesProvider';

function FavoritesScreen({navigation}) {
  const {favorites} = useContext(FavoritesContext);
  console.log('FavoritesContext', favorites);

  return (
    <SafeAreaView>
      <Text style={styles.title}>Favorites</Text>
      <ScrollView contentContainerStyle={styles.container}>
        {favorites.length > 0 ? (
          <View>
            {favorites.map((item, index) => {
              const {title, score} = item || {};
              return (
                <View style={styles.line} key={index}>
                  <Text style={styles.text}>{title}</Text>
                  <Text style={([styles.text], {fontWeight: 'bold'})}>
                    Score: {score}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : (
          <Text>Your list is empty!</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    paddingHorizontal: 30,
    paddingBottom: 100,
  },

  title: {
    fontSize: 25,
    padding: 30,
  },

  img: {
    width: 100,
    height: 100,
  },

  line: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  text: {
    fontSize: 18,
  },
});
