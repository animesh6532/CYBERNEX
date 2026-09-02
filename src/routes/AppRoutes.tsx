import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { WorkbenchPage } from '../pages/WorkbenchPage';
import { AgentExecutionPage } from '../pages/AgentExecutionPage';
import { ResultsPage } from '../pages/ResultsPage';
import { KnowledgeBasePage } from '../pages/KnowledgeBasePage';
import { DocumentsPage } from '../pages/DocumentsPage';
import { RunsPage } from '../pages/RunsPage';
import { ModelsPage } from '../pages/ModelsPage';
import { SecurityPage } from '../pages/SecurityPage';
import { AdminPage } from '../pages/AdminPage';
import { SettingsPage } from '../pages/SettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Authenticated Application Shell */}
      <Route element={<AppShell />}>
        <Route path="/workbench" element={<WorkbenchPage />} />
        <Route path="/runs/:id" element={<AgentExecutionPage />} />
        <Route path="/results/:id" element={<ResultsPage />} />
        <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/runs" element={<RunsPage />} />
        <Route path="/models" element={<ModelsPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
