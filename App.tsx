
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Service, Booking, View, QuizResult, StudentProgress, Book, ActivityLog, Review, UserProfile, ProviderApplication, Category, TaskerSubmissionStatus, PaymentStatus, BookingStatus, ProviderStatus } from './types';
import Header from './components/Header';
import Home from './components/Home';
import ServiceDetail from './components/ServiceDetail';
import Contact from './components/Contact';
import AdminDashboard from './components/AdminDashboard';
import TutoringHub from './components/TutoringHub';
import IntakeQuiz from './components/IntakeQuiz';
import BookBoutique from './components/BookBoutique';
import CleaningHub from './components/CleaningHub';
import Footer from './components/Footer';
import Settings from './components/Settings';
import CustomerProfile from './components/CustomerProfile';
import SupportCenter from './components/SupportCenter';
import PrivacySafetyCenter from './components/PrivacySafetyCenter';
import AboutUs from './components/AboutUs';
import ProviderApplicationForm from './components/ProviderApplicationForm';
import ProviderDashboard from './components/ProviderDashboard';
import TaskerProfileEditor from './components/TaskerProfileEditor';
import CategoryDiscovery from './components/CategoryDiscovery';
import PublicTaskerProfile from './components/PublicTaskerProfile';
import TaskerActivation from './components/TaskerActivation';

const INITIAL_SERVICES: Service[] = [
  {
    id: 't1',
    title: 'Expert Tutoring',
    description: 'Personalized learning for Grades 1-3. We make math and reading fun!',
    price: 'KES 2,000/session',
    durationMinutes: 60,
    category: 'Learning & Tutoring',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
    isActive: true,
    maxJobsPerDay: 3,
    allowedProviderIds: []
  },
  {
    id: 'c1',
    title: 'Home & Yard Help',
    description: 'From car washing to room tidying, I help keep your home sparkling!',
    price: 'KES 400/task',
    durationMinutes: 90,
    category: 'Home Help & Cleaning',
    imageUrl: 'https://images.unsplash.com/photo-1581578731522-745505146205?auto=format&fit=crop&q=80&w=800',
    isActive: true,
    maxJobsPerDay: 4,
    allowedProviderIds: []
  }
];

const INITIAL_PROFILE: UserProfile = {
  id: 'user_1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+254 700 000 000',
  address: '123 Sunshine Street',
  city: 'Nairobi',
  role: 'Customer',
  joinedDate: '2024-01-01',
  status: 'Active',
  preferences: { preferredTime: 'Morning', newsletter: true, serviceReminders: true, autoApproveCleaners: false },
  notes: { gateCode: '4321', petInfo: 'Golden Retriever named Sparky', generalInstructions: 'Please leave keys with the concierge.' }
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('Home');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTaskerId, setSelectedTaskerId] = useState<string | null>(null);
  const [targetProviderId, setTargetProviderId] = useState<string | undefined>(undefined);
  
  const [services, setServices] = useState<Service[]>(() => JSON.parse(localStorage.getItem('skillio_v6_services') || JSON.stringify(INITIAL_SERVICES)));
  const [bookings, setBookings] = useState<Booking[]>(() => JSON.parse(localStorage.getItem('skillio_v6_bookings') || '[]'));
  const [reviews, setReviews] = useState<Review[]>(() => JSON.parse(localStorage.getItem('skillio_v6_reviews') || '[]'));
  const [books, setBooks] = useState<Book[]>(() => JSON.parse(localStorage.getItem('skillio_v6_books') || '[]'));
  const [applications, setApplications] = useState<ProviderApplication[]>(() => JSON.parse(localStorage.getItem('skillio_v6_apps') || '[]'));
  const [logs, setLogs] = useState<ActivityLog[]>(() => JSON.parse(localStorage.getItem('skillio_v6_logs') || '[]'));
  const [userProfile, setUserProfile] = useState<UserProfile>(() => JSON.parse(localStorage.getItem('skillio_v6_profile') || JSON.stringify(INITIAL_PROFILE)));
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => JSON.parse(localStorage.getItem('skillio_v6_all_users') || '[]'));
  
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgress>({
    totalStars: 0,
    badges: [],
    history: []
  });

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [view]);

  useEffect(() => {
    localStorage.setItem('skillio_v6_services', JSON.stringify(services));
    localStorage.setItem('skillio_v6_bookings', JSON.stringify(bookings));
    localStorage.setItem('skillio_v6_reviews', JSON.stringify(reviews));
    localStorage.setItem('skillio_v6_apps', JSON.stringify(applications));
    localStorage.setItem('skillio_v6_profile', JSON.stringify(userProfile));
    localStorage.setItem('skillio_v6_all_users', JSON.stringify(allUsers));
  }, [services, bookings, reviews, userProfile, applications, allUsers]);

  const addLog = (action: string) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      action,
      user: 'SYSTEM'
    };
    setLogs([newLog, ...logs]);
  };

  const handleCreateBooking = (booking: Booking) => {
    setBookings([booking, ...bookings]);
    setView('Home');
    addLog(`💸 ESCROW PAYMENT: ${booking.customerName} paid KES ${booking.totalPrice} for ${booking.serviceTitle}. Funds held by app.`);
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    addLog(`Booking ${id} status updated to ${status}`);
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    setAllUsers(prev => {
      const exists = prev.find(u => u.id === profile.id);
      if (exists) return prev.map(u => u.id === profile.id ? profile : u);
      return [...prev, profile];
    });
    addLog(`Profile for ${profile.name} updated.`);
  };

  const handleAddReview = (review: Review) => {
    setReviews([review, ...reviews]);
    addLog(`New review added for ${review.serviceTitle}`);
  };

  const handleUpdateApplicationStatus = (id: string, status: ProviderStatus) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
    const app = applications.find(a => a.id === id);
    if (app) {
      setAllUsers(prev => prev.map(u => u.id === app.userId ? { ...u, providerStatus: status } : u));
      if (app.userId === userProfile.id) {
        setUserProfile(prev => ({ ...prev, providerStatus: status }));
      }
    }
    addLog(`Application ${id} status updated to ${status}`);
  };

  const handleAssignProvider = (serviceId: string, providerId: string) => {
    setServices(prev => prev.map(s => s.id === serviceId ? { ...s, allowedProviderIds: [...(s.allowedProviderIds || []), providerId] } : s));
    addLog(`Provider ${providerId} assigned to service ${serviceId}`);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-white selection:bg-indigo-100 selection:text-indigo-900">
      <Header setView={setView} currentView={view} userProfile={userProfile} />
      
      <main className="flex-grow">
        {view === 'Home' && (
          <Home 
            services={services} 
            reviews={reviews} 
            userProfile={userProfile}
            onSelectService={(s) => { setSelectedService(s); setView('ServiceDetail'); }}
            onSelectCategory={(c) => { setSelectedCategory(c); setView('CategoryDiscovery'); }}
            onNavigate={setView}
            onAddReview={handleAddReview}
          />
        )}
        
        {view === 'ServiceDetail' && selectedService && (
          <ServiceDetail 
            service={selectedService} 
            applications={applications}
            onBook={(pid) => { setTargetProviderId(pid); setView('Contact'); }}
            onBack={() => setView('Home')}
          />
        )}

        {view === 'CategoryDiscovery' && selectedCategory && (
          <CategoryDiscovery 
            category={selectedCategory}
            users={allUsers}
            onSelectTasker={(id) => { setSelectedTaskerId(id); setView('PublicTaskerProfile'); }}
            onBack={() => setView('Home')}
          />
        )}

        {view === 'PublicTaskerProfile' && selectedTaskerId && (
          <PublicTaskerProfile 
            tasker={allUsers.find(u => u.id === selectedTaskerId)!}
            bookings={bookings}
            onBook={() => setView('Contact')}
            onBack={() => setView('CategoryDiscovery')}
          />
        )}

        {view === 'Contact' && (
          <Contact 
            service={selectedService} 
            bookings={bookings}
            targetProviderId={targetProviderId}
            providerName={allUsers.find(u => u.id === targetProviderId)?.name}
            onSubmit={handleCreateBooking}
            onBack={() => setView('ServiceDetail')}
          />
        )}

        {view === 'Admin' && (
          <AdminDashboard 
            services={services}
            bookings={bookings}
            reviews={reviews}
            books={books}
            applications={applications}
            activityLogs={logs}
            allUsers={allUsers}
            onUpdateServices={setServices}
            onUpdateBookings={setBookings}
            onUpdateBookingStatus={updateBookingStatus}
            onUpdateBooks={setBooks}
            onUpdateReviews={setReviews}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
            onUpdateApplicationFeedback={(id, fb) => setApplications(prev => prev.map(a => a.id === id ? { ...a, adminFeedback: fb } : a))}
            onUpdateUserProfile={handleUpdateProfile}
            onAssignProvider={handleAssignProvider}
          />
        )}

        {view === 'ProviderHub' && (
          <ProviderDashboard 
            userProfile={userProfile}
            bookings={bookings}
            services={services}
            onUpdateBookingStatus={updateBookingStatus}
            onUpdateProfile={handleUpdateProfile}
            onNavigate={setView}
            onBack={() => setView('Home')}
          />
        )}

        {view === 'TaskerProfile' && (
          <TaskerProfileEditor 
            userProfile={userProfile}
            bookings={bookings}
            reviews={reviews}
            services={services}
            applications={applications}
            onUpdateProfile={handleUpdateProfile}
            onBack={() => setView('Settings')}
          />
        )}

        {view === 'Settings' && (
          <Settings 
            onNavigate={setView} 
            onBack={() => setView('Home')} 
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {view === 'Profile' && (
          <CustomerProfile 
            userProfile={userProfile}
            bookings={bookings}
            onUpdateProfile={handleUpdateProfile}
            onBack={() => setView('Settings')}
          />
        )}

        {view === 'SupportCenter' && (
          <SupportCenter 
            onBack={() => setView('Settings')} 
            userProfile={userProfile} 
            bookings={bookings} 
          />
        )}

        {view === 'PrivacySafetyCenter' && (
          <PrivacySafetyCenter onBack={() => setView('Settings')} />
        )}

        {view === 'AboutUs' && (
          <AboutUs onBack={() => setView('Home')} />
        )}

        {view === 'ApplyProvider' && (
          <ProviderApplicationForm 
            userProfile={userProfile} 
            existingApplication={applications.find(a => a.userId === userProfile.id)}
            onSubmit={(app) => {
              setApplications(prev => {
                const exists = prev.find(a => a.userId === app.userId);
                if (exists) return prev.map(a => a.userId === app.userId ? app : a);
                return [...prev, app];
              });
              handleUpdateProfile({ 
                ...userProfile, 
                providerStatus: 'applied',
                email: app.userEmail,
                phone: app.userPhone
              });
              addLog(`Provider application submitted by ${userProfile.name}`);
            }}
            onBack={() => setView('Home')}
          />
        )}

        {view === 'BookBoutique' && (
          <BookBoutique 
            books={books}
            onBorrow={(b) => setBooks([b as Book, ...books])}
            onBack={() => setView('Home')}
            userProfile={userProfile}
          />
        )}

        {view === 'IntakeQuiz' && (
          <IntakeQuiz 
            onSubmit={(res) => { setQuizResult(res); setView('TutoringHub'); }} 
            onBack={() => setView('Home')} 
          />
        )}

        {view === 'TutoringHub' && quizResult && (
          <TutoringHub 
            quiz={quizResult} 
            progress={studentProgress} 
            onBook={() => {
              const tutoringService = services.find(s => s.category === 'Learning & Tutoring');
              if (tutoringService) {
                setSelectedService(tutoringService);
                setView('ServiceDetail');
              } else {
                setView('Home');
              }
            }}
            onRestartQuiz={() => setView('IntakeQuiz')}
          />
        )}

        {view === 'CleaningHub' && (
          <CleaningHub 
            onBack={() => setView('Home')}
            bookings={bookings}
            onBookingCreated={handleCreateBooking}
            onUpdateBookingStatus={updateBookingStatus}
            userProfile={userProfile}
          />
        )}

        {view === 'TaskerActivation' && (
          <TaskerActivation 
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onBack={() => setView('Settings')}
          />
        )}
      </main>

      <Footer onNavigate={setView} />
    </div>
  );
};

export default App;
