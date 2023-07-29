import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import {MessageStackNavigationProp} from '../navigations/MessageNavigation';
import {useNavigation} from '@react-navigation/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';

type ItemProps = {
  incr: number;
  c_content: string;
  user_id: number,
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

const CommentItem = ({
  items,
  likeComment,
  onValueChange,
  writeRc,
  recommentData,
}: {
  items: ItemProps;
  likeComment: Function;
  onValueChange: Function;
  writeRc: string;
  recommentData: CommentItemProps[];
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [toID, setToID] = useState(-1);

  const userID = useSelector((state: RootState) => state.user.id);
  const navigation = useNavigation<MessageStackNavigationProp>();
  const [recomment, setRecomment] = useState('F');
  const currentReData: CommentItemProps[] = [];
  const reComment = useCallback(() => {
    setRecomment('T');
  }, []);

  function handleClick() {
    onValueChange(items.incr);
  }

  const setRc = () => {
    if (writeRc === 'F') {
      setRecomment('F');
    }
  };

  const setReData = () => {
    for (let i: number = 0; i < recommentData.length; i++) {
      if (recommentData[i].r_id > items.incr) {
        break;
      } else {
        if (recommentData[i].r_id === items.incr) {
          currentReData.push(recommentData[i]);
        }
      }
    }
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      setRc();
    })
  }, [writeRc]);

  useEffect(() => {
    navigation.addListener('focus', () => {
      setReData();
    })
  }, [currentReData]);

  function ReplyComment({Item}) {
    return (
      <View style={styles.replyComment}>
        <View style={styles.RecommentProfile}>
          {Item.profile_img === undefined || Item.profile_img === null ? (
            <Pressable
              onPress={() => {
                setShowProfile(true);
                setToID(Item.user_id);
              }}>
              <Icon name="md-person-circle-outline" color="gray" size={35} />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                setShowProfile(true);
                setToID(Item.user_id);
              }}>
              <Image
                style={styles.reprofile}
                source={{uri: `${Item.profile_img}?time=${new Date()}`}}
              />
            </Pressable>
          )}
          <View style={styles.commentContent}>
            <Text style={styles.commentContentIDTxt}>{Item.user_name}</Text>
            <Text style={styles.commentContentBodyTxt}>{Item.c_content}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <Pressable style={styles.eachComment}>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.commentProfile}>
          {/* setProfile(item.user_name) */}
          {items.profile_img === undefined || items.profile_img === null ? (
            <Pressable
              onPress={() => {
                setShowProfile(true);
                setToID(items.user_id);
                // console.log(items.user_name)
                // console.log(items.user_id)
              }}>
              <Icon name="md-person-circle-outline" color="gray" size={40} />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                setShowProfile(true);
                setToID(items.user_id);
              }}>
              <Image
                style={styles.profile}
                source={{uri: `${items.profile_img}?time=${new Date()}`}}
              />
            </Pressable>
          )}
          <View style={styles.commentContent}>
            <Text style={styles.commentContentIDTxt}>{items.user_name}</Text>
            <Text style={styles.commentContentBodyTxt}>{items.c_content}</Text>
          </View>
        </View>
        <View style={styles.commentInfo}>
          {/* onPress시 incr이용해서 like 눌러주는 기능 + axios get 해서 댓글 추천 수 새로고침하는 기능*/}
          <Pressable
            style={styles.recommend}
            onPress={() => {
              likeComment(items.incr);
            }}>
            <View style={styles.thumb}>
              <FontAwesomeIcon
                name="thumbs-up"
                size={28}
                color={items.myrec ? '#1F6733' : '#DAE2D8'}
              />
              <Text style={styles.recommendNum}>{items.like}</Text>
            </View>
          </Pressable>
          <Pressable
            style={styles.thumb}
            onPress={() => {
              reComment();
              handleClick();
            }}>
            <FontAwesome5Icon
              name="caret-down"
              size={40}
              color={recomment === 'F' ? '#DAE2D8' : '#346627'}
            />
            <Text
              style={
                recomment === 'F' ? {color: '#B7CBB2'} : {color: '#346627'}
              }>
              답글
            </Text>
          </Pressable>
        </View>
      </View>
      <FlatList
        data={currentReData}
        keyExtractor={item => String(item.incr)}
        renderItem={({item}) => <ReplyComment Item={item} />}
      />
      <Modal transparent={true} visible={showProfile}>
        <Pressable
          style={styles.modalBG}
          onPress={() => {
            setShowProfile(false);
            setToID(-1);
          }}>
          <View style={styles.modal}>
            {items.profile_img === undefined || items.profile_img === null ? (
              <Pressable>
                <Icon name="md-person-circle-outline" color="gray" size={130} />
              </Pressable>
            ) : (
              <Pressable>
                <Image
                  style={{
                    width: 130,
                    height: 130,
                    borderRadius: 70,
                  }}
                  source={{uri: `${items.profile_img}?time=${new Date()}`}}
                />
              </Pressable>
            )}
            <Text style={styles.modalID}>{items.user_name}</Text>
            <Pressable
              style={styles.modalBtn}
              onPress={async () => {
                const response = await axios.post(
                  `${Config.API_URL}/message/makeroom`,
                  {
                    id: userID,
                    you: toID,
                  },
                );
                console.log(response?.data.roomlist[0].incr);
                navigation.navigate('MessageDetail', {
                  incr: response?.data.roomlist[0].incr,
                });
              }}
              >
              {/* navigate할때 전달해주는 정보 수정 필요! roomID 찾아보고 있으면 string으로 전달해줘야함 (없으면 만들면서 전달) */}
              <Text style={styles.modalBtnTxt}>쪽지 보내기</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  eachComment: {
    paddingHorizontal: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  replyComment: {
    width: '70%',
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
    marginLeft: 50,
  },
  reComment: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    backgroundColor: '#DCFFEB',
  },
  commentContent: {
    paddingLeft: 10,
    paddingRight: 35,
  },
  RecommentProfile: {
    flexDirection: 'row',
    width: '110%',
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
  thumb: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  recommend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendNum: {
    color: '#B7CBB2',
    fontSize: 13,
  },
  entire: {
    flex: 1,
    backgroundColor: 'white',
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
  reprofile: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: 'black',
    top: 1,
  },

  postHeaderTxt: {
    fontSize: 17,
    marginLeft: 20,
    width: '85%',
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

export default CommentItem;
