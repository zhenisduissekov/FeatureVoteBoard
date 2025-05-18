import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Feature } from "@shared/schema";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeatureList from "@/components/FeatureList";
import Footer from "@/components/Footer";
import AddFeatureModal from "@/components/AddFeatureModal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FeatureSortOption, SORT_OPTIONS } from "@/lib/types";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('most-voted');
  const [filterBy, setFilterBy] = useState<string>('all');
  const [votedFeatures, setVotedFeatures] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  // Fetch features
  const { data: features = [], isLoading, refetch } = useQuery<Feature[]>({
    queryKey: ['/api/features'],
  });

  // Create feature mutation
  const createFeatureMutation = useMutation({
    mutationFn: async (data: { title: string; description?: string }) => {
      const response = await apiRequest('POST', '/api/features', data);
      return response.json();
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Success!",
        description: "Your feature idea has been submitted.",
      });
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit feature idea.",
        variant: "destructive",
      });
    },
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async (featureId: number) => {
      const response = await apiRequest('POST', `/api/features/${featureId}/vote`);
      return response.json();
    },
    onSuccess: (_data, featureId) => {
      refetch();
      setVotedFeatures(prev => ({ ...prev, [featureId]: true }));
      toast({
        title: "Vote Submitted",
        description: "Your vote has been recorded.",
      });
    },
    onError: (error, featureId) => {
      // If the error is "Already voted", we'll update our local state to reflect that
      if (error.message?.includes("Already voted")) {
        setVotedFeatures(prev => ({ ...prev, [featureId]: true }));
      }
      
      toast({
        title: "Error",
        description: error.message || "Failed to submit vote.",
        variant: "destructive",
      });
    },
  });

  // Check which features the user has already voted for
  useEffect(() => {
    const checkVoteStatus = async () => {
      if (features.length === 0) return;
      
      try {
        const votedMap: Record<number, boolean> = {};
        
        await Promise.all(
          features.map(async (feature) => {
            const response = await fetch(`/api/features/${feature.id}/voted`);
            if (response.ok) {
              const { voted } = await response.json();
              votedMap[feature.id] = voted;
            }
          })
        );
        
        setVotedFeatures(votedMap);
      } catch (error) {
        console.error("Failed to check vote status:", error);
      }
    };
    
    checkVoteStatus();
  }, [features]);

  // Handle feature submission
  const handleSubmitFeature = (title: string, description?: string) => {
    createFeatureMutation.mutate({ title, description });
  };

  // Handle voting
  const handleVote = (featureId: number) => {
    if (votedFeatures[featureId]) {
      toast({
        title: "Already Voted",
        description: "You have already voted for this feature.",
      });
      return;
    }
    
    voteMutation.mutate(featureId);
  };

  // Sort and filter features
  const sortedAndFilteredFeatures = [...features]
    .filter(feature => filterBy === 'all' || feature.status === filterBy)
    .sort((a, b) => {
      if (sortBy === 'most-voted') {
        return b.votes - a.votes;
      } else if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0;
    });

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header onAddFeatureClick={() => setIsModalOpen(true)} />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Hero 
          onSortChange={(value) => setSortBy(value)} 
          onFilterChange={(value) => setFilterBy(value)} 
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <FeatureList 
            features={sortedAndFilteredFeatures} 
            onVote={handleVote} 
            votedFeatures={votedFeatures} 
          />
        )}
      </main>
      
      <Footer />
      
      <AddFeatureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSubmitFeature} 
      />
      
      {/* Mobile Add Feature button */}
      <div className="md:hidden fixed right-6 bottom-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-accent hover:bg-blue-700 text-white font-medium h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition duration-200 ease-in-out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
