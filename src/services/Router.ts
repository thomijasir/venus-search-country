import { RouteProps } from 'react-router-dom';
import HomePage from '../container/Home/Home.page';
import DetailCountryPage from '../container/DetailCountry/DetailCountry.page';

export interface IRoute extends RouteProps {
  key: number;
  path: string;
  exact: boolean;
  element: any;
}

const Routes: Array<IRoute> = [
  {
    key: 1,
    path: '/',
    exact: true,
    element: HomePage,
  },
  {
    key: 2,
    path: '/:id',
    exact: true,
    element: DetailCountryPage,
  },
];

export default Routes;
