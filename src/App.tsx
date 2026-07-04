import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { AuditPage } from '@/pages/AuditPage'
import { VersionFindingsPage } from '@/pages/VersionFindingsPage'
import { VersionsPage } from '@/pages/VersionsPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index element={<Navigate to="/audit-website" replace />} />
          <Route path="audit-website" element={<AuditPage />} />
          <Route path="audit-versions" element={<VersionsPage />} />
          <Route path="audit-versions/:versionId" element={<VersionFindingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
