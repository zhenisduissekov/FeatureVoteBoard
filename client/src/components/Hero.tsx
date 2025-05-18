import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeroProps, SORT_OPTIONS, FILTER_OPTIONS } from "@/lib/types";

export default function Hero({ onSortChange, onFilterChange }: HeroProps) {
  return (
    <section className="mb-12">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Build <span className="bg-primary/10 px-2 py-1 rounded-md">better features</span> from user feedback
        </h2>
        <p className="text-gray-600 mb-8">
          Drive your product's growth with clarity by letting users vote on the features they want. 🚀
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="font-semibold text-lg">Ideas Board</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select onValueChange={onSortChange} defaultValue="most-voted">
                <SelectTrigger className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select onValueChange={onFilterChange} defaultValue="all">
                <SelectTrigger className="w-[150px] bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  {FILTER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
