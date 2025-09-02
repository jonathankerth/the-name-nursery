"use client";

import React, { createContext, useContext } from "react";
import { User } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	error: Error | undefined;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
	error: undefined,
});

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, loading, error] = useAuthState(auth);

	return (
		<AuthContext.Provider value={{ user: user || null, loading, error }}>
			{children}
		</AuthContext.Provider>
	);
};
