import React, { useMemo } from 'react';
import Select, { OptionProps, GroupBase } from 'react-select';
import { FixedSizeList as List } from 'react-window';
import { useDiagramStore } from '../../store';

import './Select.css';

const height = 35; // Height of each option

interface MenuListProps extends OptionProps<Option, false, GroupBase<Option>> {
  children: React.ReactNode[];
  options: Option[];
  maxHeight: number;
  getValue: () => Option[];
}

const MenuList = (props: MenuListProps): React.ReactElement => {
  const { options, children, maxHeight, getValue } = props;
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * height;
  const itemCount = children.length;
  const totalHeight = itemCount * height;

  return itemCount > 0 ? (
    <List
      height={Math.min(maxHeight, totalHeight)}
      itemCount={itemCount}
      itemSize={height}
      initialScrollOffset={initialOffset}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>{React.Children.toArray(children)[index]}</div>
      )}
    </List>
  ) : (
    <div className='emptyStateContainer'>Node's not available</div>
  );
};

interface Option {
  label: string;
  value: string;
}

interface Props {
  onChange: (value?: string) => void;
}

export default function VirtualizedSelect(props: Props) {
  const { nodes } = useDiagramStore();
  const options: Option[] = useMemo(() => nodes.map(node => ({
    value: node.key,
    label: node.text
  })), [nodes]);

  return (
    <Select
      className="react-select-container"
      classNamePrefix="react-select"
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      components={{ MenuList }}
      options={options}
      {...props}
      isSearchable
      placeholder="Search a node..."
      onChange={(option) => props.onChange(option?.value)}
    />
  );
}
