import React, {useCallback, useDebugValue, useEffect, useState} from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MypageStackNavigationProp} from '../navigations/MypageNavigation';
import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import axios from 'axios';
import Config from 'react-native-config';
import * as Progress from 'react-native-progress';
import ImagePicker from 'react-native-image-crop-picker';

const Mypage = () => {
  const navigation = useNavigation<MypageStackNavigationProp>();
  const [isModifying, setModifying] = useState(false);
  const [profileImg, setImage] = useState(null);
  const [userName, setuserName] = useState('');
  const [Intro, setIntro] = useState('');
  const [percent, setPercent] = useState(0);
  const [profile, setProfile] = useState({
    cat_0: '',
    cat_1: '',
    cat_2: '',
    current_level: '',
    next_level: '',
    percentage: '',
    name: '',
    intro: '',
    quest: '',
    profile_img: '',
  });
  const getPercent = (text: string) => {
    let arr = text.split('%');
    let p = parseInt(arr[0], 10);
    setPercent(p);
  };
  const screenWidth = Dimensions.get('window').width;

  const selectImage = async () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      compressImageQuality: 0.4,
    }).then(image => {
      setImage(image);
    });
  };
  const toSetCategory = useCallback(() => {
    navigation.navigate('SetCategory');
  }, [navigation]);
  const toMyGrade = useCallback(() => {
    navigation.navigate('MyGrade');
  }, [navigation]);
  const toMyCertification = useCallback(() => {
    navigation.navigate('MyCertification');
  }, [navigation]);
  const toMyKnowhow = useCallback(() => {
    navigation.navigate('MyKnowhow');
  }, [navigation]);
  const onChangeName = useCallback((text: string) => {
    setuserName(text);
  }, []);
  const onChangeIntro = useCallback((text: string) => {
    setIntro(text);
  }, []);

  const userID = useSelector((state: RootState) => state.user.id);

  useEffect(() => {
    navigation.addListener('focus', () => {
      const getName = async () => {
        if (isModifying === false) {
          try {
            const response = await axios.get(
              `${Config.API_URL}/mypage/main/${userID}`,
            );
            setProfile(response.data);
            setuserName(response.data.name);
            setIntro(response.data.intro);
            getPercent(response.data.percentage);
          } catch (error) {}
        }
      };
      getName();
    })}, []);

  const changeProfile = async () => {
    if (profileImg != null) {
      const data = new FormData();
      let file = {
        uri: profileImg?.path,
        type: profileImg?.mime,
        name: `profile_${userID}`,
      };
      data.append('image', file);
      axios({
        url: `${Config.API_URL}/img/profile`,
        method: 'POST',
        data,
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(async () => {
          await axios.patch(`${Config.API_URL}/mypage/name`, {
            id: userID,
            name: userName,
            intro: Intro,
            profileImg: `https://kr.object.ncloudstorage.com/profileimg/profile_${userID}`,
          });
        })
        .catch(async () => {
          await axios.patch(`${Config.API_URL}/mypage/name`, {
            id: userID,
            name: userName,
            intro: Intro,
          });
        })
        .finally(async () => {
          const response = await axios.get(
            `${Config.API_URL}/mypage/main/${userID}`,
          );
          setProfile(response.data);
          setuserName(response.data.name);
          setIntro(response.data.intro);
          getPercent(response.data.percentage);
          setImage(null);
        });
    } else {
      await axios.patch(`${Config.API_URL}/mypage/name`, {
        id: userID,
        name: userName,
        intro: Intro,
      });
      const response = await axios.get(
        `${Config.API_URL}/mypage/main/${userID}`,
      );
      setProfile(response.data);
      setuserName(response.data.name);
      setIntro(response.data.intro);
      getPercent(response.data.percentage);
    }
  };

  return (
    <SafeAreaView
      style={isModifying === true ? styles.modifyEntire : styles.entire}>
      {isModifying === true ? (
        <View style={styles.modifyProfile}>
          <View style={styles.profileContent}>
            <View style={styles.Image}>
              {(profile.profile_img === undefined ||
                profile.profile_img === null) &&
              profileImg === null ? (
                <Pressable onPress={selectImage}>
                  <Icon
                    name="md-person-circle-outline"
                    color="gray"
                    size={75}
                  />
                </Pressable>
              ) : (
                <Pressable onPress={selectImage}>
                  <Image
                    style={styles.image}
                    source={{
                      uri:
                        profileImg !== null
                          ? `${profileImg.path}`
                          : `${profile.profile_img}?time=${new Date()}`,
                    }}
                  />
                </Pressable>
              )}
            </View>
            <View style={styles.NameBox}>
              <View style={styles.modifyIntroduce}>
                <TextInput
                  style={styles.NameStModify}
                  value={userName}
                  onChangeText={onChangeName}
                />
                <View style={styles.circle}>
                  <FontAwesome5Icon name="pen-nib" size={12} color="white" />
                </View>
              </View>
              <View style={styles.modifyIntroduce}>
                <TextInput
                  style={styles.IntroduceStModify}
                  value={Intro}
                  onChangeText={onChangeIntro}
                />
                <View style={styles.circle}>
                  <FontAwesome5Icon name="pen-nib" size={12} color="white" />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.Modify_profile}>
            <Pressable
              style={styles.Modify}
              onPress={() => {
                setModifying(false);
                changeProfile();
              }}>
              <Text style={styles.ModifyBt}>프로필 수정완료</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.profile}>
          <View style={styles.profileContent}>
            <View style={styles.Image}>
              {profile.profile_img === undefined ||
              profile.profile_img === null ? (
                <Pressable>
                  <Icon
                    name="md-person-circle-outline"
                    color="gray"
                    size={75}
                  />
                </Pressable>
              ) : (
                <Pressable>
                  <Image
                    style={styles.image}
                    source={{uri: `${profile.profile_img}?time=${new Date()}`}}
                  />
                </Pressable>
              )}
            </View>
            <View style={styles.NameBox}>
              <View>
                <Text style={styles.NameSt}>{profile.name}</Text>
              </View>
              <View style={styles.Introduce}>
                <Text style={styles.IntroduceSt}>{Intro}</Text>
              </View>
            </View>
          </View>
          <View style={styles.Modify_profile}>
            <Pressable
              style={styles.Modify}
              onPress={() => {
                setModifying(true);
              }}>
              <Text style={styles.ModifyBt}>프로필 수정하기</Text>
            </Pressable>
          </View>
        </View>
      )}
      <View style={isModifying ? styles.modify : styles.noModify}>
        <View>
          <Progress.Bar
            progress={percent / 100}
            color={'#346627'}
            unfilledColor={'#EBEFEA'}
            width={screenWidth - 40}
            height={30}
            borderRadius={30}
            style={styles.bar}>
            <Text style={styles.barTxt_1}>
              현재 등급: {profile.current_level} ({profile.percentage})
            </Text>
            <Text style={styles.barTxt_2}>다음등급: {profile.next_level}</Text>
          </Progress.Bar>
        </View>
        <View style={isModifying ? styles.modifyongoing : styles.Ongoing}>
          <View style={styles.OngoingHead}>
            <Text style={styles.FontSt}>수행 중인 도전</Text>
          </View>
          <View style={styles.QuestName}>
            <Text style={styles.Txt}>{profile.quest}</Text>
          </View>
        </View>
        <View style={isModifying ? styles.modifyPrefer : styles.Prefer}>
          <View style={styles.Head}>
            <Text style={styles.FontSt}>선호 카테고리</Text>
          </View>
          <View style={styles.CategoryName}>
            <View style={styles.CategoryBox1}>
              <Text style={styles.Num}>1.</Text>
              <Text style={styles.Txt_2}>{profile.cat_0}</Text>
            </View>
            <View style={styles.CategoryBox2}>
              <Text style={styles.Num}>2.</Text>
              <Text style={styles.Txt_2}>{profile.cat_1}</Text>
            </View>
            <View style={styles.CategoryBox3}>
              <Text style={styles.Num}>3.</Text>
              <Text style={styles.Txt_2}>{profile.cat_2}</Text>
            </View>
          </View>
        </View>
        <View style={isModifying ? styles.modifybox : styles.ModifyBox}>
          <Pressable
            style={styles.Modify}
            onPress={toSetCategory}
            disabled={isModifying ? true : false}>
            <Text style={styles.ModifyBt}>선호 카테고리 재설정</Text>
          </Pressable>
        </View>
        <View style={isModifying ? styles.modifyetc : styles.Etc}>
          <Pressable
            style={styles.EtcBt}
            onPress={toMyGrade}
            disabled={isModifying ? true : false}>
            <Text style={styles.FontSt}>내 등급</Text>
          </Pressable>
          <Pressable
            style={styles.EtcBt}
            onPress={toMyCertification}
            disabled={isModifying ? true : false}>
            <Text style={styles.FontSt}>도전 모음</Text>
          </Pressable>
          <Pressable
            style={styles.EtcBt}
            onPress={toMyKnowhow}
            disabled={isModifying ? true : false}>
            <Text style={styles.FontSt}>내 글</Text>
          </Pressable>
        </View>
        <View style={styles.Adv}>
          <Text />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Mypage;

const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginTop: 5,
  },
  entire: {
    flex: 1,
    flexWrap: 'nowrap',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  modifyEntire: {
    flex: 1,
    flexWrap: 'nowrap',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  profile: {
    height: 120,
    borderStyle: 'solid',
    borderColor: '#B7CBB2',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#F9FAF8',
  },
  modifyProfile: {
    height: 120,
    borderStyle: 'solid',
    borderColor: '#B7CBB2',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: 'white',
    opacity: 1,
    zIndex: 100,
  },
  profileContent: {
    flex: 7,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },

  Image: {flex: 3},
  NameBox: {
    flex: 7,
    paddingVertical: 20,
  },
  NameSt: {
    color: '#3D3C3C',
    fontWeight: 'bold',
    fontSize: 20,
  },
  NameStModify: {
    color: '#3D3C3C',
    fontWeight: 'bold',
    fontSize: 20,
    backgroundColor: 'white',
    height: 24,
    underlineColorAndroid: '#878787',
  },
  IntroduceStModify: {
    color: '#878787',
    height: 22,
    backgroundColor: 'white',
  },
  modifyIntroduce: {
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#878787',
    flexDirection: 'row',
    justifyContent: 'space-between',
    underlineColorAndroid: '#878787',
  },
  Introduce: {
    marginTop: 5,
  },
  IntroduceSt: {
    color: '#878787',
  },
  Modify_profile: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  FontSt: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  circle: {
    backgroundColor: 'gray',
    width: 20,
    height: 20,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar: {
    marginVertical: 10,
    borderWidth: 0,
  },
  modifybar: {
    height: 30,
    backgroundColor: '#EBEFEA',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    opacity: 0.5,
    borderWidth: 0,
  },
  Ongoing: {
    height: 70,
    marginVertical: 5,
    flexDirection: 'column',
  },
  modifyongoing: {
    height: 70,
    marginVertical: 5,
    flexDirection: 'column',
    opacity: 0.5,
  },
  OngoingHead: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B7CBB2',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  QuestName: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAF8',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  Prefer: {
    height: 70,
    marginVertical: 10,
  },
  modifyPrefer: {
    height: 70,
    marginVertical: 10,
    opacity: 0.5,
  },
  Head: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B7CBB2',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  CategoryName: {
    flex: 1.5,
    flexDirection: 'row',
    backgroundColor: '#F9FAF8',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  Num: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    color: '#B7CBB2',
    paddingLeft: 12,
  },
  CategoryBox1: {
    flex: 1,
    flexDirection: 'row',
    borderRightWidth: 2,
    borderRightColor: '#B7CBB2',
    alignItems: 'center',
  },
  CategoryBox2: {
    flex: 1,
    flexDirection: 'row',
    borderRightWidth: 2,
    borderRightColor: '#B7CBB2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  CategoryBox3: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ModifyBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modifybox: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  Modify: {
    height: 27,
    color: '#336627',
    width: '93%',
    borderRadius: 30,
    backgroundColor: '#EBEFEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ModifyBt: {
    fontSize: 12,
    color: '#346627',
  },
  Etc: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 15,
  },
  modifyetc: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 15,
    opacity: 0.5,
  },
  EtcBt: {
    backgroundColor: '#B7CBB2',
    borderRadius: 30,
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 7,
  },
  barTxt_1: {
    position: 'absolute',
    top: 6,
    left: 6,
    color: 'white',
    fontSize: 12,
  },
  barTxt_2: {
    position: 'absolute',
    top: 6,
    right: 20,
    color: 'black',
    fontSize: 12,
  },
  Txt: {
    fontWeight: 'bold',
    color: '#4C4D4C',
  },
  Txt_2: {
    flex: 2,
    fontWeight: 'bold',
    color: '#4C4D4C',
    paddingLeft: 15,
  },
  modify: {
    opacity: 0.5,
  },
  noModify: {
    opacity: 1,
  },
  /* Adv: {
    backgroundColor: 'yellow',
  },*/
});
