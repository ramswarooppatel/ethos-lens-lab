import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, MessageSquare, Award, Shield, TrendingUp, Plus, Sparkles, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getPosts, addPost, votePost } from "@/lib/localStorage";
import { generateMockPost } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const Community = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState(getPosts());
  const [votedPosts, setVotedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedPosts = getPosts();
    if (storedPosts.length === 0) {
      // Add initial demo posts
      const demoPosts = Array.from({ length: 3 }, generateMockPost);
      demoPosts.forEach(post => addPost(post));
      setPosts(getPosts());
    } else {
      setPosts(storedPosts);
    }
  }, []);

  const handleVote = (postId: string, type: 'up' | 'down') => {
    if (votedPosts.has(postId)) {
      toast({
        title: "Already Voted",
        description: "You have already voted on this post.",
        variant: "destructive",
      });
      return;
    }
    
    votePost(postId, type);
    setVotedPosts(prev => new Set([...prev, postId]));
    setPosts(getPosts());
    
    toast({
      title: type === 'up' ? "Upvoted" : "Downvoted",
      description: "Your vote has been recorded.",
    });
  };

  const createNewPost = () => {
    const newPost = generateMockPost();
    addPost(newPost);
    setPosts(getPosts());
    
    toast({
      title: "Post Created",
      description: "Your community post has been published.",
    });
  };

  const loadMorePosts = () => {
    const newPosts = Array.from({ length: 2 }, generateMockPost);
    newPosts.forEach(post => addPost(post));
    setPosts(getPosts());
    
    toast({
      title: "Posts Loaded",
      description: "New discussions have been loaded.",
    });
  };

  const leaderboard = [
    { name: "Dr. Sarah Chen", score: 2847, badge: "expert" },
    { name: "James Wilson", score: 2156, badge: "contributor" },
    { name: "Alex Kumar", score: 1923, badge: "contributor" },
    { name: "Maria Rodriguez", score: 1654, badge: "citizen" },
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "expert":
        return "bg-primary/20 text-primary border-primary/30";
      case "contributor":
        return "bg-accent/20 text-accent border-accent/30";
      default:
        return "bg-foreground/20 text-foreground border-foreground/30";
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "expert":
        return <Shield className="w-3 h-3" />;
      case "contributor":
        return <Award className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  Community <span className="text-gradient">Hub</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  {posts.length} active discussions on AI ethics and bias detection
                </p>
              </div>
              <Button onClick={createNewPost} variant="hero">
                <Plus className="w-4 h-4" />
                Create Post
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Discussion Posts */}
            <div className="lg:col-span-2 space-y-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="glass-panel-hover p-6 rounded-2xl"
                >
                  {/* Author Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-12 h-12 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {post.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{post.author}</h3>
                        <Badge className={getBadgeColor(post.badge)}>
                          {getBadgeIcon(post.badge)}
                          {post.role}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Trust Score: {post.trustScore}%
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <h2 className="text-xl font-bold mb-3">{post.title}</h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {post.summary}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <Button 
                      variant={votedPosts.has(post.id) ? "secondary" : "ghost"} 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleVote(post.id, 'up')}
                    >
                      <ArrowUp className="w-4 h-4" />
                      {post.upvotes}
                    </Button>
                    <Button 
                      variant={votedPosts.has(post.id) ? "secondary" : "ghost"} 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleVote(post.id, 'down')}
                    >
                      <ArrowDown className="w-4 h-4" />
                      {post.downvotes}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageSquare className="w-4 h-4" />
                      {post.comments}
                    </Button>
                  </div>
                </motion.div>
              ))}

              <Button onClick={loadMorePosts} variant="hero" className="w-full" size="lg">
                <Sparkles className="w-4 h-4" />
                Load More Discussions
              </Button>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Leaderboard */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="glass-panel p-6 rounded-2xl border-accent/20 sticky top-24"
              >
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-6 h-6 text-accent" />
                  <h3 className="text-xl font-bold">Top Reviewers</h3>
                </div>
                <div className="space-y-4">
                  {leaderboard.map((user, index) => (
                    <div
                      key={user.name}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/5 transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {user.score} points
                        </div>
                      </div>
                      <Badge className={getBadgeColor(user.badge)} variant="outline">
                        {getBadgeIcon(user.badge)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Create Post */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="glass-panel p-6 rounded-2xl"
              >
                <h3 className="text-lg font-bold mb-4">Share Your Findings</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Found bias in an AI model? Share your analysis with the community.
                </p>
                <Button onClick={createNewPost} variant="hero" className="w-full">
                  <Plus className="w-4 h-4" />
                  Create New Post
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Community;
