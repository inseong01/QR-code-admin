import styles from '@/style/swiper/OrderListSwiper.module.css';
import MiddleBox from '../middle/MiddleBox';
import updateOrderListStatus from '@/lib/supabase/func/updateOrderListStatus';
import {
  changeSubmitState,
  changeSubmitType,
  fetchOrderListStatus,
} from '@/lib/features/submitState/submitSlice';

import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Swiper from 'swiper';
import { Pagination, Grid } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/grid';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmModal from '../modal/ConfirmModal';
import { changeModalState } from '@/lib/features/modalState/modalSlice';
import { getOrderListInfo, getSelectedListId } from '@/lib/features/itemState/itemSlice';

export default function OrderListSwiper({ orderList, swiper_motion }) {
  // useState
  // const [clickedItemId, setClickedItemId] = useState('');
  const selectedListId = useSelector((state) => state.itemState.selectedListId);
  // useRef
  const orderListRef = useRef(null);
  // useDispatch
  const dispatch = useDispatch();
  // useSelector
  const preventSubmit = useSelector((state) => state.submitState.isError);

  useEffect(() => {
    if (!orderListRef.current) return;
    new Swiper(orderListRef.current, {
      modules: [Pagination, Grid],
      pagination: {
        el: '.swiper-pagination',
        type: 'progressbar',
        clickable: true,
      },
      grid: {
        fill: 'row',
        rows: 2,
      },
      slidesPerView: 4,
      spaceBetween: 10,
    });
  }, []);

  function onClickOpenListOption(list) {
    return () => {
      dispatch(getSelectedListId({ selectedListId: list.id }));
    };
  }

  function onClickCloseListOption(e) {
    e.stopPropagation();
    dispatch(getSelectedListId({ selectedListId: '' }));
  }

  function onClickUpdateListStatus(list) {
    return () => {
      if (preventSubmit) return;
      dispatch(changeModalState({ isOpen: true, type: 'update' }));
      dispatch(getOrderListInfo({ list }));
    };
  }

  return (
    <>
      <motion.div
        className={`orderList ${styles.orderList}`}
        ref={orderListRef}
        variants={swiper_motion}
        initial={'notActive'}
        animate={'active'}
      >
        <ul className={`swiper-wrapper ${styles.listBox}`}>
          {orderList.map((list, idx) => {
            const amount = list.orderList.reduce((prev, curr) => prev + curr.amount, 0);
            return (
              <li key={idx} className={`swiper-slide ${styles.slide}`}>
                <div className={styles.list}>
                  <div className={styles.topBox} onClick={onClickOpenListOption(list)}>
                    <div className={styles.top}>
                      <div className={styles.title}>#{list.orderNum}</div>
                      <div className={styles.right}>
                        <div className={styles.table}>테이블 1</div>
                        <div className={styles.time}>00:00</div>
                      </div>
                    </div>
                  </div>
                  <MiddleBox orderList={list.orderList} />
                  <div className={styles.bottomBox}>
                    <div className={styles.bottom}>
                      <div className={styles.totalMenuAmount}>
                        <span>{amount}</span> 개
                      </div>
                      <div
                        className={`${styles.completeBtn} ${selectedListId === list.id ? styles.delete : ''}`}
                        onClick={onClickUpdateListStatus(list)}
                      >
                        {selectedListId === list.id ? '삭제' : '완료'}
                      </div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {selectedListId === list.id && (
                      <motion.ul
                        className={styles.listOptionBox}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        style={{ y: 10 }}
                      >
                        <li className={styles.option} onClick={onClickCloseListOption}>
                          <Image src={'/img/close-icon.png'} alt="옵션 닫기" width={30} height={30} />
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            );
          })}
        </ul>
        <div className={`swiper-pagination ${styles.pagination}`}></div>
      </motion.div>
    </>
  );
}
