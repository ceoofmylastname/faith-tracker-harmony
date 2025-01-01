import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <img 
        src="https://storage.googleapis.com/msgsndr/TivPy8SDoCwta90bdzyN/media/672aa6ff53c79865cd710429.png"
        alt="FTTHLV Logo"
        className="w-48 mb-8"
      />
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">Welcome Back</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#800000',
                  brandAccent: '#4A0404',
                  inputBackground: 'white',
                  inputText: 'black',
                  inputPlaceholder: 'darkgray',
                }
              }
            },
            style: {
              button: {
                background: '#800000',
                color: 'white',
              },
              anchor: {
                color: '#800000',
              },
              input: {
                background: 'white',
                borderColor: '#e5e7eb',
                color: 'black',
              },
              label: {
                color: '#374151',
              },
            },
          }}
          theme="default"
          providers={[]}
        />
      </div>
    </div>
  );
}