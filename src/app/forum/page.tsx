'use client'

import { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import ModelViewer from '@/components/ModelViewer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import Navbar from '@/components/Navbar';
import './forum.css';

interface CommunityModel {
  _id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  originalImage: string;
  thumbnailUrl: string;
  modelUrl: string;
  tags: string[];
  createdAt: string;
  prompt?: string;
  type: 'text-to-3d' | 'image-to-3d';
}

export default function Forum() {
  const [models, setModels] = useState<CommunityModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<CommunityModel | null>(null);

  const fetchModels = async (search?: string) => {
    try {
      setLoading(true);
      const url = '/api/community/models' + (search ? `?search=${encodeURIComponent(search)}` : '');
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }

      const data = await response.json();
      setModels(data.models);
    } catch (error) {
      console.error('Error fetching models:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch models');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchModels(searchQuery);
  };

  const handleDownload = async (modelUrl: string) => {
    try {
      // Extract the original URL if it's already proxied
      const originalUrl = modelUrl.startsWith('/api/proxy') ? 
        decodeURIComponent(modelUrl.split('url=')[1]) : 
        modelUrl;

      // Create a fresh proxy URL
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(originalUrl)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download model: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `model${contentType?.includes('gltf') ? '.glb' : '.obj'}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = 'Model downloaded successfully!';
      document.body.appendChild(successMessage);
      setTimeout(() => document.body.removeChild(successMessage), 3000);
    } catch (error) {
      console.error('Error downloading model:', error);
      
      // Show error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorMessage.textContent = 'Failed to download model. Please try again.';
      document.body.appendChild(errorMessage);
      setTimeout(() => document.body.removeChild(errorMessage), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      
      <div className="search-section">
        <h1 className="forum-title">Community Models</h1>
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-wrapper">
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </form>
          <button onClick={handleSearch} className="search-button">
            <Search size={20} />
            Search
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size={40} message="Loading models..." />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-12">{error}</div>
        ) : models.length === 0 ? (
          <div className="text-center py-12 text-[var(--foreground-secondary)]">
            No models found. Be the first to publish one!
          </div>
        ) : (
          <div className="models-grid">
            {models.map((model) => (
              <div 
                key={model._id} 
                className="model-card"
                onClick={() => setSelectedModel(model)}
              >
                <div className="model-thumbnail">
                  {model.thumbnailUrl ? (
                    <img 
                      src={model.thumbnailUrl}
                      alt={model.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="model-loading">
                      <LoadingSpinner />
                    </div>
                  )}
                </div>
                <div className="model-card-info">
                  <h3 className="model-title">{model.title}</h3>
                  <p className="model-author">by {model.userName}</p>
                  <p className="model-type">{model.type === 'text-to-3d' ? 'Text to 3D' : 'Image to 3D'}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Model Details Modal */}
        {selectedModel && (
          <div className="modal-overlay" onClick={() => setSelectedModel(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button 
                className="modal-close"
                onClick={() => setSelectedModel(null)}
              >
                ×
              </button>
              
              <div className="modal-body">
                <h2 className="modal-title">{selectedModel.title}</h2>
                <p className="modal-author">Created by {selectedModel.userName}</p>
                
                <div className="modal-model-viewer">
                  <ModelViewer 
                    modelUrl={selectedModel.modelUrl}
                    className="w-full h-[600px]"
                  />
                </div>

                <div className="modal-details">
                  <p className="modal-description">{selectedModel.description}</p>
                  {selectedModel.prompt && (
                    <p className="modal-prompt mt-2">
                      <span className="font-semibold">Prompt:</span> {selectedModel.prompt}
                    </p>
                  )}
                  <div className="modal-tags">
                    {selectedModel.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  className="download-button"
                  onClick={() => handleDownload(selectedModel.modelUrl)}
                >
                  <Download size={20} />
                  Download Model
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <p className="footer-text">
            © 2024 ShapeShift AI. All rights reserved.
          </p>
          <div className="footer-links">
            <a href="/privacy" className="footer-link">Privacy Policy</a>
            <a href="/terms" className="footer-link">Terms of Service</a>
            <a href="/contact" className="footer-link">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 