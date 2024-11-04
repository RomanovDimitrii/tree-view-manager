import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import TreeComponent from '../../components/TreeComponent/TreeComponent';
import Description from '../../components/Description/Description';
import { useQuery, gql } from '@apollo/client';
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
    <div className="main">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main style={{ display: 'flex', gap: '20px' }}>
        <TreeComponent nodes={nodes} searchTerm={searchTerm} onSelectNode={setSelectedNode} />
        <Description selectedNode={selectedNode} />
      </main>
    </div>
  );
};

export default MainPage;
