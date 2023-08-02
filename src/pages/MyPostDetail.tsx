import React, {useCallback, useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
  RefreshControl,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import CommentItem from '../components/CommentItem';
import {MypageStackParamList} from '../navigations/MypageNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

type MyPostDetailScreenProps = NativeStackScreenProps<
  MypageStackParamList,
  'MyPostDetail'
>;
type PostItemProps = {
  is_qna: string;
  title: string;
  content: string;
  img_path_1: string;
  img_path_2: string;
  img_path_3: string;
  user_id: number;
  user_name: string;
  like: number;
  myrec: number;
  profile_img: string;
};
type CommentItemProps = {
  incr: number;
  c_content: string;
  user_id: number;
  user_name: string;
  like: number;
  myrec: number;
  r_id: number;
  profile_img: string;
};

function MyPostDetail({navigation, route}: MyPostDetailScreenProps) {
  const idCurrent = route.params.postID;
  const setQid = useCallback((id: string) => {
    AsyncStorage.setItem('postId', id, () => [console.log('저장완료')]);
  }, []);
  const [postDATA, setPostDATA] = useState<PostItemProps>({
    is_qna: 'T',
    title: '',
    content: '',
    img_path_1: 'undefined',
    img_path_2: 'undefined',
    img_path_3: 'undefined',
    user_id: 0,
    user_name: '',
    like: 0,
    myrec: 0,
    profile_img: 'undefined',
  });
  const [commentDATA, setCommentDATA] = useState<CommentItemProps[]>([]);
  const [RecommentDATA, setReCommentDATA] = useState<CommentItemProps[]>([]);
  const [commentValue, setCommentValue] = useState('');
  const [needReset, setNeedReset] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [writeRc, setWriteRc] = useState('T');
  const [rid, setRid] = useState(0);
  const textInputRef = useRef<TextInput>(null);
  const handleValueChange = (incr: number) => {
    setWriteRc('T');
    setRid(incr);
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const onChangeComment = useCallback((text: string) => {
    setCommentValue(text);
  }, []);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  navigation.setOptions({
    headerTitle: postDATA.is_qna === 'T' ? '질문' : '노하우',
    headerStyle: {backgroundColor: '#DAE2D8'},
    headerRight: () => (
      <Pressable
        onPress={() => {
          {
            setQid(idCurrent.toString());
            navigation.navigate('ModifyMyknowhow');
          }
        }}>
        <Text style={{color: '#346627', fontSize: 15, fontWeight: '800'}}>
          수정하기
        </Text>
      </Pressable>
    ),
  });

  const getBoardAndRefresh = useCallback(() => {
    const getBoardRefresh = async () => {
      try {
        const response = await axios.get(
          `${Config.API_URL}/board/post/${idCurrent}?id='${userID}'`,
        );
        setPostDATA(response.data.post[0]);
        setMyPostRecommend(response.data.post[0].myrec);
        setCommentDATA(response.data.comment);
        setReCommentDATA(response.data.comment2);
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        if (errorResponse) {
          return Alert.alert('알림', errorResponse.data?.message);
        }
      }
    };
    getBoardRefresh();
  }, []);

  useEffect(() => {
    navigation.addListener('focus', () => {
      getBoardAndRefresh();
    })
  }, []);

  const userID = useSelector((state: RootState) => state.user.id);
  const [myPostRecommend, setMyPostRecommend] = useState(0);
  const recommendPost = useCallback(() => {
    if (myPostRecommend) {
      Alert.alert('이미 추천한 게시글입니다.');
    } else {
      setMyPostRecommend(1);
      const recommendPostWait = async () => {
        try {
          const response = await axios.post(
            `${Config.API_URL}/board/likepost`,
            {
              id: userID,
              w_id: idCurrent,
            },
          );
          getBoardAndRefresh();
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>)
            .response;
          if (errorResponse) {
            return Alert.alert('알림', errorResponse.data?.message);
          }
        }
      };
      recommendPostWait();
    }
  }, [idCurrent, myPostRecommend, userID, getBoardAndRefresh]);

  const postComment = useCallback(() => {
    const postCommentWait = async () => {
      try {
        const response = await axios.post(`${Config.API_URL}/board/comment`, {
          id: userID,
          w_id: idCurrent,
          r_id: rid,
          c_content: commentValue,
        });
        setNeedReset(!needReset);
        setCommentValue('');
        // 백엔드 문제 해결 후 프론트 : post하고 나서 textinput clear되는지 확인해야 함
        getBoardAndRefresh();
      } catch (error) {
        const errorResponse = (error as AxiosError<{message: string}>).response;
        if (errorResponse) {
          return Alert.alert('알림', errorResponse.data?.message);
        }
      }
    };
    postCommentWait();
  }, [commentValue, idCurrent, needReset, userID, rid, getBoardAndRefresh]);

  const likeComment = useCallback(
    (incr: number) => {
      const likeCommentWait = async () => {
        try {
          await axios.post(`${Config.API_URL}/board/likecomment`, {
            id: userID,
            c_id: incr,
          });
          setNeedReset(!needReset);
          getBoardAndRefresh();
        } catch (error) {
          const errorResponse = (error as AxiosError<{message: string}>)
            .response;
          if (errorResponse) {
            return Alert.alert('알림', errorResponse.data?.message);
          }
        }
      };
      likeCommentWait();
    },
    [needReset, userID, getBoardAndRefresh],
  );

  const deletePost = async () => {
    Alert.alert('알림', '정말 게시글을 삭제하시겠습니까?', [
      {
        text: '예',
        onPress: async () => {
          await axios.delete(`${Config.API_URL}/board/delete/${idCurrent}`, {});
          navigation.goBack();
        },
      },
      {
        text: '아니요',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.entire}>
      <ScrollView>
        <View style={styles.post}>
          <View style={styles.postHeader}>
            <View style={styles.postTitle}>
              {postDATA.profile_img === undefined ||
              postDATA.profile_img === null ? (
                <Pressable
                  onPress={() => {
                    setShowProfile(true);
                  }}>
                  <Icon
                    name="md-person-circle-outline"
                    color="gray"
                    size={40}
                  />
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => {
                    setShowProfile(true);
                  }}>
                  <Image
                    style={styles.profile}
                    source={{uri: `${postDATA.profile_img}?time=${new Date()}`}}
                  />
                </Pressable>
              )}
              <View style={styles.postProfileTxt}>
                <Text style={styles.postProfileNameTxt}>
                  {postDATA.user_name}
                </Text>
                <Text style={styles.postHeaderTxt}>{postDATA.title}</Text>
              </View>
            </View>
            {postDATA.user_id === parseInt(userID) && (
              <Text style={styles.deleteBtn} onPress={deletePost}>
                삭제
              </Text>
            )}
            <Pressable onPress={recommendPost}>
              <FontAwesomeIcon
                name="thumbs-up"
                size={40}
                color={myPostRecommend ? '#1F6733' : '#DAE2D8'}
              />
              <Text style={styles.likeTxt}>{postDATA.like}</Text>
            </Pressable>
          </View>
          <View style={styles.postContent}>
            <Text style={{color: '#4C4D4C'}}>{postDATA.content}</Text>
          </View>
          <View style={styles.imageContainer}>
            {postDATA.img_path_1 !== 'undefined' && (
              <Image
                style={styles.image}
                source={{uri: postDATA.img_path_1}}
                resizeMode="center"
              />
            )}
            {postDATA.img_path_2 !== 'undefined' && (
              <Image
                style={styles.image}
                source={{uri: postDATA.img_path_2}}
                resizeMode="center"
              />
            )}
            {postDATA.img_path_3 !== 'undefined' && (
              <Image
                style={styles.image}
                source={{uri: postDATA.img_path_3}}
                resizeMode="center"
              />
            )}
          </View>
        </View>
        <View style={styles.comment}>
          <FlatList
            data={commentDATA}
            renderItem={({item}) => (
              <CommentItem
                items={item}
                likeComment={likeComment}
                onValueChange={handleValueChange}
                writeRc={writeRc}
                recommentData={RecommentDATA}
              />
            )}
            keyExtractor={Item => String(Item.incr)}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      </ScrollView>
      <View style={styles.myComment}>
        <TextInput
          value={commentValue}
          ref={textInputRef}
          onBlur={() => {
            setWriteRc('F');
            console.log('**');
          }}
          style={styles.myCommentContent}
          onChangeText={onChangeComment}
          placeholder="댓글을 입력하세요"
          onSubmitEditing={postComment}
          multiline={true}
        />
        <Pressable onPress={postComment} style={styles.commentBtn}>
          <Text style={styles.commentBtnTxt}>입력</Text>
        </Pressable>
      </View>
      <Modal transparent={true} visible={showProfile}>
        <Pressable
          style={styles.modalBG}
          onPress={() => {
            setShowProfile(false);
          }}>
          <View style={styles.modal}>
            {postDATA.profile_img === undefined ||
            postDATA.profile_img === null ? (
              <Pressable
                onPress={() => {
                  setShowProfile(true);
                }}>
                <Icon name="md-person-circle-outline" color="gray" size={130} />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  setShowProfile(true);
                }}>
                <Image
                  style={{
                    width: 130,
                    height: 130,
                    borderRadius: 70,
                  }}
                  source={{uri: `${postDATA.profile_img}?time=${new Date()}`}}
                />
              </Pressable>
            )}
            <Text style={styles.modalID}>{postDATA.user_name}</Text>
            <Pressable
              style={styles.modalBtn}
              onPress={async () => {
                const response = await axios.post(
                  `${Config.API_URL}/message/makeroom`,
                  {
                    id: userID,
                    you: postDATA.user_id,
                  },
                );
                console.log(response?.data.roomlist[0].incr);
                navigation.navigate('MessageDetail', {
                  incr: response?.data.roomlist[0].incr,
                });
              }}>
              <Text style={styles.modalBtnTxt}>쪽지 보내기</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

export default MyPostDetail;

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
  deleteBtn: {
    fontSize: 15,
    fontWeight: '800',
    marginRight: 25,
  },
  eachComment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  commentContent: {
    paddingHorizontal: 10,
  },
  commentProfile: {
    flexDirection: 'row',
    width: '80%',
  },
  commentContentIDTxt: {
    fontSize: 11,
    color: '#5F5D5D',
  },
  commentContentBodyTxt: {
    fontSize: 14,
    color: '#878787',
  },
  commentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendNum: {
    color: '#B7CBB2',
    fontSize: 20,
  },
  commentIcon: {
    marginLeft: 15,
    marginRight: 5,
  },
  entire: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 50,
  },
  post: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  postTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    flex: 6,
  },
  postProfile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'black',
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'black',
    top: 1,
  },
  postProfileTxt: {
    flex: 5, // flexDirection: 'row'
  },
  postProfileNameTxt: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 10,
  },
  postHeaderTxt: {
    fontSize: 17,
    fontWeight: '800',
    marginLeft: 10,
    width: '85%',
    color: 'black',
  },
  likeTxt: {
    color: '#B7CBB2',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  postContent: {
    paddingVertical: 10,
    fontSize: 16,
  },
  comment: {
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#EBEFEA',
    marginBottom: 100,
  },
  myComment: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 70,
    backgroundColor: 'white',
  },
  myProfile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'black',
  },
  myCommentContent: {
    borderWidth: 1,
    borderColor: '#EBEFEA',
    borderRadius: 30,
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
    color: '#878787',
    paddingHorizontal: 20,
  },
  commentBtn: {
    marginLeft: 10,
  },
  commentBtnTxt: {
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 14,
    color: '#B7CBB2',
  },
  modalBG: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: 300,
    height: 330,
    backgroundColor: 'white',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalID: {
    color: '#3D3C3C',
    fontWeight: '800',
    fontSize: 30,
    marginTop: 10,
  },
  modalBtn: {
    backgroundColor: '#346627',
    borderRadius: 30,
    width: 120,
    height: 30,
    marginTop: 20,
    justifyContent: 'center',
  },
  modalBtnTxt: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
});
