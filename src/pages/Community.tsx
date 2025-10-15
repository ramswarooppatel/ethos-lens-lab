import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, MessageSquare, Award, Shield, TrendingUp, Plus, Sparkles, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { leaderboardAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface LeaderboardUser {
  id: number;
  username: string;
  email: string;
  total_posts: number;
  total_upvotes: number;
  categories: Record<string, number>;
  score: number;
  badge: string;
}

const Community = () => {
  const { toast } = useToast();
  const { token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedPosts, setVotedPosts] = useState<Set<number>>(new Set());
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [creatingPost, setCreatingPost] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await postsAPI.getAllPosts(token);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        toast({
          title: "Error",
          description: "Failed to load community posts. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token, toast]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLeaderboardLoading(true);
        const leaderboardData = await leaderboardAPI.getLeaderboard(10, token);
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        toast({
          title: "Error",
          description: "Failed to load leaderboard. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLeaderboardLoading(false);
      }
    };

    fetchLeaderboard();
  }, [token, toast]);

  const handleVote = async (postId: number, type: 'up' | 'down') => {
    if (votedPosts.has(postId)) {
      toast({
        title: "Already Voted",
        description: "You have already voted on this post.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (type === 'up') {
        await postsAPI.upvotePost(postId, token);
      } else {
        await postsAPI.downvotePost(postId, token);
      }

      // Update local state
      setVotedPosts(prev => new Set([...prev, postId]));
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                upvotes: type === 'up' ? post.upvotes + 1 : post.upvotes,
                downvotes: type === 'down' ? post.downvotes + 1 : post.downvotes
              }
            : post
        )
      );

      toast({
        title: type === 'up' ? "Upvoted" : "Downvoted",
        description: "Your vote has been recorded.",
      });
    } catch (error) {
      console.error('Failed to vote:', error);
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const createNewPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content for your post.",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreatingPost(true);
      const newPost = await postsAPI.createPost({
        title: newPostTitle,
        content: newPostContent
      }, token);

      setPosts(prevPosts => [newPost, ...prevPosts]);
      setNewPostTitle('');
      setNewPostContent('');
      setCreateDialogOpen(false);

      toast({
        title: "Post Created",
        description: "Your community post has been published successfully.",
      });
    } catch (error) {
      console.error('Failed to create post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreatingPost(false);
    }
  };

  const loadMorePosts = async () => {
    try {
      const fetchedPosts = await postsAPI.getAllPosts(token);
      // For now, just refresh the posts. In a real app, you'd implement pagination
      setPosts(fetchedPosts);

      toast({
        title: "Posts Refreshed",
        description: "Community posts have been updated.",
      });
    } catch (error) {
      console.error('Failed to load more posts:', error);
      toast({
        title: "Error",
        description: "Failed to load more posts. Please try again.",
        variant: "destructive",
      });
    }
  };

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

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
                  {posts.length} active discussions • {leaderboard.length} top contributors
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
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading discussions...</span>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No discussions yet</h3>
                  <p className="text-muted-foreground mb-4">Be the first to start a conversation!</p>
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    Start a Discussion
                  </Button>
                </div>
              ) : (
                posts.map((post, index) => (
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
                          {(post.author_username || 'Anonymous')
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{post.author_username || 'Anonymous'}</h3>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <h2 className="text-xl font-bold mb-3">{post.title}</h2>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {post.content}
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
                    </div>
                  </motion.div>
                ))
              )}

              {posts.length > 0 && (
                <Button onClick={loadMorePosts} variant="hero" className="w-full" size="lg">
                  <Sparkles className="w-4 h-4" />
                  Load More Discussions
                </Button>
              )}
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
                  <h3 className="text-xl font-bold">Top Contributors</h3>
                </div>
                {leaderboardLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2 text-sm">Loading leaderboard...</span>
                  </div>
                ) : leaderboard.length === 0 ? (
                  <div className="text-center py-8">
                    <Award className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No contributors yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leaderboard.map((user, index) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/5 transition-colors"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{user.username}</div>
                          <div className="text-xs text-muted-foreground">
                            {user.score} points • {user.total_posts} posts
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Object.keys(user.categories).length} categories
                          </div>
                        </div>
                        <Badge className={getBadgeColor(user.badge)} variant="outline">
                          {getBadgeIcon(user.badge)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
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
                <Button onClick={() => setCreateDialogOpen(true)} variant="hero" className="w-full">
                  <Plus className="w-4 h-4" />
                  Create New Post
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Create Post Dialog */}
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Start a New Discussion</DialogTitle>
                <DialogDescription>
                  Share your thoughts, ask questions, or discuss topics with the community.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="What's your discussion about?"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createNewPost} disabled={creatingPost}>
                  {creatingPost ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Discussion'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </div>
  );
};

export default Community;
