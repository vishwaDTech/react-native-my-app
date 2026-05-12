import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

// Define the API URL - use your computer's IP address if testing on a physical device
// 10.0.2.2 is the localhost alias for Android Emulator
export const API_URL = 'http://10.0.2.2:5000/api';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
    resetPassword: (token: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    loading: true,
    login: async () => ({ success: false }),
    register: async () => ({ success: false }),
    forgotPassword: async () => ({ success: false }),
    resetPassword: async () => ({ success: false }),
    logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load stored token on app start
        const loadStoredData = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync('userToken');
                const storedUser = await SecureStore.getItemAsync('userData');

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    // Configure axios default header
                    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                }
            } catch (e) {
                console.error('Failed to load auth data', e);
            } finally {
                setLoading(false);
            }
        };

        loadStoredData();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { token, user } = response.data;

            await SecureStore.setItemAsync('userToken', token);
            await SecureStore.setItemAsync('userData', JSON.stringify(user));

            setToken(token);
            setUser(user);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return { success: true };
        } catch (error: any) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed. Please check your credentials.' 
            };
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            await axios.post(`${API_URL}/auth/register`, { name, email, password });
            // We don't set the token/user here because the user wants to login manually after registration
            return { success: true };
        } catch (error: any) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Registration failed.' 
            };
        }
    };

    const forgotPassword = async (email: string) => {
        try {
            const response = await axios.post(`${API_URL}/auth/forgotpassword`, { email });
            return { success: true, message: response.data.message };
        } catch (error: any) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to send reset email.' 
            };
        }
    };

    const resetPassword = async (token: string, password: string) => {
        try {
            const response = await axios.put(`${API_URL}/auth/resetpassword/${token}`, { password });
            const { token: userToken, user } = response.data;

            await SecureStore.setItemAsync('userToken', userToken);
            await SecureStore.setItemAsync('userData', JSON.stringify(user));

            setToken(userToken);
            setUser(user);
            axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
            return { success: true };
        } catch (error: any) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Password reset failed.' 
            };
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userData');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, forgotPassword, resetPassword, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
