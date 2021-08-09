import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, Alert,
} from 'react-native';
import firebase from 'firebase';

// import AppBar from '../components/AppBar';
import MemoListItem from '../components/MemoListItem';
import CircleButton from '../components/CircleButton';
// import LogOutButton from '../components/LogOutButton';
import Button from '../components/Button';
import Loading from '../components/Loading';
import HeaderRightButton from '../components/HeaderRightButton';

export default function MemoListScreen(props) {
  const { navigation } = props;
  const [memos, setMemos] = useState([]);
  const [isLoading, setLoading] = useState(false);
  // ???  setOptionsが不明、headerRightとはどこから出てきた、なぜfunctionの形式
  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => <LogOutButton />,
  //   });
  // }, []);

  useEffect(() => {
  //   const db = firebase.firestore();
  //   const { currentUser } = firebase.auth();
  //   let unsubscribe = () => {};
  //   if (currentUser) {
    setLoading(true);
    //     const ref = db.collection(`users/${currentUser.uid}/memos`).orderBy('updatedAt', 'desc');
    //     unsubscribe = ref.onSnapshot((snapshot) => {
    //       const userMemos = [];
    //      snapshot.forEach((doc) => {
    //         const data = doc.data();
    //         userMemos.push({
    //           id: doc.id,
    //           bodyText: data.bodyText,
    //           updatedAt: data.updatedAt.toDate(),
    const cleanupFuncs = {
      auth: () => {}, // auth何が入る？
      memos: () => {},
    };
    cleanupFuncs.auth = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const db = firebase.firestore();
        const ref = db.collection(`users/${user.uid}/memos`).orderBy('updatedAt', 'desc');
        cleanupFuncs.memos = ref.onSnapshot((snapshot) => {
          const userMemos = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            userMemos.push({
              id: doc.id,
              bodyText: data.bodyText,
              updatedAt: data.updatedAt.toDate(),
            });
          });
          setMemos(userMemos);
          setLoading(false); // 不明
        }, () => { // 不明
          setLoading(false); // 不明
        });
        // ユーザーが存在したら会員登録ボタンかログアウトボタンを表示
        // 会員登録ボタン：匿名ユーザー
        // ログアウトボタン：メアド登録済みユーザー
        navigation.setOptions({
          headerRight: () => (
            <HeaderRightButton currentUser={user} cleanupFuncs={cleanupFuncs} />
          ),
        });
        // });
        //  });
        //  setMemos(userMemos);
        //  setLoading(false);
        // }, () => {
        //  setLoading(false);
        //  Alert.alert('データの読み込みに失敗しました。');
        // });
      // }
      // return unsubscribe;
      } else {
      // 匿名ログイン
        firebase.auth().signInAnonymously()
          .catch(() => {
            Alert.alert('エラー', 'アプリを再起動してください'); // なぜエラー
          })
          .then(() => { setLoading(false); });
      }
    });
    // ??? これ何どこへ戻り値を返す?
    return () => {
      cleanupFuncs.auth();
      cleanupFuncs.memos();
    };
  }, []);

  if (memos.length === 0) {
    return (
      <View style={emptyStyles.container}>
        <Loading isLoadin={isLoading} />
        <View style={emptyStyles.inner}>
          <Text style={emptyStyles.title}>最初のメモを作成しよう！</Text>
          <Button
            style={emptyStyles.button}
            label="作成"
            onPress={() => { navigation.navigate('MemoCreate'); }}
          />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <MemoListItem memos={memos} />
      <CircleButton
        name="plus"
        onPress={() => { navigation.navigate('MemoCreate'); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
});

const emptyStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 24,
  },
  button: {
    alignSelf: 'center',
  },
});
