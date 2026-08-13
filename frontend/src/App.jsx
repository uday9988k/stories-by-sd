import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Website Pages
import Nav from "./pages/nav";
import Home from "./pages/home";
import About from "./pages/about";
import Contact from "./pages/contact";
import Login from "./pages/login";
import ForgotPassword from "./pages/ForgotPassword";
import ViewStory from "./pages/admin/pages/ViewStory";

import OurStories from "./pages/OurStories";
import ViewStoryPublic from "./pages/ViewStory";

// Protected Route
import ProtectedRoute from "./pages/admin/routes/ProtectedRoute";

// Admin Pages
import Dashboard from "./pages/admin/pages/Dashboard";
import ViewStories from "./pages/admin/pages/ViewStories";
import AddStory from "./pages/admin/pages/AddStory";
import EditStory from "./pages/admin/pages/EditStory";
import ViewContacts from "./pages/admin/pages/ViewContacts";

import "./App.css";

function AppContent() {
  const location = useLocation();

  // Hide website navbar on admin pages
  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/OurStories/");

  return (
    <>
      {!hideNavbar && <Nav />}

      <Routes>
        {/* Website */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/OurStories" element={<OurStories />} />

        <Route path="/OurStories/:id" element={<ViewStoryPublic />} />

        {/* Admin Authentication */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/stories" element={<ViewStories />} />
          <Route path="/admin/stories/view/:id" element={<ViewStory />} />
          <Route path="/admin/stories/add" element={<AddStory />} />
          <Route path="/admin/stories/edit/:id" element={<EditStory />} />
          <Route path="/admin/contact-enquiries" element={<ViewContacts />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
