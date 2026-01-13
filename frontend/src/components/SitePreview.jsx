import {
  MapPin, Phone, MessageCircle, Instagram, Twitter, Linkedin,
  Facebook, Youtube, Globe, Play, ExternalLink, Mail, ArrowRight
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

  // Generate contrasting text color
  const getContrastColor = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient with pattern */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
          }}
        />
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20" style={{ backgroundColor: colors.secondary }} />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-20" style={{ backgroundColor: colors.primary }} />

        <div className="relative z-10 py-20 md:py-28 px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            {isPersonal && content.profilePhoto && (
              <div className="mb-8">
                <img
                  src={content.profilePhoto}
                  alt={content.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto object-cover ring-4 ring-white/30 shadow-2xl"
                />
              </div>
            )}
            {!isPersonal && content.logo && (
              <div className="mb-8">
                <img
                  src={content.logo}
                  alt={content.name}
                  className="h-16 md:h-20 mx-auto object-contain drop-shadow-lg"
                />
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              {content.name || 'Your Name'}
            </h1>
            {content.tagline && (
              <p className="text-xl md:text-2xl opacity-90 font-light max-w-xl mx-auto">
                {content.tagline}
              </p>
            )}

            {/* CTA in hero if enabled */}
            {sections.cta.enabled && (sections.cta.whatsapp || sections.cta.phone) && (
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {sections.cta.whatsapp && (
                  <a
                    href={`https://wa.me/${sections.cta.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full font-medium hover:bg-white/30 transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </a>
                )}
                {sections.cta.phone && (
                  <a
                    href={`tel:${sections.cta.phone}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-medium hover:shadow-lg transition-all"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L60 45.8C120 41.7 240 33.3 360 29.2C480 25 600 25 720 33.3C840 41.7 960 58.3 1080 62.5C1200 66.7 1320 58.3 1380 54.2L1440 50V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      {(isPersonal ? content.bio : content.description) && (
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.primary }}>
                {isPersonal ? 'About Me' : 'About Us'}
              </h2>
            </div>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed whitespace-pre-line">
              {isPersonal ? content.bio : content.description}
            </p>
          </div>
        </section>
      )}

      {/* Services */}
      {sections.services.enabled && sections.services.items.some(i => i.title) && (
        <section className="py-16 md:py-20 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.primary }}>
                Services
              </h2>
            </div>
            <div className="grid gap-4">
              {sections.services.items.filter(i => i.title).map((item, i) => (
                <div
                  key={i}
                  className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-gray-500 mt-1">{item.description}</p>
                      )}
                    </div>
                    {item.price && (
                      <span
                        className="text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap"
                        style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}
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
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.primary }}>
                Gallery
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {sections.gallery.images.map((img, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Videos */}
      {sections.videos.enabled && sections.videos.links.some(l => l) && (
        <section className="py-16 md:py-20 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.primary }}>
                Videos
              </h2>
            </div>
            <div className="space-y-4">
              {sections.videos.links.filter(l => l).map((link, i) => {
                const videoId = extractYouTubeId(link);
                if (videoId) {
                  return (
                    <div key={i} className="aspect-video rounded-2xl overflow-hidden shadow-lg">
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
                    className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all group"
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${colors.primary}10` }}
                    >
                      <Play className="w-6 h-6" style={{ color: colors.primary }} />
                    </div>
                    <span className="flex-1 text-gray-700 truncate">{link}</span>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Founder */}
      {!isPersonal && sections.founder.enabled && sections.founder.name && (
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.primary }}>
                Meet the Founder
              </h2>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-3xl" style={{ backgroundColor: `${colors.primary}08` }}>
              {sections.founder.photo && (
                <img
                  src={sections.founder.photo}
                  alt={sections.founder.name}
                  className="w-28 h-28 rounded-2xl object-cover shadow-lg"
                />
              )}
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-900">{sections.founder.name}</h3>
                <p className="text-sm font-medium mb-3" style={{ color: colors.primary }}>Founder</p>
                {sections.founder.bio && (
                  <p className="text-gray-600 leading-relaxed">{sections.founder.bio}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Location */}
      {sections.location.enabled && sections.location.address && (
        <section className="py-16 md:py-20 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.primary }}>
                Location
              </h2>
            </div>
            <div className="flex items-start gap-5 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${colors.primary}10` }}
              >
                <MapPin className="w-6 h-6" style={{ color: colors.primary }} />
              </div>
              <div>
                <p className="text-lg text-gray-800 font-medium">{sections.location.address}</p>
                {sections.location.mapLink && (
                  <a
                    href={sections.location.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-sm font-medium hover:underline"
                    style={{ color: colors.primary }}
                  >
                    Open in Google Maps
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Social Links */}
      {sections.social.enabled && Object.values(sections.social.links).some(l => l) && (
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.primary }}>
                Connect With {isPersonal ? 'Me' : 'Us'}
              </h2>
              <div className="w-12 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
            </div>
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
                    className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all hover:scale-105"
                    style={{
                      backgroundColor: `${colors.primary}10`,
                      color: colors.primary
                    }}
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

      {/* Final CTA Section */}
      {sections.cta.enabled && (sections.cta.whatsapp || sections.cta.phone) && (
        <section
          className="py-16 md:py-20 px-4"
          style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}
        >
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Work Together</h2>
            <p className="text-lg opacity-90 mb-8">Ready to get started? Reach out today.</p>
            <div className="flex flex-wrap justify-center gap-4">
              {sections.cta.whatsapp && (
                <a
                  href={`https://wa.me/${sections.cta.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  WhatsApp Us
                </a>
              )}
              {sections.cta.phone && (
                <a
                  href={`tel:${sections.cta.phone}`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm rounded-full font-semibold hover:bg-white/30 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  {sections.cta.phone}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {content.name}. All rights reserved.
          </p>
          {!isPublic && (
            <p className="mt-2 text-xs text-gray-600">
              Built with SiteForge
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
