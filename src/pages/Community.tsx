import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, MessageSquare, Award, Shield, TrendingUp, Plus, Sparkles, ArrowUp, ArrowDown, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getPosts, addPost, votePost, deletePost } from "@/lib/localStorage";
import { generateMockPost } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Community = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState(getPosts());
  const [votedPosts, setVotedPosts] = useState<Set<string>>(new Set());
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const postsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedPosts = getPosts();
    if (storedPosts.length === 0) {
      const demoPosts = Array.from({ length: 3 }, generateMockPost);
      demoPosts.forEach(post => addPost(post));
      setPosts(getPosts());
    } else {
      setPosts(storedPosts);
    }
  }, []);

  useEffect(() => {
    if (postsContainerRef.current) {
      const posts = postsContainerRef.current.querySelectorAll('.post-card');
      gsap.fromTo(
        posts,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: postsContainerRef.current,
            start: "top 80%",
          }
        }
      );
    }
  }, [posts.length]);

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

  const handleCreatePost = (data: { title: string; content: string; tags: string[] }) => {
    const newPost = generateMockPost();
    newPost.title = data.title;
    newPost.summary = data.content;
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

  const handleDeletePost = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      deletePost(postToDelete);
      setPosts(getPosts());
      toast({
        title: "Post Deleted",
        description: "The post has been removed successfully.",
      });
    }
    setDeleteDialogOpen(false);
    setPostToDelete(null);
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
                  Community Hub
                </h1>
                <p className="text-xl text-muted-foreground">
                  {posts.length} active discussions on AI ethics and bias detection
                </p>
              </div>
              <Button onClick={() => setCreateDialogOpen(true)} variant="default">
                <Plus className="w-4 h-4" />
                Create Post
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div ref={postsContainerRef} className="lg:col-span-2 space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="post-card glass-panel-hover p-6 rounded-lg"
                >
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>

                  <h2 className="text-xl font-bold mb-3">{post.title}</h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {post.summary}
                  </p>

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
                </div>
              ))}

              <Button onClick={loadMorePosts} variant="default" className="w-full" size="lg">
                <Sparkles className="w-4 h-4" />
                Load More Discussions
              </Button>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="glass-panel p-6 rounded-lg sticky top-24"
              >
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Top Reviewers</h3>
                </div>
                <div className="space-y-4">
                  {leaderboard.map((user, index) => (
                    <div
                      key={user.name}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
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

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="glass-panel p-6 rounded-lg"
              >
                <h3 className="text-lg font-bold mb-4">Share Your Findings</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Found bias in an AI model? Share your analysis with the community.
                </p>
                <Button onClick={() => setCreateDialogOpen(true)} variant="default" className="w-full">
                  <Plus className="w-4 h-4" />
                  Create New Post
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <CreatePostDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreatePost}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Post?"
        description="Are you sure you want to delete this post? This action cannot be undone."
      />
    </div>
  );
};

export default Community;
