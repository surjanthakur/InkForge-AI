import { MailIcon, LockIcon, ArrowLeft, User2Icon, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../../components/index";

const Signup = () => {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    const res = await signup(data);
    if (!res.ok) {
      toast.error(res.detail);
      return;
    }
    toast.success(res.data?.detail);
    navigate("/login");
  };

  const passwordValue = watch("password");

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
                Welcome to InkForge-Ai
              </h1>
              <p className="text-gray-500 mt-1 text-sm">Create your account</p>
            </div>

            {/* Loader */}
            {(loading || isSubmitting) && (
              <div className="mb-4 flex justify-center">
                <Loader />
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Username
                </label>

                <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-black transition">
                  <User2Icon size={18} className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Enter your username"
                    className="w-full outline-none bg-transparent text-sm"
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "At least 3 characters",
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message: "Only letters, numbers, underscores",
                      },
                    })}
                  />
                </div>

                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Email
                </label>

                <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-black transition">
                  <MailIcon size={18} className="text-gray-500 mr-2" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full outline-none bg-transparent text-sm"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                        message: "Enter valid email",
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
                  <LockIcon size={18} className="text-gray-500 mr-2" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full outline-none bg-transparent text-sm"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 4,
                        message: "Min 4 characters",
                      },
                      validate: (value) =>
                        /[A-Z]/.test(value) || "Need one uppercase letter",
                    })}
                  />
                </div>

                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Confirm Password
                </label>

                <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-black transition">
                  <LockIcon size={18} className="text-gray-500 mr-2" />
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full outline-none bg-transparent text-sm"
                    {...register("confirmPassword", {
                      required: "Confirm your password",
                      validate: (value) =>
                        value === passwordValue || "Passwords do not match",
                    })}
                  />
                </div>

                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition disabled:opacity-60"
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 mt-5">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-black font-medium underline hover:opacity-70"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
