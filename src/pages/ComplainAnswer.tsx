import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ComplainStackParamList} from '../navigations/ComplainNavigation';
import {SafeAreaView, StyleSheet, Text, View, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';

type ComplainScreenProps = NativeStackScreenProps<
  ComplainStackParamList,
  'ComplainAnswer'
>;

const ComplainAnswer = ({navigation}: ComplainScreenProps) => {
  const [complain, setComplain] = useState({
    inquiry_title: '',
    inquiry_content: '',
    answer_title: '',
    answer_content: '',
  });
  const [incr, setIncr] = useState(0);

  useEffect(() => {
    navigation.addListener('focus', () => {
      const getComplain = async () => {
        if (incr !== 0) {
          try {
            const response = await axios.get(
              `${Config.API_URL}/settings/inquiry/${incr}`,
            );
            setComplain(response.data);
          } catch (error) {}
        }
      };
      getComplain();
    })
  }, [incr]);

  useEffect(() => {
    navigation.addListener('focus', () => {
      const getIncr = async () => {
        const response = await AsyncStorage.getItem('complain');
        setIncr(parseInt(response));
      };
      getIncr();
    })
  }, [setIncr]);

  return (
    <SafeAreaView style={styles.entire}>
      <View style={styles.ComplainBoard}>
        <View style={styles.BoardTitle}>
          <Text style={styles.BoardTitleTxt}>{complain.inquiry_title}</Text>
        </View>
        <ScrollView style={styles.BoardCt}>
          <Text style={styles.BoardCtTxt}>{complain.inquiry_content}</Text>
        </ScrollView>
      </View>
      <View style={styles.AnswerBoard}>
        <View style={styles.AnsBoardTitle}>
          <Text style={styles.BoardTitleTxt}>{complain.answer_title}</Text>
        </View>
        <ScrollView style={styles.BoardCt}>
          <Text style={styles.BoardCtTxt}>{complain.answer_content}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ComplainAnswer;

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    flexWrap: 'nowrap',
    backgroundColor: '#E7EBE4',
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  ComplainBoard: {
    flex: 3,
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  BoardTitle: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  BoardTitleTxt: {
    fontSize: 20,
    fontWeight: '900',
    color: 'black',
  },
  BoardCt: {
    flex: 3,
    paddingHorizontal: 10,
  },
  BoardCtTxt: {
    color: '#4C4D4C',
  },
  AnswerBoard: {
    flex: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  AnsBoardTitle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
