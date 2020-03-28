import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Svg, {G, Path} from 'react-native-svg';

export const DislikeButton = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Svg
        viewBox="0 0 30 30"
        height="25px"
        width="25px"
        xmlns="http://www.w3.org/2000/svg">
        <G fill="red" data-name="Layer 57" id="Layer_57">
          <Path d="M18.83,16l8.59-8.59a2,2,0,0,0-2.83-2.83L16,13.17,7.41,4.59A2,2,0,0,0,4.59,7.41L13.17,16,4.59,24.59a2,2,0,1,0,2.83,2.83L16,18.83l8.59,8.59a2,2,0,0,0,2.83-2.83Z" />
        </G>
      </Svg>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    width: 60,
    height: 60,
    marginHorizontal: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
