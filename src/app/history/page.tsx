'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Credits from '@/components/Credits';
import ModelViewer from '@/components/ModelViewer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Clock, Box, CreditCard, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import './history.css';

type ModelHistory = {
  id: string;
  type: 'text-to-3d' | 'image-to-3d';
  prompt?: string;
  negative_prompt?: string;
  art_style?: string;
  thumbnail_url?: string;
  model_urls?: {
    glb?: string;
    fbx?: string;
    obj?: string;
    mtl?: string;
    usdz?: string;
  };
  status: 'SUCCEEDED' | 'FAILED' | 'PENDING';
  created_at: number;
  finished_at?: number;
  task_error?: {
    message: string;
  };
  credits: number;
};

type Transaction = {
  type: 'subscription' | 'topup' | 'usage';
  amount?: number;
  credits: number;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: string;
};

export default function HistoryPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'models' | 'transactions'>('models');
  const [models, setModels] = useState<ModelHistory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to be loaded before redirecting
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        
        // Fetch model generations
        const modelResponse = await fetch('/api/history/models', {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        if (!modelResponse.ok) throw new Error('Failed to fetch models');
        const modelData = await modelResponse.json();
        console.log('Fetched models:', modelData);
        
        // Fetch transactions
        const transactionsResponse = await fetch('/api/history/transactions');
        if (!transactionsResponse.ok) throw new Error('Failed to fetch transactions');
        const transactionsData = await transactionsResponse.json();
        
        // Filter credit purchases
        const creditPurchases = transactionsData.transactions
          .filter((t: Transaction) => t.type === 'topup' && t.status === 'success');

        setModels(modelData.models || []);
        setTransactions(creditPurchases);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isSignedIn, isLoaded, router]);

  // Show loading state while auth is being checked
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  // Return null if not signed in (will redirect)
  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <Navbar />
      <Credits />
      
      <main className="flex-1 container mx-auto px-4 py-8" style={{ marginTop: "120px" }}>
        <h1 className="history-title">History</h1>

        <div className="history-tabs">
          <button
            className={`tab-button ${activeTab === 'models' ? 'active' : ''}`}
            onClick={() => setActiveTab('models')}
          >
            <Box className="w-4 h-4" />
            Model Generations
          </button>
          <button
            className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            <CreditCard className="w-4 h-4" />
            Credit Purchases
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="history-content">
            {/* Models Tab */}
            {activeTab === 'models' && (
              <div className="history-content">
                {models.length === 0 ? (
                  <div className="empty-state">
                    <Box className="w-12 h-12 mb-4 text-[var(--foreground-secondary)]" />
                    <p className="empty-text">No models generated yet</p>
                  </div>
                ) : (
                  <div className="history-list">
                    {models.map((model, index) => (
                      <div key={model.id} className="history-item">
                        <div className="model-preview">
                          {model.thumbnail_url ? (
                            <img 
                              src={model.thumbnail_url} 
                              alt="Model Preview" 
                              className="w-full h-full object-contain"
                            />
                          ) : model.model_urls?.glb ? (
                            <ModelViewer modelUrl={model.model_urls.glb} />
                          ) : (
                            <div className="model-loading">
                              <LoadingSpinner />
                            </div>
                          )}
                        </div>
                        <div className="model-info">
                          <div className="model-header">
                            <h3 className="model-type">
                              {model.type === 'text-to-3d' ? 'Text to 3D' : 'Image to 3D'}
                            </h3>
                            <span className={`model-status ${model.status.toLowerCase()}`}>
                              {model.status === 'SUCCEEDED' ? 'success' : model.status.toLowerCase()}
                            </span>
                          </div>

                          {model.prompt && (
                            <p className="model-prompt">Prompt: {model.prompt}</p>
                          )}
                          {model.negative_prompt && (
                            <p className="model-prompt">Negative Prompt: {model.negative_prompt}</p>
                          )}
                          {model.art_style && (
                            <p className="model-prompt">Art Style: {model.art_style}</p>
                          )}

                          {model.task_error?.message && (
                            <p className="model-error">{model.task_error.message}</p>
                          )}

                          <div className="model-metadata">
                            <span className="metadata-item">
                              <Clock className="w-4 h-4" />
                              {format(new Date(model.created_at), 'MMM d, yyyy h:mm a')}
                            </span>
                            <span className="metadata-item">
                              <Box className="w-4 h-4" />
                              ID: {model.id}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="history-content">
                {transactions.length === 0 ? (
                  <div className="empty-state">
                    <CreditCard className="w-12 h-12 mb-4 text-[var(--foreground-secondary)]" />
                    <p className="empty-text">No credit purchases yet</p>
                  </div>
                ) : (
                  <div className="history-list">
                    {transactions.map((transaction, index) => (
                      <div key={index} className="transaction-item">
                        <div className="transaction-icon">
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <div className="transaction-info">
                          <div className="transaction-header">
                            <h3 className="transaction-type">Credit Purchase</h3>
                            <span className="transaction-status success">Success</span>
                          </div>
                          <div className="transaction-details">
                            <div className="transaction-metadata">
                              <span className="metadata-item">
                                <Clock className="w-4 h-4" />
                                {format(new Date(transaction.timestamp), 'MMM d, yyyy h:mm a')}
                              </span>
                              <span className="metadata-item">
                                ₹{transaction.amount! / 100}
                              </span>
                              <span className="metadata-item">
                                <CreditCard className="w-4 h-4" />
                                +{transaction.credits} credits
                              </span>
                            </div>
                            {transaction.razorpayPaymentId && (
                              <p className="transaction-id">
                                Payment ID: {transaction.razorpayPaymentId}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
} 