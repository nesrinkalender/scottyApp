import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Svg, {G, Path} from 'react-native-svg';

export const LikeButton = ({onPress}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Svg version="1.1" viewBox="0 0 512 512" height="30px" width="30px">
        <G>
          <G>
            <Path
              fill="green"
              d="M133.815,443.378V241.587c0-2.507,0.632-4.962,1.897-7.148l4.141-7.268H33.193c-7.938,0-14.379,6.46-14.379,14.416    v201.791c0,7.953,6.44,14.412,14.379,14.412h114.993C140.255,457.79,133.815,451.331,133.815,443.378z"
            />
            <Path
              fill="green"
              d="M435.682,198.344H320.684v-86.483c0-31.798-25.787-57.651-57.494-57.651h-43.133c-7.93,0-14.368,6.456-14.368,14.408    v68.237l-51.463,90.315l-4.142,7.268c-1.265,2.186-1.897,4.642-1.897,7.148v201.791c0,7.953,6.44,14.412,14.372,14.412h14.38    h216.339c22.715,0,43.355-13.46,52.527-34.245l46.111-104.04c0.838-1.841,1.27-3.834,1.27-5.849V256    C493.186,224.199,467.395,198.344,435.682,198.344z"
            />
          </G>
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
