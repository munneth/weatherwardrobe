import AdvancedImageGenerator from '@/components/advanced-image-generator';

export default function AIImageTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Image Generation Test
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test the latest Google Gemini and Imagen models for generating high-quality fashion images. 
            Choose between different models, aspect ratios, and customize your prompts.
          </p>
        </div>
        
        <AdvancedImageGenerator 
          defaultPrompt="A stylish casual outfit perfect for 70°F sunny weather, featuring a light cotton t-shirt, comfortable jeans, and sneakers. Professional fashion photography with clean studio lighting."
        />
        
        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-medium mb-2">Choose Model</h3>
              <p className="text-sm text-gray-600">
                Select between Gemini 2.0 Flash for contextual reasoning or Imagen 4.0 for photorealistic quality.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-medium mb-2">Customize Settings</h3>
              <p className="text-sm text-gray-600">
                Pick aspect ratios, write detailed prompts, and configure generation parameters.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-medium mb-2">Generate & Download</h3>
              <p className="text-sm text-gray-600">
                Create high-quality images and download them for your wardrobe planning.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Model Comparison</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Gemini 2.0 Flash</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Contextual reasoning and understanding</li>
                <li>• Good for complex prompts with multiple elements</li>
                <li>• Can handle text and image inputs together</li>
                <li>• Conversational image editing capabilities</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Imagen 4.0</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Highest quality photorealistic images</li>
                <li>• Multiple aspect ratio options</li>
                <li>• Specialized for artistic and detailed work</li>
                <li>• Best for professional fashion photography</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 