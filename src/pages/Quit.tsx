import {SettingStackParamList} from '../navigations/SettingNavigation';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import NaverLogin from '@react-native-seoul/naver-login';
import {RootState, useAppDispatch} from '../store';
import {useSelector} from 'react-redux';
import {logout, unlink} from '@react-native-seoul/kakao-login';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import Config from 'react-native-config';
import userSlice from '../slices/user';
import CheckIcon from 'react-native-vector-icons/FontAwesome';

type SettingScreenProps = NativeStackScreenProps<SettingStackParamList, 'Quit'>;

const Quit = ({navigation}: SettingScreenProps) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);

  const onLogOut = useCallback(() => {
    setShowLogoutModal(true);
  }, []);
  const onQuit = useCallback(() => {
    setShowQuitModal(true);
  }, []);

  const signOutUser = async (): Promise<void> => {
    if (user.loginType === 'kakao') {
      await logout();
    } else if (user.loginType === 'naver') {
      await NaverLogin.logout();
    } else {
      const response = await axios.patch(`${Config.API_URL}/user/logout`, {
        headers: {
          authorization: `Bearer ${user.accessToken}`,
        },
      });
      await EncryptedStorage.removeItem('refreshToken');
    }
    const deviceToken = await EncryptedStorage.getItem('deviceToken');
    await axios.delete(`${Config.API_URL}/push/delete`, {
      data: {deviceToken: deviceToken},
    });
    dispatch(
      userSlice.actions.setUser({
        name: '',
        id: '',
        phoneNum: '',
        loginType: '',
        accessToken: '',
      }),
    );
  };

  const unlinkUser = async (): Promise<void> => {
    // console.log(user.id)
    // if (user.loginType === 'kakao') {
    //   await unlink();
    //   await axios.delete(`${Config.API_URL}/user/unlinkSocial?id=${user.id}`);
    // } else if (user.loginType === 'naver') {
    //   await NaverLogin.deleteToken();
    //   await axios.delete(`${Config.API_URL}/user/unlinkSocial?id=${user.id}`);
    // } else 
    {
      const response = await axios.delete(
        `${Config.API_URL}/user/unlink?id=${user.id}`,
        {
          headers: {
            authorization: `Bearer ${user.accessToken}`,
          },
        },
      );
      await EncryptedStorage.removeItem('refreshToken');
    }
    dispatch(
      userSlice.actions.setUser({
        name: '',
        id: '',
        phoneNum: '',
        loginType: '',
        accessToken: '',
      }),
    );
  };

  return (
    <SafeAreaView style={styles.entire}>
      <Pressable style={styles.Logout} onPress={onLogOut}>
        <Text style={styles.Txt}>로그아웃</Text>
      </Pressable>
      <Pressable style={styles.ByeBye} onPress={onQuit}>
        <Text style={styles.Txt}>회원 탈퇴</Text>
      </Pressable>
      <Modal transparent={true} visible={showLogoutModal}>
        <Pressable
          style={styles.modalBG}
          onPress={() => setShowLogoutModal(false)}>
          <View style={styles.modal}>
            <View style={styles.modalHead}>
              <CheckIcon
                name="check-circle"
                size={50}
                color="#F6DD55"
                style={styles.modalImg}
              />
              <Text style={styles.modalTextHeader}>
                정말 로그아웃 하시겟습니까?
              </Text>
            </View>
            <View style={styles.Choose}>
              <Pressable style={styles.YesBt} onPress={signOutUser}>
                <Text style={styles.ChooseTxt}>예</Text>
              </Pressable>
              <Pressable
                style={styles.NoBt}
                onPress={() => setShowLogoutModal(false)}>
                <Text style={styles.ChooseTxt}>아니요</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
      <Modal transparent={true} visible={showQuitModal}>
        <Pressable
          style={styles.modalBG}
          onPress={() => setShowQuitModal(false)}>
          <View style={styles.modal}>
            <View style={styles.modalHead}>
              <Text style={styles.modalTextHeader}>
                정말 탈퇴 하시겠습니까?
              </Text>
              <Text style={styles.modalText}>
                지금 탈퇴하시면 지금까지의 정보가 모두 삭제되고 복구될 수
                없습니다
              </Text>
            </View>
            <View style={styles.Choose}>
              <Pressable style={styles.YesBt} onPress={unlinkUser}>
                <Text style={styles.ChooseTxt}>예</Text>
              </Pressable>
              <Pressable
                style={styles.NoBt}
                onPress={() => setShowQuitModal(false)}>
                <Text style={styles.ChooseTxt}>아니요</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default Quit;

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    flexWrap: 'nowrap',
    backgroundColor: '#E7EBE4',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 2,
  },
  Logout: {
    borderRadius: 10,
    backgroundColor: '#346627',
    width: '100%',
    height: 40,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
  ByeBye: {
    borderRadius: 10,
    backgroundColor: '#B7CBB2',
    width: '100%',
    height: 40,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  Txt: {
    fontWeight: 'bold',
    color: 'white',
  },
  modalBG: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: 246,
    height: 181,
    backgroundColor: 'white',
    borderRadius: 30,
  },
  modalHead: {
    flex: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImg: {
    marginTop: 3,
  },
  modalTextHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: 'black',
    marginVertical: 10,
  },
  modalText: {
    fontSize: 9,
    color: '#8D8D8D',
    paddingHorizontal: 25,
    textAlign: 'center',
  },
  Choose: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  NoBt: {
    width: '49.5%',
    backgroundColor: '#346627',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 30,
  },
  YesBt: {
    width: '49.5%',
    backgroundColor: '#346627',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
  },
  ChooseTxt: {
    color: 'white',
    fontWeight: 'bold',
  },
});
