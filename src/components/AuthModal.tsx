import React from "react";
import { createPortal } from "react-dom";

interface AuthModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
	if (!isOpen || typeof document === "undefined") {
		return null;
	}

	return createPortal(
		<div
			style={{
				position: "fixed",
				top: "0",
				left: "0",
				right: "0",
				bottom: "0",
				backgroundColor: "rgba(0, 0, 0, 0.8)",
				zIndex: 10000,
			}}
			onClick={onClose}
		>
			<div
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					width: "400px",
					height: "300px",
					marginTop: "-150px",
					marginLeft: "-200px",
					backgroundColor: "white",
					borderRadius: "8px",
					padding: "20px",
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<div style={{ textAlign: "center" }}>
					<h2>Sign in to save baby names!</h2>
					<p>Please sign in to save your favorite names.</p>
					<button
						onClick={onClose}
						style={{
							marginTop: "20px",
							padding: "10px 20px",
							backgroundColor: "#2563eb",
							color: "white",
							border: "none",
							borderRadius: "4px",
							cursor: "pointer",
						}}
					>
						Close
					</button>
				</div>
			</div>
		</div>,
		document.body
	);
}
