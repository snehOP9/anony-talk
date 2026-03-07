import { Navigate } from 'react-router-dom';

// Profile editing is now integrated into ViewProfile
export default function EditProfile() {
  return <Navigate to="/profile" replace />;
}
