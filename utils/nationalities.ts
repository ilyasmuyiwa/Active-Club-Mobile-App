// Nationality list extracted from nationalities.csv
const COUNTRIES = [
  'China', 'India', 'United States', 'Indonesia', 'Pakistan', 'Brazil', 'Nigeria', 'Bangladesh',
  'Russia', 'Mexico', 'Philippines', 'Iran', 'Egypt', 'Germany', 'Tanzania', 'Colombia',
  'Turkey', 'Sudan', 'Ethiopia', 'Japan', 'Italy', 'Canada', 'DR Congo', 'France',
  'Vietnam', 'South Korea', 'Angola', 'United Kingdom', 'Kenya', 'Thailand', 'Algeria',
  'Nepal', 'Myanmar', 'Argentina', 'South Africa', 'Poland', 'North Korea', 'Uganda',
  'Afghanistan', 'Spain', 'Peru', 'Mali', 'Iraq', 'Uzbekistan', 'Zambia', 'Ukraine',
  'Yemen', 'Senegal', 'Saudi Arabia', 'Ghana', 'Morocco', 'Côte d\'Ivoire', 'Guinea',
  'Mozambique', 'Malaysia', 'Cameroon', 'Bolivia', 'Madagascar', 'Venezuela', 'Dominican Republic',
  'Sri Lanka', 'Australia', 'Azerbaijan', 'Chile', 'Tajikistan', 'Romania', 'Syria',
  'Guatemala', 'Israel', 'Burkina Faso', 'Somalia', 'Cambodia', 'Paraguay', 'Niger',
  'Burundi', 'Rwanda', 'Cuba', 'Kazakhstan', 'Kyrgyzstan', 'Belgium', 'Jordan',
  'Malawi', 'Netherlands', 'Czech Republic (Czechia)', 'Finland', 'United Arab Emirates',
  'Zimbabwe', 'Ecuador', 'State of Palestine', 'Papua New Guinea', 'Sweden', 'Tunisia',
  'Chad', 'Sierra Leone', 'New Zealand', 'Belarus', 'Benin', 'Moldova', 'South Sudan',
  'Lebanon', 'Haiti', 'Mongolia', 'Switzerland', 'Singapore', 'Portugal', 'Lithuania',
  'Greece', 'Bulgaria', 'Norway', 'Lesotho', 'Hungary', 'Bahrain', 'Ireland', 'Mauritius',
  'Serbia', 'Comoros', 'Kuwait', 'Luxembourg', 'Laos', 'El Salvador', 'Honduras',
  'Uruguay', 'Congo', 'Nicaragua', 'Malta', 'Austria', 'Qatar', 'Togo', 'Denmark',
  'Costa Rica', 'Botswana', 'Libya', 'Oman', 'Vanuatu', 'Guinea-Bissau', 'Mauritania',
  'Turkmenistan', 'Central African Republic', 'Estonia', 'Kiribati', 'Slovakia', 'Georgia',
  'Antigua and Barbuda', 'Djibouti', 'Croatia', 'Monaco', 'Liberia', 'Armenia', 'Solomon Islands',
  'Bosnia and Herzegovina', 'Nauru', 'Namibia', 'Panama', 'Micronesia', 'Albania',
  'North Macedonia', 'Eritrea', 'Gabon', 'Bahamas', 'Jamaica', 'Latvia', 'Gambia',
  'Samoa', 'Slovenia', 'Timor-Leste', 'Trinidad and Tobago', 'Tonga', 'Eswatini',
  'Fiji', 'Bhutan', 'Equatorial Guinea', 'Marshall Islands', 'Montenegro', 'Cabo Verde',
  'Cyprus', 'Palau', 'Maldives', 'Belize', 'Guyana', 'Iceland', 'Sao Tome & Principe',
  'Suriname', 'Saint Lucia', 'St. Vincent & Grenadines', 'Brunei', 'Seychelles',
  'Dominica', 'Saint Kitts & Nevis', 'Barbados', 'San Marino', 'Tuvalu', 'Grenada',
  'Andorra', 'Liechtenstein', 'Holy See'
];

export const getNationalityOptions = (): string[] => {
  // Remove Qatar from the list to put it first
  const otherCountries = COUNTRIES.filter(country => country !== 'Qatar');
  
  // Sort other countries alphabetically
  otherCountries.sort();
  
  // Return with 'Please select' first, then Qatar, then other countries alphabetically
  return ['Please select', 'Qatar', ...otherCountries];
};