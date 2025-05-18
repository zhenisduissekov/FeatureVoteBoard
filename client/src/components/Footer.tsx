export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="bg-primary rounded-md w-8 h-8 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-white" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
            <span className="text-gray-600">© 2023 FeatureVote. All rights reserved.</span>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Built for educational purposes only.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
