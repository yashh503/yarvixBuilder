import { useState, useCallback } from 'react';
import { api, getDraftToken } from '../lib/utils';

const initialSiteData = {
  type: null, // 'personal' | 'brand'
  content: {
    name: '',
    tagline: '',
    profilePhoto: '',
    bio: '',
    logo: '',
    description: '',
  },
  colors: {
    primary: '#3B82F6',
    secondary: '#1E40AF',
  },
  sections: {
    gallery: { enabled: false, images: [] },
    videos: { enabled: false, links: [''] },
    services: { enabled: false, items: [{ title: '', description: '', price: '' }] },
    location: { enabled: false, address: '', mapLink: '' },
    founder: { enabled: false, name: '', photo: '', bio: '' },
    social: {
      enabled: false,
      links: { instagram: '', twitter: '', linkedin: '', facebook: '', youtube: '', website: '' }
    },
    cta: { enabled: false, whatsapp: '', phone: '' },
  },
};

export function useSiteBuilder() {
  const [siteData, setSiteData] = useState(initialSiteData);
  const [siteId, setSiteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(0); // 0: type, 1: basic, 2: sections, 3: preview

  const updateSiteData = useCallback((path, value) => {
    setSiteData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
  }, []);

  const toggleSection = useCallback((sectionName) => {
    setSiteData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionName]: {
          ...prev.sections[sectionName],
          enabled: !prev.sections[sectionName].enabled,
        },
      },
    }));
  }, []);

  const saveDraft = useCallback(async () => {
    setSaving(true);
    try {
      const draftToken = getDraftToken();
      const response = await api('/site/preview', {
        method: 'POST',
        body: JSON.stringify({
          siteId,
          draftToken,
          type: siteData.type,
          content: siteData.content,
          colors: siteData.colors,
          sections: siteData.sections,
        }),
      });
      setSiteId(response.siteId);
      return response;
    } catch (err) {
      console.error('Save draft failed:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [siteData, siteId]);

  const resetBuilder = useCallback(() => {
    setSiteData(initialSiteData);
    setSiteId(null);
    setStep(0);
    localStorage.removeItem('draftToken');
  }, []);

  return {
    siteData,
    setSiteData,
    siteId,
    setSiteId,
    saving,
    step,
    setStep,
    updateSiteData,
    toggleSection,
    saveDraft,
    resetBuilder,
  };
}
