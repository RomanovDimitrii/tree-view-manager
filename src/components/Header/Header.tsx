import React, { useState } from 'react';
import { MultiSelect } from 'react-multi-select-component';
import './Header.css';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm }) => {
  const [assignedOptions, setAssignedOptions] = useState([]);
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
          value={assignedOptions}
          onChange={setAssignedOptions}
          labelledBy="Присвоенные"
          disableSearch
          hasSelectAll={false}
          overrideStrings={{
            selectSomeItems: getLabel(assignedOptions, 'Присвоенные')
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

        <input
          type="text"
          placeholder="Поиск..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
    </header>
  );
};

export default Header;
