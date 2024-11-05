import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TreeNode {
  value: string;
  label: string;
  description: string;
  children?: TreeNode[];
}

interface TreeState {
  nodes: TreeNode[];
  loading: boolean;
  error: string | null;
  selectedNode: TreeNode | null;
  checked: string[];
  expanded: string[];
  searchTerm: string;
  assignedFilter: { label: string; value: string }[];
}

const initialState: TreeState = {
  nodes: [],
  loading: false,
  error: null,
  selectedNode: null,
  checked: [],
  expanded: [],
  searchTerm: '',
  assignedFilter: []
};

export const treeSlice = createSlice({
  name: 'tree',
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<TreeNode[]>) => {
      state.nodes = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSelectedNode: (state, action: PayloadAction<TreeNode | null>) => {
      state.selectedNode = action.payload;
    },
    setChecked: (state, action: PayloadAction<string[]>) => {
      state.checked = action.payload;
    },
    setExpanded: (state, action: PayloadAction<string[]>) => {
      state.expanded = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setAssignedFilter: (state, action: PayloadAction<{ label: string; value: string }[]>) => {
      state.assignedFilter = action.payload;
    }
  }
});

export const {
  setNodes,
  setLoading,
  setError,
  setSelectedNode,
  setChecked,
  setExpanded,
  setSearchTerm,
  setAssignedFilter
} = treeSlice.actions;

export default treeSlice.reducer;
