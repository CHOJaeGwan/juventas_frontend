import React, {useCallback, useState, useRef, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Pressable,
  StyleSheet,
  TextInput,
  Text,
  FlatList,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import Config from 'react-native-config';
import SearchPostItem from '../components/SearchPostItem';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MypageStackParamList} from '../navigations/MypageNavigation';
import {useSelector} from 'react-redux';
import {RootState} from '../store';

type SearchMyPostScreenProps = NativeStackScreenProps<
  MypageStackParamList,
  'SearchMyPost'
>;

function SearchMyPost({navigation}: SearchMyPostScreenProps) {
  const [DATA, setDATA] = useState();

  const toMyKnowhow = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  const SearchRef = useRef<TextInput | null>(null);
  const [keyword, setKeyword] = useState('');

  const searchKeyword = useRef<string>('');
  const userID = useSelector((state: RootState) => state.user.id);

  useFocusEffect(
    useCallback(() => {
      SearchRef.current?.focus();
    }, []),
  );

  useEffect(() => {
    navigation.addListener('focus', () => {
      onSubmit();
    })
  }, [keyword]);

  const onChangeSearch = useCallback((text: string) => {
    setKeyword(text);
  }, []);

  const onSubmit = useCallback(async () => {
    const response = await axios.get(
      `${Config.API_URL}/mypage/search?keyword=${keyword}&id=${userID}`,
    );
    setDATA(response.data.post);
    searchKeyword.current = keyword;
  }, [keyword]);

  return (
    <SafeAreaView style={styles.entire}>
      <View style={styles.headerSearchingArea}>
        <View style={styles.headerSearch}>
          <FontAwesomeIcon
            name="search"
            size={22}
            color="#DAE2D8"
            style={styles.headerSearchIcon}
          />
          <TextInput
            style={styles.headerSearchInput}
            placeholder="검색"
            placeholderTextColor={'#DAE2D8'}
            // onFocus={}
            ref={SearchRef}
            onChangeText={onChangeSearch}
            returnKeyType="done"
            onSubmitEditing={onSubmit}
            clearButtonMode="while-editing"
          />
        </View>
        <Pressable style={styles.headerSearchCancelBtn} onPress={toMyKnowhow}>
          <Text style={styles.headerSearchCancelBtnText}>취소</Text>
        </Pressable>
      </View>
      <FlatList
        data={DATA}
        renderItem={({item}) => (
          <SearchPostItem item={item} searchKeyword={searchKeyword.current} />
        )}
        keyExtractor={Item => String(Item.incr)}
      />
    </SafeAreaView>
  );
}

export default SearchMyPost;

const styles = StyleSheet.create({
  entire: {
    backgroundColor: 'white',
    flex: 1,
  },
  headerSearchingArea: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#E7EBE4',
  },
  headerSearch: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    height: 40,
    flex: 4,
  },
  headerSearchIcon: {
    marginLeft: 15,
  },
  headerSearchInput: {
    backgroundColor: 'transparent',
    color: '#1F6733',
    fontSize: 18,
    padding: 0,
    width: '88%',
    paddingLeft: 10,
  },
  headerSearchCancelBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 45,
    marginLeft: 9,
    marginRight: 5,
  },
  headerSearchCancelBtnText: {
    color: '#1F6733',
    fontSize: 18,
  },
});
