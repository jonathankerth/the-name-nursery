import styles from "./page.module.css";

export default function Home() {
	return (
		<div className={styles.page}>
			<header className={styles.header}>
				<h1 className={styles.title}>The Name Nursery</h1>
				<nav className={styles.nav}>
					<a href="#generate">Generate Name</a>
					<a href="#info">Name Info</a>
					<a href="#more">More Features</a>
				</nav>
			</header>
			<main className={styles.main}>
				<section id="generate" className={styles.section}>
					<h2>Generate a Random Baby Name</h2>
					<div className={styles.placeholder}>
						{/* Feature coming soon: Random name generator */}
						<button className={styles.button} disabled>
							Generate Name
						</button>
						<p className={styles.comingSoon}>Feature coming soon!</p>
					</div>
				</section>
				<section id="info" className={styles.section}>
					<h2>Baby Name Info</h2>
					<div className={styles.placeholder}>
						{/* Feature coming soon: Name info lookup */}
						<p className={styles.comingSoon}>Feature coming soon!</p>
					</div>
				</section>
				<section id="more" className={styles.section}>
					<h2>More Features Coming Soon</h2>
					<ul>
						<li>Favorites & Lists</li>
						<li>Search & Filter</li>
						<li>Share Names</li>
						<li>And more!</li>
					</ul>
				</section>
			</main>
			<footer className={styles.footer}>
				<p>&copy; {new Date().getFullYear()} The Name Nursery</p>
			</footer>
		</div>
	);
}
