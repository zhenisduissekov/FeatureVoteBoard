import { FeatureCardProps, STATUS_COLORS, STATUS_LABELS } from "@/lib/types";
import { FeatureStatus } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function FeatureCard({ feature, onVote, hasVoted }: FeatureCardProps) {
  const statusColor = STATUS_COLORS[feature.status as FeatureStatus];
  const statusLabel = STATUS_LABELS[feature.status as FeatureStatus];
  
  const formattedDate = formatDistanceToNow(new Date(feature.createdAt), { addSuffix: true });
  
  return (
    <div className="feature-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{feature.title}</h3>
          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
        
        <p className="text-gray-600 mb-6 line-clamp-3">{feature.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">Submitted {formattedDate}</span>
          <div className="flex items-center">
            <button
              onClick={() => onVote(feature.id)}
              disabled={hasVoted}
              className={`vote-button flex items-center space-x-1 ${
                hasVoted 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              } font-medium py-1 px-3 rounded-md transition duration-200 ease-in-out`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span>{feature.votes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
