import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { getCurrentUser } from '../utils/auth';
import './CreateGigPage.css';

const CreateGigPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subCategory: '',
    description: '',
    searchKeywords: [],
    tags: [],
    
    // Packages
    packages: {
      basic: {
        name: 'Basic',
        description: '',
        price: '',
        deliveryTime: '',
        revisions: 0,
        features: ['']
      },
      standard: {
        name: 'Standard',
        description: '',
        price: '',
        deliveryTime: '',
        revisions: 2,
        features: ['']
      },
      premium: {
        name: 'Premium',
        description: '',
        price: '',
        deliveryTime: '',
        revisions: 5,
        features: ['']
      }
    },

    // Add-ons
    addOns: [],

    // FAQs
    faqs: [{ question: '', answer: '' }],

    // Media
    images: [],
    videos: [],
    pdfs: [],

    // Requirements
    requirements: [],

    // Metadata
    metadata: {
      language: 'English',
      targetAudience: '',
      skillLevel: '',
      industryExperience: ''
    }
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [newTag, setNewTag] = useState('');
  const [imagePreview, setImagePreview] = useState([]);

  const categories = [
    'Programming & Tech',
    'Graphics & Design',
    'Digital Marketing',
    'Writing & Translation',
    'Video & Animation',
    'AI Services',
    'Music & Audio',
    'Business',
    'Consulting'
  ];

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    if (currentUser.userType !== 'seller') {
      navigate('/gigs');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePackageChange = (packageType, field, value) => {
    setFormData(prev => ({
      ...prev,
      packages: {
        ...prev.packages,
        [packageType]: {
          ...prev.packages[packageType],
          [field]: value
        }
      }
    }));
  };

  const handlePackageFeatureChange = (packageType, index, value) => {
    const updatedFeatures = [...formData.packages[packageType].features];
    updatedFeatures[index] = value;
    handlePackageChange(packageType, 'features', updatedFeatures);
  };

  const addPackageFeature = (packageType) => {
    const updatedFeatures = [...formData.packages[packageType].features, ''];
    handlePackageChange(packageType, 'features', updatedFeatures);
  };

  const removePackageFeature = (packageType, index) => {
    const updatedFeatures = formData.packages[packageType].features.filter((_, i) => i !== index);
    handlePackageChange(packageType, 'features', updatedFeatures);
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.searchKeywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        searchKeywords: [...prev.searchKeywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      searchKeywords: prev.searchKeywords.filter(k => k !== keyword)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleFAQChange = (index, field, value) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index][field] = value;
    setFormData(prev => ({ ...prev, faqs: updatedFaqs }));
  };

  const addFAQ = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const removeFAQ = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formDataObj = new FormData();
    
    files.forEach(file => {
      formDataObj.append('images', file);
    });

    try {
      const response = await fetch('http://localhost:5000/api/upload/images', {
        method: 'POST',
        body: formDataObj
      });

      const data = await response.json();
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...data.filePaths]
        }));
        setImagePreview(prev => [...prev, ...data.filePaths]);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddOn = (type) => {
    const addOnTemplates = {
      'extra-fast': {
        name: 'Extra Fast Delivery',
        description: 'Deliver 1 day faster',
        price: 500,
        deliveryTime: -1,
        type: 'extra-fast'
      },
      'additional-revision': {
        name: 'Additional Revision',
        description: '1 extra revision',
        price: 300,
        deliveryTime: 0,
        type: 'additional-revision'
      },
      'extra-feature': {
        name: 'Extra Feature',
        description: '',
        price: 0,
        deliveryTime: 0,
        type: 'extra-feature'
      }
    };

    setFormData(prev => ({
      ...prev,
      addOns: [...prev.addOns, addOnTemplates[type] || addOnTemplates['extra-feature']]
    }));
  };

  const updateAddOn = (index, field, value) => {
    const updatedAddOns = [...formData.addOns];
    updatedAddOns[index][field] = value;
    setFormData(prev => ({ ...prev, addOns: updatedAddOns }));
  };

  const removeAddOn = (index) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step) => {
    switch(step) {
      case 1:
        if (!formData.title || !formData.category ) {
          alert('Please fill in all required fields');
          return false;
        }
        return true;
      case 2:
        if (!formData.packages.basic.price || !formData.packages.basic.deliveryTime) {
          alert('Please complete at least the Basic package');
          return false;
        }
        return true;
      case 3:
        return true;
      case 4:
        if (formData.images.length === 0) {
          alert('Please upload at least one image');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (status = 'draft') => {
    if (!validateStep(4)) return;

    setLoading(true);
    try {
      const gigData = {
        ...formData,
        sellerId: user.id,
        status,
        isActive: status === 'active',
        // Set legacy fields for backward compatibility
        price: formData.packages.basic.price,
        deliveryTime: formData.packages.basic.deliveryTime,
        features: formData.packages.basic.features.filter(f => f.trim())
      };

      const response = await fetch('http://localhost:5000/api/gigs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gigData),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Gig ${status === 'draft' ? 'saved as draft' : 'published'} successfully!`);
        navigate('/my-gigs');
      } else {
        alert(data.message || 'Failed to create gig');
      }
    } catch (error) {
      console.error('Error creating gig:', error);
      alert('Failed to create gig');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="create-gig-page">
      <Header />
      
      <div className="create-gig-container">
        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Overview</div>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Pricing & Packages</div>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Description & FAQ</div>
          </div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-label">Gallery</div>
          </div>
          <div className={`step ${currentStep >= 5 ? 'active' : ''}`}>
            <div className="step-number">5</div>
            <div className="step-label">Publish</div>
          </div>
        </div>

        {/* Form Content */}
        <div className="form-content">
          {/* Step 1: Overview */}
          {currentStep === 1 && (
            <div className="form-step">
              <h2>Gig Overview</h2>
              
              <div className="form-group">
                <label>Gig Title *</label>
                <input
                  type="text"
                  placeholder="I will..."
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  maxLength={80}
                />
                <span className="char-count">{formData.title.length}/80</span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Sub Category</label>
                  <input
                    type="text"
                    placeholder="e.g., Web Development"
                    value={formData.subCategory}
                    onChange={(e) => handleInputChange('subCategory', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Search Keywords</label>
                <div className="tags-input">
                  <input
                    type="text"
                    placeholder="Add keyword and press Enter"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  />
                  <button type="button" onClick={addKeyword}>Add</button>
                </div>
                <div className="tags-list">
                  {formData.searchKeywords.map((keyword, index) => (
                    <span key={index} className="tag">
                      {keyword}
                      <button onClick={() => removeKeyword(keyword)}>×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Tags</label>
                <div className="tags-input">
                  <input
                    type="text"
                    placeholder="Add tag and press Enter"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button type="button" onClick={addTag}>Add</button>
                </div>
                <div className="tags-list">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                      <button onClick={() => removeTag(tag)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Pricing & Packages - Continued in next artifact due to length */}
          {currentStep === 2 && (
            <div className="form-step">
              <h2>Pricing & Packages</h2>
              
              <div className="packages-container">
                {['basic', 'standard', 'premium'].map(packageType => (
                  <div key={packageType} className="package-section">
                    <h3>{packageType.charAt(0).toUpperCase() + packageType.slice(1)} Package</h3>
                    
                    <div className="form-group">
                      <label>Package Name</label>
                      <input
                        type="text"
                        value={formData.packages[packageType].name}
                        onChange={(e) => handlePackageChange(packageType, 'name', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        rows="3"
                        placeholder="Describe what's included..."
                        value={formData.packages[packageType].description}
                        onChange={(e) => handlePackageChange(packageType, 'description', e.target.value)}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Price (PKR) {packageType === 'basic' && '*'}</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="5000"
                          value={formData.packages[packageType].price}
                          onChange={(e) => handlePackageChange(packageType, 'price', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Delivery Time (Days) {packageType === 'basic' && '*'}</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="7"
                          value={formData.packages[packageType].deliveryTime}
                          onChange={(e) => handlePackageChange(packageType, 'deliveryTime', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Revisions</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.packages[packageType].revisions}
                          onChange={(e) => handlePackageChange(packageType, 'revisions', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Features</label>
                      {formData.packages[packageType].features.map((feature, index) => (
                        <div key={index} className="feature-input">
                          <input
                            type="text"
                            placeholder="Feature description"
                            value={feature}
                            onChange={(e) => handlePackageFeatureChange(packageType, index, e.target.value)}
                          />
                          {formData.packages[packageType].features.length > 1 && (
                            <button type="button" onClick={() => removePackageFeature(packageType, index)}>×</button>
                          )}
                        </div>
                      ))}
                      <button type="button" className="add-feature-btn" onClick={() => addPackageFeature(packageType)}>
                        + Add Feature
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="addons-section">
                <h3>Add-ons (Optional)</h3>
                <div className="addon-buttons">
                  <button type="button" onClick={() => handleAddOn('extra-fast')}>+ Extra Fast</button>
                  <button type="button" onClick={() => handleAddOn('additional-revision')}>+ Extra Revision</button>
                  <button type="button" onClick={() => handleAddOn('extra-feature')}>+ Custom Add-on</button>
                </div>

                {formData.addOns.map((addon, index) => (
                  <div key={index} className="addon-item">
                    <div className="form-row">
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Add-on name"
                          value={addon.name}
                          onChange={(e) => updateAddOn(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="number"
                          placeholder="Price"
                          value={addon.price}
                          onChange={(e) => updateAddOn(index, 'price', e.target.value)}
                        />
                      </div>
                      <button type="button" onClick={() => removeAddOn(index)}>×</button>
                    </div>
                    <input
                      type="text"
                      placeholder="Description"
                      value={addon.description}
                      onChange={(e) => updateAddOn(index, 'description', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Continue to next message for remaining steps */}
        </div>{currentStep === 3 && (
            <div className="form-step">
              <h2>Description & FAQ</h2>
              
              <div className="form-group">
                <label>Gig Description *</label>
                <textarea
                  rows="10"
                  placeholder="Describe your service in detail..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  maxLength={5000}
                />
                <span className="char-count">{formData.description.length}/5000</span>
              </div>

              <div className="faqs-section">
                <h3>Frequently Asked Questions</h3>
                {formData.faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <div className="faq-header">
                      <h4>FAQ {index + 1}</h4>
                      {formData.faqs.length > 1 && (
                        <button type="button" onClick={() => removeFAQ(index)}>Remove</button>
                      )}
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Question"
                        value={faq.question}
                        onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <textarea
                        rows="3"
                        placeholder="Answer"
                        value={faq.answer}
                        onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                <button type="button" className="add-faq-btn" onClick={addFAQ}>
                  + Add Another FAQ
                </button>
              </div>

              <div className="metadata-section">
                <h3>Additional Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Language</label>
                    <input
                      type="text"
                      value={formData.metadata.language}
                      onChange={(e) => handleInputChange('metadata', {...formData.metadata, language: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Target Audience</label>
                    <input
                      type="text"
                      placeholder="e.g., Small businesses"
                      value={formData.metadata.targetAudience}
                      onChange={(e) => handleInputChange('metadata', {...formData.metadata, targetAudience: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Skill Level</label>
                    <select
                      value={formData.metadata.skillLevel}
                      onChange={(e) => handleInputChange('metadata', {...formData.metadata, skillLevel: e.target.value})}
                    >
                      <option value="">Select Level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Industry Experience (Years)</label>
                    <input
                      type="text"
                      placeholder="e.g., 5+"
                      value={formData.metadata.industryExperience}
                      onChange={(e) => handleInputChange('metadata', {...formData.metadata, industryExperience: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Gallery */}
          {currentStep === 4 && (
            <div className="form-step">
              <h2>Gallery & Portfolio</h2>
              
              <div className="upload-section">
                <h3>Images *</h3>
                <p className="upload-note">Upload at least 1 image (max 5). Use high-quality images that showcase your work.</p>
                
                <div className="image-upload">
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="image-upload" className="upload-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Upload Images
                  </label>
                </div>

                <div className="image-preview-grid">
                  {imagePreview.map((img, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={`http://localhost:5000${img}`} alt={`Preview ${index + 1}`} />
                      <button className="remove-image" onClick={() => removeImage(index)}>×</button>
                      {index === 0 && <span className="main-badge">Main</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="upload-section">
                <h3>Videos (Optional)</h3>
                <p className="upload-note">Add video URLs (YouTube, Vimeo, etc.) to showcase your work.</p>
                <input
                  type="text"
                  placeholder="Enter video URL"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value) {
                      setFormData(prev => ({
                        ...prev,
                        videos: [...prev.videos, { url: e.target.value, thumbnail: '' }]
                      }));
                      e.target.value = '';
                    }
                  }}
                />
                <div className="video-list">
                  {formData.videos.map((video, index) => (
                    <div key={index} className="video-item">
                      <span>{video.url}</span>
                      <button onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          videos: prev.videos.filter((_, i) => i !== index)
                        }));
                      }}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="upload-section">
                <h3>PDFs/Documents (Optional)</h3>
                <p className="upload-note">Upload portfolio PDFs or relevant documents (max 10MB each).</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const formDataObj = new FormData();
                      formDataObj.append('pdf', file);
                      
                      try {
                        const response = await fetch('http://localhost:5000/api/upload/pdf', {
                          method: 'POST',
                          body: formDataObj
                        });
                        
                        const data = await response.json();
                        if (data.success) {
                          setFormData(prev => ({
                            ...prev,
                            pdfs: [...prev.pdfs, {
                              name: file.name,
                              url: data.filePath,
                              size: file.size
                            }]
                          }));
                        }
                      } catch (error) {
                        console.error('Error uploading PDF:', error);
                      }
                    }
                  }}
                />
                <div className="pdf-list">
                  {formData.pdfs.map((pdf, index) => (
                    <div key={index} className="pdf-item">
                      <span>{pdf.name} ({(pdf.size / 1024 / 1024).toFixed(2)} MB)</span>
                      <button onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          pdfs: prev.pdfs.filter((_, i) => i !== index)
                        }));
                      }}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Publish */}
          {currentStep === 5 && (
            <div className="form-step">
              <h2>Review & Publish</h2>
              
              <div className="review-section">
                <h3>Gig Summary</h3>
                <div className="summary-item">
                  <strong>Title:</strong>
                  <p>{formData.title}</p>
                </div>
                <div className="summary-item">
                  <strong>Category:</strong>
                  <p>{formData.category} {formData.subCategory && `> ${formData.subCategory}`}</p>
                </div>
                <div className="summary-item">
                  <strong>Basic Package:</strong>
                  <p>PKR {formData.packages.basic.price} - {formData.packages.basic.deliveryTime} days</p>
                </div>
                <div className="summary-item">
                  <strong>Images:</strong>
                  <p>{formData.images.length} uploaded</p>
                </div>
                <div className="summary-item">
                  <strong>FAQs:</strong>
                  <p>{formData.faqs.filter(f => f.question && f.answer).length} added</p>
                </div>
              </div>

              <div className="publish-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => handleSubmit('draft')}
                  disabled={loading}
                >
                  Save as Draft
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => handleSubmit('active')}
                  disabled={loading}
                >
                  {loading ? 'Publishing...' : 'Publish Gig'}
                </button>
              </div>

              <div className="publish-note">
                <p>
                  <strong>Note:</strong> Once published, your gig will be reviewed by our team before going live.
                  You can edit it anytime from your dashboard.
                </p>
              </div>
            </div>
          )}

        {/* Navigation Buttons */}
        <div className="form-navigation">
          {currentStep > 1 && (
            <button className="btn-secondary" onClick={prevStep}>
              Previous
            </button>
          )}
          {currentStep < 5 && (
            <button className="btn-primary" onClick={nextStep}>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateGigPage;