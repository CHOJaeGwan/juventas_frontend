import React, {useEffect, useState} from 'react';
import {View, Dimensions, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MypageStackParamList} from '../navigations/MypageNavigation';
import Config from 'react-native-config';
import axios, {AxiosError} from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import * as Progress from 'react-native-progress';

type MyGradeScreenProps = NativeStackScreenProps<MypageStackParamList>;

const MyGrade = ({navigation}: MyGradeScreenProps) => {
  const [currentGrade, setCurrentGrade] = useState('');
  const [nextGrade, setNextGrade] = useState('');
  const [percent, setPercent] = useState(0);
  const [leftNum, setLeftNum] = useState(0);
  const [percentage, setPercentage] = useState('');
  const getPercent = (text: string) => {
    let arr = text.split('%');
    let p = parseInt(arr[0], 10);
    setPercent(p);
  };
  const userID = useSelector((state: RootState) => state.user.id);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    navigation.addListener('focus', () => {
      const getGrade = async () => {
        try {
          const response = await axios.get(
            `${Config.API_URL}/mypage/mylevel/${userID}`,
          );
          setCurrentGrade(response.data.current_level);
          setNextGrade(response.data.next_level);
          setPercentage(response.data.percentage);
          setLeftNum(response.data.questleft);
          getPercent(response.data.percentage);
        } catch (error) {}
      };
      getGrade();
    })
  }, []);

  return (
    <SafeAreaView style={styles.entire}>
      <View style={styles.GradeInf}>
        <Text style={styles.MyGradeInf}>현제 내 등급</Text>
        <Text style={styles.MyGradeInf_2}>{currentGrade}</Text>
      </View>
      <View style={styles.GradeInf}>
        <Text style={styles.MyGradeInf}>다음 등급 ({nextGrade})까지</Text>
        <Text style={styles.MyGradeInf_2}>{leftNum} 도전 남음</Text>
      </View>
      <View style={styles.grade}>
        <View>
          <Progress.Bar
            progress={percent / 100}
            color={'#346627'}
            unfilledColor={'#EBEFEA'}
            width={screenWidth - 40}
            height={30}
            borderRadius={30}
            style={styles.bar}>
            <Text style={styles.barTxt}>{percentage}</Text>
          </Progress.Bar>
        </View>
      </View>
      <View style={styles.AllGrade}>
        <View style={styles.TopGrade}>
          <Text style={styles.GradeName}>열매</Text>
        </View>
        <View style={styles.MiddleGrade}>
          <Text style={styles.GradeName}>꽃</Text>
        </View>
        <View style={styles.MiddleGrade}>
          <Text style={styles.GradeName}>나무</Text>
        </View>
        <View style={styles.MiddleGrade}>
          <Text style={styles.GradeName}>묘목</Text>
        </View>
        <View style={styles.MiddleGrade}>
          <Text style={styles.GradeName}>새싹</Text>
        </View>
        <View style={styles.LowGrade}>
          <Text style={styles.GradeName}>씨앗</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MyGrade;

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 15,
  },
  grade: {
    flex: 0.7,
    justifyContent: 'center',
  },
  bar: {
    marginVertical: 10,
    borderWidth: 0,
  },
  barTxt: {
    position: 'absolute',
    top: 6,
    left: 180,
    color: 'white',
    fontSize: 12,
  },
  GradeInf: {
    flex: 0.5,
    flexDirection: 'row',
  },
  MyGradeInf: {
    fontWeight: 'bold',
    color: '#346627',
    marginRight: 10,
  },
  MyGradeInf_2: {
    fontWeight: 'bold',
    color: '#4C4D4C',
  },
  AllGrade: {
    flex: 8,
    marginTop: 20,
    marginBottom: 100,
    justifyContent: 'space-around',
  },
  TopGrade: {
    flex: 1,
    backgroundColor: '#EBEFEA',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  MiddleGrade: {
    flex: 1,
    backgroundColor: '#EBEFEA',
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  LowGrade: {
    flex: 1,
    backgroundColor: '#EBEFEA',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  GradeName: {
    fontWeight: 'bold',
    color: '#3D3C3C',
  },
});
