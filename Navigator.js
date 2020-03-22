import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

//Pages
import HomeScreen from "./pages/Home";
import FavoritesScreen from "./pages/Favorites";


const Tab = createMaterialTopTabNavigator();

export default function Navigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
          initialRouteName="Home"
          activeColor="#FFF"
          inactiveColor="#CCC"
          showIcon="true"
          tabBarPosition="bottom"
          barStyle={{ backgroundColor: '#694fad' }}>
        <Tab.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="fav" color={color} size={26} />
                ),
              }}
        />
        <Tab.Screen name="Favorites" component={FavoritesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}