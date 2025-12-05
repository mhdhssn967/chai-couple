import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  updateProfile 
} from "firebase/auth";
import Swal from "sweetalert2";

export default function LoginRegister() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const redirectBasedOnRole = async (user) => {
  const token = await user.getIdTokenResult(true); // get claims

  const role = token.claims.role || "user"; // default user

  if (role === "admin") {
    navigate("/admin");
  } else {
    navigate("/");
  }
};


  const handleEmailLogin = async () => {
  try {
    let userCredential;

    if (isRegister) {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      Swal.fire("Welcome!", "Registration successful", "success");
    } else {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
      Swal.fire("Welcome back!", "", "success");
    }

    const user = userCredential.user;

    await redirectBasedOnRole(user);

  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
};


 const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Redirect based on role
    await redirectBasedOnRole(user);

  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
};

  return (
    <div className="min-h-screen bg-[#f7f2eb]  justify-center p-4 mt-10">
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 border border-[#d9cbb8]">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-24" />
        </div>
        <h2 className="text-2xl font-bold text-[#5b3a28] text-center mb-6">
          {isRegister ? "Register" : "Login"}
        </h2>

        <div className="flex flex-col gap-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#d8c5a8] bg-[#faf6f0] focus:ring-2 focus:ring-[#c7a574] outline-none"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#d8c5a8] bg-[#faf6f0] focus:ring-2 focus:ring-[#c7a574] outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#d8c5a8] bg-[#faf6f0] focus:ring-2 focus:ring-[#c7a574] outline-none"
          />
        </div>

        <button
          onClick={handleEmailLogin}
          className="mt-6 w-full bg-[#452e1c] hover:bg-[#724b30] text-white py-3 rounded-xl flex items-center justify-center gap-2 text-lg font-semibold shadow-md transition"
        >
          {isRegister ? "Register" : "Login"}
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-1 border-[#d9cbb8]" />
          <span className="mx-2 text-[#5b3a28] opacity-70">OR</span>
          <hr className="flex-1 border-[#d9cbb8]" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-[#d8c5a8] py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-md transition"
        >
          <img
  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/250px-Google_Favicon_2025.svg.png"
  alt="Google"
  className="w-6 h-6"
/>

          Continue with Google
        </button>

        <p className="text-center mt-4 text-[#5b3a28] opacity-70">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={() => setIsRegister(!isRegister)}
            className="text-[#452e1c] font-semibold cursor-pointer"
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}
