import { LockIcon, MailIcon, ArrowLeft, EyeIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Loader } from "../../components/index";
import { useAuthContext } from "../../context/authContext";
import GoogleIcon from "../../assets/icons8-google.svg";
import { useState } from "react";

const Login = () => {
  const [passType, setPassType] = useState(false);
  const { login, loading } = useAuth();
  const { get_currUser } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const fromEditor = location.state?.fromEditor;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const res = await login(data);
    if (!res.ok) {
      toast.error(res.detail);
      return;
    }
    toast.success(res.data?.detail);
    navigate("/");
    await get_currUser();
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-black">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8">
            {/* Header */}
            <div className="mb-6">
              <Link to="/" className="inline-block mb-4 text-black">
                <ArrowLeft />
              </Link>

              <h1 className="text-2xl sm:text-3xl font-bold text-black">
                Welcome Back
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Sign in to your account
              </p>
            </div>

            {fromEditor && (
              <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-600">
                Please login to access the editor.
              </div>
            )}

            {(loading || isSubmitting) && (
              <div className="mb-4 flex justify-center">
                <Loader />
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Email
                </label>

                <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-black transition">
                  <MailIcon size={18} className="text-gray-500 mr-2" />
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    className="w-full outline-none bg-transparent text-sm"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                  />
                </div>

                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Password
                </label>

                <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-black transition">
                  {!passType ? (
                    <EyeIcon
                      onClick={() => setPassType(!passType)}
                      size={18}
                      className="text-gray-500 mr-2"
                    />
                  ) : (
                    <LockIcon
                      onClick={() => setPassType(!passType)}
                      size={18}
                      className="text-gray-500 mr-2"
                    />
                  )}
                  <input
                    type={passType ? "password" : "text"}
                    placeholder="Enter your password"
                    className="w-full outline-none bg-transparent text-sm"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 4,
                        message: "Password must be at least 4 characters",
                      },
                      validate: (value) =>
                        /[A-Z]/.test(value) ||
                        "Must contain at least one uppercase letter",
                    })}
                  />
                </div>

                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition"
              >
                {isSubmitting ? "Signing..." : "Sign in"}
              </button>

              {/* Signup */}
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-black font-medium underline hover:opacity-70"
                >
                  Sign up
                </Link>
              </p>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-xs text-gray-500">Or continue with</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Google */}
              <div className="flex justify-center mt-3">
                <button className="flex items-center justify-center border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition">
                  <img src={GoogleIcon} alt="Google" className="w-10 h-10" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
