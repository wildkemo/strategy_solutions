import { Footer } from '../components/Footer'
import styles from './page.module.css'

const values = [
  {
    title: 'Integrity',
    text: 'We tell you what we see, not what is easiest to hear, and we stand behind our recommendations.',
  },
  {
    title: 'Partnership',
    text: 'Your wins are ours. We work alongside your leaders rather than handing down prescriptions.',
  },
  {
    title: 'Impact',
    text: 'We measure success by adoption, outcomes, and the durability of change—not deliverable counts.',
  },
]

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <section className={styles.intro}>
        <div className={styles.narrow}>
          <h1>About Strategy Solutions</h1>
          <p className={styles.lead}>
            We are a strategy and transformation practice focused on pragmatic
            execution. Our teams blend industry experience with structured
            problem solving to help you move from intent to results.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.narrow}>
          <h2>Who we are</h2>
          <p>
            Founded by operators and advisors who have led complex programs
            across continents, Strategy Solutions exists to close the gap
            between planning decks and daily operations. We believe strategy
            only matters when people understand it, own it, and can act on it.
          </p>
          <div
            className={styles.imageFrame}
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80')",
            }}
          />
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.narrow}>
          <h2>Our mission</h2>
          <p>
            To equip organizations with clarity, alignment, and momentum—so they
            can adapt confidently in markets that never stand still. We help
            you prioritize ruthlessly, invest wisely, and build cultures that
            learn faster than the competition.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.narrow}>
          <h2>Our values</h2>
          <div className={styles.valueGrid}>
            {values.map((v) => (
              <article key={v.title} className={styles.valueCard}>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.legacy}>
        <div
          className={styles.legacyBg}
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80')",
          }}
        >
          <div className={styles.legacyBadge}>
            <span className={styles.badgeNum}>20+</span>
            <span className={styles.badgeText}>years of combined leadership experience</span>
          </div>
        </div>
        <div className={styles.narrow}>
          <h2>Our legacy</h2>
          <p>
            From regional champions to global enterprises, our clients trust us
            with their most sensitive initiatives—post-merger integration,
            digital roadmaps, cost transformation, and leadership transitions.
            We carry that trust by showing up prepared, staying curious, and
            leaving your teams stronger than we found them.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
