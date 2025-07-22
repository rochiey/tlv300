import React, { useState } from 'react';
import { Search, Globe, User, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const WhoisLookup = () => {
  const [domain, setDomain] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [lookupType, setLookupType] = useState('domain');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/whois', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: domain.trim(),
          type: lookupType,
          apiKey: apiKey.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Lookup failed');
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const DomainInfoTable = ({ data }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
        <div className="flex items-center space-x-2">
          <Globe className="text-white" size={24} />
          <h3 className="text-xl font-bold text-white">Domain Information</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Domain Name</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">{data.domainName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Registrar</label>
              <p className="text-lg text-gray-900 mt-1">{data.registrar}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Registration Date</label>
              <p className="text-lg text-gray-900 mt-1">{new Date(data.registrationDate).toLocaleDateString() || data.registrationDate}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Expiration Date</label>
              <p className="text-lg text-gray-900 mt-1">{new Date(data.expirationDate).toLocaleDateString() || data.expirationDate}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Estimated Domain Age</label>
              <p className="text-lg text-gray-900 mt-1">{data.estimatedDomainAge}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Hostnames</label>
              <p className="text-lg text-gray-900 mt-1 font-mono text-sm">{data.hostnames}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ContactInfoTable = ({ data }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
        <div className="flex items-center space-x-2">
          <User className="text-white" size={24} />
          <h3 className="text-xl font-bold text-white">Contact Information</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Registrant Name</label>
              <p className="text-lg text-gray-900 mt-1">{data.registrantName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Technical Contact</label>
              <p className="text-lg text-gray-900 mt-1">{data.technicalContactName}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Administrative Contact</label>
              <p className="text-lg text-gray-900 mt-1">{data.administrativeContactName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Contact Email</label>
              <p className="text-lg text-gray-900 mt-1">{data.contactEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <Globe className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            WHOIS Domain Lookup
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get comprehensive domain information and contact details for any domain name
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="space-y-6">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                  API Key *
                </label>
                <input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your WHOIS API key"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get your free API key from whoisxmlapi.com
                </p>
              </div>

              <div>
                <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
                  Domain Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., amazon.com"
                    required
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Information Type *
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="lookupType"
                      value="domain"
                      checked={lookupType === 'domain'}
                      onChange={(e) => setLookupType(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 font-medium">Domain Information</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="lookupType"
                      value="contact"
                      checked={lookupType === 'contact'}
                      onChange={(e) => setLookupType(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 font-medium">Contact Information</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !domain.trim() || !apiKey.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Looking up...</span>
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    <span>Lookup Domain</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <h4 className="text-red-800 font-semibold">Error</h4>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-center space-x-2">
              <CheckCircle className="text-green-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">
                Lookup Results for {result.domain}
              </h2>
            </div>
            
            {result.type === 'domain' ? (
              <DomainInfoTable data={result.data} />
            ) : (
              <ContactInfoTable data={result.data} />
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500">
          <p>&copy; 2025 Rochie Tool for TLV300 Coding Exercise</p>
        </div>
      </div>
    </div>
  );
};

export default WhoisLookup;