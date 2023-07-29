import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TextInput,
  FlatList,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MypageStackParamList} from '../navigations/MypageNavigation';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import PostMyItem from '../components/PostMyItem';

export type MyKnowhowScreenProps = NativeStackScreenProps<MypageStackParamList>;

type ItemProps = {
  incr: number;
  c_id: number;
  title: string;
  like: number;
  comment: number;
};

const MyKnowhow = ({navigation}: MyKnowhowScreenProps) => {
  const userID = useSelector((state: RootState) => state.user.id);
  const toSearchMyPost = useCallback(() => {
    navigation.navigate('SearchMyPost');
  }, [navigation]);

  const [DATA, setDATA] = useState<ItemProps[]>([]);
  const [categorySelected, setCategorySelected] = useState(0);
  const [filterSelected, setFilterSelected] = useState(0);
  const categoryDATA = ['전체', '건강', '여가', '학습', '관계'];
  const filterDATA = ['전체', '노하우', 'QnA'];

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    navigation.addListener('focus', () => {
      const filterPost = async () => {
        try {
          if (categorySelected) {
            if (filterSelected) {
              let temp;
              if (filterSelected === 1) {
                temp = 'F';
              } else {
                temp = 'T';
              }
              const response = await axios.get(
                `${Config.API_URL}/mypage/mywriting?c_id=${
                  categorySelected - 1
                }&is_qna='${temp}'&id='${userID}'`,
              );
              setDATA(response.data.post);
            } else {
              const response = await axios.get(
                `${Config.API_URL}/mypage/mywriting?c_id=${
                  categorySelected - 1
                }&id='${userID}'`,
              );
              setDATA(response.data.post);
            }
          } else {
            if (filterSelected) {
              let temp;
              if (filterSelected === 1) {
                temp = 'F';
              } else {
                temp = 'T';
              }
              const response = await axios.get(
                `${Config.API_URL}/mypage/mywriting?is_qna='${temp}'&id='${userID}'`,
              );
              setDATA(response.data.post);
            } else {
              const response = await axios.get(
                `${Config.API_URL}/mypage/mywriting?id='${userID}'`,
              );
              setDATA(response.data.post);
            }
          }
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>).response;
          if (errorResponse) {
            return Alert.alert('알림', errorResponse.data?.message);
          }
        }
      };
      filterPost();
    })
  }, [categorySelected, filterSelected, refreshing, userID]);

  useEffect(() => {
    navigation.addListener('focus', () => {
      const getBoardAndRefresh = async () => {
        try {
          const response = await axios.get(
            `${Config.API_URL}/mypage/mywriting?id='${userID}'`,
          );
          setDATA(response.data.post);
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>).response;
          if (errorResponse) {
            return Alert.alert('알림', errorResponse.data?.message);
          }
        }
      };
      getBoardAndRefresh();
    })
  }, []);

  return (
    <SafeAreaView style={styles.entire}>
      <View style={styles.header}>
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
              placeholderTextColor={'#B7CBB2'}
              onFocus={toSearchMyPost}
            />
          </View>
        </View>
      </View>
      <View style={styles.filtering}>
        <SelectDropdown
          data={categoryDATA}
          onSelect={(_selectedItem, index) => {
            setCategorySelected(index);
          }}
          defaultButtonText="카테고리"
          defaultValue={0}
          buttonTextAfterSelection={(selectedItem, _index) => {
            switch (selectedItem) {
              case '전체':
                return '카테고리';
            }
            return selectedItem;
          }}
          buttonStyle={styles.category}
          buttonTextStyle={styles.categoryTxt}
          renderDropdownIcon={() => {
            return (
              <FontAwesome5Icon
                name="caret-down"
                size={30}
                color="#DAE2D8"
                style={styles.categoryIcon}
              />
            );
          }}
          dropdownOverlayColor="transparent"
          rowStyle={styles.categoryRow}
          rowTextStyle={styles.RowTxtSt}
        />
        <SelectDropdown
          data={filterDATA}
          onSelect={(_selectedItem, index) => {
            setFilterSelected(index);
          }}
          defaultButtonText="필터"
          defaultValue={0}
          buttonTextAfterSelection={(selectedItem, _index) => {
            switch (selectedItem) {
              case '전체':
                return '필터';
            }
            return selectedItem;
          }}
          buttonStyle={styles.category}
          buttonTextStyle={styles.categoryTxt}
          renderDropdownIcon={() => {
            return (
              <FontAwesome5Icon
                name="caret-down"
                size={30}
                color="#DAE2D8"
                style={styles.categoryIcon}
              />
            );
          }}
          dropdownOverlayColor="transparent"
          rowStyle={styles.categoryRow}
          rowTextStyle={styles.RowTxtSt}
        />
      </View>
      <FlatList
        data={DATA}
        renderItem={({item}) => <PostMyItem item={item} />}
        keyExtractor={Item => String(Item.incr)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};
export default MyKnowhow;

const styles = StyleSheet.create({
  entire: {
    backgroundColor: 'white',
    flex: 1,
    // paddingBottom: 100
  },
  header: {
    backgroundColor: '#E7EBE4',
  },
  headerSearchingArea: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    marginVertical: 15,
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
  filtering: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
  },
  category: {
    backgroundColor: 'white',
    width: '45%',
  },
  categoryTxt: {
    width: '30%',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B7CBB2',
    marginLeft: 20,
  },
  categoryIcon: {
    marginRight: 15,
  },
  categoryRow: {
    backgroundColor: '#B7CBB2',
    alignContent: 'space-around',
  },
  RowTxtSt: {
    color: 'white',
  },
  newPostBtn: {
    backgroundColor: '#1F6733',
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
