import { useState } from 'react'
import Button from './Button'

export default function AboutLink() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-stone-500 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-400 hover:underline"
      >
        About
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-title"
        >
          <div
            className="bg-stone-100 dark:bg-dark rounded-xl border border-stone-400 dark:border-stone-600 p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="about-title" className="font-serif text-2xl text-gold-dark dark:text-gold-light mb-6">
              About the Creator
            </h2>

            <div className="space-y-6 text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
              <p>
                Hi, I&apos;m Daniel West.
              </p>
              <p>
                I built the Buddha Family Quiz as a simple way for people to explore the Five Buddha Families — a set of teachings from the Vajrayana Buddhist tradition that describe different patterns of human energy, perception, and wisdom.
              </p>
              <p>
                I&apos;ve been a Buddhist practitioner for many years, and the Five Buddha Families have been one of the most helpful lenses I&apos;ve encountered for understanding personality, relationships, and spiritual practice. Each family expresses a particular kind of energy. When we&apos;re confused, that energy can show up as habitual patterns or emotional reactivity. When it&apos;s recognized and worked with, the same energy becomes wisdom.
              </p>
              <p>
                Over time I noticed that many people are curious about the Buddha Families but don&apos;t have an easy way to explore them in a personal way. I created this quiz as a playful entry point — something that might spark curiosity and reflection.
              </p>
              <p>
                The results are not meant to label anyone or put people in a box. In the traditional teachings, every person contains all five Buddha Families. Most of us simply tend to express some of them more strongly than others.
              </p>
              <p>
                This project grew out of my personal interest in Buddhist philosophy, psychology, and the creative ways technology can help people explore meaningful ideas. My day job is in software, and I enjoy building small tools and experiments like this.
              </p>
              <p>
                If the quiz helps you learn something about yourself, reflect on your patterns, or even just smile at the results, then it has done its job.
              </p>
              <p>
                You can follow my creative projects and reflections here:
                <br />
                Instagram: <a href="https://instagram.com/bodhiexpression" target="_blank" rel="noopener noreferrer" className="text-gold-dark dark:text-gold hover:underline">@bodhiexpression</a>
              </p>

              <h3 className="font-serif text-lg text-gold-dark dark:text-gold-light mt-8">
                A Note on This Quiz
              </h3>
              <p>
                This quiz is a personal project created to explore the Five Buddha Families in a fun and accessible way. It is not an official teaching tool of any Buddhist lineage or organization.
              </p>
              <p>
                The results are simply an interpretation based on common descriptions of the Five Buddha Families found in Vajrayana teachings. They are meant to encourage curiosity and reflection — not to replace study with qualified teachers or traditional practice.
              </p>
              <p>
                If you&apos;re interested in learning more about the Five Buddha Families, I encourage you to explore authentic teachings and texts from the Vajrayana tradition.
              </p>

              <h3 className="font-serif text-lg text-gold-dark dark:text-gold-light mt-8">
                Support the Project
              </h3>
              <p>
                The quiz is completely free to use. If you enjoy it and would like to help keep the project online and evolving, you&apos;re welcome to support it with a small donation.
              </p>
              <p>
                <a href="https://ko-fi.com/B0B61VS0I1" target="_blank" rel="noopener noreferrer">
                  <img height="36" style={{ border: 0, height: 36 }} src="https://storage.ko-fi.com/cdn/kofi6.png?v=6" alt="Buy Me a Coffee at ko-fi.com" />
                </a>
              </p>
              <p>
                Your support helps cover hosting and encourages me to keep building and improving tools like this.
              </p>
            </div>

            <div className="mt-8">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
