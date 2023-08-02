import React, {useState, useCallback, useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  Modal,
  Alert,
  Image,
} from 'react-native';
import {BoardStackParamList} from '../navigations/BoardNavigation';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import CheckIcon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type BoardScreenProps = NativeStackScreenProps<BoardStackParamList, 'NewPost'>;

const NewPost = ({navigation}: BoardScreenProps) => {
  const [categorySelected, setCategorySelected] = useState<number | null>(null);
  const [filterSelected, setFilterSelected] = useState<number | null>(null);
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showModal, setShowModal] = useState(false);

  const categoryDATA = ['건강', '여가', '학습', '관계'];
  const filterDATA = ['노하우', '질문'];
  const userID = useSelector((state: RootState) => state.user.id);

  const onChangeTitle = useCallback((text: string) => {
    setTitle(text);
  }, []);
  const onChangeContent = useCallback((text: string) => {
    setContent(text);
  }, []);
  const writeDone = useCallback(() => {
    setShowModal(true);
  }, []);

  const selectImage = async () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      compressImageQuality: 0.4,
      multiple: true,
    }).then(image => {
      if (image.length > 3) {
        Alert.alert('알림', '이미지는 3개까지만 업로드 가능합니다.');
      } else {
        setImages(image);
      }
    });
  };

  let temp: string;
  let files_length = 0;
  const upload = async () => {
    if (filterSelected === 1) {
      temp = 'T';
    } else {
      temp = 'F';
    }
    if (images.length > 0) {
      const data = new FormData();
      let files = [];
      images.map(x => {
        let file = {
          uri: x?.path,
          type: x?.mime,
          name: `${userID}_${new Date().getTime()}_${files.length}`,
        };
        files.push(file);
        data.append('image', file);
      });
      files_length = files.length;
      axios({
        url: `${Config.API_URL}/img/board`,
        method: 'POST',
        data,
        headers: {'Content-Type': 'multipart/form-data'},
      }).finally(async () => {
        await axios.post(`${Config.API_URL}/board/post`, {
          id: userID,
          c_id: categorySelected,
          q_id: 0,
          is_qna: temp,
          title: title,
          content: content,
          img_path_1:
            files_length >= 1
              ? `https://kr.object.ncloudstorage.com/boardimg/${files[0].name}`
              : undefined,
          img_path_2:
            files_length >= 2
              ? `https://kr.object.ncloudstorage.com/boardimg/${files[1].name}`
              : undefined,
          img_path_3:
            files_length >= 3
              ? `https://kr.object.ncloudstorage.com/boardimg/${files[2].name}`
              : undefined,
        });
        navigation.goBack();
      });
    } else {
      await axios.post(`${Config.API_URL}/board/post`, {
        id: userID,
        c_id: categorySelected,
        q_id: 0,
        is_qna: temp,
        title: title,
        content: content,
      });
      navigation.goBack();
    }
  };
  useEffect(() => {
    navigation.addListener('focus', () => {
    })
  }, [categorySelected, filterSelected]);

  return (
    <KeyboardAwareScrollView>
      <SafeAreaView style={styles.Background}>
        <View>
          <SelectDropdown
            data={categoryDATA}
            onSelect={(_selectedItem, index) => {
              setCategorySelected(index);
            }}
            defaultButtonText="카테고리"
            defaultValue={0}
            buttonTextAfterSelection={(selectedItem, _index) => {
              return selectedItem;
            }}
            buttonStyle={styles.listBt}
            buttonTextStyle={styles.categoryList}
            renderDropdownIcon={() => {
              return (
                <FontAwesome5Icon
                  name="caret-down"
                  size={30}
                  color="#DAE2D8"
                  style={styles.categoryIcon}
                />
              );
            }}
            dropdownOverlayColor="transparent"
            rowStyle={styles.RowSt}
            rowTextStyle={styles.RowTxtSt}
            selectedRowTextStyle={styles.selectedTxt}
          />
          <SelectDropdown
            data={filterDATA}
            onSelect={(_selectedItem, index) => {
              setFilterSelected(index);
            }}
            defaultButtonText="필터"
            defaultValue={0}
            buttonTextAfterSelection={(selectedItem, _index) => {
              return selectedItem;
            }}
            buttonStyle={styles.listBt}
            buttonTextStyle={styles.categoryList}
            renderDropdownIcon={() => {
              return (
                <FontAwesome5Icon
                  name="caret-down"
                  size={30}
                  color="#DAE2D8"
                  style={styles.categoryIcon}
                />
              );
            }}
            dropdownOverlayColor="transparent"
            rowStyle={styles.RowSt}
            rowTextStyle={styles.RowTxtSt}
            selectedRowTextStyle={styles.selectedTxt}
          />
        </View>
        <View style={styles.board}>
          <Pressable
            android_ripple={{
              color: '#ffffff',
            }}
            style={styles.circle}
            onPress={selectImage}>
            <Icon name="camera-alt" color="white" size={24} />
          </Pressable>

          <TextInput
            style={styles.titleInput}
            placeholder="제목을 입력하세요"
            placeholderTextColor="#B7CBB2"
            multiline={true}
            value={title}
            onChangeText={onChangeTitle}
            maxLength={100}
          />
          <TextInput
            style={styles.contentInput}
            placeholder="내용을 입력하세요"
            placeholderTextColor="#B7CBB2"
            multiline={true}
            value={content}
            onChangeText={onChangeContent}
            maxLength={5000}
          />
          <View style={styles.imageContainer}>
            {images.map(x => (
              <Image
                style={styles.image}
                source={{uri: x.path}}
                resizeMode="center"
              />
            ))}
          </View>
        </View>
        <View>
          <Pressable style={styles.complete} onPress={writeDone}>
            <Text style={{color: '#346627'}}>업로드</Text>
          </Pressable>
        </View>
        <Modal transparent={true} visible={showModal}>
          <Pressable style={styles.modalBG} onPress={() => setShowModal(false)}>
            <View style={styles.modal}>
              <View style={styles.modalHead}>
                <CheckIcon
                  name="check-circle"
                  size={50}
                  color="#F6DD55"
                  style={styles.modalImg}
                />
                <Text style={styles.modalTextHeader}>
                  글을 업로드 하시겠습니까?
                </Text>
              </View>
              <View style={styles.Choose}>
                <Pressable style={styles.YesBt} onPress={upload}>
                  <Text style={styles.ChooseTxt}>예</Text>
                </Pressable>
                <Pressable
                  style={styles.NoBt}
                  onPress={() => setShowModal(false)}>
                  <Text style={styles.ChooseTxt}>아니요</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    marginHorizontal: '10%',
    width: '80%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  Background: {
    backgroundColor: '#DAE2D8',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 100,
  },
  upLoad: {
    color: '#1F6733',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 10,
  },
  listBt: {
    width: 350,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 5,
  },
  categoryList: {
    fontSize: 18,
    fontWeight: '600',
    color: '#B7CBB2',
    textAlign: 'left',
  },
  categoryIcon: {
    marginRight: 15,
  },
  RowSt: {
    backgroundColor: '#B7CBB2',
    alignContent: 'space-around',
  },
  RowTxtSt: {
    color: 'white',
    textAlign: 'left',
    fontSize: 18,
    fontWeight: '600',
  },
  selectedTxt: {
    color: '#346627',
  },
  board: {
    minHeight: 470,
    width: 350,
    borderRadius: 10,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  questInput: {
    fontWeight: 'bold',
    fontSize: 12,
    paddingHorizontal: 21,
    paddingTop: 10,
    paddingBottom: 5,
  },
  titleInput: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingHorizontal: 21,
    paddingTop: 10,
    paddingBottom: 10,
    width: '83%',
  },
  contentInput: {
    fontSize: 17,
    paddingHorizontal: 21,
    paddingTop: 10,
    paddingBottom: 5,
  },
  circle: {
    backgroundColor: '#B7CBB2',
    borderRadius: 27,
    height: 49,
    width: 49,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 19,
    right: 10,
    zIndex: 3,
  },
  complete: {
    backgroundColor: 'white',
    borderRadius: 7.5,
    height: 30,
    width: 160,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#346627',
    borderWidth: 1,
    marginTop: 8,
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

export default NewPost;
