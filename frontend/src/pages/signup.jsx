import { PenIcon, LockIcon, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { UseAuth } from "../hooks/useAuth";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const { Signup, error, loading } = UseAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    try {
     const res =  await Signup(data);
     if (res?.success === true) {
      setTimeout(()=>{
        navigate("/login");
      },500)
     }
    } catch (err) {
      toast.error(
        error || "❌ An error occurred during signup. Please try again."
      );
    }
  };

  const passwordValue = watch("password");

  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">
              Welcome to InkForge-Ai
            </h1>
            <p className="text-gray-600">Sign up to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Username
              </label>
              <div className="flex items-center border border-black bg-white px-4 py-3">
                <PenIcon size={20} className="text-black mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="flex-1 outline-none bg-transparent text-black"
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: "Only letters, numbers and underscores allowed",
                    },
                  })}
                />
              </div>
              {errors.username && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Email
              </label>
              <div className="flex items-center border border-black bg-white px-4 py-3">
                <PenIcon size={20} className="text-black mr-3 shrink-0" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 outline-none bg-transparent text-black"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Password
              </label>
              <div className="flex items-center border border-black bg-white px-4 py-3">
                <LockIcon size={20} className="text-black mr-3 shrink-0" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="flex-1 outline-none bg-transparent text-black"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 4,
                      message: "Password must be at least 4 characters",
                    },
                    validate: (value) =>
                      /[A-Z]/.test(value) ||
                      "Password must contain at least one uppercase letter",
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Confirm Password
              </label>
              <div className="flex items-center border border-black bg-white px-4 py-3">
                <LockIcon size={20} className="text-black mr-3 shrink-0" />
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="flex-1 outline-none bg-transparent text-black"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === passwordValue || "Passwords do not match",
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-black text-white font-semibold py-3 px-4 border border-black hover:bg-gray-900 transition duration-200 disabled:opacity-60"
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-black mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold underline hover:text-gray-700"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
