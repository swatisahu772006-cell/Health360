import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewPage } from './pages/OverviewPage';
import { PatientAnalyticsPage } from './pages/PatientAnalyticsPage';
import { DiseaseAnalysisPage } from './pages/DiseaseAnalysisPage';
import { RiskAssessmentPage } from './pages/RiskAssessmentPage';
import { LifestyleInsightsPage } from './pages/LifestyleInsightsPage';
import { DemographicsPage } from './pages/DemographicsPage';
import { DataExplorerPage } from './pages/DataExplorerPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { api } from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('health360_theme') === 'dark';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [totalPatients, setTotalPatients] = useState<number>(1500);

  // Sync theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('health360_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('health360_theme', 'light');
    }
  }, [darkMode]);

  // Handle global patient search redirect
  useEffect(() => {
    if (searchQuery && activeTab !== 'patients') {
      setActiveTab('patients');
    }
  }, [searchQuery]);

  // Page Switcher
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewPage
            onNavigateTab={(tab) => setActiveTab(tab)}
            searchQuery={searchQuery}
            selectedDateRange={selectedDateRange}
          />
        );
      case 'patients':
        return <PatientAnalyticsPage initialSearch={searchQuery} />;
      case 'diseases':
        return <DiseaseAnalysisPage />;
      case 'risk':
        return <RiskAssessmentPage />;
      case 'lifestyle':
        return <LifestyleInsightsPage />;
      case 'demographics':
        return <DemographicsPage />;
      case 'explorer':
        return <DataExplorerPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} />;
      default:
        return (
          <OverviewPage
            onNavigateTab={(tab) => setActiveTab(tab)}
            searchQuery={searchQuery}
            selectedDateRange={selectedDateRange}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex">
      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar (Desktop & Mobile) */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-40 lg:z-30 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setMobileMenuOpen(false);
          }}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          totalPatients={totalPatients}
        />
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>

        {/* Global Institutional Footer */}
        <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 px-6 py-4 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">Health360</span>
            <span>&bull;</span>
            <span>Comprehensive Healthcare Risk & Disease Analytics</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Educational Research Prototype</span>
            <span>&bull;</span>
            <span className="text-teal-600 dark:text-teal-400 font-medium">Not for Clinical Diagnosis</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
