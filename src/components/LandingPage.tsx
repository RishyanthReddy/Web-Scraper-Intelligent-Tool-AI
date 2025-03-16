import React from "react";
import { Button } from "./ui/button";
import { ArrowRight, Code, Database, FileJson, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">AI Web Scraper</span>
          </div>
          <div className="space-x-4">
            <Button variant="outline" asChild>
              <Link to="/docs">Documentation</Link>
            </Button>
            <Button asChild>
              <Link to="/app">Launch App</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <h1 className="text-5xl font-bold mb-6 text-gray-900">
              Extract Data from Any Website with AI
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Our intelligent web scraping engine automatically extracts
              structured data from any website without predefined schemas or
              complex setup.
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" asChild>
                <Link to="/app" className="flex items-center gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#features">Learn More</a>
              </Button>
            </div>
            <div className="mt-16 bg-white rounded-lg shadow-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
                alt="Dashboard Preview"
                className="w-full h-auto border border-gray-200 rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
              Powerful Features
            </h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <FileJson className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Intelligent Extraction
                </h3>
                <p className="text-gray-600">
                  Our AI automatically identifies and extracts structured data
                  from any website without requiring predefined schemas.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Multiple Export Formats
                </h3>
                <p className="text-gray-600">
                  Download your extracted data in JSON, CSV, or Excel formats
                  with a single click for easy integration with your workflows.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Customizable Settings
                </h3>
                <p className="text-gray-600">
                  Fine-tune your extraction with configurable settings for wait
                  time, depth, and specific data types to extract.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Enter URL</h3>
                <p className="text-gray-600">
                  Paste any website URL into the input field
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Configure Settings
                </h3>
                <p className="text-gray-600">
                  Adjust extraction parameters if needed
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Results</h3>
                <p className="text-gray-600">
                  View and download your structured data
                </p>
              </div>
            </div>
            <div className="text-center mt-12">
              <Button size="lg" asChild>
                <Link to="/app">Try It Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <Database className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">AI Web Scraper</span>
              </div>
              <p className="mt-2 text-gray-400">
                Extract structured data from any website
              </p>
            </div>
            <div className="flex space-x-8">
              <div>
                <h4 className="font-semibold mb-3">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#features"
                      className="text-gray-400 hover:text-white"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Documentation
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              © {new Date().getFullYear()} AI Web Scraper. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
