import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SitePreview } from '../components/SitePreview';
import { api } from '../lib/utils';
import { Loader2 } from 'lucide-react';

export function PublicSite() {
  const { slug } = useParams();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSite() {
      try {
        const data = await api(`/site/${slug}`);
        setSite(data);
      } catch (err) {
        setError(err.message || 'Site not found');
      } finally {
        setLoading(false);
      }
    }

    fetchSite();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
        <p className="text-gray-500 mb-6">Site not found</p>
        <a href="/" className="text-blue-600 hover:underline">
          Create your own site →
        </a>
      </div>
    );
  }

  return <SitePreview siteData={site} isPublic />;
}
