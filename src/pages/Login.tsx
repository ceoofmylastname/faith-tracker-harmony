import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [savedEmail, setSavedEmail] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
    // Load saved email from localStorage
    const email = localStorage.getItem("savedEmail");
    if (email) {
      setSavedEmail(email);
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="relative w-48 h-48 mb-8 animate-flip">
        <img 
          src="https://storage.googleapis.com/msgsndr/TivPy8SDoCwta90bdzyN/media/672aa6ff53c79865cd710429.png"
          alt="FTTHLV Logo"
          className="w-full h-full object-contain transform-gpu transition-transform duration-1000 backface-visibility-hidden"
        />
      </div>
      <div className="relative w-full max-w-md">
        {/* Neon border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-lg blur opacity-75 animate-gradient-xy group-hover:opacity-100 transition duration-1000"></div>
        
        {/* Main form container */}
        <div className="relative w-full max-w-md bg-black p-8 rounded-lg shadow-[0_0_50px_-12px] shadow-primary">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">Welcome Back</h2>
          <Auth
            supabaseClient={supabase}
            providers={[]}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#800000',
                    brandAccent: '#4A0404',
                    inputBackground: 'black',
                    inputText: 'white',
                    inputPlaceholder: 'darkgray',
                    defaultButtonBackground: 'black',
                    defaultButtonBackgroundHover: '#800000',
                  }
                }
              },
              style: {
                button: {
                  background: '#800000',
                  color: 'white',
                  border: '1px solid #800000',
                },
                anchor: {
                  color: '#800000',
                },
                input: {
                  background: 'black',
                  borderColor: '#333',
                  color: 'white',
                },
                label: {
                  color: 'white',
                },
              },
            }}
            theme="dark"
            redirectTo={window.location.origin}
            localization={{
              variables: {
                sign_in: {
                  email_label: savedEmail ? undefined : "Email",
                  password_label: "Password",
                  email_input_placeholder: savedEmail || "Enter your email",
                  password_input_placeholder: "Enter your password",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}