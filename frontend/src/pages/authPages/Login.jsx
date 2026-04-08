import { LockIcon, MailIcon, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Loader } from "../../components/index";
import { useAuthContext } from "../../context/authContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, loading } = useAuth();
  const { get_currUser } = useAuthContext();

  const fromEditor = location.state?.fromEditor;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // form submit logic
  const onSubmit = async (data) => {
    const res = await login(data);
    if (!res.ok) {
      toast.error(res?.error_msg);
      return;
    }
    toast.success(res.data?.detail);
    await get_currUser();
    navigate("/");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-black">
        <div className="w-full md:max-w-md lg:max-w-lg lg:max-h-2xl">
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
                    autoComplete="off"
                    type="email"
                    placeholder="example@gmail.com"
                    className="w-full outline-none bg-transparent text-sm"
                    {...register("email", {
                      required: "Email is required",
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
                    autoComplete="off"
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
              <p className="text-center text-sm text-red-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-500 font-medium underline hover:opacity-70"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
