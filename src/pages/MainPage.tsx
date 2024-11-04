import React, { useState } from 'react';
import Header from '../components/Header';
import TreeComponent from '../components/TreeComponent';
import Description from '../components/Description';
import { useQuery, gql } from '@apollo/client';

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

const MainPage = () => {
  const { data, loading, error } = useQuery(GET_TREE_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  const nodes = data?.modelTreeClasses.tree.map(node => ({
    value: node.id,
    label: node.name,
    description: node.description,
    children: node.children?.map(child => ({
      value: child.id,
      label: child.name,
      description: child.description,
      children: child.children?.map(subChild => ({
        value: subChild.id,
        label: subChild.name,
        description: subChild.description
      }))
    }))
  }));

  return (
    <div>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div style={{ display: 'flex', gap: '20px' }}>
        <TreeComponent nodes={nodes} searchTerm={searchTerm} onSelectNode={setSelectedNode} />
        <Description selectedNode={selectedNode} />
      </div>
    </div>
  );
};

export default MainPage;
