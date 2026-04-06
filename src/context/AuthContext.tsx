import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface UserAccess {
  product_id: string;
  plan: string;
  status: string;
  expires_at: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  access: UserAccess[];
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  hasAccess: (productId: string) => boolean;
  checkB2BDomainAccess: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState<UserAccess[]>([]);

  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchAccess(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchAccess(session.user.id);
        } else {
          setAccess([]);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function fetchAccess(userId: string) {
    const { data, error } = await supabase
      .from('user_access')
      .select('product_id, plan, status, expires_at')
      .eq('user_id', userId)
      .eq('status', 'active');
    
    if (error) {
      console.error('Error fetching user access:', error);
    }
    
    setAccess(data ?? []);
    setLoading(false);
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  }

  async function signUp(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error as Error | null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setAccess([]);
  }

  function hasAccess(productId: string): boolean {
    // For guia_junior, also check B2B access
    if (productId === 'guia_junior') {
      return access.some(a => 
        (a.product_id === 'guia_junior' || a.product_id === 'guia_junior_b2b') && a.status === 'active'
      );
    }
    return access.some(a => a.product_id === productId && a.status === 'active');
  }

  // Check if user's email domain is authorized for B2B access
  async function checkB2BDomainAccess(): Promise<boolean> {
    if (!user?.email) return false;
    
    try {
      const { data, error } = await supabase.rpc('has_b2b_domain_access', { email: user.email });
      if (error) {
        console.error('Error checking B2B domain:', error);
        return false;
      }
      return data ?? false;
    } catch {
      return false;
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, access, signIn, signUp, signOut, hasAccess, checkB2BDomainAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
