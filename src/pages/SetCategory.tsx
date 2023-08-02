import React, {useEffect, useState} from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MypageStackParamList} from '../navigations/MypageNavigation';
import axios from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import {BarChart} from 'react-native-chart-kit';

type MypageScreenProps = NativeStackScreenProps<
  MypageStackParamList,
  'SetCategory'
>;

const SetCategory = ({navigation}: MypageScreenProps) => {
  const [categorySelected_0, setCategorySelected_0] = useState('');
  const [categorySelected_1, setCategorySelected_1] = useState('');
  const [categorySelected_2, setCategorySelected_2] = useState('');

  const [completedNum, setNum] = useState({
    cat_0: '',
    cat_1: '',
    cat_2: '',
    cat_3: '',
  });

  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundGradientFrom: '#FFF',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#FFF',
    color: (opacity = 1) => `rgba(52, 102, 39, ${opacity})`,
    strokeWidth: 3, // optional, default 3
    barPercentage: 1.5,
    useShadowColorFromDataset: false, // optional
    propsForLabels: {
      width: 0,
      height: 0,
    },
  };
  const data = {
    labels: ['1', '2', '3', '4'],
    datasets: [
      {
        data: [
          completedNum.cat_0,
          completedNum.cat_1,
          completedNum.cat_2,
          completedNum.cat_3,
        ],
      },
    ],
  };

  const check_0 = (ct: string) => {
    if (categorySelected_1 === ct || categorySelected_2 === ct) {
      Alert.alert('알림', '카테고리를 중복하여 선택할 수 없습니다.');
    } else {
      setCategorySelected_0(ct);
    }
  };
  const check_1 = (ct: string) => {
    if (categorySelected_0 === ct || categorySelected_2 === ct) {
      Alert.alert('알림', '카테고리를 중복하여 선택할 수 없습니다.');
    } else {
      setCategorySelected_1(ct);
    }
  };
  const check_2 = (ct: string) => {
    if (categorySelected_0 === ct || categorySelected_1 === ct) {
      Alert.alert('알림', '카테고리를 중복하여 선택할 수 없습니다.');
    } else {
      setCategorySelected_2(ct);
    }
  };

  const userID = useSelector((state: RootState) => state.user.id);

  useEffect(() => {
    navigation.addListener('focus', () => {
      const getCat = async () => {
        try {
          const response = await axios.get(
            `${Config.API_URL}/mypage/main/${userID}`,
          );
          setCategorySelected_0(response.data.cat_0);
          setCategorySelected_1(response.data.cat_1);
          setCategorySelected_2(response.data.cat_2);
        } catch (error) {}
      };
      getCat();
    })
  }, []);

  useEffect(() => {
    navigation.addListener('focus', () => {
      const getCompletedCategory = async () => {
        try {
          const response = await axios.get(
            `${Config.API_URL}/mypage/category/${userID}`,
          );
          setNum(response.data);
        } catch (error) {}
      };
      getCompletedCategory();
    })
  }, []);

  const changeCategory = async () => {
    await axios.patch(`${Config.API_URL}/mypage/category`, {
      id: userID,
      cat_0: categorySelected_0,
      cat_1: categorySelected_1,
      cat_2: categorySelected_2,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.entire}>
      <View style={styles.Prefer}>
        <View style={styles.Head}>
          <Text style={styles.FontSt}>수행한 도전으로 알아보는 내 선호도</Text>
        </View>
        <View style={styles.CategoryName}>
          <View style={styles.CategoryBox1}>
            <Text style={styles.Txt}>건강</Text>
          </View>
          <View style={styles.CategoryBox2}>
            <Text style={styles.Txt}>여가</Text>
          </View>
          <View style={styles.CategoryBox2}>
            <Text style={styles.Txt}>학습</Text>
          </View>
          <View style={styles.CategoryBox3}>
            <Text style={styles.Txt}>관계</Text>
          </View>
        </View>
        <View style={styles.chartSt}>
          <BarChart
            style={styles.graphStyle}
            withHorizontalLabels={false}
            withVerticalLabels={false}
            withInnerLines={false}
            fromZero={true}
            showValuesOnTopOfBars={true}
            data={data}
            height={220}
            width={screenWidth + 20}
            chartConfig={chartConfig}
            showBarTops={true}
          />
        </View>
      </View>
      <View style={styles.PreferCt}>
        <View style={styles.Head}>
          <Text style={styles.FontSt}>선호 카테고리</Text>
        </View>
        <View style={styles.PreferOrder}>
          <View style={styles.Order}>
            <Text style={styles.OrderTxt}>1 순위</Text>
          </View>
          <View style={styles.Ct}>
            <Pressable
              style={
                categorySelected_0 === '건강'
                  ? styles.Category_pre
                  : styles.Categoryname
              }
              onPress={() => check_0('건강')}>
              <Text
                style={
                  categorySelected_0 === '건강' ? styles.Txt_pre : styles.Txt
                }>
                건강
              </Text>
            </Pressable>
            <Pressable
              style={
                categorySelected_0 === '여가'
                  ? styles.Category_pre
                  : styles.Categoryname
              }
              onPress={() => check_0('여가')}>
              <Text
                style={
                  categorySelected_0 === '여가' ? styles.Txt_pre : styles.Txt
                }>
                여가
              </Text>
            </Pressable>
            <Pressable
              style={
                categorySelected_0 === '학습'
                  ? styles.Category_pre
                  : styles.Categoryname
              }
              onPress={() => check_0('학습')}>
              <Text
                style={
                  categorySelected_0 === '학습' ? styles.Txt_pre : styles.Txt
                }>
                학습
              </Text>
            </Pressable>
            <Pressable
              style={
                categorySelected_0 === '관계'
                  ? styles.Category_pre
                  : styles.Categoryname
              }
              onPress={() => check_0('관계')}>
              <Text
                style={
                  categorySelected_0 === '관계' ? styles.Txt_pre : styles.Txt
                }>
                관계
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.PreferOrder}>
          <View style={styles.Order}>
            <Text style={styles.OrderTxt}>2 순위</Text>
          </View>
          <View style={styles.Ct}>
            <Pressable
              style={
                categorySelected_1 === '건강'
                  ? styles.Category_pre
                  : styles.Categoryname
              }
              onPress={() => check_1('건강')}>
              <Text
                style={
                  categorySelected_1 === '건강' ? styles.Txt_pre : styles.Txt
                }>
                건강
              </Text>
            </Pressable>
            <Pressable
              style={
                categorySelected_1 === '여가'
                  ? styles.Category_pre
                  : styles.Categoryname
              }
              onPress={() => check_1('여가')}>
              <Text
                style={
                  categorySelected_1 === '여가' ? styles.Txt_pre : styles.Txt
                }>
                여가
              </Text>
            </Pressable>
            <Pressable
              style={
                categorySelected_1 === '학습'
                  ? styles.Category_pre
                  : styles.Categoryname
              }
              onPress={() => check_1('학습')}>
              <Text
                style={
                  categorySelected_1 === '학습' ? styles.Txt_pre : styles.Txt
                }>
                학습
              </Text>
            </Pressable>
            <Pressable
              style={
                categorySelected_1 === '관계'
                  ? styles.Category_pre
                  : styles.Categoryname
              }
              onPress={() => check_1('관계')}>
              <Text
                style={
                  categorySelected_1 === '관계' ? styles.Txt_pre : styles.Txt
                }>
                관계
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.PreferOrder}>
          <View style={styles.Order}>
            <Text style={styles.OrderTxt}>3 순위</Text>
          </View>
          <View style={styles.Ct}>
            <Pressable
              style={
                categorySelected_2 === '건강'
                  ? styles.Category_pre
                  : styles.Categoryname
              }
              onPress={() => check_2('건강')}>
              <Text
                style={
                  categorySelected_2 === '건강' ? styles.Txt_pre : styles.Txt
                }>
                건강
              </Text>
            </Pressable>
            <Pressable
              style={
                categorySelected_2 === '여가'
                  ? styles.Category_pre
                  : styles.Categoryname
              }
              onPress={() => check_2('여가')}>
              <Text
                style={
                  categorySelected_2 === '여가' ? styles.Txt_pre : styles.Txt
                }>
                여가
              </Text>
            </Pressable>
            <Pressable
              style={
                categorySelected_2 === '학습'
                  ? styles.Category_pre
                  : styles.Categoryname
              }
              onPress={() => check_2('학습')}>
              <Text
                style={
                  categorySelected_2 === '학습' ? styles.Txt_pre : styles.Txt
                }>
                학습
              </Text>
            </Pressable>
            <Pressable
              style={
                categorySelected_2 === '관계'
                  ? styles.Category_pre
                  : styles.Categoryname
              }
              onPress={() => check_2('관계')}>
              <Text
                style={
                  categorySelected_2 === '관계' ? styles.Txt_pre : styles.Txt
                }>
                관계
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View style={styles.Set}>
        <View>
          <Pressable style={styles.SetBt} onPress={changeCategory}>
            <Text style={styles.SetTxt}>설정 완료</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SetCategory;

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 5,
    paddingBottom: 2,
    paddingHorizontal: 20,
  },
  Prefer: {
    flex: 4.5,
    marginVertical: 5,
    borderColor: '#E7EBE4',
    borderWidth: 1.3,
    borderRadius: 10,
    flexDirection: 'column',
  },
  PreferCt: {
    flex: 3.5,
    borderColor: '#E7EBE4',
    borderWidth: 1.3,
    borderRadius: 10,
  },
  Set: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  SetBt: {
    width: 250,
    height: 30,
    borderRadius: 7.5,
    borderColor: '#346627',
    borderStyle: 'solid',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  SetTxt: {
    color: '#346627',
    fontWeight: 'bold',
  },
  Head: {
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B7CBB2',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  CategoryName: {
    height: 34,
    flexDirection: 'row',
    backgroundColor: '#F9FAF8',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  CategoryBox1: {
    flex: 1,
    borderRightWidth: 2,
    borderRightColor: '#B7CBB2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  CategoryBox2: {
    flex: 1,
    borderRightWidth: 2,
    borderRightColor: '#B7CBB2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  CategoryBox3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  FontSt: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  Txt: {
    fontWeight: 'bold',
  },
  Txt_pre: {
    color: '#346627',
  },
  PreferOrder: {
    flex: 1,
    flexDirection: 'row',
  },
  Order: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  OrderTxt: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#B7CBB2',
  },
  Ct: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  Categoryname: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAF8',
    borderRadius: 10,
    height: 44,
    marginHorizontal: 5,
  },
  Category_pre: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EBEFEA',
    borderRadius: 10,
    height: 44,
    marginHorizontal: 5,
    borderColor: '#346627',
    borderWidth: 1,
  },
  chartSt: {
    height: 220,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  graphStyle: {
    marginTop: 38,
  },
});
