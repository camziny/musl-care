export async function getCountries() {
  const res = await fetch("https://restcountries.com/v3.1/all");
  const allCountriesData = await res.json();

  type Country = {
    value: string;
    label: string;
    flag: string;
  };

  const sortedCountries: Country[] = allCountriesData
    .map((country: any) => ({
      value: country.name.common,
      label: country.name.common,
      flag: country.flags.svg,
    }))
    .sort((a: Country, b: Country) => a.label.localeCompare(b.label));

  return sortedCountries;
}
