import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, StyleSheet, Text, View, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CertificationtStackParamList} from '../navigations/MycertificationNavigation';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CertificationScreenProps = NativeStackScreenProps<
  CertificationtStackParamList,
  'CertificationContent'
>;
const QuestList = ({navigation}: CertificationScreenProps) => {
  const [myCertification, setMyCertification] = useState({
    content: '',
    q_name: '',
    t_date: '',
    title: '',
    img_path_1: 'undefined',
    img_path_2: 'undefined',
    img_path_3: 'undefined',
  });
  const [Incr, setIncr] = useState(-1);

  const getIncr = async () => {
    const incr = await AsyncStorage.getItem('TdIncr');
    if (incr) {
      const parsedIncr = parseInt(incr, 10);
      setIncr(parsedIncr);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };
  useEffect(() => {
    navigation.addListener('focus', () => {
      const checkIncr = async () => {
        if (Incr === -1) {
          await getIncr();
        }
      };
      checkIncr();
    })
  }, [Incr]);

  const userID = useSelector((state: RootState) => state.user.id);
  useEffect(() => {
    navigation.addListener('focus', () => {
      const getCertification = async () => {
        try {
          if (Incr !== -1) {
            const response = await axios.get(
              `${Config.API_URL}/mypage/myrecord/${userID}`,
            );
            setMyCertification(response.data.record[Incr]);
          }
        } catch (error) {}
      };
    
      getCertification();
    })
  }, [Incr]);

  if (Incr === -1) {
    return null; // 렌더링을 막는 부분
  } else {
    return (
      <SafeAreaView style={styles.entire}>
        <View style={styles.QuestBox}>
          <Text style={styles.Quest}>{myCertification.q_name}</Text>
        </View>
        <View style={styles.ContentBox}>
          <ScrollView style={{paddingHorizontal: 20}}>
            <View style={styles.date}>
              <Text style={styles.dateTxt}>
                {formatDate(myCertification.t_date)}
              </Text>
            </View>
            <View style={styles.Title}>
              <Text style={styles.TitleTxt}>{myCertification.title}</Text>
            </View>
            <View>
              <Text style={styles.contentTxt}>{myCertification.content}</Text>
            </View>
            <View style={styles.imageContainer}>
              {myCertification.img_path_1 !== 'undefined' && (
                <Image
                  style={styles.image}
                  source={{uri: myCertification.img_path_1}}
                />
              )}
              {myCertification.img_path_2 !== 'undefined' && (
                <Image
                  style={styles.image}
                  source={{uri: myCertification.img_path_2}}
                />
              )}
              {myCertification.img_path_3 !== 'undefined' && (
                <Image
                  style={styles.image}
                  source={{uri: myCertification.img_path_3}}
                />
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
};

export default QuestList;

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 20,
    marginHorizontal: 5,
  },
  entire: {
    backgroundColor: '#E7EBE4',
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  QuestBox: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B7CBB2',
    height: 40,
  },
  Quest: {
    color: 'white',
    fontSize: 15,
    fontWeight: '900',
  },
  ContentBox: {
    backgroundColor: 'white',
    minHeight: 500,
    borderRadius: 10,
    marginTop: 20,
  },
  date: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateTxt: {
    color: '#346627',
    fontSize: 18,
  },
  Title: {
    height: 70,
  },
  TitleTxt: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
  },
  contentTxt: {
    color: 'black',
    fontsize: 15,
  },
});
