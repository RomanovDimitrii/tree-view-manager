import React, { useEffect, useState } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { setChecked, setExpanded } from '../../features/tree/treeSlice';
import { selectChecked, selectExpanded } from '../../features/tree/selectors';

import 'react-checkbox-tree/lib/react-checkbox-tree.css';
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

  const CustomLabel = ({ node }: { node: TreeNode }) => (
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

  const formatNodesForCheckboxTree = (nodes: TreeNode[]): any[] =>
    nodes.map(node => ({
      ...node,
      label: <CustomLabel node={node} />,
      children: node.children ? formatNodesForCheckboxTree(node.children) : undefined
    }));

  const assignedValues = assignedFilter.map(filter => filter.value);

  const filterNodesByAssigned = (nodes: TreeNode[]): TreeNode[] => {
    const effectiveAssignedValues = assignedValues.length > 0 ? assignedValues : ['yes', 'no'];

    return nodes
      .map(node => {
        const isChecked = checked.includes(node.value);

        const filteredChildren =
          node.children && node.children.length > 0
            ? filterNodesByAssigned(node.children)
            : undefined;

        const includeNode =
          (effectiveAssignedValues.includes('yes') && isChecked) ||
          (effectiveAssignedValues.includes('no') && !isChecked) ||
          (effectiveAssignedValues.includes('yes') && effectiveAssignedValues.includes('no')) ||
          (filteredChildren && filteredChildren.length > 0);

        return includeNode
          ? {
              ...node,
              children: filteredChildren
            }
          : null;
      })
      .filter(node => node !== null) as TreeNode[];
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

  console.log('Assigned Values:', assignedValues);

  useEffect(() => {
    const updatedNodes = searchTerm ? filterNodes(nodes, searchTerm) : filterNodesByAssigned(nodes);
    setFilteredNodes(updatedNodes);
  }, [nodes, searchTerm, assignedFilter, checked]);

  return (
    <section className="tree__block">
      <div className="tree__btn-block">
        <button className="tree__btn" onClick={expandAllNodes}>
          Развернуть все
        </button>
        <button className="tree__btn" onClick={collapseAllNodes}>
          Свернуть все
        </button>
      </div>
      <div className="tree__wrapper">
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
    </section>
  );
};

export default TreeComponent;
