import styles from '@/style/AlertMsg.module.css';

import { motion, AnimatePresence } from 'motion/react';
import { useSelector } from 'react-redux';

export default function CommonMsgType({ isAlert }) {
  // useSelector
  const msgType = useSelector((state) => state.submitState.msgType);
  const submitStatus = useSelector((state) => state.submitState.status);
  const callCount = useSelector((state) => state.submitState.callCount);

  let str = '';
  switch (msgType) {
    case 'edit':
    case 'update': {
      str = submitStatus !== 'rejected' ? '수정되었습니다.' : '요청에 실패했습니다';
      break;
    }
    case 'add':
    case 'create': {
      str = submitStatus !== 'rejected' ? '생성되었습니다.' : '요청에 실패했습니다';
      break;
    }
    case 'delete': {
      str = submitStatus !== 'rejected' ? '삭제되었습니다.' : '요청에 실패했습니다';
      break;
    }
    default: {
      if (submitStatus === 'rejected') str = '요청에 실패했습니다.';
      else return;
    }
  }

  return (
    <AnimatePresence>
      {isAlert && (
        <motion.div
          key={'alert'}
          className={`${styles.alertMsg} ${submitStatus !== 'rejected' ? '' : styles.error}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={callCount <= 5 ? { opacity: 0, y: 10 } : false}
          style={{ translateX: '-50%' }}
        >
          <div className={styles.title}>{callCount < 5 ? str : '페이지를 새로고침 해주세요!'}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}