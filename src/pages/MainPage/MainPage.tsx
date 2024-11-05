import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import TreeComponent from '../../components/TreeComponent/TreeComponent';
import Description from '../../components/Description/Description';
import { useQuery, gql } from '@apollo/client';
import { RootState, AppDispatch } from '../../app/store';
import {
  setNodes,
  setLoading,
  setError,
  setSearchTerm,
  setAssignedFilter,
  setSelectedNode
} from '../../features/tree/treeSlice';
import {
  selectNodes,
  selectLoading,
  selectError,
  selectSearchTerm,
  selectAssignedFilter,
  selectSelectedNode
} from '../../features/tree/selectors';
import './MainPage.css';

const GET_TREE_DATA = gql`
  query MyQuery {
    modelTreeClasses {
      tree {
        id
        name
        description
        children {
          id
          name
          description
          children {
            id
            name
            description
          }
        }
      }
    }
  }
`;

const MainPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { data, loading, error } = useQuery(GET_TREE_DATA);

  // Используем Redux для управления состояниями
  const searchTerm = useSelector((state: RootState) => selectSearchTerm(state));
  const assignedFilter = useSelector((state: RootState) => selectAssignedFilter(state));
  const selectedNode = useSelector((state: RootState) => selectSelectedNode(state));
  const nodes = useSelector((state: RootState) => selectNodes(state));

  useEffect(() => {
    dispatch(setLoading(loading));
    if (error) dispatch(setError(error.message));
    if (data) {
      const nodes = data.modelTreeClasses.tree.map((node: any) => ({
        value: node.id,
        label: node.name,
        description: node.description,
        children: node.children?.map((child: any) => ({
          value: child.id,
          label: child.name,
          description: child.description,
          children: child.children?.map((subChild: any) => ({
            value: subChild.id,
            label: subChild.name,
            description: subChild.description
          }))
        }))
      }));
      dispatch(setNodes(nodes));
    }
  }, [data, loading, error, dispatch]);

  return (
    <div className="main">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={term => dispatch(setSearchTerm(term))}
        assignedFilter={assignedFilter}
        setAssignedFilter={filter => dispatch(setAssignedFilter(filter))}
      />

      <main className="main__columns">
        <TreeComponent
          nodes={nodes}
          searchTerm={searchTerm}
          assignedFilter={assignedFilter}
          onSelectNode={node => dispatch(setSelectedNode(node))}
        />
        <Description selectedNode={selectedNode} />
      </main>
    </div>
  );
};

export default MainPage;
