import React, { useState, useEffect } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import {
  FaCheckSquare,
  FaSquare,
  FaMinusSquare,
  FaPlus,
  FaMinus,
  FaFolder,
  FaFolderOpen,
  FaFile
} from 'react-icons/fa';

interface TreeNode {
  value: string;
  label: string;
  description: string;
  children?: TreeNode[];
}

interface TreeComponentProps {
  nodes: TreeNode[];
  searchTerm: string;
  onSelectNode: (node: TreeNode) => void;
}

const TreeComponent: React.FC<TreeComponentProps> = ({ nodes, searchTerm, onSelectNode }) => {
  const [checked, setChecked] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);

  const expandAllNodes = () => {
    setExpanded(nodes.flatMap(getAllNodeValues));
  };

  const collapseAllNodes = () => {
    setExpanded([]);
  };

  const getAllNodeValues = (nodes: TreeNode[]): string[] =>
    nodes.reduce((acc, node) => {
      acc.push(node.value);
      if (node.children) acc.push(...getAllNodeValues(node.children));
      return acc;
    }, [] as string[]);

  const handleCheck = (checkedValues: string[]) => {
    setChecked(checkedValues);
    const selectedNodeValue = checkedValues[checkedValues.length - 1];
    const selectedNode = findNodeByValue(nodes, selectedNodeValue);
    if (selectedNode) onSelectNode(selectedNode);
  };

  const findNodeByValue = (nodes: TreeNode[], value: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.value === value) return node;
      if (node.children) {
        const childNode = findNodeByValue(node.children, value);
        if (childNode) return childNode;
      }
    }
    return null;
  };

  const filterNodes = (nodes: TreeNode[], term: string): TreeNode[] => {
    return nodes
      .map(node => ({
        ...node,
        children: node.children ? filterNodes(node.children, term) : []
      }))
      .filter(
        node => node.label.toLowerCase().includes(term.toLowerCase()) || node.children.length > 0
      );
  };

  const filteredNodes = searchTerm ? filterNodes(nodes, searchTerm) : nodes;

  return (
    <div>
      <button onClick={expandAllNodes}>Развернуть все</button>
      <button onClick={collapseAllNodes}>Свернуть все</button>

      <CheckboxTree
        nodes={filteredNodes}
        checked={checked}
        expanded={expanded}
        onCheck={handleCheck}
        onExpand={setExpanded}
        icons={{
          check: <FaCheckSquare />,
          uncheck: <FaSquare />,
          halfCheck: <FaMinusSquare />,
          expandOpen: <FaMinus />,
          expandClose: <FaPlus />,
          parentClose: <FaFolder />,
          parentOpen: <FaFolderOpen />,
          leaf: <FaFile />
        }}
      />
    </div>
  );
};

export default TreeComponent;
