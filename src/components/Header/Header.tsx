import React, { useState } from 'react';
import { MultiSelect } from 'react-multi-select-component';
import './Header.css';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  assignedFilter: { label: string; value: string }[];
  setAssignedFilter: (filter: { label: string; value: string }[]) => void;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
  assignedFilter,
  setAssignedFilter
}) => {
  const [libraryOptions, setLibraryOptions] = useState([]);

  const options = [
    { label: 'Да', value: 'yes' },
    { label: 'Нет', value: 'no' }
  ];

  const getLabel = (selectedOptions: any[], defaultLabel: string) => {
    if (selectedOptions.some(option => option.value === 'yes')) {
      return `${defaultLabel} +1`;
    }
    return defaultLabel;
  };

  return (
    <header className="header">
      <h1 className="header__title">Классы</h1>
      <div className="header__filters">
        <MultiSelect
          options={options}
          value={assignedFilter}
          onChange={setAssignedFilter}
          labelledBy="Присвоенные"
          disableSearch
          hasSelectAll={false}
          overrideStrings={{
            selectSomeItems:
              assignedFilter.some(opt => opt.value === 'yes') && assignedFilter.length === 1
                ? 'Присвоенные +1'
                : 'Присвоенные'
          }}
        />

        <MultiSelect
          options={options}
          value={libraryOptions}
          onChange={setLibraryOptions}
          labelledBy="В библиотеке"
          disableSearch
          hasSelectAll={false}
          overrideStrings={{
            selectSomeItems: getLabel(libraryOptions, 'В библиотеке')
          }}
        />

        <div className="header__input-wrapper">
          <img src="../../images/search_icon.svg" alt="Search" className="header__search-icon" />
          <input
            className="header__input"
            type="text"
            placeholder="Найти классы"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
