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
      <div className="flag">
        <img src={country?.flags.svg} alt="Flag of country" />
      </div>
      <div className="country-info">
        <div className="item">
          <div className="col-left">Name</div>
          <div className="col-right">
            {country?.name} - {country?.nativeName}
          </div>
        </div>
        <div className="item">
          <div className="col-left">Population</div>
          <div className="col-right">
            {new Intl.NumberFormat().format(
              parseInt(country?.population.toString() || '0', 10),
            )}
          </div>
        </div>
        <div className="item">
          <div className="col-left">Capital</div>
          <div className="col-right">{country?.capital}</div>
        </div>
        <div className="item">
          <div className="col-left">Currency</div>
          <div className="col-right">
            {country?.currencies[0].code} - {country?.currencies[0].symbol}
          </div>
        </div>
        <div className="item">
          <div className="col-left">Regional</div>
          <div className="col-right">{country?.region}</div>
        </div>
        <div className="item">
          <div className="col-left">Sub Region</div>
          <div className="col-right">{country?.subregion}</div>
        </div>
      </div>
    </div>
  );
};

export default DetailCountry;
