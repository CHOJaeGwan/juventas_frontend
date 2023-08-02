import React, {useCallback, useState, useEffect} from 'react';
import {SafeAreaView, FlatList, StyleSheet, RefreshControl} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MessageStackParamList } from '../navigations/MessageNavigation';
import MessageItem from '../components/MessageItem';
import axios from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
type MessageScreenProps = NativeStackScreenProps<MessageStackParamList, 'Message'>;

type RoomProps = {
  incr: number;
  user_name: string;
  message: string;
  timestamp: string;
  not_read: number;
  profile_img: string;
};

function Message({navigation}:MessageScreenProps) {
  const userID = useSelector((state: RootState) => state.user.id);
  const [roomlist, setRoomlist] = useState<RoomProps[]>([]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    navigation.addListener('focus', () => {
      const getRoomlist = async () => {
        const response = await axios.get(
          `${Config.API_URL}/message/roomlist?id=${userID}`,
        );
        setRoomlist(response.data.roomlist);
        console.log(response.data.roomlist)
      };
      getRoomlist();
    })
  }, [refreshing, userID]);

  return (
    <SafeAreaView style={styles.entire}>
      <FlatList
        data={roomlist}
        renderItem={({item}) => <MessageItem item={item} />}
        keyExtractor={Item => String(Item.incr)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}
export default Message;

const styles = StyleSheet.create({
  entire: {
    backgroundColor: 'white',
    flex: 1,
  },
});
