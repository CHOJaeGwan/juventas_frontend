import React, {useCallback, useEffect, useState} from 'react';
import {View, Pressable, Text, StyleSheet, FlatList, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CertificationtStackParamList} from '../navigations/MycertificationNavigation';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CertificationScreenProps = NativeStackScreenProps<
  CertificationtStackParamList,
  'MyCertification'
>;

const MyCertification = ({navigation}: CertificationScreenProps) => {
  const [myCertification, setMyCertification] = useState([
    {content: '', q_name: '', t_date: '', title: ''},
  ]);

  const toContent = useCallback(() => {
    navigation.navigate('CertificationContent');
  }, [navigation]);

  interface DataItem {
    content: string;
    q_name: string;
    t_date: string;
    title: string;
    img_path_1: string;
    img_path_2: string;
    img_path_3: string;
  }

  const setTdIncr = useCallback((id: string) => {
    AsyncStorage.setItem('TdIncr', id);
  }, []);

  const userID = useSelector((state: RootState) => state.user.id);

  useEffect(() => {
    navigation.addListener('focus', () => {
      const getCertification = async () => {
        try {
          const response = await axios.get(
            `${Config.API_URL}/mypage/myrecord/${userID}`,
          );
          setMyCertification(response.data.record);
        } catch (error) {}
      };
      getCertification();
    })
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  function Item({item, index}: {item: DataItem; index: number}) {
    const formattedDate = formatDate(item.t_date);
    return (
      <Pressable
        style={styles.Box1}
        onPress={() => {
          toContent();
          setTdIncr(index.toString());
        }}>
        <View style={styles.date}>
          <Text style={styles.dateTxt}>{formattedDate}</Text>
        </View>
        <View style={styles.Content}>
          <Text style={styles.ChallengeName}>{item.q_name}</Text>
          <View style={styles.Step}>
            {item.img_path_1 === 'undefined' ? (
              <View style={styles.Step1} />
            ) : (
              <Image style={styles.image} source={{uri: item.img_path_1}} />
            )}
            {item.img_path_2 === 'undefined' ? (
              <View style={styles.Step2} />
            ) : (
              <Image style={styles.image} source={{uri: item.img_path_2}} />
            )}
            {item.img_path_3 === 'undefined' ? (
              <View style={styles.Step3} />
            ) : (
              <Image style={styles.image} source={{uri: item.img_path_3}} />
            )}
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.entire}>
      <FlatList<DataItem>
        data={myCertification}
        renderItem={Item}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

export default MyCertification;

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    backgroundColor: '#E7EBE4',
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  Box1: {
    height: 200,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  date: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateTxt: {
    color: '#346627',
    fontWeight: 'bold',
  },
  Content: {
    height: 150,
    width: '100%',
    backgroundColor: '#CFD8C8',
    borderRadius: 10,
    alignItems: 'center',
  },
  ChallengeName: {
    color: 'white',
    fontWeight: 'bold',
    marginVertical: 15,
  },
  Step: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    width: 80,
    height: 80,
  },
  Step1: {
    width: 80,
    height: 80,
    backgroundColor: '#935858',
  },
  Step2: {
    width: 80,
    height: 80,
    backgroundColor: '#DBBBBB',
  },
  Step3: {
    width: 80,
    height: 80,
    backgroundColor: '#DCCFF1',
  },
});
