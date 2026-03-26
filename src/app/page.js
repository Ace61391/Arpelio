import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { INSTRUMENTS } from '@/data/instruments';

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white border border-[#e5e8ed] rounded-card p-7 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
      <div className="w-11 h-11 rounded-xl bg-accent-light flex items-center justify-center text-2xl mb-4">{icon}</div>
      <h3 className="text-[17px] font-bold text-[#1a1d23] mb-2 leading-tight">{title}</h3>
      <p className="text-sm text-[#4a5060] leading-relaxed">{desc}</p>
    </div>
  );
}

function PricingCard({ tier, price, period, desc, features, featured, cta }) {
  return (
    <div className={`rounded-2xl p-8 flex flex-col relative ${featured ? 'bg-[#1a1d23] border-2 border-accent' : 'bg-white border border-[#e5e8ed]'}`}>
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[11px] font-bold px-4 py-1 rounded-full tracking-wide">
          Most Popular
        </div>
      )}
      <div className={`text-xs font-bold uppercase tracking-wider ${featured ? 'text-[#8b92a8]' : 'text-[#7a8294]'}`}>{tier}</div>
      <div className="flex items-baseline gap-1 mt-3 mb-1">
        <span className={`text-4xl font-extrabold tracking-tight ${featured ? 'text-white' : 'text-[#1a1d23]'}`}>{price}</span>
        {period && <span className={`text-base ${featured ? 'text-[#8b92a8]' : 'text-[#7a8294]'}`}>{period}</span>}
      </div>
      <p className={`text-sm mb-6 ${featured ? 'text-[#8b92a8]' : 'text-[#7a8294]'}`}>{desc}</p>
      <div className="flex-1">
        {features.map((f, i) => (
          <div key={i} className="flex gap-2.5 items-start mb-2.5">
            <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0 mt-0.5">
              <circle cx="8" cy="8" r="8" fill={featured ? 'rgba(79,109,245,0.2)' : '#eef1fe'} />
              <path d="M5 8l2 2 4-4" stroke={featured ? '#7b96ff' : '#4f6df5'} fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={`text-sm leading-snug ${featured ? 'text-[#c8ccda]' : 'text-[#4a5060]'}`}>{f}</span>
          </div>
        ))}
      </div>
      <Link href="/instruments" className={`block text-center w-full py-3 rounded-lg text-sm font-bold mt-5 transition-colors ${featured ? 'bg-accent hover:bg-accent-hover text-white' : 'bg-[#f1f3f6] hover:bg-[#e5e8ed] text-[#1a1d23]'}`}>
        {cta}
      </Link>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-extrabold text-accent tracking-tight">{number}</div>
      <div className="text-sm text-[#7a8294] font-medium mt-0.5">{label}</div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="px-8 pt-16 pb-20 text-center max-w-[1160px] mx-auto">
        <div className="inline-block bg-accent-light rounded-full px-4 py-1.5 text-sm font-semibold text-accent mb-6">
          ✨ 14 instruments · 484 verified fingerings · Free to start
        </div>
        <h1 className="text-5xl md:text-[50px] font-extrabold leading-[1.15] tracking-tight text-[#1a1d23] max-w-[700px] mx-auto mb-5 animate-fade-up">
          Fingering charts that teach themselves
        </h1>
        <p className="text-lg text-[#4a5060] leading-relaxed max-w-[560px] mx-auto mb-9 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Interactive reference charts, auto-graded quizzes, and printable worksheets for every band instrument. Stop hand-drawing charts. Start teaching.
        </p>
        <div className="flex gap-3 justify-center flex-wrap animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <Link href="/instruments" className="bg-accent hover:bg-accent-hover text-white rounded-lg px-8 py-3.5 text-base font-bold transition-all shadow-[0_4px_14px_rgba(79,109,245,0.3)] hover:-translate-y-0.5">
            Browse Instruments — Free
          </Link>
          <Link href="#features" className="bg-white text-[#4a5060] border border-[#e5e8ed] hover:border-accent hover:text-accent rounded-lg px-8 py-3.5 text-base font-semibold transition-all">
            See How It Works
          </Link>
        </div>
        <div className="flex justify-center gap-16 mt-16 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <Stat number="14" label="Instruments" />
          <Stat number="484" label="Verified Fingerings" />
          <Stat number="6" label="Assessment Modes" />
        </div>
      </section>

      {/* Instruments */}
      <section id="instruments" className="bg-[#f8f9fb] px-8 py-16">
        <div className="max-w-[1160px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#1a1d23] mb-3 tracking-tight">Every instrument in the band room</h2>
            <p className="text-base text-[#4a5060] max-w-[520px] mx-auto">From beginning recorder to advanced brass. One platform, one login, every fingering.</p>
          </div>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {INSTRUMENTS.map(inst => (
              <Link key={inst.id} href={`/instruments/${inst.id}`}
                className="bg-white border border-[#e5e8ed] rounded-lg px-5 py-3 flex items-center gap-2.5 hover:border-accent hover:-translate-y-0.5 hover:shadow-md transition-all">
                <div className={`w-2 h-2 rounded-full ${inst.family === 'brass' ? 'bg-brass' : 'bg-woodwind'}`} />
                <span className="text-sm font-semibold text-[#1a1d23]">{inst.shortName}</span>
                <span className="text-xs text-[#7a8294]">{inst.notes}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-20">
        <div className="max-w-[1160px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#1a1d23] mb-3 tracking-tight">Everything a music teacher needs</h2>
            <p className="text-base text-[#4a5060] max-w-[500px] mx-auto">Stop buying static PDFs on TPT. Generate unlimited materials, grade automatically, track progress.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard icon="📖" title="Interactive Reference Charts" desc="Every note, every fingering, every instrument. Click a note to see the diagram. Concert pitch toggle. Free forever." />
            <FeatureCard icon="✏️" title="Printable Worksheets" desc="Generate fill-in-the-blank and scale worksheets. Select notes by difficulty, scale, or custom. Print-ready B&W PDFs with answer keys." />
            <FeatureCard icon="🎯" title="Auto-Graded Quizzes" desc="Students tap fingerings on their Chromebook. Instant scoring. No more hand-grading stacks of paper." />
            <FeatureCard icon="⚡" title="Flashcard Study Mode" desc="Interactive flashcards students actually want to use. Self-paced, tracks mastery per note. Works on any device." />
            <FeatureCard icon="⏱️" title="Timed Challenges" desc="'Mad Minutes' speed drills. Students compete against themselves and classmates. Configurable time limits and note ranges." />
            <FeatureCard icon="📊" title="Teacher Gradebook" desc="See which notes your students struggle with. Per-student scores, class averages, and analytics. Export to CSV." />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-[#f8f9fb] px-8 py-20">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#1a1d23] mb-3 tracking-tight">Up and running in 60 seconds</h2>
            <p className="text-base text-[#4a5060]">No training. No setup wizard. No 45-minute onboarding call.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { s: '1', t: 'Pick an instrument', d: 'Select from 14 band instruments. Every fingering is verified against professional sources.' },
              { s: '2', t: 'Choose a mode', d: 'Reference chart, quiz, worksheet, flashcards, or timed challenge.' },
              { s: '3', t: 'Assign or print', d: 'Share a digital quiz link, or generate a print-ready PDF worksheet with answer key.' },
              { s: '4', t: 'See the results', d: 'Digital quizzes grade themselves. View scores per student, per note, per class.' },
            ].map(({ s, t, d }) => (
              <div key={s} className="text-center">
                <div className="w-12 h-12 rounded-full bg-accent-light flex items-center justify-center text-xl font-extrabold text-accent mx-auto mb-4">{s}</div>
                <h3 className="text-base font-bold text-[#1a1d23] mb-2">{t}</h3>
                <p className="text-sm text-[#4a5060] leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-8 py-16">
        <div className="max-w-[800px] mx-auto text-center">
          <div className="bg-[#f8f9fb] rounded-2xl p-12 border border-[#e5e8ed]">
            <div className="text-4xl mb-5">🎵</div>
            <p className="text-xl font-medium text-[#1a1d23] leading-relaxed italic mb-6 max-w-[560px] mx-auto">
              &ldquo;How many times have you wanted to test your students&rsquo; knowledge of correct fingerings and been forced to scribble down a makeshift fingering chart by hand?&rdquo;
            </p>
            <p className="text-sm text-[#7a8294]">
              — Every band director, every year. <span className="text-accent font-semibold">Arpelio fixes this.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-[#f8f9fb] px-8 py-20">
        <div className="max-w-[1060px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#1a1d23] mb-3 tracking-tight">Simple, fair pricing</h2>
            <p className="text-base text-[#4a5060]">Start free. Upgrade when you need worksheets and auto-grading.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            <PricingCard tier="Free" price="$0" desc="Free forever"
              features={['Interactive charts for all 14 instruments', 'Flashcard study mode (1st octave)', '1 reference PDF per instrument', 'Concert ↔ written pitch toggle']}
              cta="Get Started Free" />
            <PricingCard featured tier="Pro" price="$7.99" period="/month" desc="or $59.99/year — save 37%"
              features={['Everything in Free', 'Unlimited worksheet generation', 'Auto-graded digital quizzes', 'Gradebook with per-note analytics', 'Up to 150 students', 'CSV grade export', 'Answer keys + custom note sets']}
              cta="Start 14-Day Free Trial" />
            <PricingCard tier="School" price="$3.99" period="/student/yr" desc="min 50 students"
              features={['Everything in Pro', 'Unlimited students & teachers', 'Admin dashboard', 'LMS integration (Canvas, Google)', 'Clever / ClassLink rostering', 'Priority support']}
              cta="Contact Us" />
          </div>
          <p className="text-center text-sm text-[#7a8294] mt-6">All plans include all 14 instruments. No per-instrument charges. No hidden fees.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-8 py-20 text-center">
        <div className="max-w-[600px] mx-auto">
          <h2 className="text-3xl font-extrabold text-[#1a1d23] mb-4 tracking-tight">Ready to stop hand-drawing fingering charts?</h2>
          <p className="text-base text-[#4a5060] mb-8 leading-relaxed">Join music teachers who&rsquo;ve switched from static worksheets to interactive, auto-graded assessments.</p>
          <Link href="/instruments" className="inline-block bg-accent hover:bg-accent-hover text-white rounded-lg px-10 py-4 text-base font-bold transition-all shadow-[0_4px_14px_rgba(79,109,245,0.3)] hover:-translate-y-0.5">
            Browse Instruments — It&rsquo;s Free
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
