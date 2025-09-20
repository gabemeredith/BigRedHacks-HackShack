'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import AuthGuard from '@/components/AuthGuard';
import { Container, VStack, Card } from '@/components/ui/layout';
import { Headline, Title, Body, Label } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BusinessWithVideos, VideoWithBusiness, categoryToString } from '@/lib/db';
import { Heart, MessageCircle, Share, Play } from 'lucide-react';
import CoordinatesModal from '@/components/CoordinatesModal';
import PostTemplate from '@/components/PostTemplate';
import { isDemoModeClient, DEMO_SESSION, DEMO_BUSINESS } from '@/lib/demo';

function DashboardContent() {
  const { data: session } = useSession();
  const isDemo = isDemoModeClient();
  const effectiveSession = isDemo ? DEMO_SESSION : session;
  
  const [business, setBusiness] = useState<BusinessWithVideos | null>(null);
  const [videos, setVideos] = useState<VideoWithBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showCoordinatesModal, setShowCoordinatesModal] = useState(false);
  const [needsCoordinates, setNeedsCoordinates] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    website: '',
    category: 'RESTAURANTS' as any,
    address: '',
  });

  // Video form state
  const [videoForm, setVideoForm] = useState({
    title: '',
    url: '',
    thumbUrl: '',
  });

  // Fetch business data
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        if (isDemo) {
          // Use demo data in demo mode
          setBusiness(DEMO_BUSINESS as any);
          setProfileForm({
            name: DEMO_BUSINESS.name,
            website: DEMO_BUSINESS.website || '',
            category: DEMO_BUSINESS.category,
            address: DEMO_BUSINESS.address || '',
          });
          setLoading(false);
          return;
        }
        
        const response = await fetch('/api/business/profile');
        if (response.ok) {
          const data = await response.json();
          setBusiness(data.business);
          setProfileForm({
            name: data.business.name || '',
            website: data.business.website || '',
            category: data.business.category || 'RESTAURANTS',
            address: data.business.address || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch business:', error);
        setError('Failed to load business data');
      } finally {
        setLoading(false);
      }
    };

    const fetchVideos = async () => {
      try {
        if (isDemo) {
          // Use empty array for demo mode videos
          setVideos([]);
          return;
        }
        
        const response = await fetch('/api/videos/create');
        if (response.ok) {
          const data = await response.json();
          setVideos(data.videos);
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      }
    };

    if (effectiveSession?.user?.id) {
      fetchBusiness();
      fetchVideos();
    }
  }, [effectiveSession, isDemo]);

  const handleProfileSave = async () => {
    setSaving(true);
    setError('');
    
    try {
      const response = await fetch('/api/business/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });

      if (response.ok) {
        const data = await response.json();
        setBusiness(data.business);
        
        // If geocoding failed and we have an address, offer manual coordinates
        if (!data.geocoded && profileForm.address && (!data.business.lat || !data.business.lng)) {
          setNeedsCoordinates(true);
          setShowCoordinatesModal(true);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCoordinatesSave = async (lat: number, lng: number) => {
    try {
      const response = await fetch('/api/business/coordinates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      });

      if (response.ok) {
        const data = await response.json();
        setBusiness(data.business);
        setNeedsCoordinates(false);
      } else {
        setError('Failed to update coordinates');
      }
    } catch (error) {
      setError('Failed to update coordinates');
    }
  };

  const handleVideoSave = async () => {
    if (!videoForm.title || !videoForm.url) {
      setError('Title and URL are required for videos');
      return;
    }

    setSaving(true);
    setError('');
    
    try {
      const response = await fetch('/api/videos/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoForm),
      });

      if (response.ok) {
        const data = await response.json();
        setVideos(prev => [data.video, ...prev]);
        setVideoForm({ title: '', url: '', thumbUrl: '' });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create video');
      }
    } catch (error) {
      setError('Failed to create video');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-8">
        <div className="text-center">
          <Body className="text-text-secondary">Loading dashboard...</Body>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 max-w-4xl">
      <VStack className="gap-8">
        <VStack className="gap-4">
          <Headline>Business Dashboard</Headline>
          <Body className="text-text-secondary">
            Manage your business profile and content
          </Body>
        </VStack>

        {error && (
          <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
            <Body className="text-error-800">{error}</Body>
          </div>
        )}

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="videos">Videos ({videos.length})</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card className="p-6">
              <VStack className="gap-6">
                <Title className="text-xl">Business Profile</Title>
                
                <VStack className="gap-4">
                  <VStack className="gap-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your Business Name"
                    />
                  </VStack>

                  <VStack className="gap-2">
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      value={profileForm.category}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, category: e.target.value as any }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="RESTAURANTS">Restaurant</option>
                      <option value="CLOTHING">Clothing & Fashion</option>
                      <option value="ART">Art & Gallery</option>
                      <option value="ENTERTAINMENT">Entertainment</option>
                    </select>
                  </VStack>

                  <VStack className="gap-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={profileForm.website}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://yourbusiness.com"
                    />
                  </VStack>

                  <VStack className="gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="123 Main St, City, State"
                    />
                    <Body className="text-text-tertiary text-xs">
                      Address will be automatically geocoded for location features
                    </Body>
                  </VStack>

                  {business?.lat && business?.lng && (
                    <div className="p-3 bg-success-50 border border-success-200 rounded">
                      <Body className="text-success-800 text-sm">
                        📍 Coordinates: {business.lat.toFixed(6)}, {business.lng.toFixed(6)}
                      </Body>
                    </div>
                  )}
                </VStack>

                <div className="flex gap-3">
                  <Button onClick={handleProfileSave} disabled={saving} className="flex-1">
                    {saving ? 'Saving...' : 'Save Profile'}
                  </Button>
                  {needsCoordinates && (
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCoordinatesModal(true)}
                      className="flex-1"
                    >
                      Set Coordinates
                    </Button>
                  )}
                </div>
              </VStack>
            </Card>
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            <VStack className="gap-6">
              {/* Add Video Form */}
              <Card className="p-6">
                <VStack className="gap-6">
                  <Title className="text-xl">Add New Video</Title>
                  
                  <VStack className="gap-4">
                    <VStack className="gap-2">
                      <Label htmlFor="videoTitle">Title *</Label>
                      <Input
                        id="videoTitle"
                        value={videoForm.title}
                        onChange={(e) => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Showcase your business..."
                      />
                    </VStack>

                    <VStack className="gap-2">
                      <Label htmlFor="videoUrl">Video URL *</Label>
                      <Input
                        id="videoUrl"
                        type="url"
                        value={videoForm.url}
                        onChange={(e) => setVideoForm(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://youtube.com/watch?v=... or Cloudinary URL"
                      />
                    </VStack>

                    <VStack className="gap-2">
                      <Label htmlFor="thumbUrl">Thumbnail URL (Optional)</Label>
                      <Input
                        id="thumbUrl"
                        type="url"
                        value={videoForm.thumbUrl}
                        onChange={(e) => setVideoForm(prev => ({ ...prev, thumbUrl: e.target.value }))}
                        placeholder="https://example.com/thumbnail.jpg"
                      />
                    </VStack>
                  </VStack>

                  <Button onClick={handleVideoSave} disabled={saving}>
                    {saving ? 'Adding Video...' : 'Add Video'}
                  </Button>
                </VStack>
              </Card>

              {/* Videos List */}
              <Card className="p-6">
                <VStack className="gap-4">
                  <Title className="text-xl">Your Videos</Title>
                  
                  {videos.length === 0 ? (
                    <Body className="text-text-secondary text-center py-8">
                      No videos yet. Add your first video above to get started!
                    </Body>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {videos.map(video => (
                        <div key={video.id} className="border border-border-light rounded-lg p-4">
                          <VStack className="gap-3">
                            <Title className="text-lg">{video.title}</Title>
                            <Body className="text-text-secondary text-sm">
                              {video.url}
                            </Body>
                            {video.thumbUrl && (
                              <div className="aspect-video bg-surface rounded overflow-hidden">
                                <img 
                                  src={video.thumbUrl} 
                                  alt={video.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <Body className="text-text-tertiary text-xs">
                              Created: {new Date(video.createdAt).toLocaleDateString()}
                            </Body>
                          </VStack>
                        </div>
                      ))}
                    </div>
                  )}
                </VStack>
              </Card>
            </VStack>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <Card className="p-6">
              <VStack className="gap-6">
                <Title className="text-xl">Preview Your Business</Title>
                <Body className="text-text-secondary">
                  This is how your business and videos will appear to users on the platform.
                </Body>
                
                {videos.length === 0 ? (
                  <div className="text-center py-12">
                    <Body className="text-text-secondary">
                      Add some videos to see how your content will look!
                    </Body>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.slice(0, 3).map(video => {
                      const likesCount = Math.floor(Math.random() * 200) + 20;
                      const commentsCount = Math.floor(Math.random() * 50) + 5;
                      
                      return (
                        <PostTemplate
                          key={video.id}
                          mode="card"
                          cardVariant="compact"
                          title={video.title}
                          description={`From ${video.business.name}`}
                          thumbnail={video.thumbUrl || undefined}
                          mediaOverlay={
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                                <Play className="w-5 h-5 text-gray-900 ml-1" />
                              </div>
                            </div>
                          }
                          chips={[
                            {
                              text: categoryToString(video.business.category),
                              variant: 'accent'
                            }
                          ]}
                          creator={{
                            name: video.business.name,
                            subtitle: 'Your Business'
                          }}
                          primaryActions={[
                            {
                              icon: Heart,
                              count: likesCount,
                              active: false
                            },
                            {
                              icon: MessageCircle,
                              count: commentsCount
                            },
                            {
                              icon: Share
                            }
                          ]}
                        />
                      );
                    })}
                  </div>
                )}
              </VStack>
            </Card>
          </TabsContent>
        </Tabs>

        <CoordinatesModal
          open={showCoordinatesModal}
          onOpenChange={setShowCoordinatesModal}
          onSave={handleCoordinatesSave}
          currentLat={business?.lat || undefined}
          currentLng={business?.lng || undefined}
        />
      </VStack>
    </Container>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
