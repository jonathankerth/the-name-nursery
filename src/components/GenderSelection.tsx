"use client";
import { forwardRef } from "react";
import Image from "next/image";
import styles from "../app/page.module.css";

interface GenderOption {
	label: string;
	value: "baby" | "girl" | "boy";
	icon: string;
}

interface GenderSelectionProps {
	genderOptions: GenderOption[];
	selectedGender: "baby" | "girl" | "boy";
	setSelectedGender: (gender: "baby" | "girl" | "boy") => void;
}

const GenderSelection = forwardRef<HTMLDivElement, GenderSelectionProps>(
	({ genderOptions, selectedGender, setSelectedGender }, ref) => {
		return (
			<div className={styles.genderElevator}>
				<div className={styles.elevatorShaft} ref={ref}>
					<div className={styles.elevatorFloors}>
						{genderOptions.map((option) => (
							<div
								key={option.value}
								className={`${styles.genderRow} ${
									selectedGender === option.value
										? styles.genderRowSelected
										: styles.genderRowUnselected
								}`}
							>
								{selectedGender === option.value && (
									<span className={styles.elevatorText}>A</span>
								)}
								<button
									type="button"
									className={`${styles.genderOption} ${
										selectedGender === option.value
											? styles.genderOptionSelected
											: styles.genderOptionUnselected
									}`}
									onClick={() => setSelectedGender(option.value)}
								>
									<span className={styles.genderButtonContent}>
										{option.label}
										<Image
											src={option.icon}
											alt={`${option.label} icon`}
											className={styles.genderIcon}
											width={34}
											height={34}
										/>
									</span>
								</button>
								{selectedGender === option.value && (
									<span className={styles.elevatorText}>Name</span>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}
);

GenderSelection.displayName = "GenderSelection";

export default GenderSelection;
