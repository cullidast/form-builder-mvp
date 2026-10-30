import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import FormBuilder from './pages/FormBuilder';
import FormResponses from './pages/FormResponses';
import PublicForm from './pages/PublicForm';
import ThankYou from './pages/ThankYou';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/new" element={<FormBuilder />} />
        <Route path="/admin/:id/edit" element={<FormBuilder />} />
        <Route path="/admin/:id/responses" element={<FormResponses />} />
        <Route path="/form/:id" element={<PublicForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
