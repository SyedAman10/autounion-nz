'use client';

import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
// You'll need to set your API key here or use environment variable
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'YOUR_API_KEY_HERE';

// Model Configuration - Try different models for best results
// Available models: 
// - "gemini-2.0-flash-exp" (Latest experimental, fast)
// - "gemini-1.5-flash" (Stable, good performance)
// - "gemini-1.5-pro" (Best quality, slower)
// - "gemini-pro-vision" (Optimized for images)
const GEMINI_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-2.0-flash-exp";

export default function CheckInSystem() {
  const [formData, setFormData] = useState({
    email: '',
    bookingNumber: '',
    phone: '',
    licenseNumber: '',
    passportNumber: '',
    drivingLicense: null,
    passport: null
  });
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [extractedData, setExtractedData] = useState({
    licenseNumber: '',
    passportNumber: '',
    licenseValid: null,
    passportValid: null
  });
  const [isProcessing, setIsProcessing] = useState({
    license: false,
    passport: false
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // AI-powered document processing using Gemini
  const processDocument = async (file, documentType) => {
    try {
      setIsProcessing(prev => ({
        ...prev,
        [documentType === 'drivingLicense' ? 'license' : 'passport']: true
      }));

      // Convert file to base64
      const base64Data = await fileToBase64(file);
      
      // Initialize Gemini AI with image-optimized model
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: GEMINI_MODEL,
        generationConfig: {
          temperature: 0.1, // Low temperature for more consistent/accurate results
          topK: 32,
          topP: 1,
        }
      });

      // Create prompt based on document type
      const prompt = documentType === 'drivingLicense' 
        ? `Analyze this image carefully. Is this a valid driving license/driver's license document? 
           If yes, extract the license number.
           Respond in JSON format: {"isValid": true/false, "documentType": "driving_license", "licenseNumber": "extracted number or empty string", "reason": "brief explanation"}`
        : `Analyze this image carefully. Is this a valid passport document?
           If yes, extract the passport number.
           Respond in JSON format: {"isValid": true/false, "documentType": "passport", "passportNumber": "extracted number or empty string", "reason": "brief explanation"}`;

      // Generate content with image
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: file.type,
            data: base64Data
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      
      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }
      
      const aiResponse = JSON.parse(jsonMatch[0]);
      console.log('Gemini AI Response:', aiResponse);

      // Process response based on document type
      if (documentType === 'drivingLicense') {
        return validateLicenseResponse(aiResponse);
      } else if (documentType === 'passport') {
        return validatePassportResponse(aiResponse);
      }
    } catch (error) {
      console.error('AI Processing Error:', error);
      showNotification('Failed to process document. Please check your API key and try again.', 'error');
      return { valid: false, number: '' };
    } finally {
      setIsProcessing(prev => ({
        ...prev,
        [documentType === 'drivingLicense' ? 'license' : 'passport']: false
      }));
    }
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  // Validate Gemini AI response for driving license
  const validateLicenseResponse = (aiResponse) => {
    if (!aiResponse.isValid) {
      showNotification(`❌ Invalid document! ${aiResponse.reason || 'This does not appear to be a driving license.'}`, 'error');
      return { valid: false, number: '' };
    }

    const licenseNumber = aiResponse.licenseNumber || '';
    if (!licenseNumber || licenseNumber.length < 5) {
      showNotification('❌ Could not extract license number. Document may not be clear enough.', 'error');
      return { valid: false, number: '' };
    }

    showNotification('✅ AI validated driving license! Number: ' + licenseNumber, 'success');
    return { valid: true, number: licenseNumber.trim() };
  };

  // Validate Gemini AI response for passport
  const validatePassportResponse = (aiResponse) => {
    if (!aiResponse.isValid) {
      showNotification(`❌ Invalid document! ${aiResponse.reason || 'This does not appear to be a passport.'}`, 'error');
      return { valid: false, number: '' };
    }

    const passportNumber = aiResponse.passportNumber || '';
    if (!passportNumber || passportNumber.length < 5) {
      showNotification('❌ Could not extract passport number. Document may not be clear enough.', 'error');
      return { valid: false, number: '' };
    }

    showNotification('✅ AI validated passport! Number: ' + passportNumber, 'success');
    return { valid: true, number: passportNumber.trim() };
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        showNotification('Please upload a valid file (JPG, PNG, or PDF)', 'error');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('File size must be less than 5MB', 'error');
        return;
      }
      
      // Only process images (not PDFs) with AI
      if (file.type.startsWith('image/')) {
        showNotification('🤖 AI is analyzing document...', 'info');
        
        // Process document with Gemini AI
        const result = await processDocument(file, name);
        
        if (result.valid) {
          // Update form data with file and auto-fill the number field
          if (name === 'drivingLicense') {
            setFormData(prev => ({
              ...prev,
              drivingLicense: file,
              licenseNumber: result.number
            }));
            setExtractedData(prev => ({
              ...prev,
              licenseNumber: result.number,
              licenseValid: true
            }));
          } else if (name === 'passport') {
            setFormData(prev => ({
              ...prev,
              passport: file,
              passportNumber: result.number
            }));
            setExtractedData(prev => ({
              ...prev,
              passportNumber: result.number,
              passportValid: true
            }));
          }
        } else {
          // Document not valid, clear the file input and don't save it
          e.target.value = '';
          if (name === 'drivingLicense') {
            setFormData(prev => ({
              ...prev,
              drivingLicense: null,
              licenseNumber: ''
            }));
            setExtractedData(prev => ({
              ...prev,
              licenseNumber: '',
              licenseValid: false
            }));
          } else if (name === 'passport') {
            setFormData(prev => ({
              ...prev,
              passport: null,
              passportNumber: ''
            }));
            setExtractedData(prev => ({
              ...prev,
              passportNumber: '',
              passportValid: false
            }));
          }
        }
      } else {
        // For PDFs, skip OCR validation
        showNotification('⚠️ PDF uploaded. Please ensure it is a valid document.', 'info');
        setFormData(prev => ({
          ...prev,
          [name]: file
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.email || !formData.bookingNumber || !formData.phone) {
      showNotification('Please fill in all required fields', 'error');
      setIsSubmitting(false);
      return;
    }

    if (!formData.drivingLicense || !formData.passport) {
      showNotification('Please upload both driving license and passport', 'error');
      setIsSubmitting(false);
      return;
    }

    // Ensure documents were validated (for image uploads)
    if (formData.drivingLicense?.type?.startsWith('image/') && !extractedData.licenseValid) {
      showNotification('❌ Driving license validation failed. Please upload a valid license.', 'error');
      setIsSubmitting(false);
      return;
    }

    if (formData.passport?.type?.startsWith('image/') && !extractedData.passportValid) {
      showNotification('❌ Passport validation failed. Please upload a valid passport.', 'error');
      setIsSubmitting(false);
      return;
    }

    if (!formData.licenseNumber || !formData.passportNumber) {
      showNotification('❌ License and passport numbers are required. Please re-upload valid documents.', 'error');
      setIsSubmitting(false);
      return;
    }
      
    // Create check-in record
    const checkInRecord = {
      id: `CI-${Date.now()}`,
      email: formData.email,
      bookingNumber: formData.bookingNumber,
      phone: formData.phone,
      drivingLicenseName: formData.drivingLicense.name,
      passportName: formData.passport.name,
      licenseNumber: formData.licenseNumber,
      passportNumber: formData.passportNumber,
      checkInTime: new Date().toLocaleString(),
      status: 'Checked In'
    };

    // Save last check-in for confirmation display
    setLastCheckIn(checkInRecord);
    
    // Show success modal
    setShowSuccessModal(true);

    // Reset form
    setFormData({
      email: '',
      bookingNumber: '',
      phone: '',
      licenseNumber: '',
      passportNumber: '',
      drivingLicense: null,
      passport: null
    });
    
    // Reset extracted data
    setExtractedData({
      licenseNumber: '',
      passportNumber: '',
      licenseValid: null,
      passportValid: null
    });
    
    // Reset file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => input.value = '');

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' :
          'bg-blue-500'
        } text-white`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' && <span>✅</span>}
            {notification.type === 'error' && <span>❌</span>}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && lastCheckIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-scale-in">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Check-In Successful!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Welcome! Your check-in has been confirmed.
              </p>

              {/* Check-in Details */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 mb-6 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Booking Number</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{lastCheckIn.bookingNumber}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</span>
                  <span className="text-sm text-gray-900 dark:text-white">{lastCheckIn.email}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Check-In Time</span>
                  <span className="text-sm text-gray-900 dark:text-white">{lastCheckIn.checkInTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-semibold rounded-full">
                    ✓ Checked In
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setLastCheckIn(null);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              👋 Welcome
              </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Self Check-In System
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Check-In Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Check In
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please fill in your information below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                  placeholder="your.email@example.com"
                />
        </div>

              {/* Booking Number */}
                <div>
                <label htmlFor="bookingNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Booking Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="bookingNumber"
                  name="bookingNumber"
                  value={formData.bookingNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                  placeholder="Enter your booking number"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Upload Documents for Verification
                  </span>
                </div>
              </div>
            
              {/* Driving License Upload */}
                    <div>
                <label htmlFor="drivingLicense" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Driving License <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="drivingLicense"
                    name="drivingLicense"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    required
                    disabled={isProcessing.license}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  
                  {isProcessing.license && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      🤖 AI analyzing driving license...
                    </div>
                  )}
                  
                  {formData.drivingLicense && !isProcessing.license && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {formData.drivingLicense.name}
                      </div>
                      {extractedData.licenseNumber && (
                        <div className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-2">
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                    <div>
                            <span className="font-semibold text-blue-900 dark:text-blue-200">License #:</span>
                            <span className="ml-2 font-mono text-blue-800 dark:text-blue-300">{extractedData.licenseNumber}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Upload JPG, PNG, or PDF (Max 5MB) - AI will validate and extract data automatically
                </p>
              </div>

              {/* License Number (Auto-filled) */}
              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  License Number <span className="text-red-500">*</span>
                  {extractedData.licenseValid && (
                    <span className="ml-2 text-xs text-green-600 dark:text-green-400 font-normal">
                      ✓ Auto-detected
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  required
                  readOnly={extractedData.licenseValid}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    extractedData.licenseValid 
                      ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700 text-blue-900 dark:text-blue-200 font-mono font-semibold'
                      : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
                  }`}
                  placeholder="Will be auto-filled from uploaded license"
                />
                {!extractedData.licenseValid && formData.licenseNumber && (
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    ⚠️ Manually entered - Please ensure this is correct
                  </p>
                )}
              </div>

              {/* Passport Upload */}
                    <div>
                <label htmlFor="passport" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Passport <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="passport"
                    name="passport"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    required
                    disabled={isProcessing.passport}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-gray-700 dark:file:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  
                  {isProcessing.passport && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      🤖 AI analyzing passport...
                    </div>
                  )}
                  
                  {formData.passport && !isProcessing.passport && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {formData.passport.name}
                  </div>
                      {extractedData.passportNumber && (
                        <div className="flex items-center gap-2 text-sm bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded-lg p-2">
                          <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                          </svg>
                          <div>
                            <span className="font-semibold text-purple-900 dark:text-purple-200">Passport #:</span>
                            <span className="ml-2 font-mono text-purple-800 dark:text-purple-300">{extractedData.passportNumber}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Upload JPG, PNG, or PDF (Max 5MB) - AI will validate and extract data automatically
                </p>
              </div>

              {/* Passport Number (Auto-filled) */}
              <div>
                <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Passport Number <span className="text-red-500">*</span>
                  {extractedData.passportValid && (
                    <span className="ml-2 text-xs text-green-600 dark:text-green-400 font-normal">
                      ✓ Auto-detected
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  id="passportNumber"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleInputChange}
                  required
                  readOnly={extractedData.passportValid}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    extractedData.passportValid 
                      ? 'bg-purple-50 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700 text-purple-900 dark:text-purple-200 font-mono font-semibold'
                      : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
                  }`}
                  placeholder="Will be auto-filled from uploaded passport"
                />
                {!extractedData.passportValid && formData.passportNumber && (
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    ⚠️ Manually entered - Please ensure this is correct
                  </p>
                )}
              </div>

              {/* Submit Button */}
                          <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Checking In...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Check In Now
                  </span>
                )}
                    </button>
            </form>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-3">
              Quick & Easy Vehicle Check-In
            </h3>
            <p className="text-blue-100 text-lg mb-6">
              Complete your check-in by providing your booking details and uploading your documents
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl mb-2">🚀</div>
                <p className="font-semibold">Fast</p>
                <p className="text-sm text-blue-100">Check in under 2 minutes</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl mb-2">🔒</div>
                <p className="font-semibold">Secure</p>
                <p className="text-sm text-blue-100">Your documents are encrypted</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl mb-2">📄</div>
                <p className="font-semibold">Digital</p>
                <p className="text-sm text-blue-100">Upload documents instantly</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
