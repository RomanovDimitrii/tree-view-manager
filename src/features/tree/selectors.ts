import { RootState } from '../../app/store';

export const selectNodes = (state: RootState) => state.tree.nodes;
export const selectLoading = (state: RootState) => state.tree.loading;
export const selectError = (state: RootState) => state.tree.error;
export const selectSelectedNode = (state: RootState) => state.tree.selectedNode;
export const selectChecked = (state: RootState) => state.tree.checked;
export const selectExpanded = (state: RootState) => state.tree.expanded;
export const selectSearchTerm = (state: RootState) => state.tree.searchTerm;
export const selectAssignedFilter = (state: RootState) => state.tree.assignedFilter;
