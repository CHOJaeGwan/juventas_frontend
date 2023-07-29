import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  SafeAreaView,
  Alert,
  TextInput,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const IconWelcome = require('../../assets/image/welcome.png');
const IconLoading = require('../../assets/image/loading.png');

const FirstSetting = ({
  setState, name
}: {
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  name : string;
}) => {
  const userID = useSelector((state: RootState) => state.user.id);
  const username = name;
  const [firstScreen, setFirstScreen] = useState(0);
  const [Name, setName] = useState('');
  const [NameCheck, setNameCheck] = useState('');
  const [Age, setAge] = useState('');
  const [Sex, setSex] = useState('');
  const [UsingtimeMin, setUsingtimeMin] = useState(0);
  const [UsingtimeMax, setUsingtimeMax] = useState(0);

  const [parent, chooseParent] = useState(false);
  const [spouse, chooseSpouse] = useState(false);
  const [child, chooseChild] = useState(false);
  const [sibling, chooseSibling] = useState(false);
  const [relative, chooseRelative] = useState(false);
  const [lover, chooseLover] = useState(false);
  const [friend, chooseFriend] = useState(false);
  const [pet, choosePet] = useState(false);
  const [etc, chooseEtc] = useState(false);
  const [none, chooseNone] = useState(false);

  const [worker, chooseWorker] = useState(false);
  const [self, chooseSelf] = useState(false);
  const [partTime, choosePartTime] = useState(false);
  const [housemaker, chooseHousemaker] = useState(false);
  const [student, chooseStudent] = useState(false);
  const [nojob, chooseNojob] = useState(false);
  const [official, chooseOfficial] = useState(false);
  const [etcjob, chooseEtcjob] = useState(false);

  const [selected, setSelected] = useState(0);
  const [health, setHealth] = useState(false);
  const [healthOrder, setHealthOrder] = useState(0);
  const [leisure, setLeisure] = useState(false);
  const [leisureOrder, setLeisureOrder] = useState(0);
  const [study, setStudy] = useState(false);
  const [studyOrder, setStudyOrder] = useState(0);
  const [relation, setRelation] = useState(false);
  const [relationOrder, setRelationOrder] = useState(0);
  const timeDATA = [
    '       ~30분',
    '30분~1시간',
    '1시간~2시간',
    '2시간~3시간',
    '3시간~4시간',
    '4시간~5시간',
    '5시간~         ',
  ];

  const onChangeName = (text: string) => {
      setName(text.trim());
      setNameCheck('');
    };

  const onChangeSex = (text: string) => {
      if (text === Sex) {
        setSex('');
      } else {
        setSex(text);
      }
    };

  const onChooseHousemate = (num: number) => {
    if (num === 1) {
      if (parent) {
        chooseParent(false);
      } else {
        chooseParent(true);
        chooseNone(false);
      }
    }
    if (num === 2) {
      if (spouse) {
        chooseSpouse(false);
      } else {
        chooseSpouse(true);
        chooseNone(false);
      }
    }
    if (num === 3) {
      if (child) {
        chooseChild(false);
      } else {
        chooseChild(true);
        chooseNone(false);
      }
    }
    if (num === 4) {
      if (sibling) {
        chooseSibling(false);
      } else {
        chooseSibling(true);
        chooseNone(false);
      }
    }
    if (num === 5) {
      if (relative) {
        chooseRelative(false);
      } else {
        chooseRelative(true);
        chooseNone(false);
      }
    }
    if (num === 6) {
      if (lover) {
        chooseLover(false);
      } else {
        chooseLover(true);
        chooseNone(false);
      }
    }
    if (num === 7) {
      if (friend) {
        chooseFriend(false);
      } else {
        chooseFriend(true);
        chooseNone(false);
      }
    }
    if (num === 8) {
      if (pet) {
        choosePet(false);
      } else {
        choosePet(true);
        chooseNone(false);
      }
    }
    if (num === 9) {
      if (etc) {
        chooseEtc(false);
      } else {
        chooseEtc(true);
        chooseNone(false);
      }
    }
    if (num === 10) {
      if (none) {
        chooseNone(false);
      } else {
        chooseNone(true);
        chooseParent(false);
        chooseSpouse(false);
        chooseChild(false);
        chooseSibling(false);
        chooseRelative(false);
        chooseLover(false);
        chooseFriend(false);
        choosePet(false);
        chooseEtc(false);
      }
    }
    // setHousemate(!parent && !spouse && !child && !sibling && !relative && !lover && !friend && !pet && !etc && !none);
  };
  const onChooseJob = (num: number) => {
    if (num === 1) {
      if (worker) {
        chooseWorker(false);
      } else {
        chooseWorker(true);
        chooseNojob(false);
      }
    }
    if (num === 2) {
      if (self) {
        chooseSelf(false);
      } else {
        chooseSelf(true);
        chooseNojob(false);
      }
    }
    if (num === 3) {
      if (partTime) {
        choosePartTime(false);
      } else {
        choosePartTime(true);
        chooseNojob(false);
      }
    }
    if (num === 4) {
      if (housemaker) {
        chooseHousemaker(false);
      } else {
        chooseHousemaker(true);
        chooseNojob(false);
      }
    }
    if (num === 5) {
      if (student) {
        chooseStudent(false);
      } else {
        chooseStudent(true);
        chooseNojob(false);
      }
    }
    if (num === 6) {
      if (nojob) {
        chooseNojob(false);
      } else {
        chooseNojob(true);
        chooseWorker(false);
        chooseSelf(false);
        choosePartTime(false);
        chooseHousemaker(false);
        chooseStudent(false);
        chooseOfficial(false);
        chooseEtcjob(false);
      }
    }
    if (num === 7) {
      if (official) {
        chooseOfficial(false);
      } else {
        chooseOfficial(true);
        chooseNojob(false);
      }
    }
    if (num === 8) {
      if (etcjob) {
        chooseEtcjob(false);
      } else {
        chooseEtcjob(true);
        chooseNojob(false);
      }
    }
    // setJob(!worker && !self && !partTime && !housemaker && !student && !nojob && !official && !etcjob);
  };
  const onChoosePrefer = (num: number) => {
      if (num === 1) {
        if (!health) {
          setSelected(selected + 1);
          setHealthOrder(selected);
        } else {
          setSelected(selected - 1);
          setHealthOrder(0);
          // if (health && healthOrder > healthOrder) {setHealthOrder(healthOrder-1);}
          if (leisure && leisureOrder > healthOrder) {
            setLeisureOrder(leisureOrder - 1);
          }
          if (study && studyOrder > healthOrder) {
            setStudyOrder(studyOrder - 1);
          }
          if (relation && relationOrder > healthOrder) {
            setRelationOrder(relationOrder - 1);
          }
        }
        setHealth(!health);
      }
      if (num === 2) {
        if (!leisure) {
          setSelected(selected + 1);
          setLeisureOrder(selected);
        } else {
          setSelected(selected - 1);
          setLeisureOrder(0);
          if (health && healthOrder > leisureOrder) {
            setHealthOrder(healthOrder - 1);
          }
          // if (leisure && leisureOrder > leisureOrder) {setLeisureOrder(leisureOrder-1);}
          if (study && studyOrder > leisureOrder) {
            setStudyOrder(studyOrder - 1);
          }
          if (relation && relationOrder > leisureOrder) {
            setRelationOrder(relationOrder - 1);
          }
        }
        setLeisure(!leisure);
      }
      if (num === 3) {
        if (!study) {
          setSelected(selected + 1);
          setStudyOrder(selected);
        } else {
          setSelected(selected - 1);
          setStudyOrder(0);
          if (health && healthOrder > studyOrder) {
            setHealthOrder(healthOrder - 1);
          }
          if (leisure && leisureOrder > studyOrder) {
            setLeisureOrder(leisureOrder - 1);
          }
          // if (study && studyOrder > studyOrder) {setStudyOrder(studyOrder-1);}
          if (relation && relationOrder > studyOrder) {
            setRelationOrder(relationOrder - 1);
          }
        }
        setStudy(!study);
      }
      if (num === 4) {
        if (!relation) {
          setSelected(selected + 1);
          setRelationOrder(selected);
        } else {
          setSelected(selected - 1);
          setRelationOrder(0);
          if (health && healthOrder > relationOrder) {
            setHealthOrder(healthOrder - 1);
          }
          if (leisure && leisureOrder > relationOrder) {
            setLeisureOrder(leisureOrder - 1);
          }
          if (study && studyOrder > relationOrder) {
            setStudyOrder(studyOrder - 1);
          }
          // if (relation && relationOrder > relationOrder) {setRelationOrder(relationOrder-1);}
        }
        setRelation(!relation);
      }
    };

  const onNameCheck = useCallback(
    async (text: string) => {
      if (text === '') {
        Alert.alert('알림', '닉네임은 한 글자 이상이어야 합니다.');
      } else {
        //  중복확인 필요
        try {
          const response = await axios.get(
            `${Config.API_URL}/user/checknickname?nickname=${text}`,
          );
          if (response.data.available) {
            setNameCheck('T');
          } else {
            setNameCheck('F');
          }
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>)
            .response;
          if (errorResponse) {
            return Alert.alert('알림', errorResponse.data?.message);
          }
        }
      }
    },
    [NameCheck],
  );

  const nextScreen = () => {
    if (firstScreen === 1) {
      if (
        NameCheck !== 'T' ||
        !/^\d{1,3}$/.test(Age) ||
        !Sex ||
        (!worker &&
          !self &&
          !partTime &&
          !housemaker &&
          !student &&
          !nojob &&
          !official &&
          !etcjob) ||
        !UsingtimeMin ||
        !UsingtimeMax ||
        UsingtimeMin > UsingtimeMax ||
        (!parent &&
          !spouse &&
          !child &&
          !sibling &&
          !relative &&
          !lover &&
          !friend &&
          !pet &&
          !etc &&
          !none) ||
        selected < 3
      ) {
        if (UsingtimeMin > UsingtimeMax) {
          Alert.alert('알림', '최소시간이 최대시간보다 짧아야 합니다.');
        } else {
          Alert.alert('알림', '입력하지 않은 정보가 있습니다.');
        }
      } else {
        setFirstScreen(firstScreen + 1);
        if (firstScreen >= 1) {
          setUserData();
        }
      }
    } else {
      setFirstScreen(firstScreen + 1);
      if (firstScreen >= 1) {
        setUserData();
      }
    }
  };

  const setUserData = async () => {
    let hm = [];
    if (parent) {
      hm.push('0');
    }
    if (spouse) {
      hm.push('1');
    }
    if (child) {
      hm.push('2');
    }
    if (sibling) {
      hm.push('3');
    }
    if (relative) {
      hm.push('4');
    }
    if (lover) {
      hm.push('5');
    }
    if (friend) {
      hm.push('6');
    }
    if (pet) {
      hm.push('7');
    }
    if (etc) {
      hm.push('8');
    }
    if (none) {
      hm.push('9');
    }

    let jb = [];
    if (worker) {
      jb.push('0');
    }
    if (self) {
      jb.push('1');
    }
    if (partTime) {
      jb.push('2');
    }
    if (housemaker) {
      jb.push('3');
    }
    if (student) {
      jb.push('4');
    }
    if (nojob) {
      jb.push('5');
    }
    if (official) {
      jb.push('6');
    }
    if (etcjob) {
      jb.push('7');
    }

    let pf = ['', '', ''];
    if (health) {
      pf[healthOrder] = '건강';
    }
    if (leisure) {
      pf[leisureOrder] = '여가';
    }
    if (study) {
      pf[studyOrder] = '학습';
    }
    if (relation) {
      pf[relationOrder] = '관계';
    }

    try {
      await axios.patch(`${Config.API_URL}/user/firstsetting`, {
        id: userID,
        nickname: Name,
        age: parseInt(Age),
        sex: Sex,
        livewith: hm.join(''),
        time_min: `${UsingtimeMin - 1}`,
        time_max: `${UsingtimeMax - 1}`,
        cat_0: pf[0],
        cat_1: pf[1],
        cat_2: pf[2],
        job: jb.join(''),
      });
      // 홈화면으로 이동
      setState(false);
    } catch (error) {
      const errorResponse = (error as AxiosError<{message: string}>).response;
      if (errorResponse) {
        return Alert.alert('알림', errorResponse.data?.message);
      }
    }
  };
  return (
    <SafeAreaView style={styles.entire}>
      {!firstScreen && (
        <View style={styles.header}>
          <Image source={IconWelcome} style={styles.image} />
          <Text style={styles.headerText}>
            환영합니다 <Text style={styles.headerTextBold}>{username}</Text> 님!
          </Text>
        </View>
      )}
      {firstScreen === 1 && (
        <KeyboardAwareScrollView style={styles.setting}>
          <View style={styles.title}>
            <Text style={styles.titleTxt}>
              다음 중 {username}님에게 해당되는 사항은 무엇인가요?
            </Text>
            <Text style={styles.titleTxtBig}>
              {username}님에 대해 알려주세요!
            </Text>
          </View>
          <View style={styles.name}>
            <TextInput
              placeholder="닉네임"
              placeholderTextColor={'#B7CBB2'}
              selectionColor={'#346627'}
              style={NameCheck === 'F' ? styles.nameInputRed : styles.nameInput}
              autoCapitalize="none"
              onChangeText={onChangeName}
              textContentType="name"
              value={Name}
              clearButtonMode="while-editing"
            />
            <Pressable
              onPress={() => onNameCheck(Name)}
              style={styles.nameCheck}>
              {NameCheck !== 'T' && (
                <Text style={styles.nameCheckTxt}>중복 확인</Text>
              )}
              {NameCheck === 'T' && (
                <Text style={styles.nameCheckTxt}>확인 완료</Text>
              )}
            </Pressable>
          </View>
          {NameCheck === 'T' && (
            <Text style={styles.nameAvailable}>
              • 사용 가능한 닉네임입니다.
            </Text>
          )}
          {NameCheck === 'F' && (
            <Text style={styles.nameUnAvailable}>
              • 이미 사용 중인 닉네임입니다. 다른 닉네임을 작성해주세요.
            </Text>
          )}
          <View style={styles.select}>
            <View style={styles.selectTitle}>
              <Text style={styles.selectTxt}>
                {userID}님의 나이를 알려주세요
              </Text>
            </View>
            <View style={styles.selectView}>
              <TextInput
                placeholder="00세"
                placeholderTextColor={'#B7CBB2'}
                selectionColor={'#346627'}
                style={styles.ageInput}
                autoCapitalize="none"
                onChangeText={(text: string) => {
                  if (!/^\d{0,3}$/.test(text)) {
                    Alert.alert('알림', '숫자를 입력해주세요.');
                    setAge('');
                  } else {
                    setAge(text);
                  }
                }}
                keyboardType="number-pad"
                value={Age}
                clearButtonMode="never"
              />
            </View>
          </View>
          <View style={styles.select}>
            <View style={styles.selectTitle}>
              <Text style={styles.selectTxt}>
                {userID}님의 성별을 선택해주세요
              </Text>
            </View>
            <View style={styles.selectView}>
              <Pressable
                onPress={() => onChangeSex('M')}
                style={Sex === 'M' ? styles.selectedBtn : styles.selectBtn}>
                <Text
                  style={
                    Sex === 'M' ? styles.selectedBtnTxt : styles.selectBtnTxt
                  }>
                  남자
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onChangeSex('F')}
                style={Sex === 'F' ? styles.selectedBtn : styles.selectBtn}>
                <Text
                  style={
                    Sex === 'F' ? styles.selectedBtnTxt : styles.selectBtnTxt
                  }>
                  여자
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onChangeSex('N')}
                style={
                  Sex === 'N' ? styles.selectedBtnBig : styles.selectBtnBig
                }>
                <Text
                  style={
                    Sex === 'N' ? styles.selectedBtnTxt : styles.selectBtnTxt
                  }>
                  밝히지 않음
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.select}>
            <View style={styles.selectTitle}>
              <Text style={styles.selectTxt}>
                {userID}님은 누구와 함께 사시나요?
              </Text>
              <Text style={styles.selectTxtSmall}>(중복 선택 가능)</Text>
            </View>
            <View style={styles.selectView}>
              <Pressable
                onPress={() => onChooseHousemate(1)}
                style={parent ? styles.selectedBtn : styles.selectBtn}>
                <Text
                  style={parent ? styles.selectedBtnTxt : styles.selectBtnTxt}>
                  부모님
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onChooseHousemate(2)}
                style={spouse ? styles.selectedBtn : styles.selectBtn}>
                <Text
                  style={spouse ? styles.selectedBtnTxt : styles.selectBtnTxt}>
                  배우자
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onChooseHousemate(3)}
                style={child ? styles.selectedBtn : styles.selectBtn}>
                <Text
                  style={child ? styles.selectedBtnTxt : styles.selectBtnTxt}>
                  자녀
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onChooseHousemate(4)}
                style={sibling ? styles.selectedBtn : styles.selectBtn}>
                <Text
                  style={sibling ? styles.selectedBtnTxt : styles.selectBtnTxt}>
                  형제자매
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onChooseHousemate(5)}
                style={relative ? styles.selectedBtn : styles.selectBtn}>
                <Text
                  style={
                    relative ? styles.selectedBtnTxt : styles.selectBtnTxt
                  }>
                  기타 친인척
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onChooseHousemate(6)}
                style={lover ? styles.selectedBtn : styles.selectBtn}>
                <Text
                  style={lover ? styles.selectedBtnTxt : styles.selectBtnTxt}>
                  애인
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onChooseHousemate(7)}
                style={friend ? styles.selectedBtn : styles.selectBtn}>
                <Text
                  style={friend ? styles.selectedBtnTxt : styles.selectBtnTxt}>
                  친구
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onChooseHousemate(8)}
                style={pet ? styles.selectedBtn : styles.selectBtn}>
                <Text style={pet ? styles.selectedBtnTxt : styles.selectBtnTxt}>
                  반려동물
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onChooseHousemate(9)}
                style={etc ? styles.selectedBtn : styles.selectBtn}>
                <Text style={etc ? styles.selectedBtnTxt : styles.selectBtnTxt}>
                  기타
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onChooseHousemate(10)}
                style={none ? styles.selectedBtn : styles.selectBtn}>
                <Text
                  style={none ? styles.selectedBtnTxt : styles.selectBtnTxt}>
                  없음
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.select}>
            <View style={styles.selectTitle}>
              <Text style={styles.selectTxt}>
                '하루도전'에 평균적으로 몇 시간을 쓸 수 있나요?
              </Text>
            </View>
            <View style={styles.selectView}>
              <Text style={styles.perDay}>하루{'\n'}기준</Text>
              {/* dropdown */}
              <SelectDropdown
                data={timeDATA}
                onSelect={(_selectedItem, index) => {
                  if (UsingtimeMin === index + 1) {
                    setUsingtimeMin(0);
                  } else {
                    setUsingtimeMin(index + 1);
                  }
                }}
                defaultButtonText="최소"
                defaultValue={0}
                buttonTextAfterSelection={(selectedItem, _index) => {
                  if (UsingtimeMin === 0) {
                    return '최소';
                  } else {
                    return timeDATA[UsingtimeMin - 1];
                  }
                }}
                buttonStyle={
                  UsingtimeMin === 0 ? styles.category : styles.categorySelected
                }
                buttonTextStyle={
                  UsingtimeMin === 0
                    ? styles.categoryTxt
                    : styles.categoryTxtSelected
                }
                renderDropdownIcon={() => {
                  return (
                    UsingtimeMin === 0 && (
                      <FontAwesome5Icon
                        name="caret-down"
                        size={30}
                        color="#DAE2D8"
                        style={styles.categoryIcon}
                      />
                    )
                  );
                }}
                dropdownOverlayColor="transparent"
                rowStyle={styles.categoryRow}
                rowTextStyle={styles.categoryTxt}
              />
              <Text style={styles.perDay}>~</Text>
              {/* dropdown */}
              <SelectDropdown
                data={timeDATA}
                onSelect={(_selectedItem, index) => {
                  if (UsingtimeMax === index + 1) {
                    setUsingtimeMax(0);
                  } else {
                    setUsingtimeMax(index + 1);
                  }
                }}
                defaultButtonText="최대"
                defaultValue={0}
                buttonTextAfterSelection={(selectedItem, _index) => {
                  if (UsingtimeMax === 0) {
                    return '최대';
                  } else {
                    return timeDATA[UsingtimeMax - 1];
                  }
                }}
                buttonStyle={
                  UsingtimeMax === 0 ? styles.category : styles.categorySelected
                }
                buttonTextStyle={
                  UsingtimeMax === 0
                    ? styles.categoryTxt
                    : styles.categoryTxtSelected
                }
                renderDropdownIcon={() => {
                  return (
                    UsingtimeMax === 0 && (
                      <FontAwesome5Icon
                        name="caret-down"
                        size={30}
                        color="#DAE2D8"
                        style={styles.categoryIcon}
                      />
                    )
                  );
                }}
                dropdownOverlayColor="transparent"
                rowStyle={styles.categoryRow}
                rowTextStyle={styles.categoryTxt}
              />
            </View>
          </View>
          <View style={styles.select}>
            <View style={styles.selectTitle}>
              <Text style={styles.selectTxt}>
                {userID}님의 직업은 무엇인가요?
              </Text>
              <Text style={styles.selectTxtSmall}>(중복 선택 가능)</Text>
            </View>
            <View style={styles.selectView}>
              <Pressable
                onPress={() => onChooseJob(1)}
                style={worker ? styles.selectedBtn : styles.selectBtn}>
                <Text
                  style={worker ? styles.selectedBtnTxt : styles.selectBtnTxt}>
                  직장인
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onChooseJob(2)}
                style={self ? styles.selectedBtn : styles.selectBtn}>
                <Text
                  style={self ? styles.selectedBtnTxt : styles.selectBtnTxt}>
                  자영업자
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onChooseJob(3)}
                style={partTime ? styles.selectedBtn : styles.selectBtn}>
                <Text
                  style={
                    partTime ? styles.selectedBtnTxt : styles.selectBtnTxt
                  }>
                  알바
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onChooseJob(4)}
                style={housemaker ? styles.selectedBtn : styles.selectBtn}>
                <Text
                  style={
                    housemaker ? styles.selectedBtnTxt : styles.selectBtnTxt
                  }>
                  주부
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onChooseJob(5)}
                style={student ? styles.selectedBtn : styles.selectBtn}>
                <Text
                  style={student ? styles.selectedBtnTxt : styles.selectBtnTxt}>
                  학생
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onChooseJob(6)}
                style={nojob ? styles.selectedBtn : styles.selectBtn}>
                <Text
                  style={nojob ? styles.selectedBtnTxt : styles.selectBtnTxt}>
                  무직
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onChooseJob(7)}
                style={official ? styles.selectedBtn : styles.selectBtn}>
                <Text
                  style={
                    official ? styles.selectedBtnTxt : styles.selectBtnTxt
                  }>
                  공무원
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onChooseJob(8)}
                style={etcjob ? styles.selectedBtn : styles.selectBtn}>
                <Text
                  style={etcjob ? styles.selectedBtnTxt : styles.selectBtnTxt}>
                  기타
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.select}>
            <View style={styles.selectTitle}>
              <Text style={styles.selectTxt}>
                {userID}님이 해보고 싶은 도전을 선택해주세요
              </Text>
              <Text style={styles.selectTxtSmall}>(선호순으로 3개 선택)</Text>
            </View>
            <View style={styles.selectView}>
              <Pressable
                style={health ? styles.selectedBtn : styles.selectBtn}
                onPress={() => {
                  onChoosePrefer(1);
                }}>
                {health && (
                  <View style={styles.prefer}>
                    <Text style={styles.preferTxt}>{healthOrder + 1}</Text>
                  </View>
                )}
                <Text
                  style={health ? styles.selectedBtnTxt : styles.selectBtnTxt}>
                  건강
                </Text>
              </Pressable>
              <Pressable
                style={leisure ? styles.selectedBtn : styles.selectBtn}
                onPress={() => {
                  onChoosePrefer(2);
                }}>
                {leisure && (
                  <View style={styles.prefer}>
                    <Text style={styles.preferTxt}>{leisureOrder + 1}</Text>
                  </View>
                )}
                <Text
                  style={leisure ? styles.selectedBtnTxt : styles.selectBtnTxt}>
                  여가
                </Text>
              </Pressable>
              <Pressable
                style={study ? styles.selectedBtn : styles.selectBtn}
                onPress={() => {
                  onChoosePrefer(3);
                }}>
                {study && (
                  <View style={styles.prefer}>
                    <Text style={styles.preferTxt}>{studyOrder + 1}</Text>
                  </View>
                )}
                <Text
                  style={study ? styles.selectedBtnTxt : styles.selectBtnTxt}>
                  학습
                </Text>
              </Pressable>
              <Pressable
                style={relation ? styles.selectedBtn : styles.selectBtn}
                onPress={() => {
                  onChoosePrefer(4);
                }}>
                {relation && (
                  <View style={styles.prefer}>
                    <Text style={styles.preferTxt}>{relationOrder + 1}</Text>
                  </View>
                )}
                <Text
                  style={
                    relation ? styles.selectedBtnTxt : styles.selectBtnTxt
                  }>
                  관계
                </Text>
              </Pressable>
              <View style={styles.ex}>
                <Text style={styles.exTxt}>건강 예시 ) 아침에 조깅하기</Text>
                <Text style={styles.exTxt}>
                  여가 예시 ) 영화관에서 영화 한 편 시청하기
                </Text>
                <Text style={styles.exTxt}>
                  학습 예시 ) 독서 토론 모임에 가입하기
                </Text>
                <Text style={styles.exTxt}>
                  관계 예시 ) 가족들과 저녁 만들어 먹기
                </Text>
              </View>
            </View>
          </View>
          <Pressable style={styles.setUpBtnSecondPage} onPress={nextScreen}>
            <Text style={styles.setUpBtnText}>기본 사항 설정하기</Text>
          </Pressable>
        </KeyboardAwareScrollView>
      )}
      {firstScreen === 2 && (
        <View style={styles.header}>
          <Image source={IconLoading} style={styles.imageSmall} />
          <Text style={styles.headerTextSmall}>
            {userID}님의 취향에 맞게 설정하고 있어요
          </Text>
        </View>
      )}
      {!firstScreen && (
        <View style={styles.body}>
          <Text style={styles.bodyText}>
            도전을 시작하기 위해 {userID}님에 대해 알려주세요
          </Text>
          <Pressable style={styles.setUpBtn} onPress={nextScreen}>
            <Text style={styles.setUpBtnText}>기본 사항 설정하기</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
  },
  image: {
    width: 300,
    height: 370,
  },
  imageSmall: {
    width: 180,
    height: 180,
    marginTop: '40%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 20,
    color: '#346627',
  },
  headerTextSmall: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 20,
    color: '#346627',
  },
  headerTextBold: {
    fontSize: 30,
    fontWeight: '900',
  },
  body: {
    marginTop: 60,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    flex: 1,
  },
  bodyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#346627',
  },
  setUpBtn: {
    backgroundColor: '#346627',
    width: '100%',
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  setUpBtnSecondPage: {
    backgroundColor: '#346627',
    width: '100%',
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  setUpBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },

  setting: {
    marginHorizontal: 20,
  },
  username: {},
  title: {
    marginVertical: 25,
  },
  titleTxt: {
    fontSize: 16,
    fontWeight: '400',
    color: '#346627',
    textAlign: 'center',
  },
  titleTxtBig: {
    fontSize: 20,
    fontWeight: '400',
    color: '#346627',
    textAlign: 'center',
  },
  name: {
    flexDirection: 'row',
    borderColor: '#B7CBB2',
    borderRadius: 10,
    borderWidth: 1.2,
    marginBottom: 20,
  },
  nameInput: {
    flex: 1,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 115,
    color: '#346627',
    backgroundColor: 'white',
    borderRadius: 10,
    fontSize: 18,
    fontWeight: '400',
  },
  nameInputRed: {
    flex: 1,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 115,
    color: '#B74F38',
    backgroundColor: 'white',
    borderRadius: 10,
    fontSize: 18,
    fontWeight: '400',
  },
  nameCheck: {
    position: 'absolute',
    height: 30,
    right: 5,
    top: 4,
    backgroundColor: '#B7CBB2',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  nameCheckTxt: {
    fontSize: 18,
    fontWeight: '400',
    color: 'white',
  },
  nameAvailable: {
    color: '#346627',
    fontSize: 12,
    fontWeight: '400',
    top: -10,
  },
  nameUnAvailable: {
    color: '#B74F38',
    fontSize: 12,
    fontWeight: '400',
    top: -10,
  },
  ageInput: {
    flex: 1,
    padding: 0,
    paddingLeft: 10,
    marginRight: 10,
    textAlign: 'center',
    color: '#346627',
    fontSize: 18,
    fontWeight: '400',
  },
  select: {
    marginBottom: 20,
  },
  selectTitle: {
    backgroundColor: '#346627',
    borderWidth: 1.2,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    alignItems: 'center',
    borderColor: '#346627',
    paddingVertical: 6,
  },
  selectTxt: {
    fontWeight: '400',
    fontSize: 18,
    color: 'white',
  },
  selectTxtSmall: {
    fontWeight: '400',
    fontSize: 16,
    color: 'white',
  },
  selectView: {
    alignItems: 'center',
    borderWidth: 1.2,
    borderTopWidth: 0,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderColor: '#346627',
    paddingVertical: 5,
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingLeft: '3%',
  },
  selectBtn: {
    borderWidth: 1,
    borderColor: '#B7CBB2',
    borderRadius: 10,
    width: '47%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '3%',
    marginVertical: 3,
  },
  selectedBtn: {
    backgroundColor: '#B7CBB2',
    borderWidth: 1,
    borderColor: '#B7CBB2',
    borderRadius: 10,
    width: '47%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '3%',
    marginVertical: 3,
  },
  selectBtnTxt: {
    color: '#B7CBB2',
    fontWeight: '400',
    fontSize: 18,
    marginVertical: 2,
  },
  selectedBtnTxt: {
    color: 'white',
    fontWeight: '400',
    fontSize: 18,
    marginVertical: 2,
  },
  selectBtnBig: {
    borderWidth: 1,
    borderColor: '#B7CBB2',
    borderRadius: 10,
    width: '97%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '3%',
    marginVertical: 3,
  },
  selectedBtnBig: {
    backgroundColor: '#B7CBB2',
    borderWidth: 1,
    borderColor: '#B7CBB2',
    borderRadius: 10,
    width: '97%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '3%',
    marginVertical: 3,
  },
  perDay: {
    color: '#B7CBB2',
    fontSize: 18,
    fontWeight: '400',
    marginHorizontal: 5,
  },
  ex: {
    margin: 6,
  },
  exTxt: {
    color: 'rgba(151, 151, 151, 0.79)',
    fontSize: 18,
    fontWeight: '400',
  },
  prefer: {
    position: 'absolute',
    left: 5,
    backgroundColor: 'white',
    width: 20,
    height: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preferTxt: {
    color: '#B7CBB2',
    fontSize: 18,
    fontWeight: '400',
    top: -2,
  },
  category: {
    backgroundColor: 'transparent',
    width: '38%',
    borderColor: '#B7CBB2',
    borderWidth: 1,
    borderRadius: 10,
    height: 35,
    // marginLeft: 10
  },
  categorySelected: {
    backgroundColor: '#B7CBB2',
    width: '38%',
    borderColor: '#B7CBB2',
    borderWidth: 1,
    borderRadius: 10,
    height: 35,
  },
  categoryTxt: {
    color: '#B7CBB2',
    fontWeight: '400',
    fontSize: 17,
  },
  categoryTxtSelected: {
    color: 'white',
    fontWeight: '400',
    fontSize: 17,
  },
  categoryRow: {
    backgroundColor: 'white',
    // alignContent: 'space-around',
    height: 35,
  },
  categoryIcon: {},
});

export default FirstSetting;
