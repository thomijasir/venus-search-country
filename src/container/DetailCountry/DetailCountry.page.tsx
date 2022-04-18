import React, { FC, useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import useClientRestCountry from '../../hooks/useClientRestCountry';
import { IDetailCountry } from '../../interfaces/IResponses';
import { AppContext } from '../../store/AppProvider';
import './DetailCountry.scss';

export interface IProps {}

const DetailCountry: FC<IProps> = () => {
  const { searchCountryID } = useClientRestCountry();
  const [country, setCountry] = useState<IDetailCountry>();
  const context = useContext(AppContext);
  const params = useParams();

  useEffect(() => {
    if (!context.loadingState.isLoading) {
      context.setLoading({ isLoading: true });
    }
    searchCountryID(params.id || '')
      .then((data: IDetailCountry) => {
        setCountry(data);
      })
      .catch(() => {
        context.setError({
          isError: true,
          title: 'Country not found!',
          message: "The country that you're looking for is unavailable ",
        });
      })
      .finally(() => {
        context.setLoading({ isLoading: false });
      });
  }, []);

  return (
    <div className="detail-country-page safe-area">
      {JSON.stringify(country)}
    </div>
  );
};

export default DetailCountry;
