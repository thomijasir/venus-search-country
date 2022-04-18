import React, {
  FC,
  useState,
  ReactNode,
  useEffect,
  useRef,
  PropsWithChildren,
} from 'react';
import './AutoCompleteInput.scss';

export interface IListSuggestion {
  id: string | number;
  icon: string;
  text: string;
  selected: false;
}
export interface IAutoCompleteInputProps extends PropsWithChildren<any> {
  onChange?: (e: string) => void;
  onChangeFinish?: (e: string) => void;
  onSelect: (e: IListSuggestion) => void;
  isLoading?: boolean;
  suggestionData: IListSuggestion[];
  suggestionNotFound?: boolean;
}

const DEFAULT_FLAG_ICON = 'https://flagcdn.com/ax.svg';

export const AutoCompleteInputDefaultProps = {
  isLoading: false,
  suggestionNotFound: false,
};

export const AutoCompleteInputNamespace = 'AutoCompleteInput';

const AutoCompleteInput: FC<IAutoCompleteInputProps> = (props) => {
  const {
    onChange,
    onSelect,
    onChangeFinish,
    isLoading,
    suggestionNotFound,
    suggestionData,
  } = props;

  const [value, setValue] = useState<string>('');
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const [listSuggestion, setListSuggestion] =
    useState<IListSuggestion[]>(suggestionData);
  const inputElement = useRef<HTMLInputElement>(null);
  const isMount = useRef(false);
  let onTyping: any;

  useEffect(() => {
    if (isMount.current) {
      if (isFocus) {
        handleListActiveByIndex(suggestionIndex);
      } else {
        setSuggestionIndex(-1);
        handleListActiveByIndex(-1);
        inputElement.current?.blur();
      }
    } else {
      isMount.current = true;
    }
  }, [suggestionIndex, isFocus]);

  useEffect(() => {
    const filterData = arrayStringSearch('text', value, suggestionData);
    setListSuggestion(filterData);
  }, [value, suggestionData]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const getText = e.currentTarget.value;
    setValue(getText);
    onChange && onChange(getText);
  };

  const handleOnFocus = () => {
    setIsFocus(true);
  };

  const handleOnBlur = () => {
    setIsFocus(false);
  };

  const handleOnClose = () => {
    setValue('');
    setIsFocus(false);
  };

  const handleListActiveByIndex = (indexData: number) => {
    if (indexData < 0) {
      const reset = listSuggestion.map(
        (data: IListSuggestion) =>
          ({ ...data, selected: false } as IListSuggestion),
      );
      setListSuggestion(reset);
    } else {
      const newSuggestion = listSuggestion.map(
        (data: IListSuggestion, index: number) =>
          ({
            id: data.id,
            icon: data.icon,
            text: data.text,
            selected: index === indexData,
          } as IListSuggestion),
      );
      setListSuggestion(newSuggestion);
    }
  };

  const handleOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalItem = listSuggestion.length - 1;
    switch (e.key) {
      case 'ArrowDown':
        if (suggestionIndex >= totalItem) {
          setSuggestionIndex(0);
        } else {
          setSuggestionIndex(suggestionIndex + 1);
        }
        break;
      case 'ArrowUp':
        if (suggestionIndex <= 0) {
          setSuggestionIndex(totalItem);
        } else {
          setSuggestionIndex(suggestionIndex - 1);
        }
        break;
      case 'Enter':
        handleOnSelectItem(listSuggestion[suggestionIndex])();
        break;
      default:
    }
    // exception
    if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) {
      clearTimeout(onTyping);
      onTyping = setTimeout(() => {
        onChangeFinish && onChangeFinish(value);
      }, 700);
    }
  };

  const handleOnKeyDown = () => {
    clearTimeout(onTyping);
  };

  const handleOnSelectItem = (data: IListSuggestion) => () => {
    setIsFocus(false);
    onSelect(data);
  };

  const arrayStringSearch = (
    objectTarget: string,
    str: string,
    listObject: any,
  ) =>
    listObject.filter(
      (el: any) =>
        el[objectTarget].toLowerCase().indexOf(str.toLowerCase()) > -1,
    );

  const highlightText = (str: string, label: string): ReactNode | string => {
    const index = label.toLowerCase().indexOf(str.toLowerCase());
    if (index !== -1) {
      const { length } = str;
      const prefix = label.substring(0, index);
      const suffix = label.substring(index + length);
      const match = label.substring(index, index + length);
      return (
        <>
          {prefix}
          <b>{match}</b>
          {suffix}
        </>
      );
    }
    return label;
  };

  let message: string = 'Lets, search country..';
  if (isLoading) {
    message = 'Loading..';
  } else if (suggestionNotFound) {
    message = 'Seems you country not available..';
  } else {
    message = 'Lets, search country..';
  }

  return (
    <div className="autocomplete-input">
      <div
        className={`layer-blur ${isFocus ? 'show' : ''}`}
        onClick={handleOnBlur}
      ></div>
      <div className="search-icon">
        <i className="bi bi-search"></i>
      </div>
      <div className={`input-box-area ${isFocus ? 'focus' : ''}`}>
        <input
          ref={inputElement}
          type="text"
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          onKeyUp={handleOnKeyUp}
          onKeyDown={handleOnKeyDown}
          value={value}
          placeholder="Search country name.."
        />
        <div className="list-view">
          {listSuggestion.length <= 0 && (
            <div className="list-item helper">
              <div className="icon-item"></div>
              <div className="text-item">{message}</div>
            </div>
          )}
          {listSuggestion.map((data: IListSuggestion) => (
            <div
              key={data.id}
              className={`list-item ${data.selected ? 'selected' : ''} `}
              onClick={handleOnSelectItem(data)}
            >
              <div className="icon-item">
                <img src={data.icon || DEFAULT_FLAG_ICON} alt="flag-icon" />
              </div>
              <div className="text-item">{highlightText(value, data.text)}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={`loading-indicator ${isLoading ? 'show' : ''}`}>
        <div className="spinning">
          <i className="bi bi-hypnotize" />
        </div>
      </div>
      <div
        className={`close-icon ${value ? 'show' : ''}`}
        onClick={handleOnClose}
      >
        <i className="bi bi-x-circle"></i>
      </div>
    </div>
  );
};

AutoCompleteInput.displayName = AutoCompleteInputNamespace;
AutoCompleteInput.defaultProps = AutoCompleteInputDefaultProps;
export default AutoCompleteInput;
