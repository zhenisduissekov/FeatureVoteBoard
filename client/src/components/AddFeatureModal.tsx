import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddFeatureModalProps } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function AddFeatureModal({ isOpen, onClose, onSubmit }: AddFeatureModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate title
    if (title.trim().length < 3) {
      setTitleError("Please enter a title (minimum 3 characters)");
      return;
    }
    
    // Clear error if valid
    setTitleError("");
    
    // Submit the form
    onSubmit(title, description);
    
    // Reset form
    setTitle("");
    setDescription("");
  };
  
  const handleCancel = () => {
    // Reset the form and close
    setTitle("");
    setDescription("");
    setTitleError("");
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Submit new feature idea
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label htmlFor="feature-title" className="text-sm font-medium text-gray-700">
              Title *
            </Label>
            <Input
              id="feature-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim().length >= 3) {
                  setTitleError("");
                }
              }}
              placeholder="What feature would you like to see?"
              className={`w-full ${titleError ? "border-red-500" : ""}`}
            />
            {titleError && (
              <p className="text-red-500 text-xs mt-1">{titleError}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="feature-description" className="text-sm font-medium text-gray-700">
              Description (optional)
            </Label>
            <Textarea
              id="feature-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more details about your idea..."
              className="w-full h-24"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-primary hover:bg-green-500 text-white"
            >
              Submit idea
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
