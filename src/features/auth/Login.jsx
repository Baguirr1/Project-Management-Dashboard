import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    { id: 'p1', name: 'Website Redesign', status: 'Active', dueDate: '2026-04-10' },
    { id: 'p2', name: 'Mobile App Launch', status: 'Completed', dueDate: '2026-02-15' },
    { id: 'p3', name: 'Marketing Campaign', status: 'Active', dueDate: '2026-05-01' },
  ],
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { setProjects } = projectsSlice.actions;
export default projectsSlice.reducer;