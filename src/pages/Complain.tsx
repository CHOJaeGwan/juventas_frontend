import {StyleSheet, Text, View, Pressable, FlatList} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useCallback, useEffect, useState} from 'react';
import {ComplainStackParamList} from '../navigations/ComplainNavigation';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ComplainScreenProps = NativeStackScreenProps<
  ComplainStackParamList,
  'Complain'
>;

function Complain({navigation}: ComplainScreenProps) {
  const [faq, setFaq] = useState([{incr: 0, title: ''}]);
  const [complain, setComplain] = useState([{incr: 0, title: '', answer: ''}]);
  const toNewComplain = useCallback(() => {
    navigation.navigate('NewComplain');
  }, [navigation]);

  const setComplainIncr = useCallback((text: string) => {
    AsyncStorage.setItem('complain', text);
  }, []);

  useEffect(() => {
    navigation.addListener('focus', () => {
      const getComplain = async () => {
        const response = await axios.get(`${Config.API_URL}/settings/inquiry`);
        setFaq(response.data.FAQ);
        setComplain(response.data.inquiry);
      };
      getComplain();
    })
  }, []);

  function Faq({Item}) {
    return (
      <Pressable
        style={styles.QuestionBoxFr}
        onPress={() => {
          setComplainIncr(String(Item.incr));
          navigation.navigate('ComplainAnswer');
        }}>
        <View style={{flex: 1}}>
          <Text style={styles.QuestionTxt}>자주 묻는 질문{') '}</Text>
        </View>
        <View style={{flex: 3}}>
          <Text style={styles.QuestionTxt} numberOfLines={1}>
            {Item.title}
          </Text>
        </View>
      </Pressable>
    );
  }

  function ComplainContent({Item}) {
    return Item.answer === '답변미작성' ? (
      <Pressable
        style={styles.QuestionBox}
        onPress={() => {
          setComplainIncr(String(Item.incr));
          navigation.navigate('ComplainAnswer');
        }}>
        <Text style={styles.QuestionTxt} numberOfLines={1}>
          {Item.title}
        </Text>
      </Pressable>
    ) : (
      <Pressable
        style={styles.QuestionBox}
        onPress={() => {
          setComplainIncr(String(Item.incr));
          navigation.navigate('ComplainAnswer');
        }}>
        <View style={{flex: 4}}>
          <Text style={styles.QuestionTxt} numberOfLines={1}>
            {Item.title}
          </Text>
        </View>
        <View style={styles.answeredBt}>
          <Text style={styles.answered}>{Item.answer}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.entire}>
      <View>
        <FlatList
          data={faq}
          keyExtractor={item => String(item.incr)}
          renderItem={({item}) => <Faq Item={item} />}
        />
      </View>
      <View>
        <FlatList
          data={complain}
          keyExtractor={item => String(item.incr)}
          renderItem={({item}) => <ComplainContent Item={item} />}
        />
      </View>
      <Pressable style={styles.newComplainBtn}>
        <FontAwesome5Icon
          name="pen-nib"
          size={30}
          color="white"
          onPress={toNewComplain}
        />
        <Text
          style={{
            color: 'white',
            fontSize: 10,
            fontWeight: 'bold',
            marginTop: 3,
          }}>
          문의 작성
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

export default Complain;

const styles = StyleSheet.create({
  entire: {
    backgroundColor: 'white',
    flex: 1,
    paddingTop: 30,
  },
  QuestionBoxFr: {
    backgroundColor: '#346627',
    flexDirection: 'row',
    paddingLeft: 5,
    borderRadius: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  QuestionBox: {
    backgroundColor: '#B7CBB2',
    marginHorizontal: 10,
    flexDirection: 'row',
    paddingHorizontal: 5,
    borderRadius: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  QuestionTxt: {
    color: 'white',
    fontWeight: 'bold',
  },
  answeredBt: {
    flex: 1,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  answered: {
    color: '#346627',
  },
  newComplainBtn: {
    backgroundColor: '#346627',
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
