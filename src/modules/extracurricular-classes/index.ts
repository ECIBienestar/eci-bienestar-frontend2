// Export all module components, hooks, and utilities
export * from './routes';

// State slices
export { default as classesReducer } from './state/classesSlice';

// Pages
export { default as EnrolledClassesPage } from './pages/student/enrolledClassesPage';
export { default as AvailableClassesPage } from './pages/student/availableClassesPage';
export { default as AttendanceHistoryPage } from './pages/student/attendanceHistoryPage';

// Components
export { default as ModuleTabs } from './components/common/moduleTabs';
export { default as BackButton } from './components/common/backButton';
export { default as CalendarView } from './components/common/calendarView';