import React from 'react';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <header style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <h1>Классы</h1>

      <select>
        <option value="">Присвоенные</option>
        <option value="yes">Да</option>
        <option value="no">Нет</option>
      </select>

      <select>
        <option value="">В библиотеке</option>
        <option value="yes">Да</option>
        <option value="no">Нет</option>
      </select>

      <input
        type="text"
        placeholder="Поиск..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
    </header>
  );
};

export default Header;
