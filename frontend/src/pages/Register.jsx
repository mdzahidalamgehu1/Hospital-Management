// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   FaUser,
//   FaEnvelope,
//   FaLock,
//   FaEye,
//   FaEyeSlash,
//   FaArrowRight,
//   FaHospital,
// } from "react-icons/fa";

// import api from "../services/api";
// import "./Register.css";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "patient",
//   });

//   const [message, setMessage] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);
//       setMessage("");

//       await api.post("/auth/register", formData);

//       setMessage("Registration successful");

//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//     } catch (error) {
//       console.log("REGISTER ERROR:", error);
//       console.log("RESPONSE:", error.response?.data);

//       setMessage(
//         error.response?.data?.message || "Registration failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="register-page">
//       <div className="register-card">

//         {/* Header */}
//         <div className="register-header">
//           <div className="register-logo">
//             <FaHospital />
//             <span>MediCare</span>
//           </div>

//           <h1>Create account</h1>

//           <p>
//             Create your MediCare account to get started
//           </p>
//         </div>

//         {/* Message */}
//         {message && (
//           <div
//             className={
//               message === "Registration successful"
//                 ? "register-success"
//                 : "register-error"
//             }
//           >
//             {message}
//           </div>
//         )}

//         {/* Form */}
//         <form
//           onSubmit={handleRegister}
//           className="register-form"
//         >

//           {/* Name */}
//           <div className="register-input-group">
//             <label htmlFor="name">
//               Full Name
//             </label>

//             <div className="register-input-wrapper">
//               <FaUser className="register-input-icon" />

//               <input
//                 id="name"
//                 type="text"
//                 name="name"
//                 placeholder="Enter your full name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 autoComplete="name"
//                 required
//               />
//             </div>
//           </div>

//           {/* Email */}
//           <div className="register-input-group">
//             <label htmlFor="email">
//               Email Address
//             </label>

//             <div className="register-input-wrapper">
//               <FaEnvelope className="register-input-icon" />

//               <input
//                 id="email"
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 autoComplete="email"
//                 required
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div className="register-input-group">
//             <label htmlFor="password">
//               Password
//             </label>

//             <div className="register-input-wrapper">
//               <FaLock className="register-input-icon" />

//               <input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="Create a password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 autoComplete="new-password"
//                 required
//               />

//               <button
//                 type="button"
//                 className="register-password-toggle"
//                 onClick={() =>
//                   setShowPassword(!showPassword)
//                 }
//               >
//                 {showPassword ? (
//                   <FaEyeSlash />
//                 ) : (
//                   <FaEye />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Role */}
//           <div className="register-input-group">
//             <label htmlFor="role">
//               Account Type
//             </label>

//             <div className="register-select-wrapper">
//               <select
//                 id="role"
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//               >
//                 <option value="patient">
//                   Patient
//                 </option>

//                 <option value="doctor">
//                   Doctor
//                 </option>
//               </select>
//             </div>
//           </div>

//           {/* Button */}
//           <button
//             type="submit"
//             className="register-submit-btn"
//             disabled={loading}
//           >
//             {loading ? (
//               "Creating account..."
//             ) : (
//               <>
//                 <span>Create Account</span>
//                 <FaArrowRight />
//               </>
//             )}
//           </button>

//         </form>

//         {/* Divider */}
//         <div className="register-divider"></div>

//         {/* Login */}
//         <div className="register-login">
//           <span>
//             Already have an account?
//           </span>

//           <Link to="/login">
//             Sign in
//           </Link>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Register;


} catch (error) {
  console.log("========== REGISTER ERROR ==========");
  console.log("Error:", error);
  console.log("Message:", error.message);
  console.log("Code:", error.code);
  console.log("Response:", error.response);
  console.log("Response Data:", error.response?.data);
  console.log("Request:", error.request);

  setMessage(
    error.response?.data?.message ||
    error.message ||
    "Registration failed"
  );
} finally {
  setLoading(false);
}