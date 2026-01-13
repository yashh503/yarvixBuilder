import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { uploadImage } from '../lib/utils';
import {
  ArrowLeft, ArrowRight, Image, Youtube, Briefcase, MapPin,
  User, Share2, Phone, Plus, Trash2, Upload, Loader2, Camera,
  Sparkles, Palette, CheckCircle
} from 'lucide-react';

function ImageUpload({ value, onChange, label, type = 'general', size = 'md' }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, type);
      onChange(url);
    } catch (err) {
      console.error('Upload failed:', err);
      // Fallback to base64 if server upload fails
      const reader = new FileReader();
      reader.onloadend = () => onChange(reader.result);
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36',
  };

  return (
    <div>
      {label && <Label className="mb-2 block text-sm font-medium text-gray-700">{label}</Label>}
      <div className="relative">
        {value ? (
          <div className={`relative ${sizeClasses[size]} rounded-2xl overflow-hidden border-2 border-gray-200 group`}>
            <img src={value} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <label className={`flex flex-col items-center justify-center ${sizeClasses[size]} border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all group`}>
            {uploading ? (
              <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2 group-hover:bg-purple-100 transition-colors">
                  <Camera className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                </div>
                <span className="text-xs text-gray-500 group-hover:text-purple-600">Upload</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
          </label>
        )}
      </div>
    </div>
  );
}

function ColorPicker({ label, value, onChange }) {
  const presetColors = ['#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981', '#06B6D4', '#1F2937'];

  return (
    <div>
      <Label className="mb-2 block text-sm font-medium text-gray-700">{label}</Label>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-12 h-12 rounded-xl cursor-pointer border-2 border-gray-200"
            />
          </div>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-28 uppercase font-mono text-sm"
            maxLength={7}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={`w-7 h-7 rounded-lg border-2 transition-all ${value === color ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SiteForm({ siteData, updateSiteData, toggleSection, onBack, onNext }) {
  const [currentStep, setCurrentStep] = useState(0);
  const isPersonal = siteData.type === 'personal';

  const steps = [
    { title: 'Basic Info', subtitle: 'Tell us about yourself', icon: User },
    { title: 'Customize', subtitle: 'Add extra sections', icon: Sparkles },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handleBack} className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-center">
              <h2 className="font-semibold text-gray-900">{steps[currentStep].title}</h2>
              <p className="text-xs text-gray-500">{steps[currentStep].subtitle}</p>
            </div>
            <div className="w-10" />
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2">
            {steps.map((step, i) => (
              <div key={i} className="flex-1 flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all ${
                  i < currentStep
                    ? 'bg-green-500 text-white'
                    : i === currentStep
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {i < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full ${i < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {currentStep === 0 && (
          <div className="space-y-8">
            {/* Profile/Logo Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <ImageUpload
                  label={isPersonal ? 'Profile Photo' : 'Logo'}
                  value={isPersonal ? siteData.content.profilePhoto : siteData.content.logo}
                  onChange={(v) => updateSiteData(isPersonal ? 'content.profilePhoto' : 'content.logo', v)}
                  type={isPersonal ? 'profile' : 'logo'}
                  size="lg"
                />
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      {isPersonal ? 'Your Name' : 'Brand Name'} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={siteData.content.name}
                      onChange={(e) => updateSiteData('content.name', e.target.value)}
                      placeholder={isPersonal ? 'John Doe' : 'Acme Inc'}
                      className="mt-1.5 h-12 text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagline" className="text-sm font-medium text-gray-700">Tagline</Label>
                    <Input
                      id="tagline"
                      value={siteData.content.tagline}
                      onChange={(e) => updateSiteData('content.tagline', e.target.value)}
                      placeholder={isPersonal ? 'Full Stack Developer' : 'Building the future'}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bio/Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                {isPersonal ? 'About You' : 'About Your Business'}
              </Label>
              <Textarea
                id="bio"
                value={isPersonal ? siteData.content.bio : siteData.content.description}
                onChange={(e) => updateSiteData(isPersonal ? 'content.bio' : 'content.description', e.target.value)}
                placeholder={isPersonal
                  ? "Tell visitors about yourself, your skills, and what makes you unique..."
                  : "What does your business do? What problems do you solve for customers?"
                }
                className="mt-1.5 min-h-[120px]"
              />
            </div>

            {/* Brand Colors */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Brand Colors</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-6">
              Toggle the sections you want on your website. You can always change this later.
            </p>

            {/* Gallery */}
            <SectionToggle
              icon={Image}
              title="Gallery"
              description="Showcase your work with images"
              enabled={siteData.sections.gallery.enabled}
              onToggle={() => toggleSection('gallery')}
              color="purple"
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
              color="red"
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
              color="blue"
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
              color="green"
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
                color="orange"
              >
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <ImageUpload
                      value={siteData.sections.founder.photo}
                      onChange={(v) => updateSiteData('sections.founder.photo', v)}
                      type="founder"
                      size="sm"
                    />
                    <div className="flex-1">
                      <Input
                        value={siteData.sections.founder.name}
                        onChange={(e) => updateSiteData('sections.founder.name', e.target.value)}
                        placeholder="Founder name"
                        className="mb-2"
                      />
                      <Textarea
                        value={siteData.sections.founder.bio}
                        onChange={(e) => updateSiteData('sections.founder.bio', e.target.value)}
                        placeholder="Short bio..."
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </SectionToggle>
            )}

            {/* Social Links */}
            <SectionToggle
              icon={Share2}
              title="Social Links"
              description="Connect your social profiles"
              enabled={siteData.sections.social.enabled}
              onToggle={() => toggleSection('social')}
              color="pink"
            >
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(siteData.sections.social.links).map(([key, value]) => (
                  <div key={key}>
                    <Label className="text-xs text-gray-500 mb-1 block capitalize">{key}</Label>
                    <Input
                      value={value}
                      onChange={(e) => updateSiteData(`sections.social.links.${key}`, e.target.value)}
                      placeholder={`${key}.com/username`}
                    />
                  </div>
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
              color="emerald"
            >
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">WhatsApp</Label>
                  <Input
                    value={siteData.sections.cta.whatsapp}
                    onChange={(e) => updateSiteData('sections.cta.whatsapp', e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Phone</Label>
                  <Input
                    value={siteData.sections.cta.phone}
                    onChange={(e) => updateSiteData('sections.cta.phone', e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </SectionToggle>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <Button onClick={handleNext} size="lg" className="px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            {currentStep === steps.length - 1 ? 'Preview Site' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionToggle({ icon: Icon, title, description, enabled, onToggle, children, color = 'gray' }) {
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    pink: 'bg-pink-100 text-pink-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    gray: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all ${enabled ? 'border-gray-200 shadow-sm' : 'border-gray-100'}`}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
      {enabled && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50/50">
          {children}
        </div>
      )}
    </div>
  );
}

function GalleryEditor({ images, onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleAddImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, 'gallery');
      onChange([...images, url]);
    } catch (err) {
      console.error('Upload failed:', err);
      const reader = new FileReader();
      reader.onloadend = () => onChange([...images, reader.result]);
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap gap-3">
      {images.map((img, i) => (
        <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden group">
          <img src={img} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={() => handleRemove(i)}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
      <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all">
        {uploading ? (
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
        ) : (
          <>
            <Plus className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">Add</span>
          </>
        )}
        <input type="file" accept="image/*" onChange={handleAddImage} className="hidden" disabled={uploading} />
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
            <button
              onClick={() => handleRemove(i)}
              className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={handleAdd} className="mt-2">
        <Plus className="w-4 h-4 mr-1" /> Add More
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
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="p-4 bg-white rounded-xl border border-gray-200 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Service {i + 1}</span>
            {items.length > 1 && (
              <button
                onClick={() => handleRemove(i)}
                className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
              >
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
            placeholder="Price (e.g., ₹5,000 or Free)"
          />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
        <Plus className="w-4 h-4 mr-1" /> Add Service
      </Button>
    </div>
  );
}
