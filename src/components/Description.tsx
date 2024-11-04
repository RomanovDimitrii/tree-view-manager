import React from 'react';

interface DescriptionProps {
  selectedNode: { label: string; description: string; children?: { label: string }[] } | null;
}

const Description: React.FC<DescriptionProps> = ({ selectedNode }) => {
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
            {selectedNode.children?.map((child, index) => <li key={index}>{child.label}</li>) || (
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
