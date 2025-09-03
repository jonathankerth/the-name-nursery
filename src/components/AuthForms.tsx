"use client";

import { useState } from "react";
import { signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import {
	auth,
	googleProvider,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendSignInLinkToEmail,
} from "../lib/firebase";
import styles from "./AuthForms.module.css";

interface AuthFormsProps {
	onClose: () => void;
	onSuccess: () => void;
}

const AuthForms = ({ onClose, onSuccess }: AuthFormsProps) => {
	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [emailLinkSent, setEmailLinkSent] = useState(false);
	const [isEmailLinkMode, setIsEmailLinkMode] = useState(false);
	const [showForgotPassword, setShowForgotPassword] = useState(false);
	const [resetEmailSent, setResetEmailSent] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

	const handleGoogleSignIn = async () => {
		try {
			setLoading(true);
			setError("");
			await signInWithPopup(auth, googleProvider);
			onSuccess();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to sign in with Google";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const sendEmailLink = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email.trim()) {
			setError("Please enter your email address.");
			return;
		}

		try {
			setLoading(true);
			setError("");

			const actionCodeSettings = {
				url: window.location.origin,
				handleCodeInApp: true,
			};

			await sendSignInLinkToEmail(auth, email, actionCodeSettings);
			window.localStorage.setItem("emailForSignIn", email);
			setEmailLinkSent(true);
		} catch (error: unknown) {
			const firebaseError = error as { code?: string; message?: string };
			setError(
				firebaseError.message ||
					"Failed to send sign-in link. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	const handlePasswordReset = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email.trim()) {
			setError("Please enter your email address.");
			return;
		}

		try {
			setLoading(true);
			setError("");

			await sendPasswordResetEmail(auth, email);
			setResetEmailSent(true);
			setSuccess("Password reset email sent! Check your inbox.");
		} catch (error: unknown) {
			const firebaseError = error as { code?: string; message?: string };
			switch (firebaseError.code) {
				case "auth/user-not-found":
					setError("No account found with this email address.");
					break;
				case "auth/invalid-email":
					setError("Please enter a valid email address.");
					break;
				default:
					setError(
						firebaseError.message || "Failed to send password reset email."
					);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleEmailAuth = async (e: React.FormEvent) => {
		e.preventDefault();

		if (isSignUp && password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters");
			return;
		}

		try {
			setLoading(true);
			setError("");

			if (isSignUp) {
				await createUserWithEmailAndPassword(auth, email, password);
			} else {
				await signInWithEmailAndPassword(auth, email, password);
			}

			onSuccess();
		} catch (error: unknown) {
			// Handle specific Firebase error codes
			const firebaseError = error as { code?: string; message?: string };
			switch (firebaseError.code) {
				case "auth/email-already-in-use":
					setError("This email is already registered. Try signing in instead.");
					break;
				case "auth/weak-password":
					setError("Password is too weak. Please choose a stronger password.");
					break;
				case "auth/invalid-email":
					setError("Please enter a valid email address.");
					break;
				case "auth/user-not-found":
					setError("No account found with this email. Try signing up instead.");
					break;
				case "auth/wrong-password":
					setError("Incorrect password. Please try again.");
					break;
				case "auth/too-many-requests":
					setError("Too many failed attempts. Please try again later.");
					break;
				default:
					setError(
						firebaseError.message ||
							`Failed to ${isSignUp ? "sign up" : "sign in"}`
					);
			}
		} finally {
			setLoading(false);
		}
	};

	const resetForm = () => {
		setEmail("");
		setPassword("");
		setConfirmPassword("");
		setError("");
	};

	const toggleMode = () => {
		setIsSignUp(!isSignUp);
		resetForm();
	};

	return (
		<div className={styles.authContainer}>
			<div className={styles.authHeader}>
				<h2>{isSignUp ? "Create Account" : "Sign In"}</h2>
				<button
					className={styles.closeButton}
					onClick={onClose}
					aria-label="Close"
				>
					×
				</button>
			</div>

			{error && <div className={styles.errorMessage}>{error}</div>}
			{success && <div className={styles.successMessage}>{success}</div>}

			<div className={styles.authMethods}>
				{/* Google Sign In */}
				<button
					className={styles.googleButton}
					onClick={handleGoogleSignIn}
					disabled={loading}
				>
					<svg className={styles.googleIcon} viewBox="0 0 24 24">
						<path
							fill="#4285F4"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="#34A853"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="#FBBC05"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						/>
						<path
							fill="#EA4335"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						/>
					</svg>
					{loading ? "Signing in..." : "Continue with Google"}
				</button>

				<div className={styles.divider}>
					<span>or</span>
				</div>

				{/* Email Link Sign In */}
				{!isSignUp && !isEmailLinkMode && (
					<button
						type="button"
						className={styles.emailLinkButton}
						onClick={() => setIsEmailLinkMode(true)}
						disabled={loading}
					>
						Sign in with email link (no password)
					</button>
				)}

				{isEmailLinkMode && !emailLinkSent && (
					<form onSubmit={sendEmailLink} className={styles.emailForm}>
						<div className={styles.formGroup}>
							<label htmlFor="emailLink">Email</label>
							<input
								type="email"
								id="emailLink"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={loading}
								placeholder="Enter your email"
							/>
						</div>
						<button
							type="submit"
							className={styles.submitButton}
							disabled={loading}
						>
							{loading ? "Sending..." : "Send Sign-in Link"}
						</button>
						<button
							type="button"
							className={styles.backButton}
							onClick={() => setIsEmailLinkMode(false)}
							disabled={loading}
						>
							Back to password sign-in
						</button>
					</form>
				)}

				{emailLinkSent && (
					<div className={styles.emailLinkSent}>
						<h3>Check your email!</h3>
						<p>We&apos;ve sent a sign-in link to {email}</p>
						<p>Click the link in the email to sign in.</p>
						<button
							type="button"
							className={styles.backButton}
							onClick={() => {
								setEmailLinkSent(false);
								setIsEmailLinkMode(false);
								setEmail("");
							}}
						>
							Try different email
						</button>
					</div>
				)}

				{/* Email/Password Form */}
				{!isEmailLinkMode && !emailLinkSent && (
					<form onSubmit={handleEmailAuth} className={styles.emailForm}>
						<div className={styles.formGroup}>
							<label htmlFor="email">Email</label>
							<input
								type="email"
								id="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={loading}
								placeholder="Enter your email"
							/>
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="password">Password</label>
							<div className={styles.passwordContainer}>
								<input
									type={passwordVisible ? "text" : "password"}
									id="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									disabled={loading}
									placeholder="Enter your password"
									minLength={6}
								/>
								<button
									type="button"
									className={styles.passwordToggle}
									onClick={() => setPasswordVisible(!passwordVisible)}
									disabled={loading}
									aria-label={
										passwordVisible ? "Hide password" : "Show password"
									}
								>
									{passwordVisible ? "👁️" : "👁️‍🗨️"}
								</button>
							</div>
						</div>

						{isSignUp && (
							<div className={styles.formGroup}>
								<label htmlFor="confirmPassword">Confirm Password</label>
								<div className={styles.passwordContainer}>
									<input
										type={confirmPasswordVisible ? "text" : "password"}
										id="confirmPassword"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
										disabled={loading}
										placeholder="Confirm your password"
										minLength={6}
									/>
									<button
										type="button"
										className={styles.passwordToggle}
										onClick={() =>
											setConfirmPasswordVisible(!confirmPasswordVisible)
										}
										disabled={loading}
										aria-label={
											confirmPasswordVisible ? "Hide password" : "Show password"
										}
									>
										{confirmPasswordVisible ? "👁️" : "👁️‍🗨️"}
									</button>
								</div>
							</div>
						)}

						<button
							type="submit"
							className={styles.submitButton}
							disabled={loading}
						>
							{loading
								? isSignUp
									? "Creating Account..."
									: "Signing In..."
								: isSignUp
								? "Create Account"
								: "Sign In"}
						</button>

						{!isSignUp && (
							<button
								type="button"
								className={styles.forgotPasswordButton}
								onClick={() => setShowForgotPassword(true)}
								disabled={loading}
							>
								Forgot your password?
							</button>
						)}
					</form>
				)}

				{/* Forgot Password Form */}
				{showForgotPassword && (
					<form onSubmit={handlePasswordReset} className={styles.emailForm}>
						<h3>Reset Password</h3>
						<p>
							Enter your email address and we&apos;ll send you a link to reset
							your password.
						</p>

						<div className={styles.formGroup}>
							<label htmlFor="resetEmail">Email</label>
							<input
								type="email"
								id="resetEmail"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={loading}
								placeholder="Enter your email"
							/>
						</div>

						<button
							type="submit"
							className={styles.submitButton}
							disabled={loading || resetEmailSent}
						>
							{loading
								? "Sending..."
								: resetEmailSent
								? "Email Sent!"
								: "Send Reset Link"}
						</button>

						<button
							type="button"
							className={styles.backButton}
							onClick={() => {
								setShowForgotPassword(false);
								setResetEmailSent(false);
								setSuccess("");
								setError("");
							}}
							disabled={loading}
						>
							Back to sign in
						</button>
					</form>
				)}

				<div className={styles.toggleMode}>
					<span>
						{isSignUp ? "Already have an account?" : "Don't have an account?"}
					</span>
					<button
						type="button"
						className={styles.toggleButton}
						onClick={toggleMode}
						disabled={loading}
					>
						{isSignUp ? "Sign In" : "Sign Up"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AuthForms;
