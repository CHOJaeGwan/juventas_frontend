import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import axios, {AxiosError} from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import Term from './src/pages/Term';
import {useAppDispatch} from './src/store';
import {RootState} from './src/store/reducer';
import {useSelector} from 'react-redux';
import userSlice from './src/slices/user';
import FindPassword from './src/pages/FindPassword';
import Config from 'react-native-config';
import BoardNavigation from './src/navigations/BoardNavigation';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import HomeNavigation from './src/navigations/HomeNavigation';
import MypageNavigation from './src/navigations/MypageNavigation';
import SettingNavigation from './src/navigations/SettingNavigation';
import SplashScreen from 'react-native-splash-screen';
import MessageNavigation from './src/navigations/MessageNavigation';
import useSocket from './src/hooks/useSockets';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import FirstSetting from './src/pages/FirstSetting';
import {useNavigation} from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';

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
  Term: undefined;
  FindPassword: undefined;
};

const screenoptions = () => {
  return {
    tabBarStyle: {height: 80},
    tabBarHideOnKeyboard: true,
    tabBarActiveTintColor: '#1F6733',
    tabBarInactiveTintColor: '#DAE2D8',
    tabBarLabelStyle: {fontSize: 11, paddingBottom: 10},
  };
};
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function AppInner() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector((state: RootState) => !!state.user.id);
  const [socket, disconnect] = useSocket();
  const [isFirstLogin, setFirstLogin] = useState(true);
  const [username, setUserName] = useState('');

  useEffect(() => {
    SplashScreen.hide();
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('refreshToken');
        if (!token) {
          return;
        }
        const response = await axios.patch(
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

  const userID = useSelector((state: RootState) => state.user.id);
  useEffect(() => {
    if (!isLoggedIn) {
      console.log('!isLoggedIn', !isLoggedIn);
      disconnect();
    } else {
      console.log('Loggedin', isFirstLogin);
      const getFirstHomeData = async () => {
        try {
          const response = await axios.get(
            `${Config.API_URL}/quest/questselected/${userID}`,
          );
          setUserName(response.data.username);
          if (response.data.is_first === 'F') {
            setFirstLogin(false);
          }
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>)
            .response;
          console.error(errorResponse);
          if (errorResponse) {
            return Alert.alert('알림', errorResponse.data?.message);
          }
        }
      };
      getFirstHomeData();
    }
  }, [isLoggedIn, disconnect, isFirstLogin, setFirstLogin]);

  return isLoggedIn ? (
    !isFirstLogin ? (
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
      <FirstSetting setState={setFirstLogin} name={username} />
    )
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {backgroundColor: '#F5F5F5'},
        }}
      />
      <Stack.Screen
        name="Term"
        component={Term}
        options={{
          headerTitle: '이용약관',
          headerTintColor: '#346627',
          headerTitleStyle: {fontSize: 22, fontWeight: '800'},
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: {backgroundColor: '#F5F5F5'},
        }}
      />
      <Stack.Screen
        name="FindPassword"
        component={FindPassword}
        options={{
          title: '',
          headerShadowVisible: false,
          headerStyle: {backgroundColor: '#F5F5F5'},
        }}
      />
    </Stack.Navigator>
  );
}

export default AppInner;
