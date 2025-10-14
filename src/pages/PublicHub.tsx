import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Star, Filter, Search, Award, Shield, TrendingUp, Users, Database, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getModels, getDatasets, Model, Dataset } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";

interface PublicItem extends Model {
  isPublic: boolean;
  downloads: number;
  rating: number;
  ethicalScore: number;
}

interface PublicDataset extends Dataset {
  isPublic: boolean;
  downloads: number;
  rating: number;
  ethicalScore: number;
}

const PublicHub = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("downloads");
  const [publicModels, setPublicModels] = useState<PublicItem[]>([]);
  const [publicDatasets, setPublicDatasets] = useState<PublicDataset[]>([]);

  useEffect(() => {
    // Simulate public models and datasets (only those with high ethical scores)
    const models = getModels().filter(m => m.fairnessScore >= 80).map(m => ({
      ...m,
      isPublic: true,
      downloads: Math.floor(Math.random() * 5000) + 100,
      rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
      ethicalScore: m.fairnessScore
    }));

    const datasets = getDatasets().map(d => ({
      ...d,
      isPublic: true,
      downloads: Math.floor(Math.random() * 3000) + 50,
      rating: Math.floor(Math.random() * 2) + 4,
      ethicalScore: Math.floor(Math.random() * 20) + 80 // Simulated ethical score
    }));

    setPublicModels(models);
    setPublicDatasets(datasets);
  }, []);

  const handleDownload = (item: PublicItem | PublicDataset, type: 'model' | 'dataset') => {
    toast({
      title: "Download Started",
      description: `Downloading ${item.name}...`,
    });
    // Simulate download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${item.name} has been downloaded successfully.`,
      });
    }, 2000);
  };

  const filteredItems = () => {
    const allItems = [
      ...publicModels.map(m => ({ ...m, itemType: 'model' })),
      ...publicDatasets.map(d => ({ ...d, itemType: 'dataset' }))
    ];

    return allItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.tags.includes(selectedCategory);
      const matchesType = selectedType === 'all' || item.itemType === selectedType;

      return matchesSearch && matchesCategory && matchesType;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'downloads': return b.downloads - a.downloads;
        case 'rating': return b.rating - a.rating;
        case 'ethical': return b.ethicalScore - a.ethicalScore;
        default: return 0;
      }
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Public <span className="text-gradient">Hub</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover ethically vetted AI models and datasets from the community
            </p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="glass-panel p-4 rounded-xl text-center">
              <Database className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{publicDatasets.length}</div>
              <div className="text-sm text-muted-foreground">Datasets</div>
            </div>
            <div className="glass-panel p-4 rounded-xl text-center">
              <FileCode className="w-6 h-6 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">{publicModels.length}</div>
              <div className="text-sm text-muted-foreground">Models</div>
            </div>
            <div className="glass-panel p-4 rounded-xl text-center">
              <Download className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {publicModels.reduce((sum, m) => sum + m.downloads, 0) + publicDatasets.reduce((sum, d) => sum + d.downloads, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Downloads</div>
            </div>
            <div className="glass-panel p-4 rounded-xl text-center">
              <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm text-muted-foreground">Ethically Vetted</div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="glass-panel p-6 rounded-2xl mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Filters & Search</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search models & datasets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-panel border-foreground/20"
                />
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="glass-panel border-foreground/20">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="model">Models</SelectItem>
                  <SelectItem value="dataset">Datasets</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="glass-panel border-foreground/20">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="hiring">Hiring</SelectItem>
                  <SelectItem value="computer-vision">Computer Vision</SelectItem>
                  <SelectItem value="nlp">NLP</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="glass-panel border-foreground/20">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="downloads">Downloads</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="ethical">Ethical Score</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedType("all");
                  setSortBy("downloads");
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </motion.div>

          {/* Items Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems().map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                className="glass-panel-hover p-6 rounded-2xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {item.itemType === 'model' ? (
                      <FileCode className="w-5 h-5 text-primary" />
                    ) : (
                      <Database className="w-5 h-5 text-accent" />
                    )}
                    <Badge variant={item.itemType === 'model' ? 'default' : 'secondary'}>
                      {item.itemType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(item.rating)}
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {item.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {item.downloads}
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      {item.ethicalScore}%
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleDownload(item, item.itemType as 'model' | 'dataset')}
                  className="w-full"
                  variant="hero"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {filteredItems().length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No items found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PublicHub;