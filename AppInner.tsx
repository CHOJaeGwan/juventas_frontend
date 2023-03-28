import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import axios, {AxiosError} from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import FindID from './src/pages/FindID';
import {useAppDispatch} from './src/store';
import {RootState} from './src/store/reducer';
import {useSelector} from 'react-redux';
import userSlice from './src/slices/user';
import FindPassword from './src/pages/FindPassword';
import Config from 'react-native-config';
import BoardNavigation from './src/navigations/BoardNavigation';
import Message from './src/pages/Message';
import FirstSetting from './src/pages/FirstSetting';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import HomeNavigation from './src/navigations/HomeNavigation';
import MypageNavigation from './src/navigations/MypageNavigation';
import SettingNavigation from './src/navigations/SettingNavigation';
import SplashScreen from 'react-native-splash-screen';
import MessageNavigation from './src/navigations/MessageNavigation';
import useSocket from './src/hooks/useSockets';

export type LoggedInParamList = {
  Board: undefined;
  Message: undefined;
  Home: undefined;
  Mypage: undefined;
  Setting: undefined;
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  FindID: undefined;
  FindPassword: undefined;
  FirstSetting: undefined;
};

const screenoptions = () => {
  return {
    tabBarStyle: {height: 80},
    tabBarHideOnKeyboard: true,
    tabBarActiveTintColor: '#1F6733',
    tabBarInactiveTintColof: '#DAE2D8',
    tabBarLabelStyle: {fontSize: 11, paddingBottom: 10},
  };
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function AppInner() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector((state: RootState) => !!state.user.id);
  const [socket, disconnect] = useSocket();

  useEffect(() => {
    SplashScreen.hide();
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('refreshToken');
        if (!token) {
          return;
        }
        const response = await axios.get(
          `${Config.API_URL}/user/refreshToken`,
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        dispatch(
          userSlice.actions.setUser({
            id: response.data.id,
            name: response.data.name,
            accessToken: response.data.accessToken,
          }),
        );
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        console.error(errorResponse);
        if (errorResponse) {
          return Alert.alert('알림', errorResponse.data?.message);
        }
      }
    };
    getTokenAndRefresh();
  }, [dispatch]);

  useEffect(() => {
    if (socket && isLoggedIn) {
      console.log(socket);
      // 로그인 했을 때 방 목록 불러오기
    }
    return () => {
      if (socket) {
        console.log('소켓 연결 완료');
      }
    };
  }, [isLoggedIn, socket]);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('!isLoggedIn', !isLoggedIn);
      disconnect();
    }
  }, [isLoggedIn, disconnect]);

  return isLoggedIn ? (
    <Tab.Navigator initialRouteName="HomeNav" screenOptions={screenoptions}>
      <Tab.Screen
        name="BoardNav"
        component={BoardNavigation}
        options={{
          title: 'Board',
          headerShown: false,
          tabBarLabel: '게시판',
          tabBarIcon: ({color}) => (
            <FontAwesome5Icon name="bars" color={color} size={40} />
          ),
        }}
      />
      <Tab.Screen
        name="MessageNavigation"
        component={MessageNavigation}
        options={{
          title: 'Message',
          headerShown: false,
          tabBarLabel: '쪽지',
          tabBarIcon: ({color}) => (
            <AntDesignIcon name="message1" color={color} size={40} />
          ),
        }}
      />
      <Tab.Screen
        name="HomeNav"
        component={HomeNavigation}
        options={{
          title: 'Home',
          headerShown: false,
          tabBarLabel: '홈',
          tabBarIcon: ({color}) => (
            <FontAwesome5Icon name="home" color={color} size={40} />
          ),
        }}
      />
      <Tab.Screen
        name="MypageNav"
        component={MypageNavigation}
        options={{
          title: 'Mypage',
          headerShown: false,
          tabBarLabel: '내정보',
          tabBarIcon: ({color}) => (
            <IoniconsIcon name="person" color={color} size={40} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingNavigation}
        options={{
          title: 'Setting',
          headerShown: false,
          tabBarLabel: '설정',
          tabBarIcon: ({color}) => (
            <IoniconsIcon name="settings" color={color} size={40} />
          ),
        }}
      />
    </Tab.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{title: 'SignIn', headerShown: false}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{title: 'SignUp'}}
      />
      <Stack.Screen
        name="FindID"
        component={FindID}
        options={{title: 'FindID'}}
      />
      <Stack.Screen
        name="FindPassword"
        component={FindPassword}
        options={{title: 'FindPassword'}}
      />
      {/* <Stack.Screen
        name="FirstSetting"
        component={FirstSetting}
        options={{title: 'FirstSetting'}}
      /> */}
    </Stack.Navigator>
  );
}

export default AppInner;
