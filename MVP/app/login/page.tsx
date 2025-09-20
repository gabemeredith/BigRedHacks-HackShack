'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Container, VStack, Card } from '@/components/ui/layout';
import { Title, Body, Label } from '@/components/ui/typography';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/toast';
import { signUpAction, SignUpData } from '@/app/actions/auth';
import { LogIn, UserPlus, Building2 } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

interface SignUpFormData extends SignUpData {
  confirmPassword: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

  // Form state
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [signUpForm, setSignUpForm] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    website: '',
    category: 'RESTAURANTS',
    address: '',
  });

  // Basic validation
  const validateLoginForm = (): string | null => {
    if (!loginForm.email || !loginForm.password) {
      return 'Please fill in all required fields';
    }
    if (!loginForm.email.includes('@')) {
      return 'Please enter a valid email address';
    }
    if (loginForm.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  };

  const validateSignUpForm = (): string | null => {
    if (!signUpForm.email || !signUpForm.password || !signUpForm.businessName || !signUpForm.category) {
      return 'Please fill in all required fields';
    }
    if (!signUpForm.email.includes('@')) {
      return 'Please enter a valid email address';
    }
    if (signUpForm.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (signUpForm.password !== signUpForm.confirmPassword) {
      return 'Passwords do not match';
    }
    if (signUpForm.website && !signUpForm.website.startsWith('http')) {
      return 'Website must be a valid URL (include http:// or https://)';
    }
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateLoginForm();
    if (error) {
      addToast({ type: 'error', title: 'Validation Error', description: error });
      return;
    }

    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: loginForm.email,
        password: loginForm.password,
        redirect: false,
      });

      if (result?.error) {
        addToast({
          type: 'error',
          title: 'Login Failed',
          description: 'Invalid email or password. Please try again.',
        });
      } else if (result?.ok) {
        addToast({
          type: 'success',
          title: 'Welcome Back!',
          description: 'Successfully signed in to your account.',
        });
        router.push('/dashboard');
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Login Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateSignUpForm();
    if (error) {
      addToast({ type: 'error', title: 'Validation Error', description: error });
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...signUpData } = signUpForm;
      const result = await signUpAction(signUpData);

      if (result.error) {
        addToast({
          type: 'error',
          title: 'Registration Failed',
          description: result.error,
        });
      } else {
        // Auto sign-in after successful registration
        const signInResult = await signIn('credentials', {
          email: signUpForm.email,
          password: signUpForm.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          addToast({
            type: 'success',
            title: 'Account Created!',
            description: `Welcome to LocalLens, ${signUpData.businessName}! Your business profile has been created.`,
          });
          router.push('/dashboard');
        } else {
          addToast({
            type: 'warning',
            title: 'Account Created',
            description: 'Account created successfully. Please sign in.',
          });
          setActiveTab('signin');
        }
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Registration Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-background to-accent-50 p-4">
      <Container className="max-w-md mx-auto">
        <Card className="p-8 shadow-xl border-white/20 backdrop-blur-sm">
          <VStack className="gap-6">
            {/* Header */}
            <VStack className="gap-2 text-center">
              <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-2">
                <Building2 className="h-8 w-8 text-primary-600" />
              </div>
              <Title className="text-2xl">LocalLens Business</Title>
              <Body className="text-text-secondary">
                Connect with your local community through authentic video content
              </Body>
            </VStack>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="signin" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin" className="mt-6">
                <form onSubmit={handleLogin}>
                  <VStack className="gap-4">
                    <VStack className="gap-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="business@example.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </VStack>
                    
                    <VStack className="gap-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </VStack>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </>
                      )}
                    </Button>
                  </VStack>
                </form>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignUp}>
                  <VStack className="gap-4">
                    {/* Basic Info */}
                    <VStack className="gap-2">
                      <Label htmlFor="signup-email">Email *</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="business@example.com"
                        value={signUpForm.email}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </VStack>

                    <VStack className="gap-2">
                      <Label htmlFor="signup-password">Password *</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="At least 6 characters"
                        value={signUpForm.password}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </VStack>

                    <VStack className="gap-2">
                      <Label htmlFor="confirm-password">Confirm Password *</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={signUpForm.confirmPassword}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </VStack>

                    {/* Business Info */}
                    <div className="border-t border-border-light pt-4">
                      <VStack className="gap-4">
                        <VStack className="gap-2">
                          <Label htmlFor="business-name">Business Name *</Label>
                          <Input
                            id="business-name"
                            type="text"
                            placeholder="Your Business Name"
                            value={signUpForm.businessName}
                            onChange={(e) => setSignUpForm(prev => ({ ...prev, businessName: e.target.value }))}
                            required
                          />
                        </VStack>

                        <VStack className="gap-2">
                          <Label htmlFor="category">Category *</Label>
                          <select
                            id="category"
                            value={signUpForm.category}
                            onChange={(e) => setSignUpForm(prev => ({ ...prev, category: e.target.value as SignUpData['category'] }))}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="RESTAURANTS">🍕 Restaurant</option>
                            <option value="CLOTHING">👕 Clothing & Fashion</option>
                            <option value="ART">🎨 Art & Gallery</option>
                            <option value="ENTERTAINMENT">🎭 Entertainment</option>
                          </select>
                        </VStack>

                        <VStack className="gap-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            type="url"
                            placeholder="https://yourbusiness.com"
                            value={signUpForm.website}
                            onChange={(e) => setSignUpForm(prev => ({ ...prev, website: e.target.value }))}
                          />
                        </VStack>

                        <VStack className="gap-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            type="text"
                            placeholder="123 Main St, City, State"
                            value={signUpForm.address}
                            onChange={(e) => setSignUpForm(prev => ({ ...prev, address: e.target.value }))}
                          />
                        </VStack>
                      </VStack>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Create Business Account
                        </>
                      )}
                    </Button>
                  </VStack>
                </form>
              </TabsContent>
            </Tabs>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-border-light">
              <Body className="text-text-tertiary text-sm">
                By creating an account, you agree to showcase your business with authentic content and connect with your local community.
              </Body>
            </div>
          </VStack>
        </Card>
      </Container>
    </div>
  );
}