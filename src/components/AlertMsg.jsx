import CommonMsgType from './alertMsg/CommonMsgType';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function AlertMsg() {
  // useSelector
  const alertType = useSelector((state) => state.submitState.alertType);
  const submitStatus = useSelector((state) => state.submitState.status);
  const isSubmit = useSelector((state) => state.submitState.isSubmit);
  const callCount = useSelector((state) => state.submitState.callCount);
  // useState
  const [isAlert, setIsAlert] = useState(false);

  // 알림 메시지 등장/퇴장
  useEffect(() => {
    let timer;
    // 제출되지 않았으면 반환
    if (!isSubmit) return;
    setIsAlert(true);
    // 오류 발생 4번 제한
    if (callCount < 5) {
      timer = setTimeout(() => {
        setIsAlert(false);
      }, 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [submitStatus, isSubmit]);

  // fulfilled 때 alertMsg 사라지는 현상 방지
  if (submitStatus === 'pending') return;

  switch (alertType) {
    case 'list':
    case 'product': {
      return <CommonMsgType isAlert={isAlert} />;
    }
  }
}
