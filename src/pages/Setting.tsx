import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Switch} from 'react-native';
import Config from 'react-native-config';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SettingStackParamList} from '../navigations/SettingNavigation';

type SettingScreenProps = NativeStackScreenProps<
  SettingStackParamList,
  'Setting'
>;

function Setting({navigation}: SettingScreenProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [faq, setFaq] = useState([{title: ''}, {tite: ''}, {title: ''}]);
  const AlltoggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    if (isEnabled === false) {
      setMessageIsEnabled(true);
      setBoardIsEnabled(true);
      setPointIsEnabled(true);
      setQuestIsEnabled(true);
    }
  };
  const [MessageisEnabled, setMessageIsEnabled] = useState(false);
  const MessagetoggleSwitch = () => {
    if (isEnabled) {
      setIsEnabled(false);
    }
    setMessageIsEnabled(previousState => !previousState);
  };
  const [BoardisEnabled, setBoardIsEnabled] = useState(false);
  const BoardtoggleSwitch = () => {
    if (isEnabled) {
      setIsEnabled(false);
    }

    setBoardIsEnabled(previousState => !previousState);
  };
  const [PointisEnabled, setPointIsEnabled] = useState(false);
  const PointtoggleSwitch = () => {
    if (isEnabled) {
      setIsEnabled(false);
    }

    setPointIsEnabled(previousState => !previousState);
  };
  const [QuestisEnabled, setQuestIsEnabled] = useState(false);
  const QuesttoggleSwitch = () => {
    if (isEnabled) {
      setIsEnabled(false);
    }
    setQuestIsEnabled(previousState => !previousState);
  };

  const toNotice = useCallback(() => {
    navigation.navigate('NoticeList');
  }, [navigation]);
  const toComplain = useCallback(() => {
    navigation.navigate('Complain');
  }, [navigation]);
  const toQuit = useCallback(() => {
    navigation.navigate('Quit');
  }, [navigation]);

  const [Notice, setNotice] = useState({content: '', title: ''});

  useEffect(() => {
    navigation.addListener('focus', () => {
      const getNotice = async () => {
        try {
          const response = await axios.get(
            `${Config.API_URL}/settings/announcement`,
          );
          setNotice(response.data.fixed[0]);
        } catch (error) {}
      };
      getNotice();
    })
  }, []);

  useEffect(() => {
    navigation.addListener('focus', () => {
      const getNotice = async () => {
        try {
          const response = await axios.get(
            `${Config.API_URL}/settings/announcement`,
          );
          setNotice(response.data.fixed[0]);
        } catch (error) {}
      };
      getNotice();
    })
  }, []);

  useEffect(() => {
    navigation.addListener('focus', () => {
      const getComplain = async () => {
        const response = await axios.get(`${Config.API_URL}/settings/inquiry`);
        setFaq(response.data.FAQ);
      };
      getComplain();
    })
  }, []);

  return (
    <SafeAreaView style={styles.entire}>
      <View style={styles.Notice}>
        <View>
          <Text style={styles.BoardTitle}>공지사항</Text>
        </View>
        <View style={styles.NoticeBoard}>
          <Text style={styles.BoardTitleTxt} numberOfLines={1}>
            {Notice.title}
          </Text>
          <Text
            style={{marginTop: 5, fontSize: 13, color: '#4C4D4C'}}
            numberOfLines={2}>
            {Notice.content}
          </Text>
        </View>
        <Pressable style={styles.All} onPress={toNotice}>
          <Text style={styles.AllTxt}>전체 공지 보기</Text>
        </Pressable>
      </View>
      {/* <View style={styles.AlarmSetting}>
        <Text style={styles.BoardTitle}>알림 설정</Text>
        <View style={styles.AlarmBoard}>
          <View style={styles.AlarmSt1}>
            <Text style={styles.BoardTitleTxt}>알림 전체</Text>
            <Switch
              trackColor={{false: '#767577', true: '#346627'}}
              thumbColor={'white'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={AlltoggleSwitch}
              value={isEnabled}
            />
          </View>
          <View style={styles.AlarmSt2}>
            <Text style={styles.txt}>쪽지 알림</Text>
            <Switch
              trackColor={{false: '#767577', true: '#346627'}}
              thumbColor={'white'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={MessagetoggleSwitch}
              value={MessageisEnabled}
            />
          </View>
          <View style={styles.AlarmSt2}>
            <Text style={styles.txt}>게시판 알림</Text>
            <Switch
              trackColor={{false: '#767577', true: '#346627'}}
              thumbColor={'white'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={BoardtoggleSwitch}
              value={BoardisEnabled}
            />
          </View>
          <View style={styles.AlarmSt2}>
            <Text style={styles.txt}>포인트 알림</Text>
            <Switch
              trackColor={{false: '#767577', true: '#346627'}}
              thumbColor={'white'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={PointtoggleSwitch}
              value={PointisEnabled}
            />
          </View>
          <View style={styles.AlarmSt2}>
            <Text style={styles.txt}>퀘스트 알림</Text>
            <Switch
              trackColor={{false: '#767577', true: '#346627'}}
              thumbColor={'white'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={QuesttoggleSwitch}
              value={QuestisEnabled}
            />
          </View>
        </View>
      </View> */}
      <View style={styles.ComplainBoard}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.BoardTitle}>문의 게시판</Text>
          <Text style={styles.TxtTip}>
            *1:1 문의는 카카오톡 채널 '하루도전'으로 보내주세요.
          </Text>
        </View>
        <View style={styles.NoticeBoard}>
          <View style={styles.FrequentQ}>
            <Text style={styles.txt} numberOfLines={1}>
              {faq[0].title}
            </Text>
          </View>
          <View style={styles.FrequentQ}>
            <Text style={styles.txt} numberOfLines={1}>
              {faq[1].title}
            </Text>
          </View>
          <View style={styles.FrequentQ}>
            <Text style={styles.txt} numberOfLines={1}>
              {faq[2].title}
            </Text>
          </View>
        </View>
        <Pressable style={styles.All} onPress={toComplain}>
          <Text style={styles.AllTxt}>전체 문의 보기</Text>
        </Pressable>
      </View>
      <View style={styles.Account}>
        <Pressable style={styles.account} onPress={toQuit}>
          <Text style={{fontWeight: 'bold', color: 'black'}}>계정 관리</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
export default Setting;

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    flexWrap: 'wrap',
    backgroundColor: '#E7EBE4',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 2,
  },
  Notice: {
    flex: 2,
    marginBottom: 10,
  },
  BoardTitle: {
    color: '#346627',
    fontWeight: 'bold',
    paddingLeft: 5,
    paddingBottom: 5,
    fontSize: 14,
  },
  TxtTip: {
    color: '#346627',
    fontSize: 12,
    marginLeft: 5,
    textAlignVertical: 'bottom',
  },
  NoticeBoard: {
    flex: 3.7,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: 'white',
    width: '100%',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  FrequentQ: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: 5,
  },
  All: {
    flex: 1,
    backgroundColor: '#B7CBB2',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  AllTxt: {
    color: '#346627',
    fontSize: 10,
    fontWeight: '300',
  },
  AlarmSetting: {
    flex: 3,
    marginBottom: 10,
  },
  AlarmBoard: {
    backgroundColor: 'white',
    width: '100%',
    height: 160,
    borderRadius: 7,
  },
  AlarmSt1: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#B7CBB2',
    paddingHorizontal: 7,
    borderTopLeftRadius: 7,
    borderTopRighttRadius: 7,
  },
  BoardTitleTxt: {
    color: '#3D3C3C',
    fontWeight: 'bold',
    fontSize: 17,
  },
  AlarmSt2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 7,
  },
  ComplainBoard: {
    flex: 2.5,
    paddingTop: 15,
    width: '100%',
  },
  Txt: {
    fontWeight: 'bold',
    color: 'white',
  },
  txt: {
    color: '#4C4D4C',
  },
  Account: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  account: {
    height: 30,
    width: '90%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CEDACB',
  },
});
