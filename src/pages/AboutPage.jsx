import { Compass, Train, Users, Mountain, BookOpen } from 'lucide-react';
import BrandingFooter from '../components/BrandingFooter';

export default function AboutPage() {
  return (
    <div className="pb-safe">
      <div className="px-4 pt-4">
        {/* Hero */}
        <div className="bg-gradient-to-br from-deep-indigo via-deep-indigo-dark to-earth-brown rounded-2xl p-6 text-cream mb-6">
          <Compass size={32} className="text-saffron mb-3" />
          <h1 className="font-heading text-2xl font-bold leading-tight">
            The Explorer's<br />Fellowship
          </h1>
          <p className="text-sm text-cream/70 mt-3 leading-relaxed">
            A 42-day solo backpacking journey across India, documenting the unknown 
            paths and fostering dialogue with people from different walks of life.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-8">
          <h2 className="font-heading text-xl font-semibold text-deep-indigo mb-3">The Mission</h2>
          <div className="space-y-4 text-sm text-earth-brown/80 leading-relaxed">
            <p>
              This fellowship is about <strong className="text-deep-indigo">seeking the unknown</strong> — 
              stepping off the well-worn tourist path to discover the India that lives in 
              its smaller towns, sleeper trains, and roadside conversations.
            </p>
            <p>
              It's about <strong className="text-deep-indigo">fostering dialogue</strong> with people 
              from different walks of life — chai-sellers, fellow travelers, monks, fishermen, 
              students, and strangers who become friends over shared meals.
            </p>
            <p>
              Every entry in this blog is written on a smartphone, often on a rattling train 
              or a dusty bus, timestamped and GPS-tagged to prove authenticity. This is not 
              curated travel content — it's raw, real-time documentation of a journey.
            </p>
          </div>
        </section>

        {/* The Journey */}
        <section className="mb-8">
          <h2 className="font-heading text-xl font-semibold text-deep-indigo mb-3">The Route</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Train size={20} />, title: '22 Stops', desc: 'Delhi to Goa' },
              { icon: <Mountain size={20} />, title: '5 Regions', desc: 'North to South' },
              { icon: <BookOpen size={20} />, title: '42 Days', desc: 'May – June 2026' },
              { icon: <Users size={20} />, title: '1 Backpack', desc: 'Solo expedition' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-sunset-orange/10 p-4">
                <div className="text-terracotta mb-2">{item.icon}</div>
                <p className="font-heading font-semibold text-deep-indigo text-sm">{item.title}</p>
                <p className="text-xs text-earth-brown/50 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About the Fellowship Program */}
        <section className="mb-8">
          <h2 className="font-heading text-xl font-semibold text-deep-indigo mb-3">About the Fellowship</h2>
          <div className="bg-iitgn-maroon/5 border border-iitgn-maroon/10 rounded-xl p-4">
            <p className="text-sm text-earth-brown/80 leading-relaxed">
              The <strong className="text-iitgn-maroon">Explorer's Fellowship</strong> is an initiative by 
              the IIT Gandhinagar Student Affairs Office. It supports students who wish to undertake 
              independent exploratory journeys — projects that go beyond the classroom to engage 
              with India's diverse cultures, landscapes, and communities firsthand.
            </p>
            <p className="text-sm text-earth-brown/80 leading-relaxed mt-3">
              Fellows are expected to document their experiences rigorously, sharing insights that 
              inspire curiosity and cultural understanding within the IITGN community and beyond.
            </p>
          </div>
        </section>

        {/* Philosophy */}
        <section className="mb-6">
          <blockquote className="border-l-3 border-terracotta pl-4 py-2">
            <p className="text-lg font-heading italic text-deep-indigo leading-relaxed">
              "The real voyage of discovery consists not in seeking new landscapes, 
              but in having new eyes."
            </p>
            <cite className="text-xs text-earth-brown/50 mt-2 block not-italic">— Marcel Proust</cite>
          </blockquote>
        </section>
      </div>

      <BrandingFooter />
    </div>
  );
}
