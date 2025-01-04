import { Group, Text } from 'react-konva';

export default function TableName({ tableNum, width }) {
  return (
    <Group x={20} y={20}>
      <Text text={`테이블 ${tableNum}`} width={width} fill={'#222'} fontSize={18} align="left" />
    </Group>
  );
}