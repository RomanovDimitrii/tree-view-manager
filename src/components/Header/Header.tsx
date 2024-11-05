import React, { useState } from 'react';
import { MultiSelect } from 'react-multi-select-component';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { setSearchTerm, setAssignedFilter } from '../../features/tree/treeSlice';
import { selectSearchTerm, selectAssignedFilter } from '../../features/tree/selectors';
import './Header.css';

const Header: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const searchTerm = useSelector((state: RootState) => selectSearchTerm(state));
  const assignedFilter = useSelector((state: RootState) => selectAssignedFilter(state));
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
          onChange={filter => dispatch(setAssignedFilter(filter))}
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
            onChange={e => dispatch(setSearchTerm(e.target.value))}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
