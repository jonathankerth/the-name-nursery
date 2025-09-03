"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
	User,
	isSignInWithEmailLink,
	signInWithEmailLink,
} from "firebase/auth";
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
	const [emailLinkProcessing, setEmailLinkProcessing] = useState(false);

	// Handle email link authentication on app load
	useEffect(() => {
		const handleEmailLink = async () => {
			if (typeof window === "undefined") return;

			if (isSignInWithEmailLink(auth, window.location.href)) {
				setEmailLinkProcessing(true);

				try {
					let email = window.localStorage.getItem("emailForSignIn");
					if (!email) {
						// Prompt user for email if not found in localStorage
						email = window.prompt("Please provide your email for confirmation");
					}

					if (email) {
						await signInWithEmailLink(auth, email, window.location.href);
						window.localStorage.removeItem("emailForSignIn");

						// Clean up the URL by removing the email link parameters
						const url = new URL(window.location.href);
						url.search = "";
						window.history.replaceState({}, document.title, url.toString());
					}
				} catch (error) {
					console.error("Error signing in with email link:", error);
				} finally {
					setEmailLinkProcessing(false);
				}
			}
		};

		handleEmailLink();
	}, []);

	const isLoading = loading || emailLinkProcessing;

	return (
		<AuthContext.Provider
			value={{ user: user || null, loading: isLoading, error }}
		>
			{children}
		</AuthContext.Provider>
	);
};
