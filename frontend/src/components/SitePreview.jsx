import {
  MapPin, Phone, MessageCircle, Instagram, Twitter, Linkedin,
  Facebook, Youtube, Globe, Play, ExternalLink
} from 'lucide-react';

export function SitePreview({ siteData, isPublic = false }) {
  const { type, content, colors, sections } = siteData;
  const isPersonal = type === 'personal';

  const socialIcons = {
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    facebook: Facebook,
    youtube: Youtube,
    website: Globe,
  };

  return (
    <div className="min-h-screen bg-white" style={{ '--primary': colors.primary, '--secondary': colors.secondary }}>
      {/* Hero Section */}
      <section
        className="relative py-16 px-4"
        style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
      >
        <div className="max-w-2xl mx-auto text-center text-white">
          {isPersonal && content.profilePhoto && (
            <img
              src={content.profilePhoto}
              alt={content.name}
              className="w-28 h-28 rounded-full mx-auto mb-6 object-cover border-4 border-white/30 shadow-lg"
            />
          )}
          {!isPersonal && content.logo && (
            <img
              src={content.logo}
              alt={content.name}
              className="h-20 mx-auto mb-6 object-contain"
            />
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{content.name || 'Your Name'}</h1>
          {content.tagline && (
            <p className="text-lg md:text-xl opacity-90">{content.tagline}</p>
          )}
        </div>
      </section>

      {/* About / Bio / Description */}
      {(isPersonal ? content.bio : content.description) && (
        <section className="py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {isPersonal ? 'About Me' : 'About Us'}
            </h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {isPersonal ? content.bio : content.description}
            </p>
          </div>
        </section>
      )}

      {/* Services */}
      {sections.services.enabled && sections.services.items.some(i => i.title) && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Services</h2>
            <div className="grid gap-4">
              {sections.services.items.filter(i => i.title).map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-xl shadow-sm border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      {item.description && (
                        <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                      )}
                    </div>
                    {item.price && (
                      <span
                        className="text-sm font-medium px-3 py-1 rounded-full"
                        style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}
                      >
                        {item.price}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {sections.gallery.enabled && sections.gallery.images.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {sections.gallery.images.map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Videos */}
      {sections.videos.enabled && sections.videos.links.some(l => l) && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Videos</h2>
            <div className="space-y-4">
              {sections.videos.links.filter(l => l).map((link, i) => {
                const videoId = extractYouTubeId(link);
                if (videoId) {
                  return (
                    <div key={i} className="aspect-video rounded-xl overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  );
                }
                return (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border hover:shadow-md transition-shadow"
                  >
                    <Play className="w-8 h-8" style={{ color: colors.primary }} />
                    <span className="text-gray-700 truncate">{link}</span>
                    <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Founder */}
      {!isPersonal && sections.founder.enabled && sections.founder.name && (
        <section className="py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet the Founder</h2>
            <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-50 p-6 rounded-2xl">
              {sections.founder.photo && (
                <img
                  src={sections.founder.photo}
                  alt={sections.founder.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              )}
              <div className="text-center md:text-left">
                <h3 className="font-semibold text-lg text-gray-900">{sections.founder.name}</h3>
                {sections.founder.bio && (
                  <p className="text-gray-600 mt-2">{sections.founder.bio}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Location */}
      {sections.location.enabled && sections.location.address && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2>
            <div className="flex items-start gap-4 p-5 bg-white rounded-xl border">
              <MapPin className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: colors.primary }} />
              <div>
                <p className="text-gray-700">{sections.location.address}</p>
                {sections.location.mapLink && (
                  <a
                    href={sections.location.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-sm font-medium hover:underline"
                    style={{ color: colors.primary }}
                  >
                    Open in Maps <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Social Links */}
      {sections.social.enabled && Object.values(sections.social.links).some(l => l) && (
        <section className="py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Connect</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {Object.entries(sections.social.links).map(([key, value]) => {
                if (!value) return null;
                const Icon = socialIcons[key];
                return (
                  <a
                    key={key}
                    href={value.startsWith('http') ? value : `https://${value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full border hover:shadow-md transition-shadow"
                    style={{ borderColor: colors.primary, color: colors.primary }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="capitalize">{key}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Buttons */}
      {sections.cta.enabled && (sections.cta.whatsapp || sections.cta.phone) && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {sections.cta.whatsapp && (
                <a
                  href={`https://wa.me/${sections.cta.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
              )}
              {sections.cta.phone && (
                <a
                  href={`tel:${sections.cta.phone}`}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-2xl mx-auto text-center text-gray-500 text-sm">
          <p>{content.name} © {new Date().getFullYear()}</p>
          {!isPublic && (
            <p className="mt-2 text-xs text-gray-400">
              Powered by WebBuilder
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}

function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
}
