import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Image,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {DislikeButton, LikeButton} from './Components';
import {FavoritesContext} from './Providers/FavoritesProvider';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default class Cards extends React.Component {
  static contextType = FavoritesContext;
  constructor(props) {
    super(props);
    const {cards, onEndCard} = props;
    this.position = new Animated.ValueXY();
    this.favorites = new Array();
    this.state = {
      currentIndex: 0,
    };

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-30deg', '0deg', '10deg'],
      extrapolate: 'clamp',
    });

    this.rotateAndTranslate = {
      transform: [
        {
          rotate: this.rotate,
        },
        ...this.position.getTranslateTransform(),
      ],
    };

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    });

    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp',
    });

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp',
    });

    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp',
    });

    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({x: gestureState.dx, y: gestureState.dy});
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (this.state.currentIndex >= cards.length - 1) {
          onEndCard(cards[this.state.currentIndex].fullnameId);
        }
        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: {x: SCREEN_WIDTH + 100, y: gestureState.dy},
            useNativeDriver: true,
          }).start(() => {
            this.position.setValue({x: 0, y: 0});
            this._like();
          });
        } else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: {x: -SCREEN_WIDTH - 100, y: gestureState.dy},
            useNativeDriver: true,
          }).start(() => {
            this.setState({currentIndex: this.state.currentIndex + 1}, () => {
              this.position.setValue({x: 0, y: 0});
              this._dislike();
            });
          });
        } else {
          Animated.spring(this.position, {
            toValue: {x: 0, y: 0},
            friction: 14,
            useNativeDriver: true,
          }).start();
        }
      },
    });
  }

  _dislike = () => {
    Animated.spring(this.position, {
      toValue: {x: -SCREEN_WIDTH - 150, y: 0},
      useNativeDriver: true,
    }).start(() => {
      this.setState({currentIndex: this.state.currentIndex + 1}, () => {
        this.position.setValue({x: 0, y: 0});
      });
    });
  };

  _like = () => {
    const {addFavorites} = this.context;
    const {cards} = this.props;

    this.position.setValue({x: 0, y: 0});
    const currentItem = cards[this.state.currentIndex];
    addFavorites(currentItem);

    Animated.spring(this.position, {
      toValue: {x: SCREEN_WIDTH + 100, y: 0},
      useNativeDriver: true,
    }).start(() => {
      this.setState({currentIndex: this.state.currentIndex + 1}, () => {
        this.position.setValue({x: 0, y: 0});
      });
    });
  };

  renderCards = () => {
    const {currentIndex} = this.state;
    const {cards} = this.props;
    return cards
      .map((item, i) => {
        if (item.url.includes('png') || item.url.includes('jpg'))
          var image = item.url;
        else
          var image =
            'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/image-512.png';
        if (i < currentIndex) {
          return null;
        } else if (i == currentIndex) {
          return (
            <Animated.View
              {...this.PanResponder.panHandlers}
              key={item.fullnameId}
              style={[this.rotateAndTranslate, styles.box]}>
              <Animated.View
                style={{
                  opacity: this.likeOpacity,
                  transform: [{rotate: '-30deg'}],
                }}>
                <Text style={styles.likeText}>LIKE</Text>
              </Animated.View>
              <Animated.View
                style={{
                  opacity: this.dislikeOpacity,
                  transform: [{rotate: '30deg'}],
                }}>
                <Text style={styles.dislikeText}>NOPE</Text>
              </Animated.View>
              <View style={styles.view}>
                <Image source={{uri: image}} style={styles.cardImg} />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.score}>Score: {item.score}</Text>
              </View>
            </Animated.View>
          );
        } else {
          return (
            <Animated.View
              {...this.PanResponder.panHandlers}
              key={item.fullnameId}
              style={[
                this.rotateAndTranslate,
                styles.box,
                {
                  opacity: this.nextCardOpacity,
                  transform: [{scale: this.nextCardScale}],
                },
              ]}>
              <View style={styles.view}>
                <Image source={{uri: image}} style={styles.cardImg} />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.score}>Score: {item.score}</Text>
              </View>
            </Animated.View>
          );
        }
      })
      .reverse();
  };

  render() {
    return (
      <View style={styles.view}>
        <View style={styles.cardView}>{this.renderCards()}</View>
        <View style={styles.buttonsView}>
          <DislikeButton onPress={this._dislike} />
          <LikeButton onPress={this._like} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardView: {
    display: 'flex',
    height: '70%',
    alignItems: 'center',
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
  },

  buttonsView: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 50,
    justifyContent: 'space-between',
  },

  box: {
    elevation: 6,
    shadowOffset: {width: 3, height: 3},
    shadowColor: '#ccc',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    width: '100%',
    position: 'absolute',
    backgroundColor: '#FFF',
    height: '100%',
    borderRadius: 5,
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
    position: 'absolute',
    right: 0,
  },

  cardImg: {
    height: 400,
    width: '100%',
    resizeMode: 'contain',
  },

  title: {
    paddingHorizontal: 20,
  },

  score: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});
