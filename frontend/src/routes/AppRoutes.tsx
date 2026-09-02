import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { LandingPage } from '../pages/Landing/LandingPage';
import { LoginPage } from '../pages/Login/LoginPage';
import { WorkbenchPage } from '../pages/Workbench/WorkbenchPage';
import { AgentExecutionPage } from '../pages/Runs/AgentExecutionPage';
import { ResultsPage } from '../pages/Runs/ResultsPage';
import { KnowledgeBasePage } from '../pages/Knowledge/KnowledgeBasePage';
import { DocumentsPage } from '../pages/Documents/DocumentsPage';
import { RunsPage } from '../pages/Runs/RunsPage';
import { ModelsPage } from '../pages/Models/ModelsPage';
import { SecurityPage } from '../pages/Security/SecurityPage';
import { AdminPage } from '../pages/System/AdminPage';
import { SettingsPage } from '../pages/Settings/SettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing & Authentication (NO WORKSPACE NAVBAR) */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Authenticated Main Workspace (FLOATING WORKSPACE NAVBAR ONLY) */}
      <Route element={<AppShell />}>
        <Route path="/workbench" element={<WorkbenchPage />} />
        
        {/* Knowledge Base & Alias */}
        <Route path="/knowledge" element={<KnowledgeBasePage />} />
        <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
        
        <Route path="/runs" element={<RunsPage />} />
        <Route path="/runs/:id" element={<AgentExecutionPage />} />
        <Route path="/results/:id" element={<ResultsPage />} />
        <Route path="/models" element={<ModelsPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/security" element={<SecurityPage />} />
        
        {/* System & Alias */}
        <Route path="/system" element={<AdminPage />} />
        <Route path="/admin" element={<AdminPage />} />
        
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
