import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Feature, FeatureStatus } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/types";

export default function Admin() {
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<string>('most-voted');

  // Fetch features
  const { data: features = [], isLoading, refetch } = useQuery<Feature[]>({
    queryKey: ['/api/features'],
  });

  // Update feature status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: FeatureStatus }) => {
      const response = await apiRequest('PUT', `/api/features/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Status Updated",
        description: "Feature status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update feature status.",
        variant: "destructive",
      });
    },
  });

  // Handle status change
  const handleStatusChange = (id: number, status: string) => {
    updateStatusMutation.mutate({ 
      id, 
      status: status as FeatureStatus 
    });
  };

  // Sort features
  const sortedFeatures = [...features].sort((a, b) => {
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
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Feature Requests Admin Panel</h1>
        <p className="text-gray-600 mb-4">Manage feature requests and update their status</p>
        
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium">Sort by:</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="most-voted">Most Voted</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm">
          <Table>
            <TableCaption>Feature requests that users have submitted</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Votes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedFeatures.map((feature) => (
                <TableRow key={feature.id}>
                  <TableCell className="font-medium">{feature.id}</TableCell>
                  <TableCell className="max-w-xs truncate font-medium">{feature.title}</TableCell>
                  <TableCell className="max-w-sm truncate">{feature.description}</TableCell>
                  <TableCell>{feature.votes}</TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[feature.status as FeatureStatus]}>
                      {STATUS_LABELS[feature.status as FeatureStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(feature.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Select 
                      defaultValue={feature.status} 
                      onValueChange={(value) => handleStatusChange(feature.id, value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-6">
        <Button variant="outline" onClick={() => window.location.href = "/"}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}