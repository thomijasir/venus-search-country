import React, { FC, useState } from 'react';
import './BoxList.scss';

export interface IBoxItem {
  id: string;
  icon: string;
  text: string;
}

export type IBoxListProps = {
  onSelect?: (e: IBoxItem) => void;
  itemList: IBoxItem[];
};

export const BoxListDefaultProps = {};

export const BoxListNamespace = 'BoxList';

const BoxList: FC<IBoxListProps> = (props) => {
  const { itemList, onSelect } = props;
  const [boxList] = useState<IBoxItem[]>(itemList);
  const handleOnSelect = (data: IBoxItem) => () => {
    onSelect && onSelect(data);
  };
  return (
    <div className="box-list-comp">
      {boxList.map((data: IBoxItem) => (
        <div className="box-item" key={data.id} onClick={handleOnSelect(data)}>
          <div className="box-icon">
            <img src={data.icon} alt="box-icon" />
          </div>
          <div className="box-text">{data.text}</div>
        </div>
      ))}
    </div>
  );
};

BoxList.displayName = BoxListNamespace;
BoxList.defaultProps = BoxListDefaultProps;
export default BoxList;
