import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import type { Profile } from '../lib/supabase';

interface ContactProps {
  profile: Profile | null;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
}

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  projectType: '',
  message: '',
};

export function Contact({ profile }: ContactProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = window.localStorage.getItem('portfolio-theme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSending(true);

    try {
      const recipientEmail = profile?.email || 'contacts@stevangaron.fr';
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          projectType: formData.projectType,
          message: formData.message,
          recipientEmail,
          source: 'site-web',
          _subject: `Nouveau message depuis le site - ${formData.name}`,
          _captcha: 'false',
          _template: 'table',
        }),
      });

      if (!response.ok) {
        throw new Error('Le service d’envoi a refusé la requête.');
      }

      setSubmitted(true);
      setFormData(initialFormData);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Contact form error:', err);
      setError('L’envoi du message a échoué. Veuillez réessayer ou me contacter directement par email.');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const applyTheme = () => {
      const t = document.documentElement.getAttribute('data-theme');
      if (t === 'dark' || t === 'light') setTheme(t);
    };
    applyTheme();
    const obs = new MutationObserver(() => applyTheme());
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        :root[data-theme="dark"] select.contact-select option { color: #000 !important; background: #fff !important; }
        :root[data-theme="dark"] select.contact-select option:checked { color: #fff !important; background: #111 !important; }
        :root[data-theme="light"] select.contact-select, :root[data-theme="light"] select.contact-select option { color: #000 !important; }
      `}</style>
      {/* Header */}
      <section className="pt-20 pb-12 px-6 bg-neutral-950">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-4">
            Contact
          </p>
          <h1 className="text-4xl md:text-5xl font-light mb-4">Travaillons Ensemble</h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Disponible pour vos projets photographiques. N'hésitez pas à me
            contacter pour discuter de vos besoins.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 px-6 bg-neutral-950">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-light mb-4">
                  Parlons de votre projet
                </h2>
                <p className="text-neutral-400 leading-relaxed">
                  Que vous ayez besoin d'un portrait, d'une couverture d'événement,
                  ou de photos artistiques, je suis là pour créer avec vous des
                  images qui vous ressemblent.
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href={`mailto:${profile?.email || 'contact@example.com'}`}
                  className="flex items-center gap-4 p-5 bg-neutral-800/30 rounded-xl hover:bg-neutral-800/50 transition-colors group border border-neutral-700/30"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                    <Mail className="w-5 h-5 text-amber-500 group-hover:text-neutral-950" />
                  </div>
                  <div>
                    <p className="text-neutral-500 text-sm">Email</p>
                    <p className="text-theme-primary">{profile?.email || 'contacts@stevangaron.fr'}</p>
                  </div>
                </a>

                {profile?.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="flex items-center gap-4 p-5 bg-neutral-800/30 rounded-xl hover:bg-neutral-800/50 transition-colors group border border-neutral-700/30"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                      <Phone className="w-5 h-5 text-amber-500 group-hover:text-neutral-950" />
                    </div>
                    <div>
                      <p className="text-neutral-500 text-sm">Téléphone</p>
                      <p className="text-theme-primary">{profile.phone}</p>
                    </div>
                  </a>
                )}

                <div className="flex items-center gap-4 p-5 bg-neutral-800/30 rounded-xl border border-neutral-700/30">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-neutral-500 text-sm">Localisation</p>
                    <p className="text-theme-primary">{profile?.location || 'La Chaize-le-Vicomte'}</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="aspect-video rounded-xl overflow-hidden border border-neutral-700/30">
                <iframe
                  title="Carte de La Chaize-le-Vicomte"
                  src="https://www.google.com/maps?q=La+Chaize-le+Vicomte,+France&z=9&output=embed"
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-neutral-800/20 rounded-2xl p-8 border border-neutral-700/30">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                  <h3 className="text-2xl font-light text-white mb-2">
                    Message envoyé !
                  </h3>
                  <p className="text-neutral-400">
                    Merci pour votre message. Je vous répondrai dans les plus brefs délais.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-light mb-6">
                    Envoyez un message
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm text-neutral-400 mb-2">
                        Votre nom
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-colors"
                        placeholder="Jean Dupont"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-2">
                        Votre email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-colors"
                        placeholder="jean@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-2">
                        Votre téléphone (optionnel)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-colors"
                        placeholder="06 12 34 56 78"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-2">
                        Type de projet
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className={`contact-select w-full bg-neutral-800/50 border border-neutral-700 rounded-lg px-4 py-3 ${theme === 'dark' ? (formData.projectType === '' ? 'text-white' : 'text-black') : 'text-black'} focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-colors`}
                      >
                        <option value="">Sélectionnez un type</option>
                        <option value="portrait">Portrait</option>
                        <option value="paysage">Paysage</option>
                        <option value="evenement">Événement</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-2">
                        Votre message
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-colors resize-none"
                        placeholder="Décrivez votre projet..."
                        required
                      />
                    </div>
                    {error && (
                      <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSending}
                      className="w-full bg-amber-500 text-neutral-950 py-4 rounded-lg font-medium hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <span>{isSending ? 'Envoi en cours...' : 'Envoyer'}</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
