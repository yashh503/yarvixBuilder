import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import {
  ArrowLeft, ArrowRight, Image, Youtube, Briefcase, MapPin,
  User, Share2, Phone, Plus, Trash2, Upload
} from 'lucide-react';

function ImageUpload({ value, onChange, label, className = '' }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={className}>
      <Label className="mb-2 block">{label}</Label>
      <div className="relative">
        {value ? (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
            <img src={value} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
            <Upload className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">Upload</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
}

function ColorPicker({ label, value, onChange }) {
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border-0"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 uppercase"
          maxLength={7}
        />
      </div>
    </div>
  );
}

export function SiteForm({ siteData, updateSiteData, toggleSection, onBack, onNext }) {
  const [currentStep, setCurrentStep] = useState(0);
  const isPersonal = siteData.type === 'personal';

  const steps = [
    { title: 'Basic Info', icon: User },
    { title: 'Optional Sections', icon: Briefcase },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onNext();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="font-medium">{steps[currentStep].title}</span>
            <div className="w-9" />
          </div>

          {/* Progress */}
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${i <= currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {currentStep === 0 && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">{isPersonal ? 'Your Name' : 'Brand Name'} *</Label>
              <Input
                id="name"
                value={siteData.content.name}
                onChange={(e) => updateSiteData('content.name', e.target.value)}
                placeholder={isPersonal ? 'John Doe' : 'Acme Inc'}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={siteData.content.tagline}
                onChange={(e) => updateSiteData('content.tagline', e.target.value)}
                placeholder={isPersonal ? 'Full Stack Developer' : 'Building the future'}
                className="mt-1"
              />
            </div>

            {isPersonal ? (
              <>
                <ImageUpload
                  label="Profile Photo"
                  value={siteData.content.profilePhoto}
                  onChange={(v) => updateSiteData('content.profilePhoto', v)}
                />
                <div>
                  <Label htmlFor="bio">Short Bio</Label>
                  <Textarea
                    id="bio"
                    value={siteData.content.bio}
                    onChange={(e) => updateSiteData('content.bio', e.target.value)}
                    placeholder="Tell visitors about yourself..."
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </>
            ) : (
              <>
                <ImageUpload
                  label="Logo"
                  value={siteData.content.logo}
                  onChange={(v) => updateSiteData('content.logo', v)}
                />
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={siteData.content.description}
                    onChange={(e) => updateSiteData('content.description', e.target.value)}
                    placeholder="What does your brand do?"
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                label="Primary Color"
                value={siteData.colors.primary}
                onChange={(v) => updateSiteData('colors.primary', v)}
              />
              <ColorPicker
                label="Secondary Color"
                value={siteData.colors.secondary}
                onChange={(v) => updateSiteData('colors.secondary', v)}
              />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            {/* Gallery */}
            <SectionToggle
              icon={Image}
              title="Gallery"
              description="Add images to showcase your work"
              enabled={siteData.sections.gallery.enabled}
              onToggle={() => toggleSection('gallery')}
            >
              <GalleryEditor
                images={siteData.sections.gallery.images}
                onChange={(images) => updateSiteData('sections.gallery.images', images)}
              />
            </SectionToggle>

            {/* Videos */}
            <SectionToggle
              icon={Youtube}
              title="Videos"
              description="Add YouTube or video links"
              enabled={siteData.sections.videos.enabled}
              onToggle={() => toggleSection('videos')}
            >
              <ArrayInput
                values={siteData.sections.videos.links}
                onChange={(links) => updateSiteData('sections.videos.links', links)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </SectionToggle>

            {/* Services */}
            <SectionToggle
              icon={Briefcase}
              title="Services"
              description="List your services or offerings"
              enabled={siteData.sections.services.enabled}
              onToggle={() => toggleSection('services')}
            >
              <ServicesEditor
                items={siteData.sections.services.items}
                onChange={(items) => updateSiteData('sections.services.items', items)}
              />
            </SectionToggle>

            {/* Location */}
            <SectionToggle
              icon={MapPin}
              title="Location"
              description="Show your address and map"
              enabled={siteData.sections.location.enabled}
              onToggle={() => toggleSection('location')}
            >
              <div className="space-y-3">
                <Input
                  value={siteData.sections.location.address}
                  onChange={(e) => updateSiteData('sections.location.address', e.target.value)}
                  placeholder="123 Main St, City, Country"
                />
                <Input
                  value={siteData.sections.location.mapLink}
                  onChange={(e) => updateSiteData('sections.location.mapLink', e.target.value)}
                  placeholder="Google Maps link"
                />
              </div>
            </SectionToggle>

            {/* Founder (for brands) */}
            {!isPersonal && (
              <SectionToggle
                icon={User}
                title="Founder / Owner"
                description="Add founder information"
                enabled={siteData.sections.founder.enabled}
                onToggle={() => toggleSection('founder')}
              >
                <div className="space-y-3">
                  <Input
                    value={siteData.sections.founder.name}
                    onChange={(e) => updateSiteData('sections.founder.name', e.target.value)}
                    placeholder="Founder name"
                  />
                  <ImageUpload
                    label="Photo"
                    value={siteData.sections.founder.photo}
                    onChange={(v) => updateSiteData('sections.founder.photo', v)}
                  />
                  <Textarea
                    value={siteData.sections.founder.bio}
                    onChange={(e) => updateSiteData('sections.founder.bio', e.target.value)}
                    placeholder="Short bio..."
                    rows={3}
                  />
                </div>
              </SectionToggle>
            )}

            {/* Social Links */}
            <SectionToggle
              icon={Share2}
              title="Social Links"
              description="Add your social media profiles"
              enabled={siteData.sections.social.enabled}
              onToggle={() => toggleSection('social')}
            >
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(siteData.sections.social.links).map(([key, value]) => (
                  <Input
                    key={key}
                    value={value}
                    onChange={(e) => updateSiteData(`sections.social.links.${key}`, e.target.value)}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  />
                ))}
              </div>
            </SectionToggle>

            {/* CTA */}
            <SectionToggle
              icon={Phone}
              title="Call to Action"
              description="WhatsApp and phone buttons"
              enabled={siteData.sections.cta.enabled}
              onToggle={() => toggleSection('cta')}
            >
              <div className="space-y-3">
                <Input
                  value={siteData.sections.cta.whatsapp}
                  onChange={(e) => updateSiteData('sections.cta.whatsapp', e.target.value)}
                  placeholder="WhatsApp number (with country code)"
                />
                <Input
                  value={siteData.sections.cta.phone}
                  onChange={(e) => updateSiteData('sections.cta.phone', e.target.value)}
                  placeholder="Phone number"
                />
              </div>
            </SectionToggle>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-8 flex justify-end">
          <Button onClick={handleNext} size="lg">
            {currentStep === steps.length - 1 ? 'Preview Site' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionToggle({ icon: Icon, title, description, enabled, onToggle, children }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
      {enabled && (
        <div className="px-4 pb-4 pt-2 border-t bg-gray-50">
          {children}
        </div>
      )}
    </div>
  );
}

function GalleryEditor({ images, onChange }) {
  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange([...images, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap gap-2">
      {images.map((img, i) => (
        <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden">
          <img src={img} alt="" className="w-full h-full object-cover" />
          <button
            onClick={() => handleRemove(i)}
            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
      <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500">
        <Plus className="w-6 h-6 text-gray-400" />
        <input type="file" accept="image/*" onChange={handleAddImage} className="hidden" />
      </label>
    </div>
  );
}

function ArrayInput({ values, onChange, placeholder }) {
  const handleChange = (index, value) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  const handleAdd = () => {
    onChange([...values, '']);
  };

  const handleRemove = (index) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {values.map((value, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => handleChange(i, e.target.value)}
            placeholder={placeholder}
          />
          {values.length > 1 && (
            <button onClick={() => handleRemove(i)} className="p-2 text-red-500 hover:bg-red-50 rounded">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
        <Plus className="w-4 h-4 mr-1" /> Add
      </Button>
    </div>
  );
}

function ServicesEditor({ items, onChange }) {
  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const handleAdd = () => {
    onChange([...items, { title: '', description: '', price: '' }]);
  };

  const handleRemove = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="p-3 bg-white rounded-lg border space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Service {i + 1}</span>
            {items.length > 1 && (
              <button onClick={() => handleRemove(i)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <Input
            value={item.title}
            onChange={(e) => handleChange(i, 'title', e.target.value)}
            placeholder="Service title"
          />
          <Input
            value={item.description}
            onChange={(e) => handleChange(i, 'description', e.target.value)}
            placeholder="Short description"
          />
          <Input
            value={item.price}
            onChange={(e) => handleChange(i, 'price', e.target.value)}
            placeholder="Price (optional)"
          />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
        <Plus className="w-4 h-4 mr-1" /> Add Service
      </Button>
    </div>
  );
}
