import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TypeSelector } from './components/TypeSelector';
import { SiteForm } from './components/SiteForm';
import { PreviewPage } from './components/PreviewPage';
import { SuccessPage } from './components/SuccessPage';
import { PublicSite } from './pages/PublicSite';
import { AuthVerify } from './pages/AuthVerify';
import { useSiteBuilder } from './hooks/useSiteBuilder';
import './index.css';

function Builder() {
  const {
    siteData,
    siteId,
    step,
    setStep,
    updateSiteData,
    toggleSection,
    saveDraft,
    resetBuilder,
    setSiteData,
  } = useSiteBuilder();

  const [publishData, setPublishData] = useState(null);

  const handleTypeSelect = (type) => {
    setSiteData(prev => ({ ...prev, type }));
    setStep(1);
  };

  const handleFormComplete = async () => {
    try {
      await saveDraft();
      setStep(2);
    } catch (err) {
      console.error('Failed to save draft:', err);
    }
  };

  const handlePublished = (data) => {
    setPublishData(data);
    setStep(3);
  };

  const handleCreateNew = () => {
    resetBuilder();
    setPublishData(null);
  };

  // Auto-save draft periodically
  useEffect(() => {
    if (step >= 1 && siteData.content.name) {
      const timer = setTimeout(() => {
        saveDraft().catch(console.error);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [siteData, step]);

  // Step 0: Type Selection
  if (step === 0) {
    return <TypeSelector onSelect={handleTypeSelect} />;
  }

  // Step 1: Form
  if (step === 1) {
    return (
      <SiteForm
        siteData={siteData}
        updateSiteData={updateSiteData}
        toggleSection={toggleSection}
        onBack={() => setStep(0)}
        onNext={handleFormComplete}
      />
    );
  }

  // Step 2: Preview
  if (step === 2) {
    return (
      <PreviewPage
        siteData={siteData}
        siteId={siteId}
        onBack={() => setStep(1)}
        onPublished={handlePublished}
      />
    );
  }

  // Step 3: Success
  if (step === 3 && publishData) {
    return (
      <SuccessPage
        publishData={publishData}
        onCreateNew={handleCreateNew}
      />
    );
  }

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Builder />} />
        <Route path="/s/:slug" element={<PublicSite />} />
        <Route path="/auth/verify" element={<AuthVerify />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
