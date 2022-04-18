import React, { FC, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../store/AppProvider';
import AutoCompleteInput, {
  IListSuggestion,
} from '../../components/AutoCompleteInput/AutoCompleteInput.comp';
import useClientRestCountry from '../../hooks/useClientRestCountry';
import { ICountryItem } from '../../interfaces/IResponses';
import BoxList, {
  IBoxItem,
} from '../../components/TemplateComp copy/BoxList.comp';
import { useStorage } from '../../hooks/useStorage';
import './Home.scss';

export interface IProps {}

const Home: FC<IProps> = () => {
  const [autoCompleteLoad, setAutoCompleteLoad] = useState<boolean>(false);
  const [suggestionNull, setSuggestionNull] = useState<boolean>(false);
  const [suggestionList, setSuggestionList] = useState<IListSuggestion[]>([]);
  const [recent, setRecent] = useStorage('RECENT_COUNTRY', {});
  const context = useContext(AppContext);
  const { searchCountry } = useClientRestCountry();
  const navigate = useNavigate();

  const handleOnChange = () => {
    setAutoCompleteLoad(true);
  };

  const handleOnFinishTyping = (e: string) => {
    searchCountry(e)
      .then((res: ICountryItem[]) => {
        setSuggestionList(mapSetSuggestion(res));
        setSuggestionNull(false);
      })
      .catch(() => {
        setSuggestionNull(true);
      })
      .finally(() => {
        setAutoCompleteLoad(false);
      });
  };

  const handleOnSelect = (data: IListSuggestion) => {
    // UPDATE RECENTS
    if (recent.length <= 0) {
      setRecent([data]);
    } else {
      const newRecent = [data, ...recent];
      setRecent(newRecent);
    }
    // SET LOADING
    context.setLoading({ isLoading: true });
    // NEXT DETAIL PAGE
    navigate(`/${data.id}`);
  };

  const handleOnSelectRecent = (data: IBoxItem) => {
    // SET LOADING
    context.setLoading({ isLoading: true });
    // NEXT DETAIL PAGE
    navigate(`/${data.id.split('-')[0]}`);
  };

  const mapSetSuggestion = (data: ICountryItem[]) => {
    return data.map(
      (item: ICountryItem) =>
        ({
          id: item.alpha2Code,
          icon: item.flags.svg,
          text: item.name,
          selected: false,
        } as IListSuggestion),
    );
  };

  const mapBoxList = (data: IBoxItem[]) =>
    data.map(
      (item: IBoxItem, index: number) =>
        ({
          id: `${item.id}-${index}`,
          icon: item.icon,
          text: item.text,
        } as IBoxItem),
    );

  return (
    <div className="home-page safe-area">
      <div className="header-hero">Search Country</div>
      <div className="search-area">
        <AutoCompleteInput
          onSelect={handleOnSelect}
          onChange={handleOnChange}
          onChangeFinish={handleOnFinishTyping}
          suggestionData={suggestionList}
          suggestionNotFound={suggestionNull}
          isLoading={autoCompleteLoad}
        />
      </div>
      <div className="recent-search">
        <BoxList
          itemList={mapBoxList(recent).slice(0, 10)}
          onSelect={handleOnSelectRecent}
        />
      </div>
    </div>
  );
};

export default Home;
