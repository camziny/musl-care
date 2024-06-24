export async function getCountries() {
  const res = await fetch("https://restcountries.com/v3.1/all");
  if (!res.ok) {
    throw new Error("Failed to fetch countries");
  }
  const allCountriesData = await res.json();
  const sortedCountries = allCountriesData
    .map((country: any) => ({
      value: country.cca2,
      label: country.name.common,
      flag: country.flags.svg,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return sortedCountries;
}
