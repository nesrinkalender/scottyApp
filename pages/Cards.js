import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, Animated, PanResponder, Image} from 'react-native';
import data from "../data.json"
import { TouchableOpacity } from 'react-native-gesture-handler';
const SCREEN_WIDTH = Dimensions.get('window').width;
import Svg, { Path, G } from 'react-native-svg'
import AsyncStorage from '@react-native-community/async-storage';


export default class Cards extends React.Component {
    constructor(props) {
      super(props)
      this.position = new Animated.ValueXY()
      this.favorites = new Array();
      this.state = {
        loading: true,
        endOfCards: false,
        currentIndex: 0,
      }
  
      this.rotate = this.position.x.interpolate({
        inputRange: [-SCREEN_WIDTH /2 , 0, SCREEN_WIDTH /2],
        outputRange: ['-30deg', '0deg', '10deg'],
        extrapolate: 'clamp'
      });
  
      this.rotateAndTranslate = {
        transform: [{
          rotate: this.rotate
        },
        ...this.position.getTranslateTransform()
        ]
      };
  
      this.likeOpacity = this.position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp'
      });
      
      this.dislikeOpacity = this.position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1, 0, 0],
        extrapolate: 'clamp'
      });
  
      this.nextCardOpacity = this.position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1, 0, 1],
        extrapolate: 'clamp'
      });

      this.nextCardScale = this.position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1, 0.8, 1],
        extrapolate: 'clamp'
      });
  
  
  
      this.PanResponder = PanResponder.create({
          onStartShouldSetPanResponder: (evt, gestureState) => true,
          onPanResponderMove: (evt, gestureState) => {
            this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
          },
          onPanResponderRelease: (evt, gestureState) => {
            if (this.state.currentIndex >= data.length - 1) {
                  this.setState({endOfCards: true})
            }
            if (gestureState.dx > 120) {
              Animated.spring(this.position, {
                toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
              }).start(() => {
                this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                  this.position.setValue({ x: 0, y: 0 })
                })
              })
            }
            else if (gestureState.dx < -120) {
              Animated.spring(this.position, {
                toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
              }).start(() => {
                this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                  this.position.setValue({ x: 0, y: 0 })
                })
              })
            }
            else {
              Animated.spring(this.position, {
                toValue: { x: 0, y: 0 },
                friction: 14
              }).start()
            }
          }
        })
    }
    

  
      _dislike = () => {
          Animated.spring(this.position, {
              toValue: { x: -SCREEN_WIDTH - 150, y: 0}
              }).start(() => {
                this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                  this.position.setValue({ x: 0, y: 0 })
                });
          })
  
      }
  
      _like = () => {
          this.position.setValue({ x: 0, y: 0})
          // AsyncStorage.clear();
          AsyncStorage.getItem('favorites')
          .then((favorites) => {
            const c = favorites ? JSON.parse(favorites) : [];
            c.push(data.data.reddit.subreddit.hotListings[this.state.currentIndex]);
            AsyncStorage.setItem('favorites', JSON.stringify(c));
          });

          Animated.spring(this.position, {
              toValue: { x: SCREEN_WIDTH + 100, y: 0}
              }).start(() => {
                this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                  this.position.setValue({ x: 0, y: 0 })
                });
          });
      }

    renderCards = () => {
      if (data) {
        var cards = data.data.reddit.subreddit.hotListings;
        return cards.map((item, i) => {
          if (item.url.includes("png") || item.url.includes("jpg")) 
              var image = item.url;
          else 
              var image = "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/image-512.png"
          if (i < this.state.currentIndex) {
            return null
          }
          else if (i == this.state.currentIndex) {
            return (
              <Animated.View 
                  {...this.PanResponder.panHandlers} key={item.fullnameId} 
                  style={[this.rotateAndTranslate, styles.box]}>
                  <Animated.View style={{ opacity: this.likeOpacity,transform:[{ rotate: '-30deg' }]}}>
                      <Text style={styles.likeText}>LIKE</Text>
                  </Animated.View>
                  <Animated.View style={{ opacity: this.dislikeOpacity, transform:[{ rotate: '30deg' }]}}>
                      <Text style={styles.dislikeText}>NOPE</Text>
                  </Animated.View>
                  <View style={styles.view}>
                      <Image source={{uri:image}} style={styles.cardImg} />
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.score}>Score: {item.score}</Text>
                  </View>
              </Animated.View>
            )
          }else {
              return (
                <Animated.View 
                    {...this.PanResponder.panHandlers}
                    key={item.fullnameId}
                    style={[this.rotateAndTranslate, styles.box, {opacity: this.nextCardOpacity,transform: [{ scale: this.nextCardScale }]}]}>
                  <View style={styles.view}>
                      <Image source={{uri:image}} style={styles.cardImg}  />
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.score}>Score: {item.score}</Text>
                  </View>
                </Animated.View>
              )
          }
        }).reverse()
      }
    }
  



    render() {
      return (
        <View style={styles.view}>
            <View style={styles.cardView}>
                {this.renderCards()}
            </View>
            <View style={styles.buttonsView}>
                <TouchableOpacity style={styles.button} onPress={this._dislike}>
                  <Svg viewBox="0 0 30 30" height="25px" width="25px"  xmlns="http://www.w3.org/2000/svg">
                      <G fill="red" data-name="Layer 57" id="Layer_57">
                          <Path d="M18.83,16l8.59-8.59a2,2,0,0,0-2.83-2.83L16,13.17,7.41,4.59A2,2,0,0,0,4.59,7.41L13.17,16,4.59,24.59a2,2,0,1,0,2.83,2.83L16,18.83l8.59,8.59a2,2,0,0,0,2.83-2.83Z"/>
                      </G>
                  </Svg>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this._like}>
                    <Svg version="1.1" viewBox="0 0 512 512" height="30px" width="30px">
                        <G>
                            <G>
                                <Path fill="green" d="M133.815,443.378V241.587c0-2.507,0.632-4.962,1.897-7.148l4.141-7.268H33.193c-7.938,0-14.379,6.46-14.379,14.416    v201.791c0,7.953,6.44,14.412,14.379,14.412h114.993C140.255,457.79,133.815,451.331,133.815,443.378z"/>
                                <Path fill="green" d="M435.682,198.344H320.684v-86.483c0-31.798-25.787-57.651-57.494-57.651h-43.133c-7.93,0-14.368,6.456-14.368,14.408    v68.237l-51.463,90.315l-4.142,7.268c-1.265,2.186-1.897,4.642-1.897,7.148v201.791c0,7.953,6.44,14.412,14.372,14.412h14.38    h216.339c22.715,0,43.355-13.46,52.527-34.245l46.111-104.04c0.838-1.841,1.27-3.834,1.27-5.849V256    C493.186,224.199,467.395,198.344,435.682,198.344z"/>
                            </G>
                        </G>
                    </Svg>
                </TouchableOpacity>
            </View>
        </View>
      );
    }
  }


const styles = StyleSheet.create({
    view: {
      flex: 1, 
      justifyContent: "center", 
      alignItems: "center"
    },

    cardView: {
      display: "flex", 
      height: "70%",  
      alignItems: "center", 
      width: SCREEN_WIDTH, 
      paddingHorizontal: 20
    },

    buttonsView: {
      display: "flex", 
      flexDirection: "row", 
      paddingHorizontal: 20, 
      marginTop: 50,
      justifyContent: "space-between"
    },

    box: {
        elevation:6,
        shadowOffset: { width: 3, height: 3 },
        shadowColor: "#ccc",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        width:"100%",
        position: 'absolute', 
        backgroundColor: "#FFF", 
        height: "100%",
        borderRadius: 5
    },

    likeText: {
        borderColor: 'green', 
        color: 'green', 
        fontSize: 20, 
        fontWeight: '800', 
        padding: 10,
    },

    dislikeText: {
        borderColor: 'red', 
        color: 'red', 
        fontSize: 20, 
        fontWeight: '800', 
        padding: 10,
        position: "absolute",
        right: 0,
    },

    cardImg: {
      height:400, 
      width: "100%", 
      resizeMode: "contain"
    },

    title: {
      paddingHorizontal:20
    },


    score: {
      fontWeight: "bold", 
      fontSize:20
    }, 

    button: {
      backgroundColor: "#FFF",
      borderRadius: 30,
      width: 60,
      height:60,
      marginHorizontal: 30,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
})