import { useEffect, useRef, useState } from 'react';
import { Group, Line, Rect, RegularPolygon, Text, Transformer } from 'react-konva';
import { fetchUpdateAlertMsg } from '../../../lib/features/submitState/submitSlice';

const initialMsgObj = {
  list: [],
  table: {},
  pos: { x: 0, y: 0, width: 30 },
};

export default function TableLayer({
  stage,
  table,
  setClientTableList,
  konvaEditTableIdArr,
  selectTableId,
  konvaEditType,
  dispatch,
  state,
  requestList,
  onClickCheckTableInfo,
}) {
  const { init, order, tableNum, id } = table;
  const totalPrice =
    order
      ?.reduce(
        (prev, list) =>
          prev +
          list.orderList?.reduce((prevPrice, currMenu) => prevPrice + currMenu.price * currMenu.amount, 0),
        0
      )
      .toLocaleString() ?? 0;
  // console.log(totalPrice);
  const isTransformerAble = id === konvaEditTableIdArr[0] && konvaEditType !== 'delete';
  const isSelectedToDelete = konvaEditType === 'delete' && konvaEditTableIdArr.includes(id);
  const stageAttrs = stage.current.attrs;
  const blockSize = 10;
  // useRef
  const shapeRef = useRef(null);
  const trRef = useRef(null);
  // useState
  const [requestMsg, hoverTable] = useState(initialMsgObj);
  const [hasAlert, getAlert] = useState(false);
  // state
  const tableRequestAlertOn = state.realtimeState.tableRequestList.isOn;
  const tableRequestTrigger = state.realtimeState.tableRequestList.trigger;

  useEffect(() => {
    if (konvaEditTableIdArr[0] !== id) return;
    if (konvaEditType === 'delete') return; // type 제한
    trRef.current.nodes([shapeRef.current]);
    trRef.current.getLayer().batchDraw();
  }, [konvaEditTableIdArr]);

  useEffect(() => {
    if (requestList.isFetching) return;
    // 요청 알림이 꺼져 있는 상태
    if (!tableRequestAlertOn) {
      const tableAlert = requestList.data.some((request) => request.tableId === id && !request.isRead);
      if (tableAlert) {
        getAlert(true);
        const requestArr = requestList.data.filter((request) => {
          return request.tableId === id && !request.isRead;
        });

        const msgContext = requestArr.reduce((prev, curr) => prev + ', ' + curr.requestList, '').slice(2);
        const msgLength = msgContext.replace(', ', '').split('').length;
        const msgWidth = msgLength * 23 + 20; // 기본 길이 + 뒷여백(20)
        const flip = init.x + init.rec.width + 20 + msgWidth >= stageAttrs.width;
        const newX = flip ? init.x - msgWidth - 20 : init.x + init.rec.width + 20;

        hoverTable((prev) => ({
          ...prev,
          list: [msgContext],
          table: init,
          pos: {
            x: newX,
            y: init.y,
            width: msgWidth,
            flip,
          },
        }));
      } else {
        getAlert(false);
      }
    } else {
      getAlert(false);
      hoverTable(initialMsgObj);
    }
  }, [requestList, tableRequestTrigger, tableRequestAlertOn]);

  function changeTablePosition(e) {
    const lastPs = e.target.position();

    setClientTableList((prev) =>
      prev.map((table) => {
        if (table.id === konvaEditTableIdArr[0]) {
          let newPosX = Math.round(lastPs.x / blockSize) * blockSize;
          let newPosY = Math.round(lastPs.y / blockSize) * blockSize;
          newPosX = Math.max(10, Math.min(newPosX, stageAttrs.width - init.rec.width - 10)); // stageWidth 임의 설정
          newPosY = Math.max(10, Math.min(newPosY, stageAttrs.height - init.rec.height - 10)); // stageHeight 임의 설정
          return {
            ...table,
            init: {
              ...table.init,
              x: newPosX,
              y: newPosY,
            },
          };
        }
        return table;
      })
    );
  }

  function onDragTransform() {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // node 초기화
    node.scaleX(1);
    node.scaleY(1);

    // 크기 변환 적용
    setClientTableList((prev) => {
      return prev.map((table) => {
        if (table.id === konvaEditTableIdArr[0]) {
          const newWidth = Math.max(170, Math.round((node.width() * scaleX) / blockSize) * blockSize);
          const newHeight = Math.max(130, Math.round((node.height() * scaleY) / blockSize) * blockSize);

          return {
            ...table,
            init: {
              ...table.init,
              rec: {
                width: newWidth,
                height: newHeight,
              },
              tableText: {
                width: newWidth - 40,
              },
              bottom: {
                ...table.init.bottom,
                y: newHeight - 40,
                line: { points: [0, 0, newWidth - 40, 0] },
                priceText: {
                  width: newWidth - 40,
                },
              },
            },
          };
        }
        return table;
      });
    });
  }

  function limitBoundBox(oldBox, newBox) {
    const newBoxPosX = Math.round(newBox.x);
    const newBoxWidth = Math.round(newBox.width);
    const oldBoxPosX = Math.round(oldBox.x);
    if (newBox.width < 169 || newBoxPosX !== oldBoxPosX || newBoxWidth + newBoxPosX > stageAttrs.width - 9) {
      // stageWidth 임의 설정
      return oldBox;
    }

    const newBoxPosY = Math.round(newBox.y);
    const newBoxHeight = Math.round(newBox.height);
    const oldBoxPosY = Math.round(oldBox.y);
    if (
      newBox.height < 129 ||
      newBoxPosY !== oldBoxPosY ||
      newBoxHeight + newBoxPosY > stageAttrs.height - 9
    ) {
      // stageHeight 임의 설정
      return oldBox;
    }
    return newBox;
  }

  function onClickSelectTable() {
    // 테이블 결제 창, 알림 X
    if (!hasAlert && konvaEditType === '') {
      // 선택하면 모달 창 열림, 주문목록/금액, 결제/닫기 버튼, 결제
      onClickCheckTableInfo([table]);
    }
    // 읽음 처리 (DB 연동 필요)
    if (hasAlert) {
      stage.current.container().style.cursor = 'default';
      // dispatch(fetchUpdateAlertMsg({ method: 'update', id }));
      getAlert(false);
      hoverTable(initialMsgObj);
      return;
    }
    // 테이블 편집 중
    if (konvaEditType === 'update') {
      stage.current.container().style.cursor = 'move';
      selectTableId([id]);
    } else if (konvaEditType === 'delete') {
      selectTableId((prev) => {
        // 다시 누르면 배열 요소 삭제
        if (prev.includes(id)) return [...prev.filter((prevId) => prevId !== id)];
        // 클릭하면 배열 요소 추가
        else return [...prev, id];
      });
    }
  }

  function onMouseEnterChangePointer(e) {
    if (konvaEditType === '' || requestList.isFetched) {
      if (hasAlert) {
        stage.current.container().style.cursor = 'pointer';
      }
      return;
    }
    if (konvaEditType === 'delete' || konvaEditType === 'update') {
      stage.current.container().style.cursor = 'pointer';
      return;
    } else if (isTransformerAble) {
      stage.current.container().style.cursor = 'move';
    }
  }

  function onMouseLeaveChangePointer() {
    stage.current.container().style.cursor = 'default';
  }

  return (
    <>
      <Group
        key={id}
        id={id}
        x={init.x}
        y={init.y}
        draggable={isTransformerAble}
        onDragEnd={changeTablePosition}
        onClick={onClickSelectTable}
        onMouseEnter={onMouseEnterChangePointer}
        onMouseLeave={onMouseLeaveChangePointer}
      >
        <Group>
          <Rect
            ref={shapeRef}
            width={init.rec.width}
            height={init.rec.height}
            fill={'#fff'}
            stroke={isSelectedToDelete ? 'red' : hasAlert ? '#4caff8' : 'white'}
            cornerRadius={10}
            onTransform={onDragTransform}
          />
          {isTransformerAble && (
            <Transformer
              ref={trRef}
              flipEnabled={false}
              keepRatio={false}
              boundBoxFunc={limitBoundBox}
              rotateEnabled={false}
              rotateLineVisible={false}
              enabledAnchors={['middle-right', 'bottom-center']}
            />
          )}
          <Group x={20} y={20}>
            <Text
              text={`테이블 ${tableNum}`}
              width={init.tableText.width}
              fill={'#222'}
              fontSize={18}
              align="left"
            />
          </Group>
          <Group x={20} y={init.bottom.y}>
            <Line points={init.bottom.line.points} strokeWidth={1} stroke={'#8D8D8D'} />
            <Group x={0} y={10}>
              <Text
                text="합계"
                width={init.bottom.priceText.width}
                fill={'#8D8D8D'}
                fontSize={15}
                align="left"
              />
              <Text
                text={`${totalPrice}원`}
                width={init.bottom.priceText.width}
                fill={'#8D8D8D'}
                fontSize={15}
                align="right"
              />
            </Group>
          </Group>
        </Group>
      </Group>
      {requestMsg?.list.length > 0 &&
        !tableRequestAlertOn &&
        requestMsg.list.map((request, idx) => {
          const { pos, table } = requestMsg;

          return (
            <Group key={idx} x={pos.x} y={pos.y}>
              <Group x={pos.flip ? pos.width : 0}>
                <RegularPolygon
                  sides={3}
                  width={20}
                  height={20}
                  y={table.rec.height / 2}
                  rotation={pos.flip ? 90 : 30}
                  fill="white"
                />
              </Group>
              <Group x={0} offsetY={-(table.rec.height / 4)}>
                <Rect
                  width={pos.width}
                  height={table.rec.height / 2}
                  offsetX={pos.flip ? 0 : 0}
                  cornerRadius={5}
                  fill="white"
                />
                <Group x={15} offsetY={-(table.rec.height / 4) + 5}>
                  <Text width={pos.width - 30} text={request} fontSize={16} align="center" />
                </Group>
              </Group>
            </Group>
          );
        })}
    </>
  );
}
