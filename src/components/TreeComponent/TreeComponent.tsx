import React, { useEffect, useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { setChecked, setExpanded } from '../../features/tree/treeSlice';
import { selectChecked, selectExpanded } from '../../features/tree/selectors';
import './TreeComponent.css';

interface TreeNode {
  value: string;
  label: string;
  description: string;
  children?: TreeNode[];
}

interface TreeComponentProps {
  nodes: TreeNode[];
  searchTerm: string;
  assignedFilter: { label: string; value: string }[];
  onSelectNode: (node: TreeNode) => void;
}

const TreeComponent: React.FC<TreeComponentProps> = ({
  nodes = [],
  searchTerm,
  assignedFilter = [],
  onSelectNode
}) => {
  const dispatch: AppDispatch = useDispatch();
  const checked = useSelector((state: RootState) => selectChecked(state));
  const expanded = useSelector((state: RootState) => selectExpanded(state));
  const [filteredNodes, setFilteredNodes] = useState<TreeNode[]>(nodes);
  const [clickTimeout, setClickTimeout] = useState<number | null>(null);

  const expandAllNodes = () => {
    const allNodeValues = getAllNodeValues(nodes);
    dispatch(setExpanded(allNodeValues));
  };

  const collapseAllNodes = () => {
    dispatch(setExpanded([]));
  };

  const getAllNodeValues = (nodes: TreeNode[]): string[] => {
    return nodes.reduce((acc, node) => {
      acc.push(node.value);
      if (Array.isArray(node.children) && node.children.length > 0) {
        acc.push(...getAllNodeValues(node.children));
      }
      return acc;
    }, [] as string[]);
  };

  const handleCheck = (checkedValues: string[]) => {
    dispatch(setChecked(checkedValues));
  };

  const handleSingleClick = (node: TreeNode) => {
    onSelectNode(node);
  };

  const handleDoubleClick = (node: TreeNode) => {
    dispatch(
      setExpanded(
        expanded.includes(node.value)
          ? expanded.filter(id => id !== node.value)
          : [...expanded, node.value]
      )
    );
  };

  const handleNodeClick = (node: TreeNode) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      handleDoubleClick(node);
    } else {
      const timeout = window.setTimeout(() => {
        handleSingleClick(node);
        setClickTimeout(null);
      }, 300);
      setClickTimeout(timeout);
    }
  };

  const CustomLabel = ({ node }: { node: TreeNode }) => {
    return (
      <span
        onClick={e => {
          e.stopPropagation();
          handleNodeClick(node);
        }}
        style={{ cursor: 'pointer' }}
      >
        {node.label}
      </span>
    );
  };

  const formatNodesForCheckboxTree = (nodes: TreeNode[]): any[] => {
    return nodes.map(node => ({
      ...node,
      label: <CustomLabel node={node} />,
      children: node.children ? formatNodesForCheckboxTree(node.children) : undefined
    }));
  };

  const assignedValues = assignedFilter.map(filter => filter.value);

  const filterNodesByAssigned = (nodes: TreeNode[]): TreeNode[] => {
    return nodes
      .map(node => ({
        ...node,
        children:
          node.children && node.children.length > 0
            ? filterNodesByAssigned(node.children)
            : undefined
      }))
      .filter(node => {
        const isChecked = checked.includes(node.value);
        if (assignedValues.includes('yes') && assignedValues.includes('no')) {
          return true;
        } else if (assignedValues.includes('yes')) {
          return isChecked;
        } else if (assignedValues.includes('no')) {
          return !isChecked;
        } else {
          return true;
        }
      });
  };

  const filterNodes = (nodes: TreeNode[], term: string): TreeNode[] => {
    const assignedFilteredNodes = filterNodesByAssigned(nodes);
    return assignedFilteredNodes
      .map(node => ({
        ...node,
        children: node.children ? filterNodes(node.children, term) : undefined
      }))
      .filter(
        node =>
          node.label.toLowerCase().includes(term.toLowerCase()) ||
          (node.children && node.children.length > 0)
      );
  };

  useEffect(() => {
    const updatedNodes = searchTerm ? filterNodes(nodes, searchTerm) : filterNodesByAssigned(nodes);
    setFilteredNodes(updatedNodes);
  }, [nodes, searchTerm, assignedFilter, checked]);

  return (
    <div>
      <button onClick={expandAllNodes}>Развернуть все</button>
      <button onClick={collapseAllNodes}>Свернуть все</button>

      <CheckboxTree
        nodes={formatNodesForCheckboxTree(filteredNodes)}
        checked={checked}
        expanded={expanded}
        onCheck={handleCheck}
        onExpand={expandedValues => dispatch(setExpanded(expandedValues))}
        icons={{
          check: null,
          uncheck: null,
          halfCheck: null,
          expandClose: <FaChevronRight className="expand-icon" />,
          expandOpen: <FaChevronDown className="expand-icon" />
        }}
        showNodeIcon={false}
        nativeCheckboxes
      />
    </div>
  );
};

export default TreeComponent;
