import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Award, TrendingUp, Settings, Shield, Save, Edit3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getProfile, updateProfile } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState(getProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    role: profile.role,
  });
  const [preferences, setPreferences] = useState({
    notifications: true,
    community: true,
    analytics: false,
    publicProfile: true,
  });

  useEffect(() => {
    const currentProfile = getProfile();
    setProfile(currentProfile);
    setEditForm({
      name: currentProfile.name,
      role: currentProfile.role,
    });
  }, []);

  const userStats = [
    { label: "Models Audited", value: profile.stats.modelsAudited },
    { label: "Community Posts", value: profile.stats.communityPosts },
    { label: "Reports Generated", value: profile.stats.reportsGenerated },
    { label: "Upvotes Received", value: profile.stats.upvotesReceived },
  ];

  const achievements = [
    { name: "First Audit", description: "Completed your first model audit", unlocked: profile.stats.modelsAudited >= 1 },
    { name: "Community Hero", description: "Received 100+ upvotes", unlocked: profile.stats.upvotesReceived >= 100 },
    { name: "Expert Reviewer", description: "Verified by the community", unlocked: profile.trustScore >= 90 },
    { name: "Bias Hunter", description: "Detected 10+ critical biases", unlocked: profile.stats.reportsGenerated >= 10 },
  ];

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const savePreferences = () => {
    toast({
      title: "Preferences Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    updateProfile({
      name: editForm.name,
      role: editForm.role,
    });
    setProfile(getProfile());
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: profile.name,
      role: profile.role,
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="glass-panel p-8 rounded-2xl mb-8"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                  {(isEditing ? editForm.name : profile.name).split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="text-3xl font-bold h-auto py-2 text-center md:text-left"
                      placeholder="Your name"
                    />
                    <Textarea
                      value={editForm.role}
                      onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                      className="text-muted-foreground resize-none"
                      placeholder="Your role/description"
                      rows={2}
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                    <p className="text-muted-foreground mb-4">
                      {profile.role}
                    </p>
                  </>
                )}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                  {profile.badges.includes('expert') && (
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified Expert
                    </Badge>
                  )}
                  {profile.badges.includes('contributor') && (
                    <Badge className="bg-accent/20 text-accent border-accent/30">
                      <Award className="w-3 h-3 mr-1" />
                      Top Contributor
                    </Badge>
                  )}
                </div>
                {!isEditing && (
                  <p className="text-muted-foreground mb-4">
                    AI Ethics Researcher | Specializing in fairness metrics and bias detection
                  </p>
                )}
                <div className="space-y-2">
                  <div className="flex items-center justify-between max-w-md mx-auto md:mx-0">
                    <span className="text-sm text-muted-foreground">Trust Score</span>
                    <span className="font-bold text-primary">{profile.trustScore}/100</span>
                  </div>
                  <Progress value={profile.trustScore} className="h-2 max-w-md mx-auto md:mx-0" />
                </div>
              </div>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button variant="hero" size="sm" onClick={handleSaveProfile}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={handleEditProfile}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {userStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                className="glass-panel-hover p-6 rounded-2xl text-center"
              >
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="glass-panel p-8 rounded-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-accent" />
                Achievements
              </h2>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.name}
                    className={`p-4 rounded-xl border ${
                      achievement.unlocked
                        ? "bg-primary/10 border-primary/30"
                        : "bg-foreground/5 border-foreground/10 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          achievement.unlocked ? "bg-primary/20" : "bg-foreground/10"
                        }`}
                      >
                        <Award
                          className={`w-5 h-5 ${
                            achievement.unlocked ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="glass-panel p-8 rounded-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6 text-primary" />
                Preferences
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                      <Label htmlFor="notifications" className="text-base font-medium">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates on your audits
                      </p>
                    </div>
                    <Switch 
                      id="notifications" 
                      checked={preferences.notifications}
                      onCheckedChange={() => handlePreferenceChange('notifications')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="community" className="text-base font-medium">
                        Community Posts
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified of new discussions
                      </p>
                    </div>
                    <Switch 
                      id="community" 
                      checked={preferences.community}
                      onCheckedChange={() => handlePreferenceChange('community')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="analytics" className="text-base font-medium">
                        Analytics Insights
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Weekly fairness trend reports
                      </p>
                    </div>
                    <Switch 
                      id="analytics" 
                      checked={preferences.analytics}
                      onCheckedChange={() => handlePreferenceChange('analytics')}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="public-profile" className="text-base font-medium">
                        Public Profile
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Show your profile to the community
                      </p>
                    </div>
                    <Switch 
                      id="public-profile" 
                      checked={preferences.publicProfile}
                      onCheckedChange={() => handlePreferenceChange('publicProfile')}
                    />
                  </div>

                  <Button onClick={savePreferences} variant="hero" className="w-full mt-4">
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </Button>
                </div>

              <div className="mt-8 pt-6 border-t border-foreground/10">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Reputation Level
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress to Expert</span>
                    <span className="font-semibold">{profile.xp} / 3,000 XP</span>
                  </div>
                  <Progress value={(profile.xp / 3000) * 100} className="h-2" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
