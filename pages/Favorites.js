import React, {useEffect, useState} from 'react';
import { Text, View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


function FavoritesScreen({navigation}) {
  const [list, setList] = useState('');

  useEffect(() => {
    navigation.addListener('focus', () => {
      AsyncStorage.getItem("favorites").then((value) => {
        setList(JSON.parse(value));
      });
    });

  },[])

  return (
    <SafeAreaView>
        <Text style={styles.title}>Favorites</Text>
        <ScrollView contentContainerStyle={styles.container}>
          {list 
            ? 
              <View>
                  {list.map((item, index) => (
                      <View style={styles.line} key={index}>
                          <Text style={styles.text}>{item.title}</Text>
                          <Text style={[styles.text], {fontWeight:"bold"}}>Score: {item.score}</Text>
                      </View>
                  ))}
              </View>

            : <Text>Your list is empty!</Text>
          
          }

        </ScrollView>
    </SafeAreaView>
  );
}

export default FavoritesScreen;

const styles = StyleSheet.create({
    container: {
      display: "flex",
      paddingHorizontal: 30,
      paddingBottom: 100
    },

    title: {
        fontSize: 25,
        padding: 30
    },

    img: {
      width: 100, 
      height: 100
    },

    line: {
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },

    text: {
      fontSize:18
    }
})