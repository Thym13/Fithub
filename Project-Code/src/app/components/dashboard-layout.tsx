import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Button } from './ui/button';
import { LogOut, Home, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from './ui/sheet';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  role: string;
  tabs?: Array<{ id: string; label: string; path: string }>;
}

export function DashboardLayout({ children, title, role, tabs }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl">🏋️ FitHub</h1>
              <div className="hidden md:block">
                <div className="flex items-center gap-2 px-4 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  <span>{role}</span>
                </div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <Home className="size-4" />
                <span className="ml-2">Home</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="size-4" />
                <span className="ml-2">Logout</span>
              </Button>
            </div>

            {/* Mobile Hamburger Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏋️</span>
                      <span>FitHub</span>
                    </div>
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Navigation menu
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                    <span>{role}</span>
                  </div>

                  {tabs && tabs.length > 0 && (
                    <div className="space-y-2">
                      {tabs.map((tab) => {
                        const isActive = window.location.hash === tab.path;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              window.location.hash = tab.path;
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full text-left block px-4 py-3 rounded-lg transition-colors ${
                              isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="pt-4 border-t space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      onClick={() => {
                        navigate('/');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Home className="size-4 mr-2" />
                      Home
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="size-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {tabs && tabs.length > 0 && (
        <div className="bg-white border-b hidden md:block">
          <div className="px-6">
            <nav className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => {
                const isActive = window.location.hash === tab.path;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      window.location.hash = tab.path;
                    }}
                    className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                      isActive
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl mb-6">{title}</h2>
          {children}
        </div>
      </main>
    </div>
  );
}