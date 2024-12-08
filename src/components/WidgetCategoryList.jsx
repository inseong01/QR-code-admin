import styles from '@/style/WidgetCategoryList.module.css';
import { changeModalState } from '@/lib/features/modalState/modalSlice';
import { resetSubmitState } from '@/lib/features/submitState/submitSlice';

import { motion, AnimatePresence } from 'motion/react';
import { useDispatch, useSelector } from 'react-redux';

export default function WidgetCategoryList({ isClickEditor }) {
  // useSelector
  const tab = useSelector((state) => state.tabState.state);
  // useDispatch
  const dispatch = useDispatch();

  function onClickOpenEditor(modalType) {
    return () => {
      console.log('WidgetCategoryList');
      dispatch(resetSubmitState());
      dispatch(changeModalState({ type: modalType, isOpen: true }));
    };
  }

  // motion
  const optionList = {
    clicked: {
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
    notClicked: {
      transition: {
        staggerChildren: 0.1,
        staggerDirection: 1,
      },
    },
  };
  const option = {
    clicked: {
      x: 0,
      opacity: 1,
    },
    notClicked: {
      x: 10,
      opacity: 0,
    },
  };

  switch (tab) {
    case 'menu': {
      return (
        <motion.div className={styles.optionListBox}>
          <AnimatePresence>
            {isClickEditor && (
              <motion.ul
                key={'optionList'}
                className={styles.editorOption}
                variants={optionList}
                initial={'notClicked'}
                animate={'clicked'}
                exit={'notClicked'}
              >
                <motion.li
                  className={styles.option}
                  variants={option}
                  onClick={onClickOpenEditor('category-delete')}
                >
                  <span className={styles.textBox}>분류</span>
                </motion.li>
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
      );
    }
    case 'table': {
      return (
        <motion.div className={styles.optionListBox}>
          <AnimatePresence>
            {isClickEditor && (
              <motion.ul
                key={'optionList'}
                className={styles.editorOption}
                variants={optionList}
                initial={'notClicked'}
                animate={'clicked'}
                exit={'notClicked'}
              >
                <motion.li className={styles.option} variants={option}>
                  <span className={styles.iconBox}>
                    <span className={styles.textBox}>테이블 추가</span>
                    {/* <img src={'/img/shapes-icon.png'} alt="모형 추가" style={{ width: 20, height: 20 }} /> */}
                  </span>
                </motion.li>
                <motion.li className={styles.option} variants={option}>
                  <span className={styles.iconBox}>
                    <span className={styles.textBox}>테이블 추가</span>
                    {/* <img src={'/img/shapes-icon.png'} alt="모형 추가" style={{ width: 20, height: 20 }} /> */}
                  </span>
                </motion.li>
                <motion.li className={styles.option} variants={option}>
                  <span className={styles.iconBox}>
                    <span className={styles.textBox}>테이블 추가</span>
                    {/* <img src={'/img/shapes-icon.png'} alt="모형 추가" style={{ width: 20, height: 20 }} /> */}
                  </span>
                </motion.li>
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
      );
    }
    case 'order': {
      return (
        <motion.div className={styles.optionListBox}>
          <AnimatePresence>
            {isClickEditor && (
              <motion.ul
                key={'optionList'}
                className={styles.editorOption}
                variants={optionList}
                initial={'notClicked'}
                animate={'clicked'}
                exit={'notClicked'}
              >
                <motion.li className={styles.option} variants={option}>
                  <span className={styles.textBox}>준비중</span>
                </motion.li>
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
      );
    }
  }
}
