import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Cards from './Cards';
import {useQuery} from 'react-apollo';
import {hostListQuery} from './Queries';
import {ActivityIndicator} from 'react-native-paper';

function HomeScreen() {
  const [lastId, setLastId] = useState('');
  const {
    data: {reddit: {subreddit: {hotListings = []} = {}} = {}} = {},
    loading,
    error,
  } = useQuery(hostListQuery, {
    variables: {
      name: 'aww',
      after: lastId,
    },
  });

  const onEndCard = id => {
    setLastId(id);
  };

  console.log('hotListings', hotListings);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Cards cards={hotListings} onEndCard={onEndCard} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default HomeScreen;
