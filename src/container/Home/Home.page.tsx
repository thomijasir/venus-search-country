import React, { FC, useState } from 'react';
import './Home.scss';
import AutoCompleteInput, {
  IListSuggestion,
} from '../../components/AutoCompleteInput/AutoCompleteInput.comp';
import useClientRestCountry from '../../hooks/useClientRestCountry';
import { ICountryItem } from '../../interfaces/IResponses';

export interface IProps {}

const Home: FC<IProps> = () => {
  const [autoCompleteLoad, setAutoCompleteLoad] = useState<boolean>(false);
  const [suggestionNull, setSuggestionNull] = useState<boolean>(false);
  const [suggestionList, setSuggestionList] = useState<IListSuggestion[]>([]);

  const { searchCountry } = useClientRestCountry();

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
    console.log(data);
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

  return (
    <div className="home-page safe-area">
      <div className="search-content">
        <div className="header-hero">Search Country</div>
        <AutoCompleteInput
          onSelect={handleOnSelect}
          onChange={handleOnChange}
          onChangeFinish={handleOnFinishTyping}
          suggestionData={suggestionList}
          suggestionNotFound={suggestionNull}
          isLoading={autoCompleteLoad}
        />
      </div>
    </div>
  );
};

export default Home;
