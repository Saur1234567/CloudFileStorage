import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import FAB from './components/common/FAB.jsx';
import ContextMenu from './components/FileExplorer/ContextMenu.jsx';
import PreviewModal from './components/Dialogs/PreviewModal.jsx';
import DeleteDialog from './components/Dialogs/DeleteDialog.jsx';
import RenameDialog from './components/Dialogs/RenameDialog.jsx';
import MoveDialog from './components/Dialogs/MoveDialog.jsx';
import CreateFolderDialog from './components/Dialogs/CreateFolderDialog.jsx';
import UploadManager from './components/Upload/UploadProgressItem.jsx';
import { useUI } from './context/UIContext.jsx';
import { ProtectedRoute, PublicOnlyRoute } from './components/RouteGuards.jsx';

import DashboardPage from './pages/DashboardPage.jsx';
import MyDrivePage from './pages/MyDrivePage.jsx';
import RecentPage from './pages/RecentPage.jsx';
import SharedPage from './pages/SharedPage.jsx';
import StarredPage from './pages/StarredPage.jsx';
import TrashPage from './pages/TrashPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import OtpVerification from './pages/auth/OtpVerification.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';

import NotFound from './pages/errors/NotFound.jsx';
import ServerError from './pages/errors/ServerError.jsx';
import Offline from './pages/errors/Offline.jsx';

function AppLayout({ children }) {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUI();
  return (
    <div className="flex min-h-screen bg-aurora-radial bg-fixed">
      <Sidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
      <FAB />
      <UploadManager />
      <ContextMenu />
      <PreviewModal />
      <DeleteDialog />
      <RenameDialog />
      <MoveDialog />
      <CreateFolderDialog />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
      <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
      <Route path="/otp-verification" element={<OtpVerification />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/500" element={<ServerError />} />
      <Route path="/offline" element={<Offline />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/drive"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyDrivePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/recent"
        element={
          <ProtectedRoute>
            <AppLayout>
              <RecentPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/shared"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SharedPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/starred"
        element={
          <ProtectedRoute>
            <AppLayout>
              <StarredPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trash"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TrashPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SearchPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

