import FeatureCard from "./FeatureCard";
import { FeatureListProps } from "@/lib/types";
import { Feature } from "@shared/schema";

export default function FeatureList({ features, onVote, votedFeatures }: FeatureListProps) {
  if (features.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No features found</h3>
        <p className="text-gray-600">Be the first to suggest a feature!</p>
      </div>
    );
  }
  
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature: Feature) => (
        <FeatureCard 
          key={feature.id} 
          feature={feature} 
          onVote={onVote} 
          hasVoted={votedFeatures[feature.id] || false} 
        />
      ))}
    </section>
  );
}
