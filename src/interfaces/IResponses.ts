// Define Interface Data
export interface ICountryItem {
  name: string;
  capital: string;
  flags: {
    svg: string;
    png: string;
  };
  alpha2Code: string;
  independent: boolean;
}
