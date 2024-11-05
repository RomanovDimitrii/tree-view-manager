import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { selectSelectedNode, selectChecked } from '../../features/tree/selectors';
import { setChecked } from '../../features/tree/treeSlice';
import './Description.css';

interface TreeNode {
  value: string;
  label: string;
  description: string;
  children?: TreeNode[];
}

const Description: React.FC = () => {
  const dispatch = useDispatch();
  const selectedNode = useSelector((state: RootState) => selectSelectedNode(state));
  const checkedNodes = useSelector((state: RootState) => selectChecked(state));

  const isNodeChecked = (nodeId: string) => checkedNodes.includes(nodeId);

  const handleCheckboxChange = (nodeId: string) => {
    const updatedCheckedNodes = isNodeChecked(nodeId)
      ? checkedNodes.filter(id => id !== nodeId)
      : [...checkedNodes, nodeId];
    dispatch(setChecked(updatedCheckedNodes));
  };

  const renderNodeWithCheckbox = (node: TreeNode) => (
    <div key={node.value} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <input
        type="checkbox"
        checked={isNodeChecked(node.value)}
        onChange={() => handleCheckboxChange(node.value)}
      />
      <span>{node.label}</span>
    </div>
  );

  return (
    <div>
      {selectedNode ? (
        <section className="description">
          <h2 className="description__title">Описание: {selectedNode.description}</h2>
          <p className="description__text">{selectedNode.description}</p>

          <h2 className="description__title">Связи:</h2>

          <h4 className="description__subtitle">Дочерние узлы:</h4>
          <ul className="description__list">
            {selectedNode.children?.length ? (
              selectedNode.children.map(child => (
                <li key={child.value}>{renderNodeWithCheckbox(child)}</li>
              ))
            ) : (
              <li>Нет дочерних узлов</li>
            )}
          </ul>
        </section>
      ) : (
        <p>Выберите узел для просмотра информации</p>
      )}
    </div>
  );
};

export default Description;
