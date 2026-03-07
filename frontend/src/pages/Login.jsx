import { LockIcon, PenIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader } from "../components/index";
import { useAuthContext } from "../context/authContext";

const Login = () => {
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
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {fromEditor && (
            <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              Please login to access the editor.
            </div>
          )}

          {(loading || isSubmitting) && (
            <div className="mb-4 flex justify-center">
              <Loader />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Email
              </label>
              <div className="flex items-center border border-black bg-white px-4 py-3">
                <PenIcon size={24} className="text-black mr-3 shrink-0" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 outline-none bg-transparent text-black placeholder-gray-400"
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

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Password
              </label>
              <div className="flex items-center border border-black bg-white px-4 py-3">
                <LockIcon size={24} className="text-black mr-3 shrink-0" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="flex-1 outline-none bg-transparent text-black placeholder-gray-400"
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

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 border border-black bg-white"
                />
                <span className="text-sm text-black">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm text-black hover:text-gray-700 underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-black text-white font-semibold py-3 px-4 border border-black hover:bg-gray-900 transition duration-200"
            >
              {isSubmitting ? "sining..." : "Sign in"}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-black">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold underline hover:text-gray-700"
              >
                Sign up
              </Link>
            </p>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 border-t border-black"></div>
              <span className="text-sm text-black font-medium">
                Or continue with
              </span>
              <div className="flex-1 border-t border-black"></div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
              {/* Google Button */}
              <button
                type="button"
                className="flex items-center justify-center gap-2 border border-black bg-white py-3 px-4 hover:bg-gray-50 transition duration-200"
              >
                <svg
                  version="1.1"
                  width="20"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
	c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
	C103.821,274.792,107.225,292.797,113.47,309.408z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
	c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
	c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
	c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
	c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
	c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
	C318.115,0,375.068,22.126,419.404,58.936z"
                    fill="currentColor"
                  ></path>
                </svg>
                <span className="text-sm font-medium">Google</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
