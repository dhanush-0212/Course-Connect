import React, { useState, useEffect } from "react";
import {
  User,
  BookOpen,
  Users,
  Plus,
  Trash2,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react";

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE = "http://localhost:8080";

  // Authentication functions
  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/public/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        setCurrentPage("dashboard");
        setMessage("Login successful!");
      } else {
        setMessage("Invalid credentials");
      }
    } catch (error) {
      setMessage("Login failed. Please try again.");
    }
    setLoading(false);
  };

  const register = async (username, password, role = "USER") => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/public/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      if (response.ok) {
        setMessage("Registration successful! Please login.");
        setCurrentPage("login");
      } else {
        setMessage("Registration failed");
      }
    } catch (error) {
      setMessage("Registration failed. Please try again.");
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setCurrentPage("home");
    setMessage("Logged out successfully");
  };

  // API functions
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE}/public/courses`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Failed to fetch courses");
    }
  };

  const fetchEnrollments = async () => {
    if (user?.role === "ADMIN") {
      try {
        const response = await fetch(`${API_BASE}/admin/enrollments`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setEnrollments(data);
        }
      } catch (error) {
        console.error("Failed to fetch enrollments");
      }
    }
  };

  const fetchUsers = async () => {
    if (user?.role === "ADMIN") {
      try {
        const response = await fetch(`${API_BASE}/admin/users`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setAllUsers(data);
        }
      } catch (error) {
        console.error("Failed to fetch users");
      }
    }
  };

  const registerForCourse = async (courseName, studentName, email) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/public/register-course`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          name: studentName,
          email: email,
          coursename: courseName,
        }),
      });

      if (response.ok) {
        setMessage("Course registration successful!");
        fetchEnrollments();
      } else {
        setMessage("Course registration failed");
      }
    } catch (error) {
      setMessage("Registration failed. Please try again.");
    }
    setLoading(false);
  };

  const addCourse = async (course) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/add-course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(course),
      });

      if (response.ok) {
        setMessage("Course added successfully!");
        fetchCourses();
      } else {
        setMessage("Failed to add course");
      }
    } catch (error) {
      setMessage("Failed to add course. Please try again.");
    }
    setLoading(false);
  };

  const deleteCourse = async (courseId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/admin/delete-course/${courseId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (response.ok) {
        setMessage("Course deleted successfully!");
        fetchCourses();
      } else {
        setMessage("Failed to delete course");
      }
    } catch (error) {
      setMessage("Failed to delete course. Please try again.");
    }
    setLoading(false);
  };

  // Initialize data
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentPage("dashboard");
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    if (user) {
      fetchEnrollments();
      fetchUsers();
    }
  }, [user]);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Components
  const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <BookOpen className="mx-auto h-12 w-12 text-white mb-4" />
            <h2 className="text-3xl font-bold text-white">
              Course Registration
            </h2>
            <p className="text-white/70 mt-2">Sign in to your account</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              login(username, password);
            }}
            className="space-y-6"
          >
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 transition-all duration-200"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentPage("register")}
              className="text-white/70 hover:text-white transition-colors"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </div>
      </div>
    );
  };

  const RegisterForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("USER");

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <User className="mx-auto h-12 w-12 text-white mb-4" />
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="text-white/70 mt-2">Join our course platform</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              register(username, password, role);
            }}
            className="space-y-6"
          >
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              >
                <option value="USER" className="text-black">
                  Student
                </option>
                <option value="ADMIN" className="text-black">
                  Admin
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 transition-all duration-200"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentPage("login")}
              className="text-white/70 hover:text-white transition-colors"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    );
  };

  const HomePage = () => {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">
            Welcome to Our Course Registration System
          </h1>
          <p className="mb-6 text-gray-700">
            Explore a wide range of courses available for registration. Browse
            through the course list below and learn more about each course. To
            register for a course, please login or create an account.
          </p>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Available Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {courses.map((course) => (
              <div
                key={course.courseId}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {course.courseName}
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Trainer:</span>{" "}
                    {course.trainer}
                  </p>
                  <p>
                    <span className="font-medium">Duration:</span>{" "}
                    {course.durationInWeeks} weeks
                  </p>
                  <p>
                    <span className="font-medium">Course ID:</span>{" "}
                    {course.courseId}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage("login")}
            className="w-full max-w-xs bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Register for a Course
          </button>
        </div>
      </div>
    );
  };

  const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("courses");
    const [newCourse, setNewCourse] = useState({
      courseId: "",
      courseName: "",
      trainer: "",
      durationInWeeks: "",
    });
    const [registration, setRegistration] = useState({
      studentName: "",
      email: "",
      courseName: "",
    });

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Course Registration System
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome,{" "}
                  <span className="font-semibold">{user.username}</span>
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {user.role}
                  </span>
                </span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              {message}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
            <button
              onClick={() => setActiveTab("courses")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "courses"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Available Courses
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "register"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Register for Course
            </button>
            {user.role === "ADMIN" && (
              <>
                <button
                  onClick={() => setActiveTab("addCourse")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "addCourse"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Add Course
                </button>
                <button
                  onClick={() => setActiveTab("enrollments")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "enrollments"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Enrollments
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "users"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Users
                </button>
              </>
            )}
          </div>

          {/* Content */}
          {activeTab === "courses" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.courseId}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {course.courseName}
                    </h3>
                    {user.role === "ADMIN" && (
                      <button
                        onClick={() => deleteCourse(course.courseId)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Trainer:</span>{" "}
                      {course.trainer}
                    </p>
                    <p>
                      <span className="font-medium">Duration:</span>{" "}
                      {course.durationInWeeks} weeks
                    </p>
                    <p>
                      <span className="font-medium">Course ID:</span>{" "}
                      {course.courseId}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "register" && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Register for a Course
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    registerForCourse(
                      registration.courseName,
                      registration.studentName,
                      registration.email
                    );
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student Name
                    </label>
                    <input
                      type="text"
                      value={registration.studentName}
                      onChange={(e) =>
                        setRegistration({
                          ...registration,
                          studentName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={registration.email}
                      onChange={(e) =>
                        setRegistration({
                          ...registration,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course
                    </label>
                    <select
                      value={registration.courseName}
                      onChange={(e) =>
                        setRegistration({
                          ...registration,
                          courseName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select a course</option>
                      {courses.map((course) => (
                        <option key={course.courseId} value={course.courseName}>
                          {course.courseName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "addCourse" && user.role === "ADMIN" && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Add New Course
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addCourse(newCourse);
                    setNewCourse({
                      courseId: "",
                      courseName: "",
                      trainer: "",
                      durationInWeeks: "",
                    });
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course ID
                    </label>
                    <input
                      type="number"
                      value={newCourse.courseId}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, courseId: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course Name
                    </label>
                    <input
                      type="text"
                      value={newCourse.courseName}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          courseName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trainer
                    </label>
                    <input
                      type="text"
                      value={newCourse.trainer}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, trainer: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (weeks)
                    </label>
                    <input
                      type="text"
                      value={newCourse.durationInWeeks}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          durationInWeeks: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                  >
                    {loading ? "Adding..." : "Add Course"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "enrollments" && user.role === "ADMIN" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Course Enrollments
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {enrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {enrollment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {enrollment.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {enrollment.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {enrollment.coursename}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "users" && user.role === "ADMIN" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  All Users
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === "ADMIN"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Main render
  if (currentPage === "login") {
    return <LoginForm />;
  } else if (currentPage === "register") {
    return <RegisterForm />;
  } else if (currentPage === "dashboard") {
    return <Dashboard />;
  } else if (currentPage === "home") {
    return <HomePage />;
  }

  return <LoginForm />;
};

export default App;
