import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import kanbanReducer from '../features/kanban/kanbanSlice';
import projectsReducer from '../features/projects/projectsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    kanban: kanbanReducer,
    projects: projectsReducer,
  },
});