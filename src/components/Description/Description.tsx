import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { selectSelectedNode } from '../../features/tree/selectors';

const Description: React.FC = () => {
  const selectedNode = useSelector((state: RootState) => selectSelectedNode(state));

  return (
    <div>
      {selectedNode ? (
        <div>
          <h3>Информация о выбранном узле:</h3>
          <p>
            <strong>Имя:</strong> {selectedNode.label}
          </p>
          <p>
            <strong>Описание:</strong> {selectedNode.description}
          </p>
          <h4>Дочерние узлы:</h4>
          <ul>
            {selectedNode.children?.length ? (
              selectedNode.children.map((child, index) => <li key={index}>{child.label}</li>)
            ) : (
              <li>Нет дочерних узлов</li>
            )}
          </ul>
        </div>
      ) : (
        <p>Выберите узел для просмотра информации</p>
      )}
    </div>
  );
};

export default Description;
